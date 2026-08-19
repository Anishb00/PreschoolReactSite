import Banner from "../components/Banner";
import ContactInfo from "./components/ContactInfo";
import ContactForm from "./components/ContactForm";

export default function ContactPage() {
  return (
    <>
      <Banner
        imagename="/siteimages/HeroBG.webp"
        title="Contact Us"
        subtitle="We're here to answer your questions and help you get started."
      />

      <ContactInfo />

      <section className="bg-gray-100 p-4 md:px-20 md:py-16">
        <div className="mx-auto w-full max-w-[900px] rounded-xl bg-white p-4 shadow md:p-10">
          <h2 className="mb-2 text-3xl font-bold text-[#3B1FA8]">
            Send Us a Message
          </h2>
          <p className="mb-8 text-gray-600">
            Fill out the form below and we&apos;ll get back to you as soon as we
            can.
          </p>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
