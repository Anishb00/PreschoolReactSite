"use client";

import { useEffect, useState } from "react";

export default function PhotoCarousel({ filenames }: { filenames: string[] }) {
  const [images, setImages] = useState(() => filenames.filter(Boolean));
  const [currIndex, setCurrIndex] = useState(0);

  // Keep local list in sync with prop changes
  useEffect(() => {
    setImages(filenames.filter(Boolean));
    setCurrIndex(0);
  }, [filenames]);

  if (images.length === 0) {
    return (
      <section className="mx-auto -mt-50 mb-20 w-[90%] max-w-5xl rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-500">
        No photos in the carousel yet.
      </section>
    );
  }

  const goPrev = () =>
    setCurrIndex((currIndex - 1 + images.length) % images.length);
  const goNext = () => setCurrIndex((currIndex + 1) % images.length);

  const handleImageError = (badIndex: number) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== badIndex);
      setCurrIndex((idx) =>
        next.length === 0 ? 0 : Math.min(idx, next.length - 1)
      );
      return next;
    });
  };

  return (
    <section className="relative mx-auto -mt-30 mb-20 h-[500px] w-full max-w-5xl overflow-hidden shadow-xl drop-shadow-lg md:w-[90%] md:rounded-2xl">
      {/* Image row */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currIndex * 100}%)` }}
      >
        {images.map((file, i) => (
          <img
            key={file}
            src={`/photocarousel/${file}`}
            alt={`Carousel image ${i + 1}`}
            loading="lazy"
            className="h-full w-full flex-shrink-0 object-cover"
            onError={() => handleImageError(i)}
          />
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={goPrev}
        className="absolute top-1/2 left-4 z-20 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white shadow hover:bg-gray-100"
        aria-label="Previous image"
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

      {/* Right Arrow */}
      <button
        onClick={goNext}
        className="absolute top-1/2 right-4 z-20 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white shadow hover:bg-gray-100"
        aria-label="Next image"
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
    </section>
  );
}
