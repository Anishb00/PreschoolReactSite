import { authorizeUser } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";

type PageProps = {
  params: { childId: string };
  searchParams: Promise<{ ts?: string }>;
};

export default async function ReceiptPreviewPage({ params, searchParams }: PageProps) {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.GENERATE_RECIEPTS);
  const search = await searchParams;
  const cacheBust = search?.ts ?? Date.now().toString();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-6 px-4">
      <header className="mb-2">
        <h1 className="text-3xl font-semibold text-gray-800">Receipt Preview</h1>
        <p className="text-gray-600">Review the generated receipt below.</p>
      </header>

      <div className="w-full overflow-hidden rounded border border-gray-200 shadow-sm h-[75vh] max-h-[900px] max-w-4xl">
        <iframe
          title="Filled Receipt"
          src={`/api/receipt-file?ts=${cacheBust}`}
          className="h-full w-full"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          Email
        </button>
      </div>
    </div>
  );
}
