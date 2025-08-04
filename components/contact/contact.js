"use client";

import { useState } from "react";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    subject: "",
    mobile_number: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setResponseMsg("");

  try {
    const res = await fetch("/api/contact/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setResponseMsg("Message sent successfully!");
      setForm({ name: "", subject: "", mobile_number: "", message: "" });

      // Clear message after 2 seconds
      setTimeout(() => {
        setResponseMsg("");
      }, 2000);
    } else {
      setResponseMsg(data.message || "Something went wrong");
    }
  } catch (error) {
    setResponseMsg("Server error");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Write Us Form */}
        <div>
          <h2 className="text-3xl font-bold mb-6">
            Write <span className="text-red-600">Us</span>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">
                Name<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Subject<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Phone Number<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="mobile_number"
                value={form.mobile_number}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                What’s on your mind?<span className="text-red-600">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-28"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white px-6 py-2 rounded-md"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>

            {responseMsg && (
              <p className="text-green-600 font-medium mt-2">{responseMsg}</p>
            )}
          </form>
        </div>

        {/* Contact Details */}
        <div>
          <h2 className="text-3xl font-bold mb-6">
            Contact <span className="text-red-600">Details</span>
          </h2>
          <p className="font-semibold">SATHYA Mobiles India Pvt. Ltd.,</p>
          <p className="mt-1">
            No.27, 27/1, 27/A, 27/B, Gipson Puram, Thoothukudi - 628002,
            Tamilnadu, India.
          </p>

          <div className="flex items-center gap-3 mt-6">
            <div className="bg-red-600 text-white p-3 rounded-md">
              <FaPhoneAlt />
            </div>
            <span className="text-gray-800 font-medium">+91 90470 48777</span>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <div className="bg-red-600 text-white p-3 rounded-md">
              <FaEnvelope />
            </div>
            <span className="text-gray-800 font-medium">
              info@sathyai​ndia.com
            </span>
          </div>

          {/* Google Map */}
          <div className="mt-6 rounded-md shadow-md overflow-hidden">
            <iframe
              title="Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.743598145075!2d78.12458611428198!3d8.8052052936596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0411c58f33e89b%3A0x9b123c8a0c0ea4c4!2sSATHYA%20Mobiles!5e0!3m2!1sen!2sin!4v1653033422287!5m2!1sen!2sin"
              width="100%"
              height="250"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[250px] border-none"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
