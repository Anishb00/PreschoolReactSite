// components/Navbar.jsx
"use client";
// React
import { useEffect, useState } from "react";

// Next.js
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";


// Custom Components
import styles from "@/app/(site)/rootlayout.module.css";

export default function Navbar({ forceActive = false }: { forceActive?: boolean }) {
  const [active, setActive] = useState(forceActive);
  const [menuOpen, setMenuOpen] = useState(false);

  var pathname = usePathname();

  function userhasScrolled() {
    if (window.scrollY == 0) {
      setActive(false);
    } else {
      setActive(true);
    }
  }

  function styleActive(href: string) {
    return {
      fontWeight: pathname === `/${href}` ? 'bold' : 'normal',
      color: pathname === `/${href}` ? '#0070f3' : 'inherit', // adjust highlight color
      textDecoration: 'none'
    }
  }

  useEffect(() => {
    if (forceActive) {
      setActive(true);
      return;
    }
    window.addEventListener("scroll", userhasScrolled);
    return () => {
      window.removeEventListener("scroll", userhasScrolled);
    };
  }, [forceActive]);

  return (
    // Full-width transparent header, positioned at the very top
    <header
      className={`fixed inset-x-0 top-0 z-50 ${active ? styles.navbaractive : styles.navbarinactive}`}
    >
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-3 sm:px-5 lg:px-8 [box-shadow:inset_0_-1px_0_0_#ffffff]">
        {/* Logo + wordmark on wide screens */}
        <Link href="/" className="hidden flex-shrink-0 items-center space-x-3 xl:flex">
          <Image
            src="/preschoollogo.png"
            alt="SSW"
            width={95}
            height={95}
            priority
          />
          <div className="leading-tight">
            <span className="block text-2xl font-bold">
              Stepping Stone World
            </span>
            <span className="block text-xs uppercase">Preschool</span>
          </div>
        </Link>

        {/* Compact logo when space is tight */}
        <Link href="/" className="flex flex-shrink-0 items-center xl:hidden">
          <Image
            src="/preschoollogowithtext.png"
            alt="Stepping Stone World Preschool"
            width={95}
            height={95}
            priority
          />
        </Link>

        {/* Nav links */}
        <nav className="hidden min-w-0 flex-1 items-center justify-around px-6 lg:px-8 text-sm font-semibold uppercase md:flex">
          <Link href="/AboutUs" style={styleActive('AboutUs')}>About Us</Link>
          <Link href="/Programs" style={styleActive('Programs')}>Programs</Link>
          <Link href="/Calendar" style={styleActive('Calendar')}>Calendar</Link>
          <Link href="/Curriculum" style={styleActive('Curriculum')}>Curriculum</Link>
        </nav>

        {/* "Schedule a Tour" button */}
        <Link
          href="/Register"
          className="flex w-1/2 max-w-xs flex-shrink-0 items-center justify-center rounded-full bg-yellow-400 px-3 py-2 text-sm font-semibold uppercase text-gray-900 transition hover:bg-yellow-500 md:w-auto md:max-w-none md:px-4 md:mx-0 mx-auto"
        >
          Register for Waitlist
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex flex-shrink-0 items-center rounded-md bg-transparent px-2 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 md:hidden"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="text-2xl">☰</span>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="mx-auto w-full max-w-screen-2xl px-3 pb-4 sm:px-5 lg:px-8 md:hidden">
          <nav className="flex flex-col gap-3 rounded-lg bg-white/80 px-4 py-4 shadow-lg backdrop-blur">
            <Link href="/AboutUs" style={styleActive('AboutUs')} onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/Programs" style={styleActive('Programs')} onClick={() => setMenuOpen(false)}>Programs</Link>
            <Link href="/Calendar" style={styleActive('Calendar')} onClick={() => setMenuOpen(false)}>Calendar</Link>
            <Link href="/Curriculum" style={styleActive('Curriculum')} onClick={() => setMenuOpen(false)}>Curriculum</Link>
            <Link href="/Register" style={styleActive('Register')} onClick={() => setMenuOpen(false)}>Admissions</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
