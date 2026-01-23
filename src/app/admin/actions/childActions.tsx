'use server';

import { redirect } from "next/navigation";
import { EndpointErrorResponse } from "@/lib/EndpointErrorResponse";
import { API_ERROR_CODES, DB_ERROR_CODES } from "@/lib/errorCodes";
import * as helpers from "@/lib/registration-helpers";
import {
  addChildWithParentsFull,
  updateChildAndParents,
  type AddChildFullPayload,
  type UpdateChildPayload,
} from "@/lib/dbOperations";

const classOptions = new Set([
  "Waitlist",
  "Pre-Register",
  "Registered",
  "Caterpillar",
  "Chrysalis",
  "Butterfly",
  "Sunshine",
  "Rainbow",
  "Test",
]);

export async function createChild(formData: FormData) {
  const errorStatus = new EndpointErrorResponse();

  const classRaw = String(formData.get("childClass") || "").trim();
  const classValue = classRaw ? classRaw : null;
  if (classValue && !classOptions.has(classValue)) {
    errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR);
    errorStatus.log(`recieved invalid class value: ${classValue}`);
  }

  const feeRaw = String(formData.get("fee") || "").trim();
  let feeValue: number | null = null;
  if (feeRaw) {
    const parsedFee = Number(feeRaw);
    if (Number.isNaN(parsedFee) || parsedFee < 0) {
      errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR);
      errorStatus.log(`recieved invalid fee value: ${feeRaw}`);
    } else {
      feeValue = parsedFee;
    }
  }

  const enrollDateRaw = String(formData.get("enrollDate") || "").trim();
  const enrollDate =
    enrollDateRaw && !Number.isNaN(new Date(enrollDateRaw).getTime())
      ? enrollDateRaw
      : null;
  if (enrollDateRaw && !enrollDate) {
    errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR);
    errorStatus.log(`recieved invalid enroll date value: ${enrollDateRaw}`);
  }

  const dropDateRaw = String(formData.get("dropDate") || "").trim();
  const dropDate =
    dropDateRaw && !Number.isNaN(new Date(dropDateRaw).getTime())
      ? dropDateRaw
      : null;
  if (dropDateRaw && !dropDate) {
    errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR);
    errorStatus.log(`recieved invalid drop date value: ${dropDateRaw}`);
  }

  const registrationData: AddChildFullPayload = {
    childName: helpers.mustString(formData, "childName", errorStatus),
    dob: helpers.mustDOB(formData.get("dob") || "", errorStatus),
    sex: helpers.validateSex(String(formData.get("sex")), errorStatus),
    program: helpers.validateProgram(
      helpers.mustString(formData, "Program", errorStatus),
      errorStatus
    ),
    pottyTrained: helpers.parseYesNoBoolean(formData, "pottyTrained", errorStatus),
    className: classValue,
    doctorName: helpers.mustString(formData, "doctorName", errorStatus),
    doctorPhone: helpers.normalizeAndValidatePhone(
      formData,
      "doctorPhone",
      errorStatus,
      "DOC_PHONE_INVALID",
      { required: true }
    ),
    enrollDate,
    dropDate,
    fee: feeValue,
    parentOneName: helpers.mustString(formData, "parentOneName", errorStatus),
    parentOneAddress: helpers.mustString(
      formData,
      "parentOneAddress",
      errorStatus
    ),
    parentOnePhone: helpers.normalizeAndValidatePhone(
      formData,
      "parentOnePhone",
      errorStatus,
      "P1_PHONE_INVALID",
      { required: true }
    ),
    parentOneEmail: helpers.validateEmailAddress(
      formData,
      "parentOneEmail",
      errorStatus,
      "P1_EMAIL_INVALID",
      { required: true }
    ),
    parentTwoName: helpers.optionalString(formData, "parentTwoName"),
    parentTwoAddress: helpers.optionalString(formData, "parentTwoAddress"),
    parentTwoPhone: helpers.normalizeAndValidatePhone(
      formData,
      "parentTwoPhone",
      errorStatus,
      "P2_PHONE_INVALID",
      { required: false }
    ),
    parentTwoEmail: helpers.validateEmailAddress(
      formData,
      "parentTwoEmail",
      errorStatus,
      "P2_EMAIL_INVALID",
      { required: false }
    ),
  };

  if (errorStatus.checkErrors() === 0) {
    await addChildWithParentsFull(registrationData, errorStatus);
  }

  if (errorStatus.uncaughtErrors.size > 0) {
    redirect("/admin/AddChild?status=error");
  }
  if (errorStatus.caughtErrors.has(DB_ERROR_CODES.DUPLICATE_CHILD)) {
    redirect("/admin/AddChild?status=duplicate");
  }
  if (errorStatus.caughtErrors.size > 0) {
    redirect("/admin/AddChild?status=invalid");
  }

  redirect("/admin/AddChild?status=success");
}

export async function updateChild(formData: FormData) {
  const errorStatus = new EndpointErrorResponse();
  const childId = Number(formData.get("childId"));
  const parentOneId = Number(formData.get("parentOneId"));
  const parentTwoIdRaw = String(formData.get("parentTwoId") || "").trim();
  const parentTwoId = parentTwoIdRaw ? Number(parentTwoIdRaw) : null;

  if (!Number.isFinite(childId)) {
    errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR);
    errorStatus.log(`recieved invalid childId value: ${childId}`);
  }
  if (!Number.isFinite(parentOneId)) {
    errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR);
    errorStatus.log(`recieved invalid parentOneId value: ${parentOneId}`);
  }
  if (parentTwoIdRaw && !Number.isFinite(parentTwoId)) {
    errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR);
    errorStatus.log(`recieved invalid parentTwoId value: ${parentTwoIdRaw}`);
  }

  const classRaw = String(formData.get("childClass") || "").trim();
  const classValue = classRaw ? classRaw : null;
  if (classValue && !classOptions.has(classValue)) {
    errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR);
    errorStatus.log(`recieved invalid class value: ${classValue}`);
  }

  const feeRaw = String(formData.get("fee") || "").trim();
  let feeValue: number | null = null;
  if (feeRaw) {
    const parsedFee = Number(feeRaw);
    if (Number.isNaN(parsedFee) || parsedFee < 0) {
      errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR);
      errorStatus.log(`recieved invalid fee value: ${feeRaw}`);
    } else {
      feeValue = parsedFee;
    }
  }

  const enrollDateRaw = String(formData.get("enrollDate") || "").trim();
  const enrollDate =
    enrollDateRaw && !Number.isNaN(new Date(enrollDateRaw).getTime())
      ? enrollDateRaw
      : null;
  if (enrollDateRaw && !enrollDate) {
    errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR);
    errorStatus.log(`recieved invalid enroll date value: ${enrollDateRaw}`);
  }

  const dropDateRaw = String(formData.get("dropDate") || "").trim();
  const dropDate =
    dropDateRaw && !Number.isNaN(new Date(dropDateRaw).getTime())
      ? dropDateRaw
      : null;
  if (dropDateRaw && !dropDate) {
    errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR);
    errorStatus.log(`recieved invalid drop date value: ${dropDateRaw}`);
  }

  const registrationData: UpdateChildPayload = {
    childId,
    childName: helpers.mustString(formData, "childName", errorStatus),
    dob: helpers.mustDOB(formData.get("dob") || "", errorStatus),
    sex: helpers.validateSex(String(formData.get("sex")), errorStatus),
    program: helpers.validateProgram(
      helpers.mustString(formData, "Program", errorStatus),
      errorStatus
    ),
    pottyTrained: helpers.parseYesNoBoolean(formData, "pottyTrained", errorStatus),
    className: classValue,
    doctorName: helpers.mustString(formData, "doctorName", errorStatus),
    doctorPhone: helpers.normalizeAndValidatePhone(
      formData,
      "doctorPhone",
      errorStatus,
      "DOC_PHONE_INVALID",
      { required: true }
    ),
    enrollDate,
    dropDate,
    fee: feeValue,
    parentOneId,
    parentOneName: helpers.mustString(formData, "parentOneName", errorStatus),
    parentOneAddress: helpers.mustString(
      formData,
      "parentOneAddress",
      errorStatus
    ),
    parentOnePhone: helpers.normalizeAndValidatePhone(
      formData,
      "parentOnePhone",
      errorStatus,
      "P1_PHONE_INVALID",
      { required: true }
    ),
    parentOneEmail: helpers.validateEmailAddress(
      formData,
      "parentOneEmail",
      errorStatus,
      "P1_EMAIL_INVALID",
      { required: true }
    ),
    parentTwoId,
    parentTwoName: helpers.optionalString(formData, "parentTwoName"),
    parentTwoAddress: helpers.optionalString(formData, "parentTwoAddress"),
    parentTwoPhone: helpers.normalizeAndValidatePhone(
      formData,
      "parentTwoPhone",
      errorStatus,
      "P2_PHONE_INVALID",
      { required: false }
    ),
    parentTwoEmail: helpers.validateEmailAddress(
      formData,
      "parentTwoEmail",
      errorStatus,
      "P2_EMAIL_INVALID",
      { required: false }
    ),
  };

  if (errorStatus.checkErrors() === 0) {
    await updateChildAndParents(registrationData, errorStatus);
  }

  if (errorStatus.uncaughtErrors.size > 0) {
    redirect(`/admin/EditChild?childId=${childId}&status=error`);
  }
  if (errorStatus.caughtErrors.has(DB_ERROR_CODES.DUPLICATE_CHILD)) {
    redirect(`/admin/EditChild?childId=${childId}&status=duplicate`);
  }
  if (errorStatus.caughtErrors.size > 0) {
    redirect(`/admin/EditChild?childId=${childId}&status=invalid`);
  }

  redirect(`/admin/EditChild?childId=${childId}&status=success`);
}
