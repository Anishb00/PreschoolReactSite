const programs = [
  {
    name: "Caterpillar Class",
    emoji: "🐛",
    ageRange: "3 – 4.5 years",
    description:
      "Caterpillar children follow a balanced preschool day with art, circle learning, outdoor play, and rest while building strong classroom routines.",
    bullets: [
      "Art, cutting, and coloring to strengthen fine-motor skills",
      "Circle time, worksheets, and early word-reading practice",
      "Morning/afternoon outdoor play with nap and calm transitions",
    ],
  },
  {
    name: "Chrysalis Class",
    emoji: "🐚",
    ageRange: "2 – 3 years",
    description:
      "Chrysalis is a nurturing 2–3 classroom focused on gentle routines, language growth, and social confidence through short, engaging activities.",
    bullets: [
      "Art and free play to build curiosity and hand skills",
      "Circle time, stories, music, and dance for communication",
      "Snack, bathroom support, nap, and predictable transitions",
    ],
  },
  {
    name: "Butterfly Class",
    emoji: "🦋",
    ageRange: "4 – 5 years",
    description:
      "Butterfly builds kindergarten readiness with a structured day that blends academics, movement, and independence for older preschoolers.",
    bullets: [
      "Circle time and worksheets for focused learning habits",
      "Learn-to-read words, storytelling, and classroom discussion",
      "Outdoor play, self-help routines, and confident transitions",
    ],
  },
  {
    name: "Sunshine Class",
    emoji: "☀️",
    ageRange: "3 – 4 years",
    description:
      "Sunshine supports ages 3–4 with an active daily flow of creative work, outdoor exploration, and early academics in a playful setting.",
    bullets: [
      "Circle time, story, music, dance, and worksheet practice",
      "Morning and afternoon outdoor play for healthy movement",
      "Lunch, nap, then rhymes and review to reinforce learning",
    ],
  },
  {
    name: "Rainbow Class",
    emoji: "🌈",
    ageRange: "2 – 3 years",
    description:
      "Rainbow is another 2–3 classroom with supportive routines that help toddlers grow independence, communication, and early learning skills.",
    bullets: [
      "Art and free-choice play to encourage creativity",
      "Circle time, rhymes, stories, and music for language growth",
      "Outdoor play, nap, and guided transitions through the day",
    ],
  },
];

export default function ClassroomGrid() {
  return (
    <section className="bg-white p-2 md:p-20">
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
