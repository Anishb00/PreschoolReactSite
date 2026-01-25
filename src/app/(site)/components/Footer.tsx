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
            Stepping Stone World Preschool
            <br />
            1362 South Main St
            <br />
            Milpitas, California 95035
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:steppingstoneworld@gmail.com"
              className="text-blue-600"
            >
              steppingstoneworld@gmail.com
            </a>
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-center md:text-left">
          <h4 className="mb-2 font-semibold uppercase">Quick Links</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/AboutUs" >About Us</Link>
            </li>
            <li>
              <Link href="/Programs">Programs</Link>
            </li>
            <li>
              <Link href="/Calendar" >Calendar</Link>
            </li>
            <li>
              <Link href="/Curriculum">Curriculum</Link>

            </li>
            <li>
               <Link href="/Register">Register Waitlist</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-300 pt-6 text-center text-xs text-gray-500">
        © 2025 Stepping Stone World Preschool. Developed by Your Team{" "}
      </div>
    </footer>
  );
}
