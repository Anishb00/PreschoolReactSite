import { verifyEmailToken } from "@/lib/verification";
import Banner from "../components/Banner";

type PageProps = {
  searchParams: Promise<{ token?: string; email?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : null;
  const email = typeof params.email === "string" ? params.email : undefined;

  let status: "missing" | "verified" | "invalid" | "error" | "already_verified" = "missing";
  if (token) {
    try {
      const result = await verifyEmailToken(token, email);
      if (result.status === "verified" || result.status === "already_verified") {
        status = result.status;
      } else {
        status = "invalid";
      }
    } catch {
      status = "error";
    }
  }

  const copy = {
    verified: {
      title: "Email verified",
      message: "Thank you! Your email has been verified. We’ll continue your registration process.",
    },
    invalid: {
      title: "Something went wrong",
      message: "This link is invalid or expired. Please request a new verification email.",
    },
    missing: {
      title: "Something went wrong",
      message: "No token was provided.",
    },
    error: {
      title: "Something went wrong",
      message: "Please try again later.",
    },
    already_verified: {
      title: "Email already verified",
      message: "This email is already verified. No further action is needed.",
    },
  }[status];

  return (
    <>
      <Banner
        imagename="/herobg.jpeg"
        title="Email Verification"
        subtitle="Confirm your email to finish registering."
      />
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-3xl font-semibold text-gray-800 sm:text-4xl md:text-5xl">
          {copy.title}
        </h1>
        <p className="mt-4 text-base text-gray-700 sm:text-lg md:text-xl">{copy.message}</p>
      </div>
    </>
  );
}
