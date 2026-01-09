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
  const orderFilePath = path.join(
    process.cwd(),
    "src",
    "app",
    "(site)",
    "data",
    "photocarousel.json"
  );
  const isImageFile = (file: string) => /\.(jpg|jpeg|png|webp)$/i.test(file);
  const orderedFiles = (() => {
    if (!fs.existsSync(orderFilePath)) {
      return [];
    }
    try {
      const data = fs.readFileSync(orderFilePath, "utf-8");
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.filter((file) => typeof file === "string" && isImageFile(file));
    } catch {
      return [];
    }
  })();
  const carouselImageFilenames = orderedFiles;

  return (
    <>
      <Hero imagename="/herobg.jpeg" />
      <About />
      <Learning />
      <PhotoCarousel filenames={carouselImageFilenames} />
      <Testimony />
      <Navigate />
      <Location />
    </>
  );
}
