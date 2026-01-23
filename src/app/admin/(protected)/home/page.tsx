import { revalidatePath } from "next/cache";
import ChildrenTable from "@/app/admin/components/ChildrenTable";
import { authorizeUser } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";
import {
  ChildWithParentsFullRow,
  deleteChildById,
  getChildrenWithParentsFull,
} from "@/lib/dbOperations";
import { EndpointErrorResponse } from "@/lib/EndpointErrorResponse";
import { isAdmin } from "@/lib/authentication";

type TableState = {
  children: {
    id: number;
    name: string;
    sex: string;
    program: string;
    className: string;
  enrollDate: string;
  fee: string;
  dropDate: string;
  parent1Name: string;
  parent1Email: string;
  parent1Verified?: boolean;
  parent2Name: string;
  parent2Email: string;
  parent2Verified?: boolean;
  }[];
  lastDeletedId?: number;
  message?: string;
};

function formatDate(value: Date | null): string {
  if (!value) {
    return "";
  }
  return value.toISOString().split("T")[0];
}

function mapChildRow(row: ChildWithParentsFullRow) {
  return {
    id: row.Child_ID,
    name: row.Child_name ?? "",
    sex: row.Sex ?? "",
    program: row.Program ?? "",
    className: row.Class ?? "",
    enrollDate: formatDate(row.Enroll_date ?? null),
    fee: row.Fee != null ? String(row.Fee) : "",
    dropDate: formatDate(row.Drop_date ?? null),
    parent1Name: row.Parent1_Name ?? "",
    parent1Email: row.Parent1_Email ?? "",
    parent1Verified: row.Parent1_Verified ? Boolean(row.Parent1_Verified) : false,
    parent2Name: row.Parent2_Name ?? "",
    parent2Email: row.Parent2_Email ?? "",
    parent2Verified: row.Parent2_Verified ? Boolean(row.Parent2_Verified) : false,
  };
}

export default async function Dashboard() {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.VIEW_DASHBOARD);
  const isAdminUser = await isAdmin();
  const errorStatus = new EndpointErrorResponse();
  const rows = await getChildrenWithParentsFull(errorStatus);
  const children = rows.map(mapChildRow);
  const headerTitle = isAdminUser ? "Welcome, Admin" : "Welcome";

  const deleteChild = async (
    _prevState: TableState,
    formData: FormData
  ): Promise<TableState> => {
    "use server";
    const errorState = new EndpointErrorResponse();
    const childId = Number(formData.get("childId"));
    if (!Number.isFinite(childId)) {
      return {
        children: (await getChildrenWithParentsFull(errorState)).map(mapChildRow),
        message: "Invalid child selected.",
      };
    }

    await deleteChildById(childId, errorState);
    if (errorState.uncaughtErrors.size > 0) {
      return {
        children: (await getChildrenWithParentsFull(errorState)).map(mapChildRow),
        message: "Unable to delete child. Please try again.",
      };
    }

    revalidatePath("/admin/home");
    return {
      children: (await getChildrenWithParentsFull(errorState)).map(mapChildRow),
      lastDeletedId: childId,
      message: "Child removed.",
    };
  };

  return (
    <>
      <header className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">{headerTitle}</h2>
      <p className="text-gray-600">Manage child records below.</p>
    </header>

    <section className="mt-6">
      <ChildrenTable
        initialChildren={children}
        deleteChild={deleteChild}
        isAdmin={isAdminUser}
        fullView={false}
      />
    </section>
  </>
  );
}
