'use server';
import * as helpers from "@/lib/registration-helpers";
import type { RegistrationData, RegisterFormState } from "@/lib/types/Registertypes";
import {API_ERROR_CODES,DB_ERROR_CODES} from "@/lib/errorCodes";
import { redirect } from "next/navigation";
import {EndpointErrorResponse} from "@/lib/EndpointErrorResponse";
import {getChildByNameDobWithParentIds, registerChild as registerChildDb, setChildClass} from "@/lib/dbOperations";
import { sendVerificationForParent } from "@/lib/verification";
import { sendEnrollmentForms } from "@/lib/email/sendEnrollmentForms";



export default async function registerChild(
  _prev: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  let errorStatus = new EndpointErrorResponse();

  const registrationData: RegistrationData = {
    childName: helpers.mustString(formData,"childName",errorStatus),
    dob:       helpers.mustDOB(formData.get("dob") || "",errorStatus),
    sex:       helpers.validateSex(String(formData.get('sex')),errorStatus),
    Program:   helpers.validateProgram(helpers.mustString(formData, "Program",errorStatus),errorStatus),
    checkoutTime: null,
    pottyTrained: helpers.parseYesNoBoolean(formData, "pottyTrained", errorStatus),

    parentOneName:    helpers.mustString(formData, "parentOneName",errorStatus),
    parentOneAddress: helpers.mustString(formData, "parentOneAddress",errorStatus),
    parentOnePhone:   helpers.normalizeAndValidatePhone(formData,'parentOnePhone',errorStatus,API_ERROR_CODES.P1_PHONE_INVALID,{required:true}),
    parentOneEmail:   helpers.validateEmailAddress(formData, "parentOneEmail",errorStatus,API_ERROR_CODES.P1_EMAIL_INVALID,{required:true}),

    // Only Parent 2 may be null:
    parentTwoName:    helpers.optionalString(formData, "parentTwoName"),
    parentTwoAddress: helpers.optionalString(formData, "parentTwoAddress"),
    parentTwoPhone:   helpers.normalizeAndValidatePhone(formData,'parentTwoPhone',errorStatus,API_ERROR_CODES.P2_PHONE_INVALID,{required:false}),
    parentTwoEmail:   helpers.validateEmailAddress(formData, "parentTwoEmail",errorStatus,API_ERROR_CODES.P2_EMAIL_INVALID,{required:false}),

    doctorName: helpers.optionalString(formData, "doctorName") ?? "",
    doctorPhone:
      helpers.normalizeAndValidatePhone(
        formData,
        "doctorPhone",
        errorStatus,
        API_ERROR_CODES.DOC_PHONE_INVALID,
        { required: false }
      ) ?? "",
  };

  let resultingClass: string | null = null;
  // run db procedure call pass error object to it
  if (errorStatus.checkErrors() == 0){
    await registerChildDb(registrationData,errorStatus);
    if (errorStatus.checkErrors() == 0) {
      const childRow = await getChildByNameDobWithParentIds(
        { childName: registrationData.childName, dob: registrationData.dob },
        errorStatus
      );
      if (childRow) {
        resultingClass = childRow.className;
        // If DB inserted as Waitlist (existing verified parent), send enrollment forms immediately.
        if (childRow.className === "Waitlist") {
          const childInfo = {
            name: registrationData.childName,
            dob: registrationData.dob,
            pottyTrained: Boolean(childRow.pottyTrained),
          };
          const verifiedEmails: string[] = [];
          if (childRow.parent1Verified && childRow.parent1Email) verifiedEmails.push(childRow.parent1Email);
          if (childRow.parent2Verified && childRow.parent2Email) verifiedEmails.push(childRow.parent2Email);
          // If none flagged verified, fallback to parent one email.
          if (!verifiedEmails.length && registrationData.parentOneEmail) {
            verifiedEmails.push(registrationData.parentOneEmail);
          }
          for (const email of verifiedEmails) {
            await sendEnrollmentForms({ toEmail: email, children: [childInfo] });
          }
        } else {
          // Ensure class set to Pre-Register
          if (childRow.className !== "Pre-Register") {
            await setChildClass(childRow.childId, "Pre-Register", errorStatus);
          }
          if (childRow.parent1Id) {
            await sendVerificationForParent({
              parentId: childRow.parent1Id,
              parentEmail: registrationData.parentOneEmail,
              childName: registrationData.childName,
            });
          }
          if (childRow.parent2Id && registrationData.parentTwoEmail) {
            await sendVerificationForParent({
              parentId: childRow.parent2Id,
              parentEmail: registrationData.parentTwoEmail,
              childName: registrationData.childName,
            });
          }
        }
      } else {
        errorStatus.add(DB_ERROR_CODES.UNKNOWN_DB_ERROR);
        errorStatus.log("Could not locate child after registration.");
      }
    }
  }
  const params = new URLSearchParams({
    childName: String(formData.get("childName"))
  });
  console.log(errorStatus);
  if(errorStatus.uncaughtErrors.size>0 ){
    redirect(`/Register/error?${params.toString()}`);
  }else if(errorStatus.caughtErrors.has(DB_ERROR_CODES.DUPLICATE_CHILD)){
    redirect(`/Register/duplicate?${params.toString()}`);
  }else if(errorStatus.caughtErrors.size>0){
    return {statusCodes:errorStatus.caughtErrors,values:registrationData};
  }else{
    const statusParam =
      errorStatus.checkErrors() === 0 && resultingClass === "Waitlist"
        ? "waitlist"
        : "preregister";
    params.set("status", statusParam);
    redirect(`/Register/success?${params.toString()}`);
  }
}
