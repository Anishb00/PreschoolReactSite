export default function Philosophy() {
  return (
    <section className="flex flex-col-reverse items-center gap-10 bg-gray-200 px-8 py-16 md:flex-row">
      <div className="text-gray-800 md:w-1/2">
        <h3 className="mb-4 text-2xl font-semibold">
          Our Philosophy of Learning
        </h3>
        <p className="mb-4">
          We believe that every child learns best through hands-on experiences,
          guided discovery, and trusted relationships with caregivers. Our
          curriculum is rooted in play-based and developmentally appropriate
          practices that encourage intellectual, emotional, and social growth.
        </p>
        <p>
          We ensure that every child receives the personalized attention, care,
          and encouragement they deserve. This allows our teachers to deeply
          understand each child’s needs and help them build confidence at their
          own pace. Below are the Teacher to Student ratios your child's
          classroom will have based on age:
        </p>
        <br />
        <ul className="list-inside list-disc text-base">
          <li>1:6 ratio for ages 2–3</li>
          <li>1:9 ratio for ages 3–5</li>
        </ul>
      </div>
      <div className="w-full md:w-1/2">
        <img
          src="classroom.jpg"
          alt="Classroom"
          className="h-full w-full rounded-xl object-cover"
        />
      </div>
    </section>
  );
}
