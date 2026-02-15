"use client";

import { useState } from "react";

type ReceiptPreviewClientProps = {
  childId: number;
  cacheBust: string;
  period?: string;
};

type ReceiptNotice = {
  type: "success" | "error";
  message?: string;
  sent?: string[];
  failed?: { email: string; error: string }[];
};

export default function ReceiptPreviewClient({
  childId,
  cacheBust,
  period,
}: ReceiptPreviewClientProps) {
  const [emailSending, setEmailSending] = useState(false);
  const [notice, setNotice] = useState<ReceiptNotice | null>(null);

  const sendReceiptEmail = async () => {
    setEmailSending(true);
    setNotice(null);

    try {
      const response = await fetch("/api/receipt-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, period }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        sent?: string[];
        failed?: { email: string; error: string }[];
      };

      if (!response.ok) {
        throw new Error(data?.error || "Unable to send receipt email.");
      }

      const sent = data?.sent ?? [];
      const failed = data?.failed ?? [];
      const hasFailures = failed.length > 0;

      setNotice({
        type: hasFailures ? "error" : "success",
        sent,
        failed,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to send receipt email.";
      setNotice({ type: "error", message });
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="flex min-h-screen w-[calc(100%+3rem)] -mx-6 flex-col gap-6 px-4 py-4 md:px-6 md:py-6">
      {notice && (
        <div
          className={`w-full rounded-md border px-4 py-3 text-sm shadow-sm ${
            notice.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {notice.message && <p className="font-semibold">{notice.message}</p>}
          {notice.sent && notice.sent.length > 0 && (
            <p className="font-semibold">
              Sent to: <span className="font-normal">{notice.sent.join(", ")}</span>
            </p>
          )}
          {notice.failed && notice.failed.length > 0 && (
            <div className="mt-1">
              <p className="font-semibold">Failed to send:</p>
              <ul className="list-disc pl-5">
                {notice.failed.map((entry) => (
                  <li key={entry.email}>
                    {entry.email} ({entry.error})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <header className="w-full">
        <h1 className="text-3xl font-semibold text-gray-800">Receipt Preview</h1>
        <p className="text-gray-600">Review the generated receipt below.</p>
      </header>

      <div className="h-[80vh] w-full overflow-hidden rounded border border-gray-200 shadow-sm md:h-[82vh] lg:h-[84vh]">
        <iframe
          title="Filled Receipt"
          src={`/api/receipt-file?ts=${cacheBust}`}
          className="h-full w-full"
        />
      </div>

      <div className="flex w-full justify-end gap-3">
        <button
          type="button"
          onClick={sendReceiptEmail}
          disabled={emailSending}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {emailSending ? "Sending..." : "Email"}
        </button>
      </div>
    </div>
  );
}
