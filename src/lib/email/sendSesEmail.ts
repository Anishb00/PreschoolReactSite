import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const sesRegion =
  process.env.SES_REGION || process.env.AWS_REGION || "us-west-1";
const sesSourceEmail = process.env.SES_SOURCE_EMAIL;

const sesClient = sesSourceEmail
  ? new SESv2Client({ region: sesRegion })
  : null;

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type Attachment = {
  filename: string;
  content: string; // base64
  contentType?: string;
};

export async function sendSesEmail(
  to: string[],
  subject: string,
  message: string,
  htmlBody?: string,
  attachment?: Attachment
) {
  if (!sesClient || !sesSourceEmail) {
    console.warn("SES email not configured: missing SES_SOURCE_EMAIL.");
    return;
  }

  const recipients = Array.from(new Set(to.filter(Boolean)));
  if (recipients.length === 0) {
    console.warn("SES email called with no recipients.");
    return;
  }

  // If attachment provided, send one email per recipient with Raw content.
  if (attachment) {
    for (const recipient of recipients) {
      const boundary = `NextPart-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const safeFilename = attachment.filename || "attachment";
      const contentType = attachment.contentType || "application/octet-stream";
      const raw = [
        `From: ${sesSourceEmail}`,
        `To: ${recipient}`,
        `Subject: ${subject || "(no subject)"}`,
        "MIME-Version: 1.0",
        `Content-Type: multipart/mixed; boundary=\"${boundary}\"`,
        "",
        `--${boundary}`,
        "Content-Type: text/plain; charset=\"UTF-8\"",
        "Content-Transfer-Encoding: 7bit",
        "",
        message || "",
        `--${boundary}`,
        `Content-Type: ${contentType}; name=\"${safeFilename}\"`,
        `Content-Disposition: attachment; filename=\"${safeFilename}\"`,
        "Content-Transfer-Encoding: base64",
        "",
        attachment.content,
        `--${boundary}--`,
        "",
      ].join("\r\n");

      const command = new SendEmailCommand({
        FromEmailAddress: sesSourceEmail,
        Destination: { ToAddresses: [recipient] },
        Content: {
          Raw: {
            Data: new TextEncoder().encode(raw),
          },
        },
      });
      await sesClient.send(command);
    }
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
          Html: { Data: htmlBody ?? `<p>${escapeHtml(message || "")}</p>` },
        },
      },
    },
  });

  await sesClient.send(command);
}
