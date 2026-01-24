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

          <button className="w-fit rounded bg-[#FFCC00] px-4 py-2 font-semibold text-black">
            Find Us Here!
          </button>
        </div>
      </div>
    </section>
  );
}
