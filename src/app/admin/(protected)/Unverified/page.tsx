import ChildrenTable, { type ChildRow } from "@/app/admin/components/ChildrenTable";
import { authorizeUser, isAdmin } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";
import { EndpointErrorResponse } from "@/lib/EndpointErrorResponse";
import { getChildrenWithParentsFull, type ChildWithParentsFullRow } from "@/lib/dbOperations";

const TARGET_CLASSES = new Set([
  "Caterpillar",
  "Chrysalis",
  "Butterfly",
  "Sunshine",
  "Rainbow",
]);

function mapRow(row: ChildWithParentsFullRow): ChildRow {
  return {
    id: row.Child_ID,
    name: row.Child_name ?? "",
    sex: row.Sex ?? "",
    program: row.Program ?? "",
    className: row.Class ?? "",
    dob: row.DOB ? row.DOB.toISOString().split("T")[0] : undefined,
    enrollDate: row.Enroll_date ? row.Enroll_date.toISOString().split("T")[0] : "",
    fee: row.Fee != null ? String(row.Fee) : "",
    dropDate: row.Drop_date ? row.Drop_date.toISOString().split("T")[0] : "",
    doctorName: row.Doctor_name ?? "",
    doctorPhone: row.Doctor_phone ?? "",
    parent1Name: row.Parent1_Name ?? "",
    parent1Email: row.Parent1_Email ?? "",
    parent1Phone: row.Parent1_Phone ?? "",
    parent1Address: row.Parent1_Address ?? "",
    parent1Verified:
      row.Parent1_Verified === null || row.Parent1_Verified === undefined
        ? undefined
        : Boolean(row.Parent1_Verified),
    parent2Name: row.Parent2_Name ?? "",
    parent2Email: row.Parent2_Email ?? "",
    parent2Phone: row.Parent2_Phone ?? "",
    parent2Address: row.Parent2_Address ?? "",
    parent2Verified:
      row.Parent2_Verified === null || row.Parent2_Verified === undefined
        ? undefined
        : Boolean(row.Parent2_Verified),
  };
}

export default async function UnverifiedPage() {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.VIEW_DASHBOARD);
  const isAdminUser = await isAdmin();
  const errorStatus = new EndpointErrorResponse();
  const rows = await getChildrenWithParentsFull(errorStatus);

  const filtered = rows.filter((row) => {
    const classOk = row.Class ? TARGET_CLASSES.has(row.Class) : false;
    if (!classOk) return false;
    const parent1Unverified = !!row.Parent1_Email && row.Parent1_Verified === 0;
    const parent2Unverified = !!row.Parent2_Email && row.Parent2_Verified === 0;
    return parent1Unverified || parent2Unverified;
  });

  const children = filtered.map(mapRow);

  const deleteChild = async () => {
    "use server";
    return {
      children,
      message: "Delete is disabled on this view.",
    };
  };

  return (
    <div className="space-y-6">
      <header className="mb-2">
        <h1 className="text-3xl font-semibold text-gray-800">Unverified Emails</h1>
        <p className="text-gray-600">
          Children in Caterpillar, Chrysalis, Butterfly, Sunshine, or Rainbow with at least one unverified parent email.
        </p>
      </header>
      <ChildrenTable
        initialChildren={children}
        deleteChild={deleteChild}
        isAdmin={isAdminUser}
        fullView={false}
        showPrintControls={false}
      />
    </div>
  );
}
