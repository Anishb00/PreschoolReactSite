export default function ContactInfo() {
  const cards = [
    {
      label: "Phone",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7"
        >
          <path d="M6.62 10.79a15.53 15.53 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.24 1.02l-2.21 2.21z" />
        </svg>
      ),
      primary: "408-621-1037",
      href: "tel:+14086211037",
      secondary: "Mon–Fri",
    },
    {
      label: "Email",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7"
        >
          <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      ),
      primary: "steppingstoneworld@gmail.com",
      href: "mailto:steppingstoneworld@gmail.com",
      secondary: "General inquiries",
    },
    {
      label: "Visit Us",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
        </svg>
      ),
      primary: "1362 South Main St",
      href: "https://www.google.com/maps/place/Stepping+Stone+World+Preschool/@37.411487,-121.901983,17z/data=!4m15!1m8!3m7!1s0x808fceb53571e2bd:0xa48ecda0d053d2c5!2sStepping+Stone+World+Preschool!8m2!3d37.4114431!4d-121.9014929!10e5!16s%2Fg%2F11ckbqng5_!3m5!1s0x808fceb53571e2bd:0xa48ecda0d053d2c5!8m2!3d37.4114431!4d-121.9014929!16s%2Fg%2F11ckbqng5_?entry=ttu",
      secondary: "Milpitas, California 95035",
    },
  ];

  return (
    <section className="w-full bg-white px-4 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="flex flex-col items-center rounded-2xl border border-gray-100 bg-gray-50 px-6 py-8 text-center shadow-sm"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFCC00] text-[#3a249c]">
              {card.icon}
            </div>
            <h3 className="mb-1 text-lg font-bold text-gray-900">
              {card.label}
            </h3>
            <a
              href={card.href}
              target={card.href.startsWith("http") ? "_blank" : undefined}
              rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="break-words font-semibold text-[#3B1FA8] hover:underline"
            >
              {card.primary}
            </a>
            <p className="mt-1 text-sm text-gray-500">{card.secondary}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
