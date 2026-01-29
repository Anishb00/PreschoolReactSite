"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useRouter, usePathname } from "next/navigation";

const IconEdit = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
  </svg>
);

const IconMail = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconReceipt = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 21V5a2 2 0 0 1 2-2h9l5 5v13l-3-2-3 2-3-2-3 2-3-2-3 2Z" />
    <path d="M14 3v4a2 2 0 0 0 2 2h4" />
    <path d="M8 13h6" />
    <path d="M8 17h2" />
  </svg>
);

const IconTrash = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

export type ChildRow = {
  id: number;
  name: string;
  sex: string;
  program: string;
  className: string;
  dob?: string;
  enrollDate: string;
  checkoutTime?: string;
  fee: string;
  dropDate: string;
  doctorName?: string;
  doctorPhone?: string;
  parent1Name: string;
  parent1Email: string;
  parent1Verified?: boolean;
  parent1Phone?: string;
  parent1Address?: string;
  parent2Name: string;
  parent2Email: string;
  parent2Verified?: boolean;
  parent2Phone?: string;
  parent2Address?: string;
};

type TableState = {
  children: ChildRow[];
  lastDeletedId?: number;
  message?: string;
};

type ChildrenTableProps = {
  initialChildren: ChildRow[];
  deleteChild: (prevState: TableState, formData: FormData) => Promise<TableState>;
  isAdmin: boolean;
  fullView?: boolean;
  showPrintControls?: boolean;
  initialClassFilter?: string;
  showCheckoutTime?: boolean;
  showRecordCount?: boolean;
};

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
    >
      {pending ? "Deleting..." : "Confirm Delete"}
    </button>
  );
}

export default function ChildrenTable({
  initialChildren,
  deleteChild,
  isAdmin,
  fullView = false,
  showPrintControls = true,
  initialClassFilter = "enrolled",
  showCheckoutTime = true,
  showRecordCount = false,
}: ChildrenTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const actionColWidth = fullView ? "w-36" : "w-40";
  const actionColMinWidth = fullView ? "9rem" : "10rem";
  const [state, formAction] = React.useActionState(deleteChild, {
    children: initialChildren,
  });
  const [modalChildId, setModalChildId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState(
    initialClassFilter || (isAdmin ? "enrolled" : "enrolled")
  );
  const [disabledIds, setDisabledIds] = useState<Set<number>>(new Set());
  const [classOverrides, setClassOverrides] = useState<Record<number, string>>({});
  const [isGeneratingSheet, setIsGeneratingSheet] = useState(false);
  const [isGeneratingRoster, setIsGeneratingRoster] = useState(false);
  const [isGeneratingTeacherSheet, setIsGeneratingTeacherSheet] = useState(false);
  const [printError, setPrintError] = useState<string | null>(null);
  const [emailChild, setEmailChild] = useState<ChildRow | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailAttachments, setEmailAttachments] = useState<FileList | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [emailNotice, setEmailNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [sortKey, setSortKey] = useState<"name" | "enrollDate">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const computeAge = (dob?: string) => {
    if (!dob) return "";
    const parts = dob.split("-").map((value) => Number(value));
    if (parts.length < 3 || parts.some((value) => Number.isNaN(value))) return "";
    const [year, month, day] = parts;
    if (!year || !month || !day) return "";
    const today = new Date();
    let age = today.getFullYear() - year;
    const monthDiff = today.getMonth() + 1 - month;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
      age -= 1;
    }
    return age >= 0 ? String(age) : "";
  };

  const modalChild = useMemo(() => {
    if (modalChildId == null) {
      return null;
    }
    return state.children.find((child) => child.id === modalChildId) ?? null;
  }, [modalChildId, state.children]);

  const filteredChildren = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const coreClasses = new Set([
      "Caterpillar",
      "Chrysalis",
      "Butterfly",
      "Sunshine",
      "Rainbow",
    ]);

    const filtered = state.children
      .filter((child) => {
        if (classFilter === "unassigned") {
          return !child.className;
        }
        if (classFilter === "enrolled") {
          return child.className ? coreClasses.has(child.className) : false;
        }
        if (classFilter === "all") return true;
        if (classFilter === "Dismissed") return child.className === "Dismissed";
        return child.className === classFilter;
      })
      .filter((child) => {
      const haystackValues = isAdmin
        ? [
            child.id,
            child.name,
            child.sex,
            child.program,
            child.className,
            child.enrollDate,
            showCheckoutTime ? child.checkoutTime ?? "" : "",
            child.fee,
            child.dropDate,
            fullView ? child.dob : "",
            fullView ? child.doctorName : "",
            fullView ? child.doctorPhone : "",
            child.parent1Name,
            child.parent1Email,
            fullView ? child.parent1Phone : "",
            fullView ? child.parent1Address : "",
            child.parent2Name,
            child.parent2Email,
            fullView ? child.parent2Phone : "",
            fullView ? child.parent2Address : "",
          ]
        : [child.name];

      const haystack = haystackValues
        .map((value) => String(value ?? "").toLowerCase())
        .join(" ");
      return haystack.includes(query);
    });
    const compareNames = (a: ChildRow, b: ChildRow) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" });

    if (sortKey === "enrollDate") {
      return [...filtered].sort((a, b) => {
        const aVal = a.enrollDate ?? "";
        const bVal = b.enrollDate ?? "";
        const aHas = aVal !== "";
        const bHas = bVal !== "";
        if (!aHas && !bHas) return compareNames(a, b);
        if (!aHas) return 1;
        if (!bHas) return -1;
        const dateCompare = aVal.localeCompare(bVal);
        const adjusted = sortDir === "asc" ? dateCompare : -dateCompare;
        return adjusted === 0 ? compareNames(a, b) : adjusted;
      });
    }

    return [...filtered].sort((a, b) => {
      const nameCompare = compareNames(a, b);
      return sortDir === "asc" ? nameCompare : -nameCompare;
    });
  }, [isAdmin, searchTerm, state.children, fullView, classFilter, sortKey, sortDir]);

  const handleNameSort = () => {
    setSortDir((prev) => (sortKey === "name" ? (prev === "asc" ? "desc" : "asc") : "asc"));
    setSortKey("name");
  };

  const handleEnrollSort = () => {
    setSortKey("enrollDate");
    setSortDir((prev) =>
      sortKey === "enrollDate" ? (prev === "asc" ? "desc" : "asc") : "asc"
    );
  };

  const updateClass = async (childId: number, className: string) => {
    try {
      await fetch("/api/set-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, className }),
      });
      setClassOverrides((prev) => ({ ...prev, [childId]: className }));
      setDisabledIds((prev) => new Set(prev).add(childId));
    } catch (err) {
      console.error("Failed to update class", err);
    }
  };

  useEffect(() => {
    if (state.lastDeletedId != null) {
      setModalChildId(null);
    }
  }, [state.lastDeletedId]);

  const openPdf = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, "_blank");
    if (newWindow) {
      newWindow.document.title = filename;
      const cleanup = () => URL.revokeObjectURL(url);
      newWindow.addEventListener("beforeunload", cleanup, { once: true });
      try {
        newWindow.focus();
      } catch {
        // ignore focus failures
      }
    } else {
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }
  };

  const childrenForSelectedClass = (context: string) => {
    if (classFilter === "all") {
      setPrintError(`Select a class before printing the ${context}.`);
      return null;
    }

    const childrenForClass = state.children.filter(
      (child) => child.className === classFilter
    );
    if (childrenForClass.length === 0) {
      setPrintError(`No children found for class "${classFilter}".`);
      return null;
    }

    return childrenForClass;
  };

  const generateSigninSheet = async () => {
    setPrintError(null);
    const childrenForClass = childrenForSelectedClass("sign-in sheet");
    if (!childrenForClass) {
      return;
    }

    const namesWithCheckout = childrenForClass.map((child) => {
      const match = (child.checkoutTime ?? "").replace(/\s+/g, "").match(/^(\d{1,2}:\d{2})/);
      const hhmm = match ? match[1] : "";
      if (!hhmm) return child.name;
      return `${child.name} checkout:(${hhmm})`;
    });

    setIsGeneratingSheet(true);
    try {
      const response = await fetch("/api/signin-sheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          className: classFilter,
          childNames: namesWithCheckout,
        }),
      });

      if (!response.ok) {
        let message = "Unable to generate the sign-in sheet.";
        try {
          const data = (await response.json()) as { error?: string };
          if (data?.error) {
            message = data.error;
          }
        } catch {
          // ignore JSON parsing failures
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const safeClassName = classFilter.replace(/[^a-z0-9-_]+/gi, "_") || "class";
      openPdf(blob, `signin_sheet_${safeClassName}.pdf`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to generate the sign-in sheet.";
      setPrintError(message);
    } finally {
      setIsGeneratingSheet(false);
    }
  };

  const generateEmergencyRoster = async () => {
    setPrintError(null);
    if (!childrenForSelectedClass("emergency roster")) {
      return;
    }

    setIsGeneratingRoster(true);
    try {
      const response = await fetch("/api/emergency-roster", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          className: classFilter,
        }),
      });

      if (!response.ok) {
        let message = "Unable to generate the emergency roster.";
        try {
          const data = (await response.json()) as { error?: string };
          if (data?.error) {
            message = data.error;
          }
        } catch {
          // ignore JSON parsing failures
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const safeClassName = classFilter.replace(/[^a-z0-9-_]+/gi, "_") || "class";
      openPdf(blob, `emergency_roster_${safeClassName}.pdf`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to generate the emergency roster.";
      setPrintError(message);
    } finally {
      setIsGeneratingRoster(false);
    }
  };

  const generateTeacherSigninSheet = async () => {
    setPrintError(null);
    const childrenForClass = childrenForSelectedClass("teacher sign-in sheet");
    if (!childrenForClass) {
      return;
    }

    const namesWithCheckout = childrenForClass.map((child) => {
      const trimmed = (child.checkoutTime ?? "").trim();
      if (!trimmed) return child.name;
      const hhmm = trimmed.length >= 5 ? trimmed.slice(0, 5) : trimmed;
      return `${child.name} (${hhmm})`;
    });

    setIsGeneratingTeacherSheet(true);
    try {
      const response = await fetch("/api/teacher-signin-sheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          className: classFilter,
          childNames: namesWithCheckout,
        }),
      });

      if (!response.ok) {
        let message = "Unable to generate the teacher sign-in sheet.";
        try {
          const data = (await response.json()) as { error?: string };
          if (data?.error) {
            message = data.error;
          }
        } catch {
          // ignore JSON parsing failures
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const safeClassName = classFilter.replace(/[^a-z0-9-_]+/gi, "_") || "class";
      openPdf(blob, `teacher_signin_sheet_${safeClassName}.pdf`);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to generate the teacher sign-in sheet.";
      setPrintError(message);
    } finally {
      setIsGeneratingTeacherSheet(false);
    }
  };

  return (
    <>
    <div className="space-y-4">
      {state.message && (
        <div className="rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm">
          {state.message}
        </div>
      )}
      {emailNotice && (
        <div
          className={`rounded-md border px-4 py-3 text-sm shadow-sm ${
            emailNotice.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {emailNotice.message}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        {isAdmin && (
          <input
            type="search"
            name="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search children, parents, phone, email..."
            className="w-full max-w-md rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B1FA8]"
          />
        )}
        {isAdmin && (
          <select
            name="classFilter"
            value={classFilter}
            onChange={(event) => {
              const value = event.target.value;
              setClassFilter(value);
              setPrintError(null);
              const params = new URLSearchParams();
              if (value !== "enrolled") params.set("class", value);
              router.replace(`${pathname}?${params.toString()}`);
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B1FA8]"
          >
            <option value="enrolled">Enrolled Students</option>
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
            <option value="Dismissed">Dismissed</option>
          </select>
        )}
        {!isAdmin && (
          <select
            name="classFilter"
            value={classFilter}
            onChange={(event) => {
              setClassFilter(event.target.value);
              setPrintError(null);
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B1FA8]"
          >
            <option value="enrolled">Enrolled Students</option>
            <option value="Caterpillar">Caterpillar</option>
            <option value="Chrysalis">Chrysalis</option>
            <option value="Butterfly">Butterfly</option>
            <option value="Sunshine">Sunshine</option>
            <option value="Rainbow">Rainbow</option>
            <option value="Dismissed">Dismissed</option>
          </select>
        )}
        {showRecordCount && (
          <span className="text-sm font-semibold text-gray-700">
            Showing {filteredChildren.length}{" "}
            {filteredChildren.length === 1 ? "record" : "records"}
          </span>
        )}
        {showPrintControls && (
          <>
            <button
              type="button"
              onClick={generateSigninSheet}
              disabled={
                isGeneratingSheet ||
                isGeneratingRoster ||
                isGeneratingTeacherSheet ||
                classFilter === "all"
              }
              className="rounded-md bg-[#3B1FA8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d1882] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGeneratingSheet ? "Building..." : "Print sign-in sheet"}
            </button>
            <button
              type="button"
              onClick={generateEmergencyRoster}
              disabled={
                isGeneratingRoster ||
                isGeneratingSheet ||
                isGeneratingTeacherSheet ||
                classFilter === "all"
              }
              className="rounded-md bg-[#3B1FA8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d1882] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGeneratingRoster ? "Building..." : "Print emergency roster"}
            </button>
            <button
              type="button"
              onClick={generateTeacherSigninSheet}
              disabled={
                isGeneratingTeacherSheet ||
                isGeneratingSheet ||
                isGeneratingRoster ||
                classFilter === "all"
              }
              className="rounded-md bg-[#3B1FA8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d1882] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGeneratingTeacherSheet ? "Building..." : "Print teacher sign-in sheet"}
            </button>
          </>
        )}
        {isAdmin && searchTerm.trim() && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="text-sm font-semibold text-gray-600 hover:text-gray-800"
          >
            Clear
          </button>
        )}
      </div>
      {showPrintControls && printError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {printError}
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
        {isAdmin ? (
          <table className={`${fullView ? "min-w-[1850px]" : "min-w-[1200px]"} w-full text-sm`}>
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                 <th
                   className={`sticky left-0 z-10 bg-gray-100 p-3 text-left ${actionColWidth}`}
                   style={{ minWidth: actionColMinWidth }}
                 >
                  Actions
                </th>
                <th
                  className="p-3 text-left"
                  aria-sort={
                    sortKey === "name"
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <button
                    type="button"
                    onClick={handleNameSort}
                    className="inline-flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900"
                  >
                    <span>Child Name</span>
                    {sortKey === "name" && (
                      <span aria-hidden="true">{sortDir === "asc" ? "▲" : "▼"}</span>
                    )}
                  </button>
                </th>
                <th className="p-3 text-left">Age</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Sex</th>
                {fullView && <th className="p-3 text-left">DOB</th>}
                <th className="p-3 text-left">Program</th>
                <th className="p-3 text-left min-w-[140px]">Class</th>
                {fullView && <th className="p-3 text-left">Doctor Name</th>}
                {fullView && <th className="p-3 text-left">Doctor Phone</th>}
                <th
                  className="p-3 text-left"
                  aria-sort={
                    sortKey === "enrollDate"
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <button
                    type="button"
                    onClick={handleEnrollSort}
                    className="inline-flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900"
                  >
                    <span>Enroll Date</span>
                    {sortKey === "enrollDate" && (
                      <span aria-hidden="true">{sortDir === "asc" ? "▲" : "▼"}</span>
                    )}
                  </button>
                </th>
                {showCheckoutTime && <th className="p-3 text-left">Checkout Time</th>}
                <th className="p-3 text-left">Fee</th>
                <th className="p-3 text-left">Parent 1</th>
                {fullView && <th className="p-3 text-left">Parent 1 Phone</th>}
                {fullView && <th className="p-3 text-left">Parent 1 Address</th>}
                <th className="p-3 text-left">Parent 1 Email</th>
                <th className="p-3 text-left">Parent 2</th>
                {fullView && <th className="p-3 text-left">Parent 2 Phone</th>}
                {fullView && <th className="p-3 text-left">Parent 2 Address</th>}
                <th className="p-3 text-left">Parent 2 Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredChildren.length === 0 ? (
                <tr>
                  <td
                    colSpan={fullView ? (showCheckoutTime ? 21 : 20) : (showCheckoutTime ? 14 : 13)}
                    className="p-6 text-center text-gray-500"
                  >
                    No children found.
                  </td>
                </tr>
              ) : (
                filteredChildren.map((child) => {
                  const isDisabled = disabledIds.has(child.id);
                  return (
                    <tr
                      key={child.id}
                      className={`border-t border-gray-200 transition ${
                        isDisabled ? "bg-gray-300 opacity-80" : ""
                      }`}
                    >
                      <td
                        className={`sticky left-0 z-10 bg-white p-3 ${actionColWidth} ${
                          isDisabled ? "opacity-60 pointer-events-none" : ""
                        }`}
                        style={{ minWidth: actionColMinWidth }}
                      >
                        <div className="grid grid-cols-2 gap-1 sm:gap-2 items-stretch">
                          <Link
                            href={`/admin/EditChild?childId=${child.id}&class=${encodeURIComponent(classFilter)}`}
                            className="action-button w-full rounded-md border border-blue-600 px-3 py-2 text-center text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                            aria-label="Edit"
                          >
                            <span className="action-icon">
                              <IconEdit />
                            </span>
                            <span className="action-label">Edit</span>
                          </Link>
                          <button
                            type="button"
                            className="action-button w-full rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                            aria-label="Email"
                            onClick={() => {
                              setEmailChild(child);
                              setEmailSubject("");
                              setEmailMessage("");
                              setEmailAttachments(null);
                            }}
                            disabled={isDisabled}
                          >
                            <span className="action-icon">
                              <IconMail />
                            </span>
                            <span className="action-label">Email</span>
                          </button>
                          <Link
                            href={`/admin/Receipt/${child.id}`}
                            className="action-button w-full rounded-md border border-green-600 px-3 py-2 text-center text-xs font-semibold text-green-700 transition hover:bg-green-50"
                            aria-label="Receipt"
                          >
                            <span className="action-icon">
                              <IconReceipt />
                            </span>
                            <span className="action-label">Receipt</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => setModalChildId(child.id)}
                            className="action-button w-full rounded-md border border-red-600 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                            aria-label="Delete"
                            disabled={isDisabled}
                          >
                            <span className="action-icon">
                              <IconTrash />
                            </span>
                            <span className="action-label">Delete</span>
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-gray-900">{child.name}</td>
                      <td className="p-3 text-gray-700">{computeAge(child.dob) || "N/A"}</td>
                      <td className="p-3 text-gray-700">
                        {(() => {
                          const missing: string[] = [];
                          if (child.parent1Verified === false) {
                            missing.push("Parent 1 email is not verified");
                          }
                          if (child.parent2Email && child.parent2Verified === false) {
                            missing.push("Parent 2 email is not verified");
                          }
                          const hasIssue = missing.length > 0;
                          const title =
                            missing.join(" & ") || "All parent emails are verified";
                          return (
                            <span
                              className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                                hasIssue
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                              title={title}
                              aria-label={title}
                            >
                              {hasIssue ? "!" : "✓"}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="p-3 text-gray-700">{child.sex}</td>
                      {fullView && <td className="p-3 text-gray-700">{child.dob ?? ""}</td>}
                      <td className="p-3 text-gray-700">{child.program}</td>
                      <td className="p-3 text-gray-700 min-w-[140px]">
                        {isAdmin ? (
                          <select
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm disabled:opacity-60"
                            value={classOverrides[child.id] ?? child.className ?? ""}
                            disabled={isDisabled}
                            onChange={(e) => updateClass(child.id, e.target.value)}
                          >
                            <option value="">Unassigned</option>
                            <option value="Caterpillar">Caterpillar</option>
                            <option value="Chrysalis">Chrysalis</option>
                            <option value="Butterfly">Butterfly</option>
                            <option value="Sunshine">Sunshine</option>
                            <option value="Rainbow">Rainbow</option>
                            <option value="Pre-Register">Pre-Register</option>
                            <option value="Registered">Registered</option>
                            <option value="Waitlist">Waitlist</option>
                            <option value="Dismissed">Dismissed</option>
                            <option value="Test">Test</option>
                          </select>
                        ) : (
                          classOverrides[child.id] ?? child.className
                        )}
                      </td>
                      {fullView && <td className="p-3 text-gray-700">{child.doctorName ?? ""}</td>}
                      {fullView && <td className="p-3 text-gray-700">{child.doctorPhone ?? ""}</td>}
                  <td className="p-3 text-gray-700">{child.enrollDate}</td>
                  {showCheckoutTime && (
                    <td className="p-3 text-gray-700">{child.checkoutTime ?? ""}</td>
                  )}
                      <td className="p-3 text-gray-700">{child.fee}</td>
                      <td className="p-3 text-gray-700">{child.parent1Name}</td>
                      {fullView && <td className="p-3 text-gray-700">{child.parent1Phone ?? ""}</td>}
                      {fullView && <td className="p-3 text-gray-700">{child.parent1Address ?? ""}</td>}
                      <td
                        className={`p-3 text-gray-700 ${
                          child.parent1Verified === false ? "bg-amber-50 text-amber-800" : ""
                        }`}
                        title={
                          child.parent1Verified === false
                            ? "Parent 1 email is not verified"
                            : undefined
                        }
                      >
                        {child.parent1Email}
                      </td>
                      <td className="p-3 text-gray-700">{child.parent2Name}</td>
                      {fullView && <td className="p-3 text-gray-700">{child.parent2Phone ?? ""}</td>}
                      {fullView && <td className="p-3 text-gray-700">{child.parent2Address ?? ""}</td>}
                      <td
                        className={`p-3 text-gray-700 ${
                          child.parent2Email && child.parent2Verified === false
                            ? "bg-amber-50 text-amber-800"
                            : ""
                        }`}
                        title={
                          child.parent2Email && child.parent2Verified === false
                            ? "Parent 2 email is not verified"
                            : undefined
                        }
                      >
                        {child.parent2Email}
                      </td>
                    </tr>
                  );
                })
              )}
          </tbody>
          </table>
        ) : (
          <table className="min-w-full w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th
                  className="p-3 text-left"
                  aria-sort={
                    sortKey === "name"
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <button
                    type="button"
                    onClick={handleNameSort}
                    className="inline-flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900"
                  >
                    <span>Child Name</span>
                    {sortKey === "name" && (
                      <span aria-hidden="true">{sortDir === "asc" ? "▲" : "▼"}</span>
                    )}
                  </button>
                </th>
                <th className="p-3 text-left">Age</th>
              </tr>
            </thead>
            <tbody>
              {filteredChildren.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-6 text-center text-gray-500">
                    No children found.
                  </td>
                </tr>
              ) : (
                filteredChildren.map((child) => (
                  <tr key={child.id} className="border-t border-gray-200">
                    <td className="p-3 text-gray-900">{child.name}</td>
                    <td className="p-3 text-gray-700">{computeAge(child.dob) || "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isAdmin && emailChild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Email Receipts
                </h3>
                <p className="text-sm text-gray-600">
                  To: {emailChild.parent1Name} ({emailChild.parent1Email})
                  {emailChild.parent2Email
                    ? `, ${emailChild.parent2Email}`
                    : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEmailChild(null)}
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
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B1FA8]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B1FA8]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Attachments
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setEmailAttachments(e.target.files)}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-[#3B1FA8] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#2d1882]"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEmailChild(null)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!emailChild) return;
                  const recipients = [emailChild.parent1Email, emailChild.parent2Email].filter(
                    (v): v is string => Boolean(v)
                  );
                  if (recipients.length === 0) {
                    setEmailNotice({
                      type: "error",
                      message: "No parent email addresses available for this child.",
                    });
                    return;
                  }

                  setEmailSending(true);
                  setEmailNotice(null);
                  try {
                    const response = await fetch("/api/send-email", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        recipients,
                        subject: emailSubject,
                        message: emailMessage,
                      }),
                    });

                    const data = (await response.json()) as {
                      success?: boolean;
                      sent?: string[];
                      failed?: { email: string; error: string }[];
                      error?: string;
                    };

                    if (!response.ok || data?.success === false) {
                      const failedList =
                        data?.failed?.map((f) => `${f.email} (${f.error})`).join(", ") || "";
                      throw new Error(data?.error || failedList || "Failed to send email.");
                    }

                    const sentList = data?.sent ?? [];
                    if (sentList.length > 0) {
                      setEmailNotice({
                        type: "success",
                        message: `Email sent to: ${sentList.join(", ")}`,
                      });
                    } else {
                      setEmailNotice({
                        type: "error",
                        message: "Parents did not receive email.",
                      });
                    }
                  } catch (err) {
                    const msg = err instanceof Error ? err.message : "Parents did not receive email.";
                    setEmailNotice({ type: "error", message: msg });
                  } finally {
                    setEmailSending(false);
                    setEmailChild(null);
                    setEmailAttachments(null);
                  }
                }}
                className="rounded-md bg-[#3B1FA8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d1882]"
                disabled={emailSending}
              >
                {emailSending ? "Sending..." : "Send Email"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdmin && modalChild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Confirm Deletion
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Delete <span className="font-semibold">{modalChild.name}</span>?
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Parents: {modalChild.parent1Name}
              {modalChild.parent2Name
                ? `, ${modalChild.parent2Name}`
                : ""}
            </p>
            <form action={formAction} className="mt-6 flex gap-3">
              <input type="hidden" name="childId" value={modalChild.id} />
              <DeleteButton />
              <button
                type="button"
                onClick={() => setModalChildId(null)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
    <style jsx>{`
      .action-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.35rem;
      }
      .action-icon,
      .action-label {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      @media (max-width: 1880px) {
        .action-label {
          display: none;
        }
      }
      @media (min-width: 1881px) {
        .action-label {
          display: inline-flex;
        }
      }
    `}</style>
    </>
  );
}
