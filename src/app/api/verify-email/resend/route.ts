import { NextRequest, NextResponse } from "next/server";
import { resendVerificationByEmail } from "@/lib/verification";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const childName = typeof body.childName === "string" ? body.childName.trim() : undefined;

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const result = await resendVerificationByEmail(email, childName);
  switch (result.status) {
    case "sent":
      return NextResponse.json({ ok: true });
    case "already_verified":
      return NextResponse.json({ error: "Email already verified." }, { status: 400 });
    case "not_found":
      return NextResponse.json({ error: "No parent found for that email." }, { status: 404 });
    case "ambiguous":
      return NextResponse.json({
        error: "Multiple parents found for that email. Please include childName to disambiguate.",
      }, { status: 400 });
    case "cooldown":
      return NextResponse.json({ error: "Please wait before requesting another email." }, { status: 429 });
    case "daily_limit":
      return NextResponse.json({ error: "Daily resend limit reached." }, { status: 429 });
    default:
      return NextResponse.json({ error: "Unable to send verification email." }, { status: 500 });
  }
}
