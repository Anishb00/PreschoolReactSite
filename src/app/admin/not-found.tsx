import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function NotFound() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isAuthorized = !!session && (session.user?.role === "admin" || session.user?.role === "user");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-16">
      <div className="w-full max-w-xl rounded-2xl bg-white p-10 text-center shadow-xl space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin page not found</h1>
        <p className="text-sm text-gray-600">
          We couldn&apos;t find the page you&apos;re looking for. Use the buttons below to get back on track.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
          >
            Back to Home
          </Link>
          {isAuthorized && (
            <Link
              href="/admin/home"
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400"
            >
              Back to Admin Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
