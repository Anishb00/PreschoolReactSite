"use client";

import React from "react";
import { useFormStatus } from "react-dom";

type EventAlbumState = {
  event: string;
  images: string[];
  message?: string;
};

type EventAlbumEditorProps = {
  eventName: string;
  initialImages: string[];
  updateEventAlbum: (
    prevState: EventAlbumState,
    formData: FormData
  ) => Promise<EventAlbumState>;
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

export default function EventAlbumEditor({
  eventName,
  initialImages,
  updateEventAlbum,
}: EventAlbumEditorProps) {
  const [state, formAction] = React.useActionState(updateEventAlbum, {
    event: eventName,
    images: initialImages,
    message: "",
  });

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Upload Photos
        </h3>
        <form action={formAction} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <input type="hidden" name="actionType" value="upload" />
          <input type="hidden" name="eventName" value={eventName} />
          <input
            type="file"
            name="photo"
            accept=".jpg,.jpeg,.png,.webp"
            multiple
            required
            className="text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white file:font-semibold hover:file:bg-blue-700"
          />
          <ActionButton className="bg-blue-600 text-white hover:bg-blue-700">
            Upload
          </ActionButton>
        </form>
        {state.message && (
          <p className="mt-3 text-sm text-gray-600">{state.message}</p>
        )}
      </section>

      {state.images.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
          No photos yet. Upload to get started.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {state.images.map((image) => (
            <div
              key={image}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <img
                src={`/events/${encodeURIComponent(eventName)}/${encodeURIComponent(
                  image
                )}`}
                alt={image}
                className="h-32 w-full object-cover"
              />
              <form action={formAction} className="absolute right-2 top-2">
                <input type="hidden" name="actionType" value="delete" />
                <input type="hidden" name="eventName" value={eventName} />
                <input type="hidden" name="filename" value={image} />
                <ActionButton className="bg-red-600 text-white hover:bg-red-700">
                  Delete
                </ActionButton>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
