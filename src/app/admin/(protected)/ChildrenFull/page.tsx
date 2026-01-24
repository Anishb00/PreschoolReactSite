import ChildrenTable, { type ChildRow } from "@/app/admin/components/ChildrenTable";
import { authorizeUser, isAdmin } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";
import {
  ChildWithParentsFullRow,
  deleteChildById,
  getChildrenWithParentsFull,
} from "@/lib/dbOperations";
import { EndpointErrorResponse } from "@/lib/EndpointErrorResponse";
import { revalidatePath } from "next/cache";

function formatDate(value: Date | null): string {
  if (!value) {
    return "";
  }
  return value.toISOString().split("T")[0];
}

function formatTime(value: Date | string | null | undefined): string {
  if (!value) return "";
  const asString = value instanceof Date ? value.toTimeString() : String(value);
  return asString.slice(0, 5);
}

function mapChildRow(row: ChildWithParentsFullRow): ChildRow {
  return {
    id: row.Child_ID,
    name: row.Child_name ?? "",
    sex: row.Sex ?? "",
    program: row.Program ?? "",
    className: row.Class ?? "",
    dob: formatDate(row.DOB ?? null),
    enrollDate: formatDate(row.Enroll_date ?? null),
    checkoutTime: formatTime(row.Checkout_time),
    fee: row.Fee != null ? String(row.Fee) : "",
    dropDate: formatDate(row.Drop_date ?? null),
    doctorName: row.Doctor_name ?? "",
    doctorPhone: row.Doctor_phone ?? "",
    parent1Name: row.Parent1_Name ?? "",
    parent1Email: row.Parent1_Email ?? "",
    parent1Verified: row.Parent1_Verified ? Boolean(row.Parent1_Verified) : false,
    parent1Phone: row.Parent1_Phone ?? "",
    parent1Address: row.Parent1_Address ?? "",
    parent2Name: row.Parent2_Name ?? "",
    parent2Email: row.Parent2_Email ?? "",
    parent2Verified: row.Parent2_Verified ? Boolean(row.Parent2_Verified) : false,
    parent2Phone: row.Parent2_Phone ?? "",
    parent2Address: row.Parent2_Address ?? "",
  };
}

type TableState = {
  children: ChildRow[];
  lastDeletedId?: number;
  message?: string;
};

export default async function ChildrenFullPage({
  searchParams,
}: {
  searchParams?: { class?: string };
}) {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.VIEW_DASHBOARD);
  const isAdminUser = await isAdmin();
  const errorStatus = new EndpointErrorResponse();
  const currentClass = searchParams?.class ?? null;
  const rows = await getChildrenWithParentsFull(errorStatus, {
    className: currentClass ?? undefined,
  });
  const children = rows.map(mapChildRow);

  const deleteChild = async (_prevState: TableState, formData: FormData): Promise<TableState> => {
    "use server";
    const errorState = new EndpointErrorResponse();
    const childId = Number(formData.get("childId"));
    if (!Number.isFinite(childId)) {
      return {
        children: (
          await getChildrenWithParentsFull(errorState, {
            className: currentClass ?? undefined,
          })
        ).map(mapChildRow),
        message: "Invalid child selected.",
      };
    }

    await deleteChildById(childId, errorState);
    if (errorState.uncaughtErrors.size > 0) {
      return {
        children: (
          await getChildrenWithParentsFull(errorState, {
            className: currentClass ?? undefined,
          })
        ).map(mapChildRow),
        message: "Unable to delete child. Please try again.",
      };
    }

    revalidatePath("/admin/ChildrenFull");
    return {
      children: (
        await getChildrenWithParentsFull(errorState, {
          className: currentClass ?? undefined,
        })
      ).map(mapChildRow),
      lastDeletedId: childId,
      message: "Child removed.",
    };
  };

  return (
    <>
      <header className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Children (Full View)</h2>
        <p className="text-gray-600">All child and parent details with the same actions as Home.</p>
      </header>

      <section className="mt-6">
        <ChildrenTable
          key={currentClass ?? "all"}
          initialChildren={children}
          initialClassFilter={currentClass ?? "all"}
          deleteChild={deleteChild}
          isAdmin={isAdminUser}
          fullView
        />
      </section>
    </>
  );
}
