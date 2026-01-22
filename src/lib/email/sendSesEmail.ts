import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const sesRegion =
  process.env.SES_REGION || process.env.AWS_REGION || "us-west-1";
const sesSourceEmail = process.env.SES_SOURCE_EMAIL;

const sesClient = sesSourceEmail
  ? new SESv2Client({ region: sesRegion })
  : null;

export async function sendSesEmail(to: string[], subject: string, message: string) {
  if (!sesClient || !sesSourceEmail) {
    console.warn("SES email not configured: missing SES_SOURCE_EMAIL.");
    return;
  }

  const recipients = Array.from(new Set(to.filter(Boolean)));
  if (recipients.length === 0) {
    console.warn("SES email called with no recipients.");
    return;
  }

  const command = new SendEmailCommand({
    FromEmailAddress: sesSourceEmail,
    Destination: { ToAddresses: recipients },
    Content: {
      Simple: {
        Subject: { Data: subject || "(no subject)" },
        Body: {
          Text: { Data: message || "" },
          Html: { Data: `<p>${message || ""}</p>` },
        },
      },
    },
  });

  await sesClient.send(command);
}
