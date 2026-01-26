"use client";

import React from "react";
import { useFormStatus } from "react-dom";

type CarouselEditorState = {
  entries: { file: string; inCarousel: boolean }[];
  message?: string;
};

type CarouselEditorProps = {
  initialEntries: { file: string; inCarousel: boolean }[];
  updateCarousel: (
    prevState: CarouselEditorState,
    formData: FormData
  ) => Promise<CarouselEditorState>;
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

export default function CarouselEditor({
  initialEntries,
  updateCarousel,
}: CarouselEditorProps) {
  const [state, formAction] = React.useActionState(updateCarousel, {
    entries: initialEntries,
    message: "",
  });

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Add Photo
        </h3>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="actionType" value="add" />
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Photo File
            </label>
            <input
              type="file"
              name="photo"
              accept=".jpg,.jpeg,.png,.webp"
              required
              className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white file:font-semibold hover:file:bg-blue-700"
            />
            <p className="mt-2 text-xs text-gray-500">
              Allowed types: JPG, PNG, or WebP.
            </p>
          </div>
          <ActionButton className="bg-blue-600 text-white hover:bg-blue-700">
            Upload Photo
          </ActionButton>
        </form>
        {state.message && (
          <p className="mt-4 text-sm text-gray-600">{state.message}</p>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Carousel Order
        </h3>
        {state.entries.length === 0 ? (
          <div className="rounded-md border border-dashed border-gray-300 p-6 text-center text-gray-500">
            No photos in the carousel yet.
          </div>
        ) : (
          <div className="space-y-4">
            {state.entries.map((entry, index) => {
              const inCarousel = entry.inCarousel;
              const position = inCarousel
                ? state.entries.filter((e) => e.inCarousel).findIndex((e) => e.file === entry.file) + 1
                : null;
              return (
              <div
                key={entry.file}
                className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`/photocarousel/${entry.file}`}
                    alt={entry.file}
                    className="h-20 w-32 rounded-md object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{entry.file}</p>
                    <p className="text-xs text-gray-500">
                      {inCarousel ? `Position ${position}` : "Not in carousel"}
                    </p>
                    <form
                      action={formAction}
                      className="mt-2 inline-flex items-center gap-2"
                    >
                      <input type="hidden" name="actionType" value="toggle" />
                      <input type="hidden" name="filename" value={entry.file} />
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          name="include"
                          value="1"
                          key={`${entry.file}-${entry.inCarousel ? "1" : "0"}`}
                          defaultChecked={entry.inCarousel}
                          onChange={(e) => {
                            e.currentTarget.form?.requestSubmit();
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Show in carousel
                      </label>
                    </form>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`/photocarousel/${entry.file}`}
                    download
                    className="rounded-md border border-blue-600 px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                  >
                    Download
                  </a>
                  <form action={formAction}>
                    <input type="hidden" name="actionType" value="move" />
                    <input type="hidden" name="direction" value="up" />
                    <input type="hidden" name="filename" value={entry.file} />
                    <ActionButton
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50"
                      disabled={!inCarousel || position === 1}
                    >
                      Move Up
                    </ActionButton>
                  </form>
                  <form action={formAction}>
                    <input type="hidden" name="actionType" value="move" />
                    <input type="hidden" name="direction" value="down" />
                    <input type="hidden" name="filename" value={entry.file} />
                    <ActionButton
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50"
                      disabled={
                        !inCarousel ||
                        position ===
                          state.entries.filter((e) => e.inCarousel).length
                      }
                    >
                      Move Down
                    </ActionButton>
                  </form>
                  <form action={formAction}>
                    <input type="hidden" name="actionType" value="delete" />
                    <input type="hidden" name="filename" value={entry.file} />
                    <ActionButton className="border border-red-600 text-red-600 hover:bg-red-50">
                      Delete
                    </ActionButton>
                  </form>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </section>
    </div>
  );
}
