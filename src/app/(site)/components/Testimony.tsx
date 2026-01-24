export default function Testimony() {
  return (
    <section className="relative flex w-full items-center justify-start overflow-hidden bg-black px-8 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[url('/ChildreninClass.png')] bg-cover bg-top opacity-50 scale-x-[-1]" />

      <div className="relative w-full max-w-5xl rounded-xl bg-[#FFCC00] p-10 text-black shadow-lg md:w-1/2">
        <p className="mb-6 text-lg leading-relaxed">
          At Stepping Stone World Preschool, all of our teachers hold a
          Bachelor’s degree and maintain the certifications required to teach in
          California, including a Child Development Permit, CPR and First Aid
          certification, and completed coursework in Early Childhood Education.
        </p>
        <p className="mb-4 text-lg">
          We provide certified academic and developmental learning for children
          in the following age and grade levels:
        </p>
        <ul className="grid list-inside list-disc grid-cols-1 gap-x-8 gap-y-2 text-lg min-[1400px]:grid-cols-2">
          <li>Toddlers (18 months and up)</li>
          <li>Preschool</li>
          <li>Pre-Kindergarten</li>
          <li>Transitional Kindergarten (TK)</li>
          <li>Kindergarten</li>
        </ul>
      </div>
    </section>
  );
}
