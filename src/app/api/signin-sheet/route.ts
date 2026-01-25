import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";
import { PDFDocument } from "pdf-lib";
import { authorizeUser } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";
import { EndpointErrorResponse } from "@/lib/EndpointErrorResponse";
import { getChildrenWithParents } from "@/lib/dbOperations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GenerateSigninSheetBody = {
  className?: string;
  childNames?: string[];
};

const TEMPLATE_FILENAME = "signin_sheet.pdf";
const TEMPLATE_PATH = path.join(process.cwd(), "documents", TEMPLATE_FILENAME);
const CHILDREN_PER_PAGE = 8;

function sanitizeChildNames(names: unknown): string[] {
  if (!Array.isArray(names)) {
    return [];
  }
  return names
    .map((value) => String(value ?? "").trim())
    .filter((value) => value.length > 0);
}

function formatNameWithCheckout(name: string, checkoutTime?: string | null): string {
  // Strip whitespace and keep only the leading HH:MM portion; drop trailing AM/PM letters
  const match = (checkoutTime ?? "").replace(/\s+/g, "").match(/^(\d{1,2}:\d{2})/);
  const hhmm = match ? match[1] : "";
  if (!hhmm) return name;
  return `${name} checkout:(${hhmm})`;
}

function chunkNames(names: string[], chunkSize: number): string[][] {
  const chunks: string[][] = [];
  for (let i = 0; i < names.length; i += chunkSize) {
    chunks.push(names.slice(i, i + chunkSize));
  }
  return chunks;
}

function setTextField(form: ReturnType<PDFDocument["getForm"]>, name: string, value: string) {
  try {
    form.getTextField(name).setText(value);
  } catch (err) {
    throw new Error(`signin_sheet.pdf is missing the "${name}" form field.`);
  }
}

export async function POST(req: NextRequest) {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.GENERATE_SIGNIN_SHEET);

  let body: GenerateSigninSheetBody;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const className = (body.className ?? "").trim();
  if (!className) {
    return NextResponse.json(
      { error: "className is required to build a sign-in sheet." },
      { status: 400 }
    );
  }

  let childNames = sanitizeChildNames(body.childNames);

  if (childNames.length === 0) {
    // Fallback to DB lookup when the client does not send child names
    const errorStatus = new EndpointErrorResponse();
    const rows = await getChildrenWithParents(errorStatus);
    if (errorStatus.uncaughtErrors.size > 0) {
      return NextResponse.json(
        { error: "Unable to load children for the requested class." },
        { status: 500 }
      );
    }
    childNames = rows
      .filter((row) => (row.Class ?? "").trim() === className)
      .map((row) => {
        const name = (row.Child_name ?? "").trim();
        if (!name) return "";
        return formatNameWithCheckout(name, (row as any).Checkout_time);
      })
      .filter((name) => name.length > 0)
      .sort((a, b) => a.localeCompare(b));
  }

  if (childNames.length === 0) {
    return NextResponse.json(
      { error: `No children found for class "${className}".` },
      { status: 404 }
    );
  }

  let templateBytes: Uint8Array;
  try {
    templateBytes = await readFile(TEMPLATE_PATH);
  } catch (err) {
    return NextResponse.json(
      { error: "signin_sheet.pdf could not be read from the server." },
      { status: 500 }
    );
  }

  try {
    const outputDoc = await PDFDocument.create();
    const chunks = chunkNames(childNames, CHILDREN_PER_PAGE);

    for (const chunk of chunks) {
      const templateDoc = await PDFDocument.load(templateBytes);
      const form = templateDoc.getForm();

      setTextField(form, "class_name", className);
      for (let i = 0; i < CHILDREN_PER_PAGE; i += 1) {
        const childName = chunk[i] ?? "";
        setTextField(form, `child${i + 1}_name`, childName);
      }

      form.flatten();
      const pages = await outputDoc.copyPages(templateDoc, templateDoc.getPageIndices());
      pages.forEach((page) => outputDoc.addPage(page));
    }

    const pdfBytes = await outputDoc.save();
    const safeClassName = className.replace(/[^a-z0-9-_]+/gi, "_") || "class";
    const filename = `signin_sheet_${safeClassName}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to generate sign-in sheet PDF.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
