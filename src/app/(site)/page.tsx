import fs from "fs";
import path from "path";
import Hero from "@/app/(site)/components/Hero";
import About from "./components/About";
import Learning from "./components/Learning";
import PhotoCarousel from "./components/PhotoCarousel";
import Testimony from "./components/Testimony";
import Navigate from "./components/Navigate";
import Location from "./components/Location";

export default function Home() {
  const carouselDir = path.join(process.cwd(), "public/photocarousel");
  const carouselImageFilenames = fs
    .readdirSync(carouselDir)
    .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file)); // Optional file type filter

  return (
    <>
      <Hero imagename="herobg.jpeg" />
      <About />
      <Learning />
      <PhotoCarousel filenames={carouselImageFilenames} />
      <Testimony />
      <Navigate />
      <Location />
    </>
  );
}
