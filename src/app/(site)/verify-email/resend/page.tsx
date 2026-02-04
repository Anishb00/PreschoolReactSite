"use client";

import { useState } from "react";
import Banner from "../../components/Banner";

type Status =
  | { state: "idle" }
  | { state: "pending" }
  | { state: "success" }
  | { state: "error"; message: string };

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus({ state: "pending" });
    try {
      const res = await fetch("/api/verify-email/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Unable to send verification email.");
      }
      setStatus({ state: "success" });
    } catch (err: any) {
      setStatus({ state: "error", message: err.message || "Unable to send verification email." });
    }
  };

  return (
    <>
      <Banner
        imagename="/siteimages/HeroBG.webp"
        title="Resend Verification Email"
        subtitle="Request a new link to verify your email."
      />
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col gap-6 px-6 py-12">
        <h1 className="text-3xl font-bold text-[#3B1FA8]">Resend Verification Email</h1>
        <p className="text-gray-700">
          Enter the parent email to request a new verification link. Cooldowns and daily limits apply.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow">
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700" htmlFor="email">
              Parent Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B1FA8]"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={status.state === "pending"}
              className="rounded-md bg-[#3B1FA8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d1882] disabled:opacity-60"
            >
              {status.state === "pending" ? "Sending..." : "Send Verification Email"}
            </button>
            {status.state === "success" && <span className="text-sm text-green-700">Email sent.</span>}
            {status.state === "error" && (
              <span className="text-sm text-red-600" role="alert">
                {status.message}
              </span>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
