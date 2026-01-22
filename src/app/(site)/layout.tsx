import type { Metadata } from "next";
import Nav from "@/app/(site)/components/Nav";
import Footer from "@/app/(site)/components/Footer";

export const metadata: Metadata = {
  title: "Stepping Stone World Preschool",
  description: "A preschool react site",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="site-typography w-full text-black">{children}</main>
      <Footer />
    </>
  );
}
