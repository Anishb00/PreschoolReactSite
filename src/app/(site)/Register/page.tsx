"use client";
import { useState } from "react";
import Banner from "../components/Banner";

export default function WaitlistForm() {
  const [formData, setFormData] = useState({
    childName: "",
    dob: "",
    sex: "",
    parentOneName: "",
    parentTwoName: "",
    address: "",
    phone: "",
    email: "",
    parentTwoAddress: "",
    parentTwoPhone: "",
    parentTwoEmail: "",
    doctorName: "", // <-- added
    doctorPhone: "", // <-- added
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    // Send data to backend endpoint or service here
  };

  return (
    <>
      <Banner
        imagename="/herobg.jpeg"
        title="Calendar"
        subtitle="Stay up to date with important holidays, closures, and events throughout the school year."
      />

      <section className="bg-gray-100 px-6 py-20 md:px-20">
        <div className="mx-auto w-[80%] max-w-[1000px] rounded-xl bg-white p-10 shadow">
          <h2 className="mb-6 text-3xl font-bold text-[#3B1FA8]">
            Join Our Waitlist
          </h2>
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Child Info */}
            <div>
              <h3 className="mb-4 text-xl font-semibold text-[#3B1FA8]">
                Child Information
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Child's Full Name
                  </label>
                  <input
                    type="text"
                    name="childName"
                    value={formData.childName}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Sex
                  </label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Doctor Info */}
            <div>
              <h3 className="mb-4 text-xl font-semibold text-[#3B1FA8]">
                Medical Information
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Doctor's Full Name
                  </label>
                  <input
                    type="text"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Doctor's Phone Number
                  </label>
                  <input
                    type="tel"
                    name="doctorPhone"
                    value={formData.doctorPhone}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Parent 1 Info */}
            <div>
              <h3 className="mb-4 text-xl font-semibold text-[#3B1FA8]">
                Parent 1 Information
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="parentOneName"
                    value={formData.parentOneName}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Parent 2 Info */}
            <div>
              <h3 className="mb-4 text-xl font-semibold text-[#3B1FA8]">
                Parent 2 Information
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="parentTwoName"
                    value={formData.parentTwoName}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="parentTwoAddress"
                    value={formData.parentTwoAddress}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="parentTwoPhone"
                    value={formData.parentTwoPhone}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="parentTwoEmail"
                    value={formData.parentTwoEmail}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="rounded-md bg-[#3B1FA8] px-6 py-3 font-semibold text-white transition hover:bg-[#2d1882]"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
