import Banner from "../components/Banner";
import ClassroomGrid from "./components/ClassroomGrid";
import DailyRoutine from "./components/DailyRoutine";
import EnrichmentAndRatios from "./components/EnrichmentAndRatios";

export default function Programs() {
  return (
    <>
      <Banner
        imagename="/herobg.jpeg"
        title="Our Programs"
        subtitle="From toddlers to kindergarten, each class at Stepping Stone is designed to support your child's growth, curiosity, and love for learning every step of the way."
      />
      <ClassroomGrid />
      <DailyRoutine />
      <EnrichmentAndRatios />
    </>
  );
}
