"use client"

import type React from "react"

import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", message: "" })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <main className="pt-24 pb-16 bg-amber-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-serif text-amber-900 mb-4">Get In Touch</h1>
          <p className="text-xl text-amber-800">We'd love to hear from you. Reach out to us anytime.</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-serif text-amber-900 mb-6">Send us a Message</h2>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <p className="text-green-800 font-serif text-lg">Thank you for your message!</p>
                <p className="text-green-700">We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-amber-900 font-serif mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-600 bg-amber-50"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-serif mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-600 bg-amber-50"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-serif mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-600 bg-amber-50"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-serif mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-600 bg-amber-50"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-serif py-3 rounded-lg transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-serif text-amber-900 mb-6">Contact Information</h2>

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex gap-4">
                  <svg
                    className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-serif text-amber-900 mb-1">Phone</h3>
                    <p className="text-amber-800">+91 (123) 456-7890</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <svg
                    className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-serif text-amber-900 mb-1">Email</h3>
                    <p className="text-amber-800">info@surbhisweetmart.com</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4">
                  <svg
                    className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-serif text-amber-900 mb-1">Address</h3>
                    <p className="text-amber-800">
                      123 Sweet Lane, Bakery District
                      <br />
                      Mumbai, Maharashtra 400001
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4">
                  <svg
                    className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-serif text-amber-900 mb-1">Business Hours</h3>
                    <p className="text-amber-800">
                      Monday - Friday: 9:00 AM - 8:00 PM
                      <br />
                      Saturday: 10:00 AM - 9:00 PM
                      <br />
                      Sunday: 11:00 AM - 7:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-serif text-amber-900 mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-12 h-12 bg-amber-100 hover:bg-amber-600 text-amber-600 hover:text-white rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <span className="text-xl">f</span>
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-amber-100 hover:bg-amber-600 text-amber-600 hover:text-white rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <span className="text-xl">@</span>
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-amber-100 hover:bg-amber-600 text-amber-600 hover:text-white rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <span className="text-xl">in</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
