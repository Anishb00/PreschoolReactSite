import { NextRequest, NextResponse } from "next/server";
import { authorizeUser } from "@/lib/authentication";
import { sendSesEmail } from "@/lib/email/sendSesEmail";

type SendEmailBody = {
  recipients?: string[];
  subject?: string;
  message?: string;
};

export async function POST(req: NextRequest) {
  // Only admins should send bulk emails to parents
  await authorizeUser("admin");

  const sesConfigured = Boolean(process.env.SES_SOURCE_EMAIL);
  if (!sesConfigured) {
    return NextResponse.json(
      { error: "Email service is not configured on this server." },
      { status: 500 }
    );
  }

  let body: SendEmailBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const recipients = Array.from(new Set((body.recipients ?? []).map((r) => (r || "").trim()))).filter(
    (r) => r.length > 0
  );
  const subject = (body.subject ?? "").trim();
  const message = (body.message ?? "").trim();

  if (recipients.length === 0) {
    return NextResponse.json({ error: "No recipient emails provided." }, { status: 400 });
  }

  const sent: string[] = [];
  const failed: { email: string; error: string }[] = [];

  for (const email of recipients) {
    try {
      // send one-by-one to know per-recipient status
      await sendSesEmail([email], subject, message);
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
