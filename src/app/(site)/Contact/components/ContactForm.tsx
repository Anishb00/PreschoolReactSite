"use client";

import { useState } from "react";

const DEPARTMENTS = [
  "General Inquiry",
  "Enrollment",
  "Tuition & Billing",
  "Careers",
  "Tour Request",
  "Other",
];

const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.success) {
        setErrorMessage(
          json.error || "Something went wrong. Please try again later."
        );
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setErrorMessage(
        "Unable to send your message. Please check your connection and try again."
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 p-6 text-center">
        <h3 className="text-xl font-semibold text-green-800">
          Thanks for reaching out!
        </h3>
        <p className="mt-2 text-green-700">
          Your message has been sent. We&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 rounded-full bg-[#3a249c] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2e1c7d]"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot field for bots; hidden from users */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input type="text" name="name" required className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input type="email" name="email" required className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Phone Number
          </label>
          <input type="tel" name="phone" className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Department <span className="text-red-500">*</span>
          </label>
          <select name="department" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select department
            </option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Subject <span className="text-red-500">*</span>
        </label>
        <input type="text" name="subject" required className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea name="message" required rows={6} className={inputClass} />
      </div>

      {status === "error" && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center rounded-full bg-[#FFCC00] px-8 py-3 font-semibold uppercase text-gray-900 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
