export default function SteppingStoneDifference() {
  const sections = [
    {
      image: "/images/culture1.jpg", // Replace with actual image paths
      title: "Embracing Our Community",
      text: "Our community is a reflection of the rich cultural diversity of the Bay Area, and we embrace that fully in everything we do. Our teachers and students come from many backgrounds, and we make it a priority to expose children to a variety of languages and cultural experiences.",
    },
    {
      image: "/images/culture2.jpg",
      title: "Language & Cultural Exploration",
      text: "Children at Stepping Stone are introduced to Hindi/Indian, Spanish/Mexican, and Mandarin/Chinese language and culture through stories, songs, celebrations, and activities. We encourage them to express their heritage and share traditions from home—whether through food, festivals, music, or dress.",
    },
    {
      image: "/images/culture3.jpg",
      title: "Celebrating What Makes Us Unique",
      text: "Celebrating diversity isn’t just something we do—it’s who we are. It helps foster empathy, inclusion, and curiosity about the world, which we believe are just as important as academic skills.",
    },
  ];

  return (
    <section className="bg-white px-2 py-2">
      <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
        {sections.map((section, index) => (
          <div key={index} className="flex flex-col items-center bg-yellow-300">
            <img
              src={section.image}
              alt={section.title}
              className="h-56 w-full object-cover"
            />
            <div className="flex flex-col items-center px-6 py-6 text-center text-gray-800">
              <h3 className="mb-3 text-xl font-semibold">{section.title}</h3>
              <p className="text-sm">{section.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
