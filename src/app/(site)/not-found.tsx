import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function NotFound() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isAuthorized = !!session && (session.user?.role === "admin" || session.user?.role === "user");

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-gradient-to-b from-amber-50 via-white to-white px-6 py-24">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">
          We couldn&apos;t find that page.
        </h1>
        <p className="text-base text-gray-600">
          The link may be outdated or the page has moved. Head back to our home
          page to keep exploring Stepping Stone World Preschool.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold uppercase text-gray-900 shadow transition hover:bg-yellow-500"
          >
            Back to Home
          </Link>
          {isAuthorized && (
            <Link
              href="/admin/home"
              className="rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold uppercase text-gray-800 transition hover:border-gray-400"
            >
              Back to Admin Home
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
