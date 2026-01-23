import { NextRequest, NextResponse } from "next/server";
import { authorizeUser } from "@/lib/authentication";
import { sendSesEmail } from "@/lib/email/sendSesEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  to: string[];
  subject: string;
  message: string;
  attachment?: {
    filename: string;
    content: string; // base64
    contentType?: string;
  } | null;
};

export async function POST(req: NextRequest) {
  await authorizeUser("admin");
  const body = (await req.json()) as Partial<Payload>;
  const to = Array.isArray(body.to) ? body.to.filter(Boolean) : [];
  const subject = body.subject ?? "";
  const message = body.message ?? "";
  const attachment = body.attachment ?? null;

  if (to.length === 0) {
    return NextResponse.json({ error: "No recipients provided." }, { status: 400 });
  }
  if (!subject.trim()) {
    return NextResponse.json({ error: "Subject is required." }, { status: 400 });
  }
  if (!message.trim()) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  try {
    const failed: string[] = [];
    for (const recipient of to) {
      try {
        await sendSesEmail([recipient], subject, message, undefined, attachment ?? undefined);
      } catch (err) {
        console.error("Mass email send failed for", recipient, err);
        failed.push(recipient);
      }
    }
    return NextResponse.json({ ok: true, failed });
  } catch (err) {
    console.error("Mass email send failed", err);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
