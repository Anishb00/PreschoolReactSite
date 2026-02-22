import { revalidatePath } from "next/cache";
import ChildrenTable, { type ChildRow } from "@/app/admin/components/ChildrenTable";
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
  children: ChildRow[];
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
  const formatTime = (value: Date | string | null | undefined): string => {
    if (!value) return "";
    const str = value instanceof Date ? value.toTimeString().slice(0, 5) : String(value).slice(0, 5);
    const [hStr, m] = str.split(":");
    const hNum = Number(hStr);
    if (Number.isNaN(hNum)) return str;
    const period = hNum >= 12 ? "PM" : "AM";
    const hour12 = hNum % 12 === 0 ? 12 : hNum % 12;
    return `${hour12}:${m ?? "00"} ${period}`;
  };
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
    parent1Name: row.Parent1_Name ?? "",
    parent1Email: row.Parent1_Email ?? "",
    parent1Verified: row.Parent1_Verified ? Boolean(row.Parent1_Verified) : false,
    parent1Phone: row.Parent1_Phone ?? "",
    parent2Name: row.Parent2_Name ?? "",
    parent2Email: row.Parent2_Email ?? "",
    parent2Verified: row.Parent2_Verified ? Boolean(row.Parent2_Verified) : false,
    parent2Phone: row.Parent2_Phone ?? "",
  };
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams?: Promise<{ class?: string }>;
}) {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.VIEW_DASHBOARD);
  const isAdminUser = await isAdmin();
  const errorStatus = new EndpointErrorResponse();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const currentClass =
    resolvedSearchParams?.class === "unassigned"
      ? "unassigned"
      : resolvedSearchParams?.class ?? "enrolled";
  const classNameParam =
    currentClass && !["enrolled", "unassigned", "all"].includes(currentClass)
      ? currentClass
      : undefined;
  const rows = await getChildrenWithParentsFull(errorStatus, {
    className: classNameParam,
  });
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
        children: (
          await getChildrenWithParentsFull(errorState, {
            className: classNameParam,
          })
        ).map(mapChildRow),
        message: "Invalid child selected.",
      };
    }

    await deleteChildById(childId, errorState);
    if (errorState.uncaughtErrors.size > 0) {
      console.log("home deleteChild action failed", {
        caughtErrors: Array.from(errorState.caughtErrors),
        uncaughtErrors: Array.from(errorState.uncaughtErrors),
        logs: errorState.logs,
        childId,
      });
      return {
        children: (
          await getChildrenWithParentsFull(errorState, {
            className: classNameParam,
          })
        ).map(mapChildRow),
        message: "Unable to delete child. Please try again.",
      };
    }

    revalidatePath("/admin/home");
    return {
      children: (
        await getChildrenWithParentsFull(errorState, {
          className: classNameParam,
        })
      ).map(mapChildRow),
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
        key={currentClass ?? "all"}
        initialChildren={children}
        initialClassFilter={currentClass ?? "all"}
        deleteChild={deleteChild}
        isAdmin={isAdminUser}
        fullView={false}
        compactShowSexColumn={false}
        compactParentContactColumn="phone"
        showCheckoutTime
        showRecordCount
      />
    </section>
  </>
  );
}
