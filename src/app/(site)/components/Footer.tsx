// components/Footer.tsx

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 px-6 py-12 text-sm text-gray-700">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 md:flex-row md:items-center">
        {/* Logo Column */}
        <div className="flex flex-col items-center md:items-start">
          <Image
            src="/Badgelogo.png" // ✅ Replace with your actual logo file path in the /public folder
            alt="Logo"
            width={240}
            height={240}
            className="mb-4"
          />
        </div>

        {/* Contact Info */}
        <div className="text-center md:text-left">
          <h4 className="mb-2 font-semibold uppercase">Contact Information</h4>
          <p>
            Moorlands School, Foxhill Drive,
            <br />
            Weetwood Lane, Leeds LS16 5PF
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:info@moorlands-school.co.uk"
              className="text-blue-600"
            >
              info@moorlands-school.co.uk
            </a>
          </p>
          <p>Phone: 0113 278 5286</p>
          <div className="mt-2 flex justify-center gap-3 md:justify-start">
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook-square text-xl"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fab fa-instagram text-xl"></i>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center md:text-left">
          <h4 className="mb-2 font-semibold uppercase">Quick Links</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/" className="hover:underline">
                Our School
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline">
                Parent Zone
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline">
                Admissions
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline">
                Fees
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:underline">
                Admin Portal
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-300 pt-6 text-center text-xs text-gray-500">
        © 2025 Your School Name. Developed by Your Team |{" "}
        <Link href="/" className="hover:underline">
          Terms and Conditions
        </Link>{" "}
        |{" "}
        <Link href="/" className="hover:underline">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
