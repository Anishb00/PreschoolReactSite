import ChildForm from "@/app/admin/components/ChildForm";
import type { RegistrationData } from "@/lib/types/Registertypes";
import { EndpointErrorResponse } from "@/lib/EndpointErrorResponse";
import { getChildWithParentsById } from "@/lib/dbOperations";

type EditChildPageProps = {
  searchParams?: Promise<{ childId?: string; status?: string }>;
};

function toDateOnly(value: Date | null): Date | null {
  if (!value) {
    return null;
  }
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

export default async function EditChildPage({ searchParams }: EditChildPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const status = resolvedSearchParams?.status ?? "";

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
        <ChildForm values={values} />
      )}
    </>
  );
}
