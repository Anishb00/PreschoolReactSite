import { redirect } from "next/navigation";
import ChildForm from "@/app/admin/components/ChildForm";
import type { RegistrationData } from "@/lib/types/Registertypes";
import { EndpointErrorResponse } from "@/lib/EndpointErrorResponse";
import { API_ERROR_CODES, DB_ERROR_CODES } from "@/lib/errorCodes";
import * as helpers from "@/lib/registration-helpers";
import {
  getChildWithParentsById,
  updateChildAndParents,
  type UpdateChildPayload,
} from "@/lib/dbOperations";

type EditChildPageProps = {
  searchParams?: {
    childId?: string;
    status?: string;
  } | Promise<{ childId?: string; status?: string }>;
};

function toDateOnly(value: Date | null): Date | null {
  if (!value) {
    return null;
  }
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

export default async function EditChildPage({ searchParams }: EditChildPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const status = resolvedSearchParams?.status ?? "";
  const createChild = async (formData: FormData) => {
    "use server";
    void formData;
  };

  const updateChild = async (formData: FormData) => {
    "use server";
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

    const registrationData: UpdateChildPayload = {
      childId,
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
  };

  const childId = Number(resolvedSearchParams?.childId);
  const errorStatus = new EndpointErrorResponse();
  const row = Number.isFinite(childId)
    ? await getChildWithParentsById(childId, errorStatus)
    : null;

  const values: Partial<
    RegistrationData & {
      childClass?: string;
      fee?: number | null;
      enrollDate?: Date | null;
      dropDate?: Date | null;
      childId?: number;
      parentOneId?: number;
      parentTwoId?: number | null;
    }
  > | undefined = row
    ? {
        childId: row.Child_ID,
        childName: row.Child_name ?? "",
        dob: toDateOnly(row.DOB) ?? new Date(),
        sex: (row.Sex ?? "") as RegistrationData["sex"],
        Program: (row.Program ?? "") as RegistrationData["Program"],
        doctorName: row.Doctor_name ?? "",
        doctorPhone: row.Doctor_phone ?? "",
        parentOneName: row.Parent1_Name ?? "",
        parentOneAddress: row.Parent1_Address ?? "",
        parentOnePhone: row.Parent1_Phone ?? "",
        parentOneEmail: row.Parent1_Email ?? "",
        parentOneId: row.Parent1_ID ?? undefined,
        parentTwoName: row.Parent2_Name ?? null,
        parentTwoAddress: row.Parent2_Address ?? null,
        parentTwoPhone: row.Parent2_Phone ?? null,
        parentTwoEmail: row.Parent2_Email ?? null,
        parentTwoId: row.Parent2_ID ?? null,
        childClass: row.Class ?? "",
        fee: row.Fee ?? null,
        enrollDate: toDateOnly(row.Enroll_date),
        dropDate: toDateOnly(row.Drop_date),
      }
    : undefined;

  return (
    <>
      <header className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Edit Child</h2>
        <p className="text-gray-600">Update an existing child record.</p>
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
          {status === "success" && "Child record updated successfully."}
          {status === "invalid" &&
            "Some fields were invalid. Please review and submit again."}
          {status === "duplicate" &&
            "That child already exists in the database."}
          {status === "error" &&
            "Something went wrong while saving. Please try again."}
        </div>
      )}
      {!row ? (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Unable to load the selected child. Please return to the dashboard and try again.
        </div>
      ) : (
        <ChildForm
          values={values}
          createAction={createChild}
          updateAction={updateChild}
        />
      )}
    </>
  );
}
