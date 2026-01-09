'use client'
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { AdminSigninServerAction } from "@/lib/actions/AdminLogin";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { authClient } from "@/lib/auth-client";
import Nav from "@/app/(site)/components/Nav";

export default function AdminLoginForm() {

  const [state, formAction] = useActionState(AdminSigninServerAction, {status:null});

  useEffect(() => {
    if (state.status) {
      (async () => {
        // authClient.$store.notify("$sessionSignal"); // refresh client session atom after server-side sign-in
        await authClient.revokeOtherSessions(); // client-only follow-up
        redirect("/admin/home");
      })();
    }
  }, [state.status]);

  return (
    <>
      <Nav forceActive />
      <main className="min-h-screen bg-gray-100 pt-28">
        <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center px-4">
          <form
            action={formAction}
            className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6"
          >
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Admin Login
            </h2>

        {/* Username Field */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="adminuser"
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        {/* Submit */}
            <SubmitButton />
          </form>
        </div>
      </main>
    </>
  );

}


function SubmitButton() {
  const { pending } = useFormStatus(); // ✅ must be called in a component rendered inside <form>

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed hover:bg-blue-700"
    >
      {pending ? "Logging in…" : "Sign In"}
    </button>
  );
}
