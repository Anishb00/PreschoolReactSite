import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import type { RegistrationData } from "@/lib/types/Registertypes";

const sesRegion =
  process.env.SES_REGION || process.env.AWS_REGION || "us-west-2";
const sesSourceEmail = process.env.SES_SOURCE_EMAIL;
const sesDestinationEmail =
  process.env.SES_DESTINATION_EMAIL || process.env.SES_SOURCE_EMAIL;

const sesClient =
  sesSourceEmail && sesDestinationEmail
    ? new SESv2Client({ region: sesRegion })
    : null;

function buildEmailBody(data: RegistrationData) {
  const dob = data.dob instanceof Date ? data.dob.toISOString().split("T")[0] : data.dob;

  const textLines = [
    `New waitlist registration submitted.`,
    ``,
    `Child: ${data.childName}`,
    `DOB: ${dob}`,
    `Sex: ${data.sex || "n/a"}`,
    `Program: ${data.Program || "n/a"}`,
    ``,
    `Parent 1: ${data.parentOneName}`,
    `Parent 1 Email: ${data.parentOneEmail}`,
    `Parent 1 Phone: ${data.parentOnePhone}`,
    `Parent 1 Address: ${data.parentOneAddress}`,
    ``,
    `Parent 2: ${data.parentTwoName || "n/a"}`,
    `Parent 2 Email: ${data.parentTwoEmail || "n/a"}`,
    `Parent 2 Phone: ${data.parentTwoPhone || "n/a"}`,
    `Parent 2 Address: ${data.parentTwoAddress || "n/a"}`,
    ``,
    `Doctor: ${data.doctorName}`,
    `Doctor Phone: ${data.doctorPhone}`,
  ].join("\n");

  const html = `
    <h2>New waitlist registration submitted</h2>
    <p><strong>Child:</strong> ${data.childName}<br/>
    <strong>DOB:</strong> ${dob}<br/>
    <strong>Sex:</strong> ${data.sex || "n/a"}<br/>
    <strong>Program:</strong> ${data.Program || "n/a"}</p>
    <p><strong>Parent 1:</strong> ${data.parentOneName}<br/>
    <strong>Email:</strong> ${data.parentOneEmail}<br/>
    <strong>Phone:</strong> ${data.parentOnePhone}<br/>
    <strong>Address:</strong> ${data.parentOneAddress}</p>
    <p><strong>Parent 2:</strong> ${data.parentTwoName || "n/a"}<br/>
    <strong>Email:</strong> ${data.parentTwoEmail || "n/a"}<br/>
    <strong>Phone:</strong> ${data.parentTwoPhone || "n/a"}<br/>
    <strong>Address:</strong> ${data.parentTwoAddress || "n/a"}</p>
    <p><strong>Doctor:</strong> ${data.doctorName}<br/>
    <strong>Doctor Phone:</strong> ${data.doctorPhone}</p>
  `;

  return { text: textLines, html };
}

export async function sendRegistrationEmail(data: RegistrationData) {
  if (!sesClient || !sesSourceEmail || !sesDestinationEmail) {
    console.warn("SES email not configured: missing source or destination env vars.");
    return;
  }

  const { text, html } = buildEmailBody(data);
  const replyTo = data.parentOneEmail ? [data.parentOneEmail] : [];

  const command = new SendEmailCommand({
    FromEmailAddress: sesSourceEmail,
    Destination: { ToAddresses: [sesDestinationEmail] },
    ReplyToAddresses: replyTo,
    Content: {
      Simple: {
        Subject: { Data: `New Waitlist Registration: ${data.childName}` },
        Body: {
          Text: { Data: text },
          Html: { Data: html },
        },
      },
    },
  });

  try {
    await sesClient.send(command);
  } catch (err) {
    console.error("Failed to send SES email", err);
  }
}
