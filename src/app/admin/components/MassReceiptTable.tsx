"use client";

import { useMemo, useState } from "react";

export type MassReceiptChild = {
  id: number;
  childName: string;
  className: string;
  parent1Name: string;
  parent1Email: string;
  parent2Name: string;
  parent2Email: string;
};

type Props = {
  initialChildren: MassReceiptChild[];
};

export default function MassReceiptTable({ initialChildren }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

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
          className="rounded-md bg-[#3B1FA8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d1882]"
          disabled
        >
          Send Receipts
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

      <div className="rounded-md border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Select children to prepare receipts. Generation will run when email delivery is implemented.
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-[900px] w-full text-sm">
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
                <td colSpan={7} className="p-6 text-center text-gray-500">
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
                  <td className="p-3 text-gray-700">{child.className}</td>
                  <td className="p-3 text-gray-700">{child.parent1Name}</td>
                  <td className="p-3 text-gray-700">{child.parent1Email}</td>
                  <td className="p-3 text-gray-700">{child.parent2Name}</td>
                  <td className="p-3 text-gray-700">{child.parent2Email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
