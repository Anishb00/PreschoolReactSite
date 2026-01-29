import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";
import { authorizeUser } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";
import { EndpointErrorResponse } from "@/lib/EndpointErrorResponse";
import { getChildWithParentsById } from "@/lib/dbOperations";
import { sendSesEmail } from "@/lib/email/sendSesEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OUTPUT_PATH = path.join(process.cwd(), "documents", "filled_reciept.pdf");

type ReceiptEmailBody = {
  childId?: number;
  month?: string;
  year?: string;
};

export async function POST(req: NextRequest) {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.GENERATE_RECIEPTS);

  const sesConfigured = Boolean(process.env.SES_SOURCE_EMAIL);
  if (!sesConfigured) {
    return NextResponse.json(
      { error: "Email service is not configured on this server." },
      { status: 500 }
    );
  }

  let body: ReceiptEmailBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const childId = Number(body.childId);
  if (!Number.isFinite(childId)) {
    return NextResponse.json({ error: "childId is required." }, { status: 400 });
  }

  const errorStatus = new EndpointErrorResponse();
  const childRow = await getChildWithParentsById(childId, errorStatus);
  if (errorStatus.uncaughtErrors.size > 0) {
    return NextResponse.json({ error: "Unable to load child data." }, { status: 500 });
  }
  if (!childRow) {
    return NextResponse.json({ error: "Child not found." }, { status: 404 });
  }

  const recipients = Array.from(
    new Set(
      [childRow.Parent1_Email, childRow.Parent2_Email]
        .map((email) => String(email ?? "").trim())
        .filter((email) => email.length > 0)
    )
  );

  if (recipients.length === 0) {
    return NextResponse.json(
      { error: "No parent email addresses available for this child." },
      { status: 400 }
    );
  }

  let attachmentContent: string;
  try {
    const bytes = await readFile(OUTPUT_PATH);
    attachmentContent = Buffer.from(bytes).toString("base64");
  } catch {
    return NextResponse.json(
      { error: "Receipt PDF not found. Generate it before emailing." },
      { status: 404 }
    );
  }

  const month = typeof body.month === "string" ? body.month.trim() : "";
  const year = typeof body.year === "string" ? body.year.trim() : "";
  const period = month && year ? `${month} ${year}` : "";

  const subject = period
    ? `Receipt for ${childRow.Child_name ?? "your child"} - ${period}`
    : `Receipt for ${childRow.Child_name ?? "your child"}`;
  const message = period
    ? `Please find the receipt attached for ${childRow.Child_name ?? "your child"} for ${period}.`
    : `Please find the receipt attached for ${childRow.Child_name ?? "your child"}.`;

  const sent: string[] = [];
  const failed: { email: string; error: string }[] = [];

  for (const email of recipients) {
    try {
      await sendSesEmail([email], subject, message, undefined, {
        filename: "receipt.pdf",
        content: attachmentContent,
        contentType: "application/pdf",
      });
      sent.push(email);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error sending email.";
      failed.push({ email, error: msg });
    }
  }

  const success = sent.length > 0;
  return NextResponse.json({
    success,
    sent,
    failed,
  });
}
