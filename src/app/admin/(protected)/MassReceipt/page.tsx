import MassReceiptTable, { MassReceiptChild } from "@/app/admin/components/MassReceiptTable";
import { authorizeUser } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";
import { EndpointErrorResponse } from "@/lib/EndpointErrorResponse";
import { getChildrenWithParents } from "@/lib/dbOperations";

function mapChild(row: Awaited<ReturnType<typeof getChildrenWithParents>>[number]): MassReceiptChild {
  return {
    id: row.Child_ID,
    childName: row.Child_name ?? "",
    className: row.Class ?? "",
    parent1Name: row.Parent1_Name ?? "",
    parent1Email: row.Parent1_Email ?? "",
    parent2Name: row.Parent2_Name ?? "",
    parent2Email: row.Parent2_Email ?? "",
  };
}

export default async function MassReceiptPage() {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.GENERATE_RECIEPTS);

  const errorStatus = new EndpointErrorResponse();
  const rows = await getChildrenWithParents(errorStatus);
  const children = rows.map(mapChild);

  return (
    <div className="space-y-6">
      <header className="mb-2">
        <h1 className="text-3xl font-semibold text-gray-800">Mass Receipt Prep</h1>
        <p className="text-gray-600">
          Select children to prepare receipts. Emails will send once delivery is implemented.
        </p>
      </header>

      <MassReceiptTable initialChildren={children} />
    </div>
  );
}
