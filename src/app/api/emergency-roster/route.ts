import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";
import { PDFDocument } from "pdf-lib";
import { authorizeUser } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";
import { EndpointErrorResponse } from "@/lib/EndpointErrorResponse";
import {
  ChildWithParentsFullRow,
  getChildrenWithParentsFull,
} from "@/lib/dbOperations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GenerateEmergencyRosterBody = {
  className?: string;
};

const TEMPLATE_PATH = path.join(process.cwd(), "documents", "emergency_roster.pdf");
const CHILDREN_PER_PAGE = 14;

function sanitizeClassName(value: unknown): string {
  return String(value ?? "").trim();
}

function formatDate(value: Date | string | null | undefined): string {
  if (!value) {
    return "";
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function formatNameAndPhone(name: string | null, phone: string | null): string {
  const pieces = [name ?? "", phone ?? ""].map((value) => value.trim()).filter(Boolean);
  return pieces.join(" / ");
}

function pickAddress(row: ChildWithParentsFullRow): string {
  const addresses = [row.Parent1_Address, row.Parent2_Address].map((value) =>
    String(value ?? "").trim()
  );
  return addresses.find((value) => value.length > 0) ?? "";
}

type RosterEntry = {
  name: string;
  dob: Date | string | null;
  address: string;
  parent1: string;
  parent2: string;
  doctor: string;
  enrollDate: Date | string | null;
  dropDate: Date | string | null;
};

function chunkEntries(entries: RosterEntry[], chunkSize: number): RosterEntry[][] {
  const chunks: RosterEntry[][] = [];
  for (let i = 0; i < entries.length; i += chunkSize) {
    chunks.push(entries.slice(i, i + chunkSize));
  }
  return chunks;
}

function setTextField(form: ReturnType<PDFDocument["getForm"]>, name: string, value: string) {
  try {
    form.getTextField(name).setText(value);
  } catch (err) {
    throw new Error(`emergency_roster.pdf is missing the "${name}" form field.`);
  }
}

export async function POST(req: NextRequest) {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.GENERATE_EMERGENCY_ROSTER);

  let body: GenerateEmergencyRosterBody;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const className = sanitizeClassName(body.className);
  if (!className) {
    return NextResponse.json(
      { error: "className is required to build an emergency roster." },
      { status: 400 }
    );
  }

  let templateBytes: Uint8Array;
  try {
    templateBytes = await readFile(TEMPLATE_PATH);
  } catch (err) {
    return NextResponse.json(
      { error: "emergency_roster.pdf could not be read from the server." },
      { status: 500 }
    );
  }

  const errorStatus = new EndpointErrorResponse();
  const rosterRows = await getChildrenWithParentsFull(errorStatus, { className });
  if (errorStatus.uncaughtErrors.size > 0) {
    return NextResponse.json(
      { error: "Unable to load children for the requested class." },
      { status: 500 }
    );
  }

  const entries: RosterEntry[] = rosterRows
    .map((row) => ({
      name: String(row.Child_name ?? "").trim(),
      dob: row.DOB ?? null,
      address: pickAddress(row),
      parent1: formatNameAndPhone(row.Parent1_Name, row.Parent1_Phone),
      parent2: formatNameAndPhone(row.Parent2_Name, row.Parent2_Phone),
      doctor: formatNameAndPhone(row.Doctor_name, row.Doctor_phone),
      enrollDate: row.Enroll_date ?? null,
      dropDate: row.Drop_date ?? null,
    }))
    .filter((entry) => entry.name.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (entries.length === 0) {
    return NextResponse.json(
      { error: `No children found for class "${className}".` },
      { status: 404 }
    );
  }

  try {
    const outputDoc = await PDFDocument.create();
    const now = formatDate(new Date());
    const chunks = chunkEntries(entries, CHILDREN_PER_PAGE);

    for (const chunk of chunks) {
      const templateDoc = await PDFDocument.load(templateBytes);
      const form = templateDoc.getForm();

      setTextField(form, "class", className);
      setTextField(form, "date", now);

      for (let i = 0; i < CHILDREN_PER_PAGE; i += 1) {
        const entry = chunk[i];
        const rowNumber = i + 1;

        setTextField(form, `child${rowNumber}_name`, entry?.name ?? "");
        setTextField(form, `child${rowNumber}_dob`, entry ? formatDate(entry.dob) : "");
        setTextField(form, `parent${rowNumber}_addr`, entry?.address ?? "");
        setTextField(form, `parent1_${rowNumber}`, entry?.parent1 ?? "");
        setTextField(form, `parent2_${rowNumber}`, entry?.parent2 ?? "");
        setTextField(form, `child${rowNumber}_doc`, entry?.doctor ?? "");
        setTextField(form, `child${rowNumber}_enroll`, entry ? formatDate(entry.enrollDate) : "");
        setTextField(form, `child${rowNumber}_left`, entry ? formatDate(entry.dropDate) : "");
      }

      form.flatten();
      const pages = await outputDoc.copyPages(templateDoc, templateDoc.getPageIndices());
      pages.forEach((page) => outputDoc.addPage(page));
    }

    const pdfBytes = await outputDoc.save();
    const safeClassName = className.replace(/[^a-z0-9-_]+/gi, "_") || "class";
    const filename = `emergency_roster_${safeClassName}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unable to generate emergency roster PDF.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
