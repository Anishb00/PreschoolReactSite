import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import path from "path";
import fs from "fs/promises";

type ChildInfo = { name: string; dob: Date; pottyTrained: boolean };

const sesRegion = process.env.SES_REGION || process.env.AWS_REGION || "us-west-1";
const sesSourceEmail = process.env.SES_SOURCE_EMAIL;
const sesClient = sesSourceEmail ? new SESv2Client({ region: sesRegion }) : null;

const DOCUMENTS_DIR = path.join(process.cwd(), "documents");
const FORM_STANDARD = "SSW_Enrollment_Form.pdf";
const FORM_TOD = "SSW_Enrollment_Form_TOD.pdf";

function selectForm(dob: Date, pottyTrained: boolean) {
  const ageYears = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  const useTod = ageYears < 3 || !pottyTrained;
  return useTod ? FORM_TOD : FORM_STANDARD;
}

function buildRawEmail({
  to,
  subject,
  text,
  attachments,
}: {
  to: string;
  subject: string;
  text: string;
  attachments: { filename: string; content: Buffer }[];
}) {
  const boundary = "----=_Part_" + Math.random().toString(36).slice(2);
  const lines = [
    `From: ${sesSourceEmail}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit",
    "",
    text,
  ];

  for (const attachment of attachments) {
    lines.push(
      `--${boundary}`,
      `Content-Type: application/pdf; name="${attachment.filename}"`,
      "Content-Transfer-Encoding: base64",
      `Content-Disposition: attachment; filename="${attachment.filename}"`,
      "",
      attachment.content.toString("base64")
    );
  }

  lines.push(`--${boundary}--`, "");
  return Buffer.from(lines.join("\r\n"));
}

export async function sendEnrollmentForms({
  toEmail,
  children,
}: {
  toEmail: string;
  children: ChildInfo[];
}) {
  if (!sesClient || !sesSourceEmail) {
    console.warn("SES email not configured; skipping enrollment form send.");
    return;
  }
  if (!children.length) return;

  const attachments: { filename: string; content: Buffer }[] = [];
  for (const child of children) {
    try {
      const formFile = selectForm(child.dob, child.pottyTrained);
      const filePath = path.join(DOCUMENTS_DIR, formFile);
      const content = await fs.readFile(filePath);
      const safeName = child.name.replace(/[^A-Za-z0-9._-]/g, "_") || "child";
      attachments.push({
        filename: `${safeName}_registrationform.pdf`,
        content,
      });
    } catch (err) {
      console.error(`Failed to load form for ${child.name}:`, err);
    }
  }

  if (!attachments.length) return;

  const subject =
    attachments.length === 1
      ? `Enrollment form for ${children[0].name}`
      : "Enrollment forms for your child(ren)";
  const text =
    "Please find attached the enrollment form(s) for your child(ren). Reply if you have any questions.";

  const rawData = buildRawEmail({
    to: toEmail,
    subject,
    text,
    attachments,
  });

  const command = new SendEmailCommand({
    FromEmailAddress: sesSourceEmail,
    Destination: { ToAddresses: [toEmail] },
    Content: { Raw: { Data: rawData } },
  });

  await sesClient.send(command);
}
