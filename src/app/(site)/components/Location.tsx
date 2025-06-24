export default function Location() {
  return (
    <section className="flex h-[500px] w-full items-center justify-start bg-gray-200 px-20">
      <div className="flex h-[75%] w-[35%] max-w-[700px] min-w-[550px] flex-col justify-center bg-[#3a249c] px-10 py-8 text-white">
        <h2 className="mb-4 text-4xl leading-snug font-semibold">
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
    </section>
  );
}
