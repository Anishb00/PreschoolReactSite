const programs = [
  {
    name: "Caterpillar Class",
    emoji: "🐛",
    ageRange: "18 months – 2.5 years",
    description:
      "Our littlest learners explore through movement, play, and social interaction. We build trust, routines, and early communication skills.",
    bullets: [
      "Sensory activities and fine motor play",
      "First words and early social bonding",
      "Music, story time, and parallel play",
    ],
  },
  {
    name: "Chrysalis Class",
    emoji: "🐚",
    ageRange: "2.5 – 3.5 years",
    description:
      "This class supports growing independence, potty training, and structured group play while introducing early academics.",
    bullets: [
      "Following simple instructions",
      "Expanding vocabulary and expression",
      "Dress-up, puzzles, and creative art",
    ],
  },
  {
    name: "Butterfly Class",
    emoji: "🦋",
    ageRange: "3.5 – 4.5 years",
    description:
      "Foundational academic concepts emerge through phonics, number sense, and team-based learning in a nurturing space.",
    bullets: [
      "Letter recognition and phonics",
      "Group activities and problem-solving",
      "STEM-based discovery and pretend play",
    ],
  },
  {
    name: "Sunshine Class",
    emoji: "☀️",
    ageRange: "4.5 – 5 years",
    description:
      "A Transitional Kindergarten (TK) experience focused on readiness for formal schooling, teamwork, and confidence-building.",
    bullets: [
      "Pre-writing, counting, calendar time",
      "Team games and classroom roles",
      "Storytelling and emotional regulation",
    ],
  },
  {
    name: "Rainbow Class",
    emoji: "🌈",
    ageRange: "5 – 6 years",
    description:
      "Our Kindergarten-equivalent class strengthens writing, comprehension, early math, and independent learning habits.",
    bullets: [
      "Writing full sentences and short stories",
      "Math centers and hands-on problem solving",
      "Book buddies, projects, and presentations",
    ],
  },
  {
    name: "Starlight Class",
    emoji: "🌟",
    ageRange: "Multi-age Enrichment Group",
    description:
      "A creative enrichment group for advanced learners or transition support, blending art, culture, and project-based learning.",
    bullets: [
      "Mixed-age exploration and mentoring",
      "Science, storytelling, beginner Spanish",
      "Group murals, puppet shows, cultural themes",
    ],
  },
];

export default function ClassroomGrid() {
  return (
    <section className="bg-white p-20">
      <h2 className="mb-16 text-center text-4xl font-bold text-[#3B1FA8]">
        Explore Our Classrooms
      </h2>

      <div className="grid grid-cols-1 gap-10 px-6 md:grid-cols-2 md:px-0 lg:grid-cols-3">
        {programs.map((program, index) => {
          const isDark = index % 2 === 0;
          return (
            <div
              key={index}
              className={`rounded-2xl border p-6 shadow-md transition hover:shadow-lg ${
                isDark
                  ? "bg-[#3a249c] text-white"
                  : "bg-purple-50 text-gray-800"
              }`}
            >
              <h3 className="mb-1 text-xl font-bold">
                {program.emoji} {program.name}
              </h3>
              <p
                className={`mb-2 text-sm font-semibold ${isDark ? "text-yellow-300" : "text-[#3B1FA8]"}`}
              >
                {program.ageRange}
              </p>
              <p className="mb-4 text-sm">{program.description}</p>
              <ul className="list-inside list-disc space-y-1 text-sm">
                {program.bullets.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
