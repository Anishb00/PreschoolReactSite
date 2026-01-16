import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type SignupPageProps = {
  searchParams?: Promise<{ status?: string }>;
};

export default async function AdminSignupForm({ searchParams }: SignupPageProps) {
    const resolvedSearchParams = searchParams ? await searchParams : undefined;

    const  signupServerAction = async function(formData: FormData)  {
        'use server';
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session || session.user.role !== "admin") {
            redirect("/admin/signup?status=forbidden");
        }

        const name = String(formData.get("name"));
        const email = String(formData.get("email"));
        const username = String(formData.get("username"));
        const password = String(formData.get("password"));
        const confirmPassword = formData.get("confirmPassword");

        if (password !== confirmPassword) {
            redirect("/admin/signup?status=nomatch");
        }

        try{
            await auth.api.createUser({
                body: {
                    email,
                    name,
                    password,
                    role: "user",
                    data: { username },
                },
            });
        } catch(err){
            console.log("-------------Error------------------",err);
            redirect("/admin/signup?status=error");
        }

        redirect("/admin/signup?status=success");
    };

    const statusMessage =
      resolvedSearchParams?.status === "success"
        ? { text: "User created successfully.", tone: "success" as const }
        : resolvedSearchParams?.status === "error"
          ? { text: "Failed to create user. Please try again.", tone: "error" as const }
          : resolvedSearchParams?.status === "forbidden"
            ? { text: "You must be an admin to create users.", tone: "error" as const }
            : resolvedSearchParams?.status === "nomatch"
              ? { text: "Passwords do not match.", tone: "error" as const }
              : null;

    return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
        action={signupServerAction}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
        <h2 className="text-2xl font-bold text-center text-gray-800">
            Admin Sign Up
        </h2>
        {statusMessage && (
          <p
            className={[
              "rounded-md border px-3 py-2 text-sm",
              statusMessage.tone === "success"
                ? "text-green-700 bg-green-50 border-green-200"
                : "text-red-700 bg-red-50 border-red-200",
            ].join(" ")}
          >
            {statusMessage.text}
          </p>
        )}

        {/* Name Field */}
        <div>
            <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
            >
            Name
            </label>
            <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="John Doe"
            />
        </div>

        {/* Email Field */}
        <div>
            <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
            >
            Email
            </label>
            <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="john@example.com"
            />
        </div>

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

        {/* Confirm Password Field */}
        <div>
            <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
            >
            Confirm Password
            </label>
            <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="••••••••"
            />
        </div>

        {/* Submit */}
        <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
            Sign Up
        </button>
        </form>
    </div>
    );


}
