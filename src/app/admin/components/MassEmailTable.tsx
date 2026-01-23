"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type MassEmailChild = {
  id: number;
  childName: string;
  className: string;
  parent1Name: string;
  parent1Email: string;
  parent1Verified?: boolean;
  parent2Name: string;
  parent2Email: string;
  parent2Verified?: boolean;
};

type Props = {
  initialChildren: MassEmailChild[];
};

export default function MassEmailTable({ initialChildren }: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const filteredChildren = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const classAllowed = (childClass: string) => {
      if (classFilter === "all") return true;
      return childClass === classFilter;
    };

    if (!query) {
      return initialChildren.filter((child) => classAllowed(child.className));
    }

    return initialChildren.filter((child) => {
      if (!classAllowed(child.className)) return false;
      const haystack = [
        child.childName,
        child.className,
        child.parent1Name,
        child.parent1Email,
        child.parent2Name,
        child.parent2Email,
      ]
        .map((value) => String(value ?? "").toLowerCase())
        .join(" ");
      return haystack.includes(query);
    });
  }, [classFilter, initialChildren, searchTerm]);

  const toggleId = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allIds = filteredChildren.map((child) => child.id);
      const allSelected = allIds.every((id) => next.has(id));
      if (allSelected) {
        allIds.forEach((id) => next.delete(id));
      } else {
        allIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const allVisibleSelected =
    filteredChildren.length > 0 &&
    filteredChildren.every((child) => selectedIds.has(child.id));

  const openModal = () => {
    if (selectedIds.size === 0) {
      setError("Select at least one child before emailing.");
      return;
    }
    setError(null);
    setShowModal(true);
  };

  const sendEmail = async () => {
    const selected = initialChildren.filter((child) => selectedIds.has(child.id));
    const names = selected.map((child) => child.childName);
    const recipients = selected
      .flatMap((child) => [child.parent1Email, child.parent2Email])
      .filter((email) => !!email);

    if (recipients.length === 0) {
      setError("No parent emails found for the selected children.");
      return;
    }
    if (!subject.trim() || !message.trim()) {
      setError("Subject and message are required.");
      return;
    }

    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/mass-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: recipients, subject, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send email.");
      }
      const query = encodeURIComponent(JSON.stringify(names));
      router.push(`/admin/MassEmail/success?names=${query}`);
    } catch (err: any) {
      setError(err.message || "Failed to send email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          name="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search children or parents..."
          className="w-full max-w-md rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B1FA8]"
        />
        <select
          name="classFilter"
          value={classFilter}
          onChange={(event) => setClassFilter(event.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B1FA8]"
        >
          <option value="all">All Students</option>
          <option value="Caterpillar">Caterpillar</option>
          <option value="Chrysalis">Chrysalis</option>
          <option value="Butterfly">Butterfly</option>
          <option value="Sunshine">Sunshine</option>
          <option value="Rainbow">Rainbow</option>
          <option value="Pre-Register">Pre-Register</option>
          <option value="Registered">Registered</option>
          <option value="Waitlist">Waitlist</option>
          <option value="Test">Test</option>
        </select>
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-[#3B1FA8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d1882]"
        >
          Email
        </button>
        {searchTerm.trim() && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="text-sm font-semibold text-gray-600 hover:text-gray-800"
          >
            Clear
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-[950px] w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleAll}
                  aria-label="Select all visible children"
                />
              </th>
              <th className="p-3 text-left">Child</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Parent 1</th>
              <th className="p-3 text-left">Parent 1 Email</th>
              <th className="p-3 text-left">Parent 2</th>
              <th className="p-3 text-left">Parent 2 Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredChildren.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No children found.
                </td>
              </tr>
            ) : (
              filteredChildren.map((child) => (
                <tr key={child.id} className="border-t border-gray-200">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(child.id)}
                      onChange={() => toggleId(child.id)}
                      aria-label={`Select ${child.childName}`}
                    />
                  </td>
                  <td className="p-3 text-gray-900">{child.childName}</td>
                  <td className="p-3 text-gray-700">
                    {(() => {
                      const missing: string[] = [];
                      if (child.parent1Verified === false) missing.push("Parent 1 email is not verified");
                      if (child.parent2Verified === false) missing.push("Parent 2 email is not verified");
                      const hasIssue = missing.length > 0;
                      const title = missing.join(" & ") || "All parent emails are verified";
                      return (
                        <span
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                            hasIssue ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                          }`}
                          title={title}
                          aria-label={title}
                        >
                          {hasIssue ? "!" : "✓"}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="p-3 text-gray-700">{child.className}</td>
                  <td className="p-3 text-gray-700">{child.parent1Name}</td>
                  <td
                    className={`p-3 text-gray-700 ${
                      child.parent1Verified === false ? "bg-amber-50 text-amber-800" : ""
                    }`}
                    title={
                      child.parent1Verified === false ? "Parent 1 email is not verified" : undefined
                    }
                  >
                    {child.parent1Email}
                  </td>
                  <td className="p-3 text-gray-700">{child.parent2Name}</td>
                  <td
                    className={`p-3 text-gray-700 ${
                      child.parent2Verified === false ? "bg-amber-50 text-amber-800" : ""
                    }`}
                    title={
                      child.parent2Verified === false ? "Parent 2 email is not verified" : undefined
                    }
                  >
                    {child.parent2Email}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Email Selected Parents
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedIds.size} recipients selected
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close email dialog"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B1FA8]"
                  placeholder="Monthly receipts"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B1FA8]"
                  placeholder="Include any notes for families..."
                />
              </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Attachments
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => setAttachments(e.target.files)}
                className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-[#3B1FA8] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#2d1882]"
              />
              <p className="text-xs text-gray-500">Note: attachments are not sent via email yet.</p>
            </div>
          </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={sendEmail}
                disabled={sending}
                className="rounded-md bg-[#3B1FA8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d1882] disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send Email"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
