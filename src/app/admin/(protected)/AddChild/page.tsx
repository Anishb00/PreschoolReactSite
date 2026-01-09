import { redirect } from "next/navigation";
import ChildForm from "@/app/admin/components/ChildForm";
import * as helpers from "@/lib/registration-helpers";
import { EndpointErrorResponse } from "@/lib/EndpointErrorResponse";
import { API_ERROR_CODES, DB_ERROR_CODES } from "@/lib/errorCodes";
import { addChildWithParentsFull } from "@/lib/dbOperations";
import type { AddChildFullPayload } from "@/lib/dbOperations";

type AddChildPageProps = {
  searchParams?: {
    status?: string;
  };
};

export default async function AddChildPage({ searchParams }: AddChildPageProps) {
  const status = searchParams?.status ?? "";
  const createChild = async (formData: FormData) => {
    "use server";
    const errorStatus = new EndpointErrorResponse();
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

    const classRaw = String(formData.get("childClass") || "").trim();
    const classValue = classRaw ? classRaw : null;
    if (classValue && !classOptions.has(classValue)) {
      errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR);
      errorStatus.log(`recieved invalid class value: ${classValue}`);
    }

    const feeRaw = String(formData.get("fee") || "").trim();
    const feeValue = feeRaw ? Number(feeRaw) : null;
    if (feeRaw && (Number.isNaN(feeValue) || feeValue < 0)) {
      errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR);
      errorStatus.log(`recieved invalid fee value: ${feeRaw}`);
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
  };

  const updateChild = async (formData: FormData) => {
    "use server";
    void formData;
  };

  return (
    <>
      <header className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Add Child</h2>
        <p className="text-gray-600">Create a new child record.</p>
      </header>
      {status && (
        <div
          className={[
            "mb-6 rounded-md border px-4 py-3 text-sm font-semibold",
            status === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : status === "invalid"
                ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                : status === "duplicate"
                  ? "border-orange-200 bg-orange-50 text-orange-700"
                  : "border-red-200 bg-red-50 text-red-700",
          ].join(" ")}
        >
          {status === "success" && "Child record created successfully."}
          {status === "invalid" &&
            "Some fields were invalid. Please review and submit again."}
          {status === "duplicate" &&
            "That child already exists in the database."}
          {status === "error" &&
            "Something went wrong while saving. Please try again."}
        </div>
      )}
      <ChildForm createAction={createChild} updateAction={updateChild} />
    </>
  );
}
