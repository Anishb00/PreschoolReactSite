'use client';
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const params = useSearchParams();
  const childName = params.get("childName");
  const status = params.get("status") || "preregister";
  const message =
    status === "waitlist"
      ? "Your child has been added to the waitlist. Please complete the registration forms sent to your email and bring them with you on your child’s first day of school."
      : "We sent a verification email to the email address you provided. Click the link in that email to verify your email. Once verified, your child will be added to the waitlist.";

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 bg-white">
      {/* Success icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 128 128"
        className="w-32 h-32"
        role="img"
        aria-label="success"
      >
        <circle
          cx="64"
          cy="64"
          r="60"
          fill="#22c55e"
          className="origin-center [transform-box:fill-box] animate-growCircle"
        />
        <path
          d="M38 66 L56 84 L92 44"
          fill="none"
          stroke="#fff"
          strokeWidth={14}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
          className="animate-drawPath [animation-delay:.5s]"
        />
      </svg>

      {/* FadeUp text */}
      <p className="text-2xl font-medium text-gray-700 text-center opacity-0 animate-fadeUp [animation-delay:1s]">
       {message}
      </p>

      {/* Button to homepage */}
      <Link
        href="/"
        className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 transition-opacity opacity-0 animate-fadeUp [animation-delay:1.5s]"
      >
        Go to Homepage
      </Link>
    </div>
  );
}

export default function Success() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
