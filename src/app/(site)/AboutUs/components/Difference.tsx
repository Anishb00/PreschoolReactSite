export default function SteppingStoneDifference() {
  const sections = [
    {
      image: "/siteimages/ChildrenHoli.webp", // Replace with actual image paths
      title: "Embracing Our Community",
      text: "Our community is a reflection of the rich cultural diversity of the Bay Area, and we embrace that fully in everything we do. Our teachers and students come from many backgrounds, and we make it a priority to expose children to a variety of languages and cultural experiences.",
    },
    {
      image: "/siteimages/ChildrenYoga.webp",
      title: "Language & Cultural Exploration",
      text: "Children at Stepping Stone are introduced to Hindi/Indian, Spanish/Mexican, and Mandarin/Chinese language and culture through stories, songs, celebrations, and activities. We encourage them to express their heritage and share traditions from home, whether that is through food, festivals, music, or dress.",
    },
    {
      image: "/siteimages/cowboykids.webp",
      title: "Celebrating What Makes Us Unique",
      text: "Celebrating diversity isn’t just something we do; it’s who we are. It helps foster empathy, inclusion, and curiosity about the world, which we believe are just as important as academic skills.",
    },
  ];

  return (
    <section className="bg-white px-2 py-2">
      <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
        {sections.map((section, index) => (
          <div
            key={index}
            className="relative flex h-96 flex-col justify-end overflow-hidden bg-yellow-300"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-75"
              style={{ backgroundImage: `url('${section.image}')` }}
              aria-hidden="true"
            />
            <div className="relative z-10 flex flex-col gap-3 bg-gradient-to-t from-yellow-300/90 via-yellow-300/60 to-yellow-300/0 px-6 py-6 text-center text-[#2d1b7f] backdrop-blur-[1px]">
              <h3 className="text-xl font-semibold">{section.title}</h3>
              <p className="text-sm leading-relaxed">{section.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
