import Banner from "../components/Banner";
import EducationalApproach from "./components/EducationalApproach";
import CoreLearningAreas from "./components/CoreLearningAreas";
import DevelopmentalGoals from "./components/DevelopmentalGoals";
import AssessmentAndFeedback from "./components/AssessmentAndFeedback";

export default function Curriculum() {
  return (
    <>
      <Banner
        imagename="/siteimages/HeroBG.webp"
        title="Our Curriculum"
        subtitle="A balanced, hands-on curriculum that fosters creativity, confidence, and curiosity in every learner."
      />

      <EducationalApproach />
      <CoreLearningAreas />
      <DevelopmentalGoals />
      <AssessmentAndFeedback />
    </>
  );
}
