import MassEmailTable, { MassEmailChild } from "@/app/admin/components/MassEmailTable";
import { authorizeUser } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";
import { EndpointErrorResponse } from "@/lib/EndpointErrorResponse";
import { getChildrenWithParents } from "@/lib/dbOperations";

function mapChild(row: Awaited<ReturnType<typeof getChildrenWithParents>>[number]): MassEmailChild {
  const parent1Verified = row.Parent1_Verified === 1;
  const parent2Verified = row.Parent2_Verified === 1;
  return {
    id: row.Child_ID,
    childName: row.Child_name ?? "",
  className: row.Class ?? "",
  parent1Name: row.Parent1_Name ?? "",
  parent1Email: row.Parent1_Email ?? "",
  parent1Verified,
  parent2Name: row.Parent2_Name ?? "",
  parent2Email: row.Parent2_Email ?? "",
  parent2Verified,
  };
}

export default async function MassEmailPage() {
  await authorizeUser("admin");
  const errorStatus = new EndpointErrorResponse();
  const rows = await getChildrenWithParents(errorStatus);
  const children = rows.map(mapChild);

  return (
    <div className="space-y-6">
      <header className="mb-2">
        <h1 className="text-3xl font-semibold text-gray-800">Mass Email</h1>
        <p className="text-gray-600">Select children and prepare an email for their parents.</p>
      </header>

      <MassEmailTable initialChildren={children} />
    </div>
  );
}
