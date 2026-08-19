import { NextRequest, NextResponse } from "next/server";
import { sendSesEmail } from "@/lib/email/sendSesEmail";

// All contact form submissions are delivered here.
const CONTACT_RECIPIENT = "steppingstoneworld@gmail.com";

type ContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  subject?: string;
  message?: string;
  // Honeypot: real users leave this empty.
  company?: string;
};

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(req: NextRequest) {
  const sesConfigured = Boolean(process.env.SES_SOURCE_EMAIL);
  if (!sesConfigured) {
    return NextResponse.json(
      { error: "Email service is not configured on this server." },
      { status: 500 }
    );
  }

  let body: ContactBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Silently accept spam bots that fill the hidden honeypot field.
  if ((body.company ?? "").trim().length > 0) {
    return NextResponse.json({ success: true });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const department = (body.department ?? "").trim();
  const subject = (body.subject ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !department || !subject || !message) {
    return NextResponse.json(
      { error: "Please fill out all required fields." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const emailSubject = `[Website Contact] ${department}: ${subject}`;

  const textBody = [
    `New contact form submission from the Stepping Stone World website.`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "(not provided)"}`,
    `Department: ${department}`,
    `Subject: ${subject}`,
    ``,
    `Message:`,
    message,
  ].join("\n");

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
      <h2 style="color: #3a249c; margin-bottom: 4px;">New Website Contact Submission</h2>
      <p style="margin-top: 0; color: #6b7280;">Sent from the Stepping Stone World Preschool contact form.</p>
      <table style="border-collapse: collapse; margin-top: 16px;">
        <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Name</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Email</td><td>${escapeHtml(email)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Phone</td><td>${escapeHtml(phone || "(not provided)")}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Department</td><td>${escapeHtml(department)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Subject</td><td>${escapeHtml(subject)}</td></tr>
      </table>
      <h3 style="color: #3a249c; margin-bottom: 4px;">Message</h3>
      <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
    </div>
  `;

  try {
    // Send to the school; set the submitter as reply-to so staff can reply directly.
    await sendSesEmail(
      [CONTACT_RECIPIENT],
      emailSubject,
      textBody,
      htmlBody,
      undefined,
      email
    );
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Unknown error sending message.";
    console.error("Contact form send failed:", msg);
    return NextResponse.json(
      { error: "Sorry, we couldn't send your message. Please try again later." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
