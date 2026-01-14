import DocumentManager from "@/app/admin/components/DocumentManager";
import { authorizeUser } from "@/lib/authentication";

export default async function DocumentsPage() {
  await authorizeUser("admin");

  return (
    <div className="space-y-6">
      <header className="mb-2">
        <h1 className="text-3xl font-semibold text-gray-800">Documents</h1>
        <p className="text-gray-600">Upload, replace, or delete files in the documents directory.</p>
      </header>

      <DocumentManager />
    </div>
  );
}
