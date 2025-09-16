'use client'
import {auth} from "@/lib/auth";
import { redirect } from "next/navigation";
import {AdminSigninServerAction} from "@/lib/actions/AdminLogin";
import { useFormStatus } from "react-dom";

export default function AdminLoginForm() {

  const { pending } = useFormStatus();


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        action={AdminSigninServerAction}
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
        <SubmitButton/>
      </form>
    </div>
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