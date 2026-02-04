export default function Director() {
  return (
    <section className="bg-gray-50 px-6 py-30 md:px-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-10 md:flex-row md:items-start">
        {/* Left Column: Title and Name */}
        <div className="text-center md:w-1/4 md:text-right">
          <h2 className="text-2xl font-semibold text-gray-800">
            Meet the Director
          </h2>
          <p className="mt-2 text-gray-600">Manisha Sharma</p>
        </div>

        {/* Middle Column: Director Image */}
        <div className="w-2/3 md:w-1/4">
          <img
            src="/siteimages/director.webp" // Make sure this path matches your static directory
            alt="Director Manisha Sharma"
            className="w-full rounded-lg object-cover shadow-md"
          />
        </div>

        {/* Right Column: Welcome Message */}
        <div className="text-gray-700 md:w-1/2">
          <h3 className="mb-2 font-semibold">
            Director Manisha Sharma has led Stepping Stone World Preschool since
            its founding.
          </h3>
          <p className="mb-4 italic">
            As the director, I am so honored to be part of a school that values
            kindness, curiosity, and community. Our goal is to create a warm and
            enriching environment where children feel safe, celebrated, and
            inspired to learn. We believe every child is unique, and we work
            closely with families to nurture each child’s strengths and
            interests.
          </p>
          <p className="italic">
            What truly makes our school special is the sense of
            connection between teachers, children, and parents. We’re not just
            preparing children for kindergarten; we’re laying the foundation for
            confident, lifelong learners. I invite you to come visit, meet our
            amazing team, and see the joyful learning in action. We’d love to
            welcome you into the Stepping Stone family!"
          </p>
        </div>
      </div>
    </section>
  );
}
