import {auth} from "@/lib/auth";

export default function AdminSignupForm() {

    const  signupServerAction = async function(formData: FormData)  {
        'use server';
        const name = String(formData.get("name"));
        const email = String(formData.get("email"));
        const username = String(formData.get("username"));
        const password = String(formData.get("password"));
        const confirmPassword = formData.get("confirmPassword");

        try{
            const data = await auth.api.signUpEmail({
                body: {
                    email, 
                    name, 
                    password, 
                    username, 
                },
            });
            console.log("-------------Data------------------",data);
        } catch(err){
            console.log("-------------Error------------------",err);
        }
    };

    return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
        action={signupServerAction}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
        <h2 className="text-2xl font-bold text-center text-gray-800">
            Admin Sign Up
        </h2>

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
