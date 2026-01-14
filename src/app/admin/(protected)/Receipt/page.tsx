import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { authorizeUser } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";
import RosterLogger from "@/app/admin/components/RosterLogger";

type ReceiptFields = {
  fieldNames: string[];
};

async function extractReceiptFields(): Promise<ReceiptFields> {
  const pdfPath = path.join(process.cwd(), "documents", "reciept.pdf");
  const bytes = await readFile(pdfPath);
  const doc = await PDFDocument.load(bytes);
  const form = doc.getForm();
  const fields = form.getFields();

  // Preserve the order defined in the PDF.
  const fieldNames = fields.map((field) => field.getName());
  return { fieldNames };
}

export default async function ReceiptFieldsPage() {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.GENERATE_RECIEPTS);
  const { fieldNames } = await extractReceiptFields();

  return (
    <>
      <header className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Receipt PDF Fields</h2>
        <p className="text-gray-600">
          Reads and displays all form field names from the receipt PDF template.
        </p>
      </header>

      <div className="space-y-4">
        <RosterLogger fieldNames={fieldNames} label="Receipt PDF" />

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-700">
            Found <strong>{fieldNames.length}</strong> PDF form fields.
          </p>
          {fieldNames.length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-800">
              {fieldNames.map((name, idx) => (
                <li key={`${name}-${idx}`}>
                  <span className="font-mono text-xs">{name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-600">
              No form fields detected in the PDF.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
