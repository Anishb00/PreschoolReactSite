'use client';
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';


function DuplicateContent() {
  const childName = useSearchParams().get("childName");
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 bg-white">
      {/* Warning icon */}
      <svg
        viewBox="0 0 128 128"
        className="w-32 h-32"
        role="img"
        aria-label="duplicate-warning"
      >
        {/* Yellow circle */}
        <circle
          cx="64"
          cy="64"
          r="60"
          fill="#FFC400"
          className="origin-center [transform-box:fill-box] animate-growCircle"
        />

        {/* Exclamation stem (blue) */}
        <path
          d="M64 42 L64 78"
          fill="none"
          stroke="#0075FF"
          strokeWidth={12}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
          className="animate-drawPath [animation-delay:.45s]"
        />

        {/* Exclamation dot (blue) */}
        <circle
          cx={64}
          cy={96}
          r={7}
          fill="#0075FF"
          className="opacity-0 animate-fadeUp [animation-delay:.75s]"
        />
      </svg>

      {/* Message */}
      <p className="text-2xl font-medium text-gray-700 text-center opacity-0 animate-fadeUp [animation-delay:1s]">
        Child <span className="font-semibold">{childName}</span> is already on
        the waitlist. Please look for further contact in your email.
      </p>

      {/* Button to homepage */}
      <Link
        href="/"
        className="px-6 py-3 rounded-lg bg-yellow-500 text-white font-semibold shadow-md hover:bg-yellow-600 transition-opacity opacity-0 animate-fadeUp [animation-delay:1.4s]"
      >
        Go to Homepage
      </Link>
    </div>
  );
}

export default function DuplicatePage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading...</div>}>
      <DuplicateContent />
    </Suspense>
  );
}
