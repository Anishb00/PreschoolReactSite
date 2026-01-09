"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

export type ChildRow = {
  id: number;
  name: string;
  sex: string;
  program: string;
  className: string;
  doctorName: string;
  doctorPhone: string;
  fee: string;
  dropDate: string;
  parent1Name: string;
  parent1Email: string;
  parent2Name: string;
  parent2Email: string;
};

type TableState = {
  children: ChildRow[];
  lastDeletedId?: number;
  message?: string;
};

type ChildrenTableProps = {
  initialChildren: ChildRow[];
  deleteChild: (prevState: TableState, formData: FormData) => Promise<TableState>;
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
}: ChildrenTableProps) {
  const [state, formAction] = React.useActionState(deleteChild, {
    children: initialChildren,
  });
  const [modalChildId, setModalChildId] = useState<number | null>(null);

  const modalChild = useMemo(() => {
    if (modalChildId == null) {
      return null;
    }
    return state.children.find((child) => child.id === modalChildId) ?? null;
  }, [modalChildId, state.children]);

  useEffect(() => {
    if (state.lastDeletedId != null) {
      setModalChildId(null);
    }
  }, [state.lastDeletedId]);

  return (
    <div className="space-y-4">
      {state.message && (
        <div className="rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm">
          {state.message}
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-[1200px] w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="sticky left-0 z-10 bg-gray-100 p-3 text-left">
                Actions
              </th>
              <th className="p-3 text-left">Child Name</th>
              <th className="p-3 text-left">Sex</th>
              <th className="p-3 text-left">Program</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Doctor Name</th>
              <th className="p-3 text-left">Doctor Phone</th>
              <th className="p-3 text-left">Fee</th>
              <th className="p-3 text-left">Drop Date</th>
              <th className="p-3 text-left">Parent 1</th>
              <th className="p-3 text-left">Parent 1 Email</th>
              <th className="p-3 text-left">Parent 2</th>
              <th className="p-3 text-left">Parent 2 Email</th>
            </tr>
          </thead>
          <tbody>
            {state.children.length === 0 ? (
              <tr>
                <td
                  colSpan={13}
                  className="p-6 text-center text-gray-500"
                >
                  No children found.
                </td>
              </tr>
            ) : (
              state.children.map((child) => (
                <tr key={child.id} className="border-t border-gray-200">
                  <td className="sticky left-0 z-10 bg-white p-3">
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/admin/EditChild?childId=${child.id}`}
                        className="rounded-md border border-blue-600 px-3 py-2 text-center text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        Email
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalChildId(child.id)}
                        className="rounded-md border border-red-600 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                  <td className="p-3 text-gray-900">{child.name}</td>
                  <td className="p-3 text-gray-700">{child.sex}</td>
                  <td className="p-3 text-gray-700">{child.program}</td>
                  <td className="p-3 text-gray-700">{child.className}</td>
                  <td className="p-3 text-gray-700">{child.doctorName}</td>
                  <td className="p-3 text-gray-700">{child.doctorPhone}</td>
                  <td className="p-3 text-gray-700">{child.fee}</td>
                  <td className="p-3 text-gray-700">{child.dropDate}</td>
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

      {modalChild && (
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
  );
}
