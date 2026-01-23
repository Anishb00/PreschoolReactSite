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
  const verifyLink = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(toEmail)}`;
  const subject = `Verify your email for ${childName}'s registration`;
  const message = [
    `Hi,`,
    ``,
    `Please verify your email. Once verified, your child will be added to the waitlist.`,
    ``,
    `Verify Email (link valid for 24 hours):`,
    verifyLink,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <p>Hi,</p>
      <p>Please verify your email. Once verified, your child will be added to the waitlist.</p>
      <p style="margin: 16px 0;">
        <a href="${verifyLink}" style="
          display: inline-block;
          padding: 12px 20px;
          background-color: #3a249c;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
        ">
          Verify Email
        </a>
      </p>
      <p style="font-size: 14px; color: #4b5563;">This link is valid for 24 hours.</p>
    </div>
  `;

  await sendSesEmail([toEmail], subject, message, html);
}
