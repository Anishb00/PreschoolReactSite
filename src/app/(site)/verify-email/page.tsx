import { verifyEmailToken } from "@/lib/verification";

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : null;

  if (!token) {
    return (
      <div className="mx-auto max-w-2xl py-16">
        <h1 className="text-3xl font-semibold text-gray-800">Verification failed</h1>
        <p className="mt-2 text-gray-700">No token was provided.</p>
      </div>
    );
  }

  try {
    const result = await verifyEmailToken(token);
    if (result.status === "verified") {
      return (
        <div className="mx-auto max-w-2xl py-16">
          <h1 className="text-3xl font-semibold text-gray-800">Email verified</h1>
          <p className="mt-2 text-gray-700">
            Thank you! Your email has been verified. We’ll continue your registration process.
          </p>
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-2xl py-16">
        <h1 className="text-3xl font-semibold text-gray-800">Verification failed</h1>
        <p className="mt-2 text-gray-700">
          This link is invalid or expired. Please request a new verification email.
        </p>
      </div>
    );
  } catch (err) {
    return (
      <div className="mx-auto max-w-2xl py-16">
        <h1 className="text-3xl font-semibold text-gray-800">Something went wrong</h1>
        <p className="mt-2 text-gray-700">Please try again later.</p>
      </div>
    );
  }
}
