export default function About() {
  return (
    <section className="flex w-full flex-col items-center pt-16">
      {/* Welcome Section */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-6 text-5xl font-semibold">Welcome</h1>
        <p className="paragraph text-base leading-relaxed">
          At Stepping Stone World Preschool and Daycare, we believe that early
          childhood is a critical time for learning, growth, and discovery. Our
          mission is to nurture each child’s curiosity and confidence through a
          safe, supportive, and engaging environment. With a balanced approach
          to academics, play, and social development, we strive to lay a strong
          foundation for lifelong learning.
        </p>
      </div>

      {/* Middle Section - Two Column */}
      <div className="mt-24 flex max-w-[1233px] flex-col items-center justify-center gap-[11px] lg:flex-row">
        <h2 className="text-ce1nter text-5xl font-semibold lg:w-1/3">
          The Stepping
          <br />
          Stone Family
        </h2>

        <div className="h-[543px] w-[100%] max-w-[543px] bg-gray-300 lg:w-[387px]" />

        <p className="px-[10px] paragraph self-end lg:w-1/3 text-center">
          We believe families are key to a child’s growth. That’s why we share regular updates,
          joyful photos, and little milestones, so you’re part of every step. Together, we build
          a bond of trust, joy, and celebration.
        </p>
      </div>

      {/* Bottom Section - Image Left, Text Right */}
      <div className="mt-12 mb-12 flex w-full flex-col items-center justify-between gap-8 lg:flex-row">
        <div className="h-[450px] w-[100%] max-w-[543px] bg-gray-300 lg:w-1/2 lg:max-w-none"/>

        <div className="text-center lg:w-1/2 lg:text-center">
          <h2 className="mb-4 text-5xl font-semibold">First Steps</h2>
          <p className="px-[10px] paragraph text-base leading-relaxed">
            From the moment you arrive, you’ll feel the warmth of our community.
            We create a safe, loving space where children feel supported, seen,
            and excited to learn.
          </p>
        </div>
      </div>
    </section>
  );
}
