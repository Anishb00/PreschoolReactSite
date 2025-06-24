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
        imagename="/herobg.jpeg"
        title="About Us"
        subtitle="Moorlands is the oldest prep school in Leeds, founded in 1897. The school moved to its current superb location in 1967."
      />

      <Mission />
      <Philosophy />
      <Director />
      <Difference />
      <Licensing />
    </>
  );
}
