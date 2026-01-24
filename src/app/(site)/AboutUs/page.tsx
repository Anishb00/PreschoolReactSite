import Banner from "../components/Banner";
import Mission from "./components/Mission";
import Philosophy from "./components/Philosophy";
import Difference from "./components/Difference";
import Director from "./components/Director";
import Licensing from "./components/Licensing";

export default function AboutUs() {
  return (
    <>
      <Banner
        imagename="/HeroBG.png"
        title="About Us"
        subtitle="Stepping Stone World Preschool is a warm, community-first school in Milpitas where kids learn through joyful play, hands-on discovery, and close family partnerships."
      />

      <Mission />
      <Philosophy />
      <Director />
      <Difference />
      <Licensing />
    </>
  );
}
