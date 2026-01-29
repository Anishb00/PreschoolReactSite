import { authorizeUser } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";
import ReceiptPreviewClient from "@/app/admin/components/ReceiptPreviewClient";

type PageProps = {
  params: Promise<{ childId: string }>;
  searchParams: Promise<{ ts?: string; month?: string; year?: string }>;
};

export default async function ReceiptPreviewPage({ params, searchParams }: PageProps) {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.GENERATE_RECIEPTS);
  const [resolvedParams, search] = await Promise.all([params, searchParams]);
  const cacheBust = search?.ts ?? Date.now().toString();
  const childId = Number(resolvedParams.childId);

  if (!Number.isFinite(childId)) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Invalid child selected.
        </div>
      </div>
    );
  }

  return (
    <ReceiptPreviewClient
      childId={childId}
      cacheBust={cacheBust}
      month={search?.month}
      year={search?.year}
    />
  );
}
