"use client";

import React from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

type EventPhotoEntry = {
  event: string;
  count: number;
};

type EventPhotoEditorState = {
  events: EventPhotoEntry[];
  message?: string;
};

type EventPhotosEditorProps = {
  initialEvents: EventPhotoEntry[];
  updateEventPhotos: (
    prevState: EventPhotoEditorState,
    formData: FormData
  ) => Promise<EventPhotoEditorState>;
};

function ActionButton({
  children,
  disabled,
  className,
  type = "submit",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  type?: "submit" | "button";
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type={type}
      disabled={disabled || pending}
      className={[
        "rounded-md px-3 py-2 text-sm font-semibold transition disabled:opacity-60",
        className ?? "",
      ].join(" ")}
    >
      {pending ? "Working..." : children}
    </button>
  );
}

export default function EventPhotosEditor({
  initialEvents,
  updateEventPhotos,
}: EventPhotosEditorProps) {
  const [state, formAction] = React.useActionState(updateEventPhotos, {
    events: initialEvents,
    message: "",
  });

  return (
    <div className="space-y-8">
      <section className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Create New Event
        </h3>
        <form action={formAction} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <input type="hidden" name="actionType" value="create-event" />
          <label className="flex-1 text-sm font-semibold text-gray-700">
            Event Name
            <input
              type="text"
              name="eventName"
              placeholder="Easter 2025"
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-normal"
              required
            />
          </label>
          <ActionButton className="bg-blue-600 text-white hover:bg-blue-700">
            Create Event
          </ActionButton>
        </form>
        {state.message && (
          <p className="mt-3 text-sm text-gray-600">{state.message}</p>
        )}
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Event Albums</h3>
        {state.events.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
            No event albums yet.
          </div>
        ) : (
          state.events.map((event) => (
            <div
              key={event.event}
              className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">
                  {event.event}
                </h4>
                <p className="text-sm text-gray-500">
                  {event.count} {event.count === 1 ? "photo" : "photos"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/admin/EventPhotos/${encodeURIComponent(event.event)}`}
                  className="text-sm font-semibold text-[#3B1FA8] hover:text-[#2d1882]"
                >
                  Manage photos →
                </Link>
                <form action={formAction}>
                  <input type="hidden" name="actionType" value="delete-event" />
                  <input type="hidden" name="eventName" value={event.event} />
                  <ActionButton className="border border-red-600 text-red-600 hover:bg-red-50">
                    Delete event
                  </ActionButton>
                </form>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
