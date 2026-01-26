export default function Location() {
  return (
    <section className="w-full bg-gray-200 px-4 py-12 sm:px-8 lg:px-12">
      <div className=" flex max-w-6xl flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:justify-start">
        <div className="w-full max-w-5xl rounded-2xl bg-[#3a249c] px-6 py-8 text-white shadow-lg md:w-1/2 sm:px-8">
          <h2 className="mb-4 text-3xl font-semibold leading-snug sm:text-4xl">
            A Welcoming Campus <br /> Near You
          </h2>

          <p className="mb-6 text-base leading-relaxed">
            Our preschool features a beautiful, well-maintained campus with
            spacious play areas and large play structures designed to keep
            children active, engaged, and happy. Located in Milpitas, CA, we’re
            just a short drive from the Great Mall, offering families a convenient
            and easily accessible location in the heart of the community.
          </p>

          <a
            href="https://www.google.com/maps/place/Stepping+Stone+World+Preschool/@37.411487,-121.901983,17z/data=!4m15!1m8!3m7!1s0x808fceb53571e2bd:0xa48ecda0d053d2c5!2sStepping+Stone+World+Preschool!8m2!3d37.4114431!4d-121.9014929!10e5!16s%2Fg%2F11ckbqng5_!3m5!1s0x808fceb53571e2bd:0xa48ecda0d053d2c5!8m2!3d37.4114431!4d-121.9014929!16s%2Fg%2F11ckbqng5_?entry=ttu&g_ep=EgoyMDI2MDEyMS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center rounded bg-[#FFCC00] px-4 py-2 font-semibold text-black"
          >
            Find Us Here!
          </a>
        </div>
      </div>
    </section>
  );
}
