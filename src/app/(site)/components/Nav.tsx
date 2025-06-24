// components/Navbar.jsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "@/app/(site)/rootlayout.module.css";

export default function Navbar() {
  const [active, setActive] = useState(false);

  function userhasScrolled() {
    if (window.scrollY == 0) {
      setActive(false);
    } else {
      setActive(true);
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", userhasScrolled);
  });

  return (
    // Full-width transparent header, positioned at the very top
    <header
      className={`fixed inset-x-0 top-0 z-50 ${active ? styles.navbaractive : styles.navbarinactive}`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 [box-shadow:inset_0_-1px_0_0_#ffffff]">
        {/* Logo + Wordmark */}
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/preschoollogo.png"
            alt="SSW"
            width={120}
            height={120}
            priority
          />
          <div className="leading-tight">
            <span className="block text-2xl font-bold">
              Stepping Stone World
            </span>
            <span className="block text-xs uppercase">Preschool</span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden space-x-8 text-sm font-semibold uppercase md:flex">
          <Link href="AboutUs">About</Link>
          <Link href="Programs">Programs</Link>
          <Link href="Calendar">Calendar</Link>
          <Link href="Curriculum">Curriculum</Link>
          <Link href="Register">Admissions</Link>
        </nav>

        {/* "Schedule a Tour" button */}
        <Link
          href="/schedule"
          className="hidden rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-gray-900 uppercase transition hover:bg-yellow-500 md:inline-block"
        >
          Schedule a Tour
        </Link>
      </div>
    </header>
  );
}
