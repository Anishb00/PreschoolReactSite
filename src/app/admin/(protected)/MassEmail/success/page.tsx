import { authorizeUser } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";

type PageProps = {
  searchParams: Promise<{ names?: string }>;
};

export default async function MassEmailSuccessPage({ searchParams }: PageProps) {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.GENERATE_RECIEPTS);
  const params = await searchParams;
  let names: string[] = [];
  if (params.names) {
    try {
      const decoded = JSON.parse(decodeURIComponent(params.names));
      if (Array.isArray(decoded)) {
        names = decoded.map((n) => String(n));
      }
    } catch {
      // ignore parse failures
    }
  }

  return (
    <div className="space-y-4">
      <header className="mb-2">
        <h1 className="text-3xl font-semibold text-gray-800">Emails Sent</h1>
        <p className="text-gray-600">Preview of children who would receive the email.</p>
      </header>

      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
        Emails queued successfully.
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Recipients</h2>
        {names.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">No names provided.</p>
        ) : (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-800">
            {names.map((name, idx) => (
              <li key={`${name}-${idx}`}>{name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
