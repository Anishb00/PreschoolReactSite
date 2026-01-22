import { sendSesEmail } from "@/lib/email/sendSesEmail";

function getBaseUrl() {
  const url =
    process.env.APP_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.BETTER_AUTH_URL ||
    "";
  return url.replace(/\/+$/, "");
}

export async function sendVerificationEmail({
  toEmail,
  childName,
  token,
}: {
  toEmail: string;
  childName: string;
  token: string;
}) {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    console.warn("No APP_BASE_URL configured; skipping verification email send.");
    return;
  }
  const verifyLink = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;
  const subject = `Verify your email for ${childName}'s registration`;
  const message = [
    `Hi,`,
    ``,
    `Please verify your email to complete the registration for ${childName}.`,
    ``,
    `Click the link below (valid for 24 hours):`,
    verifyLink,
    ``,
    `If you didn’t request this, you can ignore this email.`,
  ].join("\n");

  await sendSesEmail([toEmail], subject, message);
}
