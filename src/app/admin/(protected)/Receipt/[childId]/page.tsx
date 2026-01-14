import { notFound } from "next/navigation";
import { authorizeUser } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";
import { EndpointErrorResponse } from "@/lib/EndpointErrorResponse";
import { getChildWithParentsById } from "@/lib/dbOperations";
import ReceiptForm from "@/app/admin/components/ReceiptForm";

type PageProps = {
  params: { childId: string };
};

export default async function ReceiptFormPage({ params }: PageProps) {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.GENERATE_RECIEPTS);
  const childId = Number(params.childId);
  if (!Number.isFinite(childId)) {
    notFound();
  }

  const errorStatus = new EndpointErrorResponse();
  const child = await getChildWithParentsById(childId, errorStatus);
  if (errorStatus.uncaughtErrors.size > 0 || !child) {
    notFound();
  }

  const parentNames = [child.Parent1_Name, child.Parent2_Name].filter(Boolean).join(" & ");
  const preschoolFee = child.Fee != null ? String(child.Fee) : "";

  return (
    <div className="space-y-6">
      <header className="mb-2">
        <h1 className="text-3xl font-semibold text-gray-800">Generate Receipt</h1>
        <p className="text-gray-600">Fill in the receipt details and generate the PDF.</p>
      </header>

      <ReceiptForm
        childId={child.Child_ID}
        childName={child.Child_name}
        parentNames={parentNames}
        preschoolFee={preschoolFee}
      />
    </div>
  );
}
