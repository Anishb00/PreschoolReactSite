"use client";

import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 bg-white">
      {/* Error icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 128 128"
        className="w-32 h-32"
        role="img"
        aria-label="error"
      >
        <circle
          cx="64"
          cy="64"
          r="60"
          fill="#ef4444" // Tailwind red-500
          className="origin-center [transform-box:fill-box] animate-growCircle"
        />
        {/* Exclamation mark */}
        <line
          x1="64"
          y1="36"
          x2="64"
          y2="76"
          stroke="#fff"
          strokeWidth={14}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
          className="animate-drawPath [animation-delay:.5s]"
        />
        <circle
          cx="64"
          cy="94"
          r="7"
          fill="#fff"
          className="opacity-0 animate-fadeUp [animation-delay:1s]"
        />
      </svg>

      {/* Error message */}
      <p className="text-2xl font-medium text-gray-700 text-center opacity-0 animate-fadeUp [animation-delay:1.2s]">
        Something went wrong! The error has been reported and we will resolve the issue as soon as possible.
      </p>

      {/* Button to homepage */}
      <Link
        href="/"
        className="px-6 py-3 rounded-lg bg-red-600 text-white font-semibold shadow-md hover:bg-red-700 transition-opacity opacity-0 animate-fadeUp [animation-delay:1.5s]"
      >
        Go to Homepage
      </Link>
    </div>
  );
}
