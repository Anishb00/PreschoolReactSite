"use client";

import React, { useState } from "react";

type EventGalleryProps = {
  eventName: string;
  images: string[];
};

export default function EventGallery({ eventName, images }: EventGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const basePath = `/events/${encodeURIComponent(eventName)}`;
  const hasImages = images.length > 0;
  const goNext = () => {
    if (!hasImages || activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % images.length);
  };
  const goPrev = () => {
    if (!hasImages || activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16">
      {images.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
          No photos have been added for this event yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 rounded-2xl bg-gray-50 p-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((file, index) => (
            <button
              key={file}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative overflow-hidden rounded-lg border-[10px] border-white bg-white shadow-[0_0_18px_rgba(0,0,0,0.18)]"
            >
              <img
                src={`${basePath}/${encodeURIComponent(file)}`}
                alt={`${eventName} photo ${index + 1}`}
                loading="lazy"
                className="h-40 w-full object-cover transition duration-200 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {activeIndex !== null && images[activeIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white text-gray-900 shadow hover:bg-gray-100"
                  aria-label="Previous photo"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white text-gray-900 shadow hover:bg-gray-100"
                  aria-label="Next photo"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-lg text-white"
              aria-label="Close photo"
            >
              ×
            </button>
            <img
              src={`${basePath}/${encodeURIComponent(images[activeIndex])}`}
              alt={`${eventName} photo ${activeIndex + 1}`}
              className="max-h-[90vh] w-full rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
