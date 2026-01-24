"use client";
import Banner from "../components/Banner";
import Calendar from "./components/Calendar";

export default function Programs() {
  return (
    <>
      <Banner
        imagename="/HeroBG.png"
        title="Calendar"
        subtitle="Stay up to date with important holidays, closures, and events throughout the school year."
      />
      <Calendar />
    </>
  );
}
