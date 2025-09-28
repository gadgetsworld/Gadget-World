"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ContactPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const { default: NProgress } = await import("nprogress")
    const { toast } = await import("react-toastify")
    NProgress.start()
    setLoading(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(formData),
      })

      const waText = `Contact Form\nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`
      if (typeof window !== "undefined") {
        const url =
          "https://wa.me/917018021841?text=" + encodeURIComponent(waText)
        window.open(url, "_blank", "noopener,noreferrer")
      }

      if (res.ok) {
        toast.success("Thanks! We will get back to you soon.")
        // Clear all form fields
        setFormData({
          name: "",
          email: "",
          message: ""
        })
        // Redirect to success page
        router.push("/contact/success")
      } else {
        toast.error("Something went wrong. Try again.")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      NProgress.done()
      setLoading(false)
    }
  }


  const faqs = [
    {
      question: "What can I expect at my first consultation?",
      answer: "During your first consultation, we'll discuss your project requirements, goals, and timeline. We'll provide an initial assessment and outline the next steps to move forward with your project."
    },
    {
      question: "What are your opening hours?",
      answer: "Our team is available Monday through Friday from 9:00 AM to 6:00 PM. We also offer flexible scheduling for consultations outside these hours when needed."
    },
    {
      question: "Do I need a referral?",
      answer: "No referral is necessary. You can contact us directly through our website, email, or phone to schedule a consultation and discuss your project requirements."
    },
  ]

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      {/* Header Section */}
      <div className="text-center ">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Get In Touch
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Have a project in mind or want to collaborate? We'd love to hear from you. 
          Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      {/* Contact Information Section */}
      <section className=" mb-16">
        <div className="px-8 py-12 mx-auto">
          <div className="grid grid-cols-1 gap-8 mt-10 md:grid-cols-3">
            <div className="text-center p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
              <span className="inline-block p-4 text-blue-600 rounded-full bg-blue-100/80 dark:bg-blue-900/30 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </span>
              <h2 className="mt-6 text-xl font-semibold text-gray-800 dark:text-white">Email</h2>
              <p className="mt-3 text-gray-600 dark:text-gray-300">Our friendly team is here to help.</p>
              <p className="mt-3 text-blue-600 dark:text-blue-400 font-medium text-lg">hello@merakiui.com</p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
              <span className="inline-block p-4 text-blue-600 rounded-full bg-blue-100/80 dark:bg-blue-900/30 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </span>
              <h2 className="mt-6 text-xl font-semibold text-gray-800 dark:text-white">Office</h2>
              <p className="mt-3 text-gray-600 dark:text-gray-300">Come say hello at our office HQ.</p>
              <p className="mt-3 text-blue-600 dark:text-blue-400 font-medium text-lg">100 Smith Street Collingwood VIC 3066 AU</p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
              <span className="inline-block p-4 text-blue-600 rounded-full bg-blue-100/80 dark:bg-blue-900/30 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </span>
              <h2 className="mt-6 text-xl font-semibold text-gray-800 dark:text-white">Phone</h2>
              <p className="mt-3 text-gray-600 dark:text-gray-300">Mon-Fri from 8am to 5pm.</p>
              <p className="mt-3 text-blue-600 dark:text-blue-400 font-medium text-lg">+1 (555) 000-0000</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Map Side by Side */}
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Send us a message</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Name *
                </label>
                <input 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Email *
                </label>
                <input 
                  name="email" 
                  type="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Message *
              </label>
              <textarea 
                name="message" 
                value={formData.message}
                onChange={handleInputChange}
                required 
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Tell us about your project or inquiry..."
              />
            </div>
            <button 
              type="submit"
              disabled={loading} 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Message...
                </span>
              ) : (
                "Send Message"
              )}
            </button>
            {message && (
              <div className="text-sm mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {message}
              </div>
            )}
          </form>
        </div>

        {/* Map Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-8 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Our Location</h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Pune, India</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Visit our office or reach out to us for a meeting
            </p>
          </div>
          <div className="h-96">
            <iframe
              title="Pune, India - Location"
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121059.04711156089!2d73.78056541037308!3d18.524603575903225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1705581234567!5m2!1sen!2sin"
              style={{ border: 0 }}
              allowFullScreen
            />
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Easy to find location with ample parking space</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
        <div className="px-8 py-12 mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white lg:text-4xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find answers to common questions about our services and processes
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-8 lg:mt-12 md:grid-cols-2 xl:grid-cols-3">
            {faqs.map((faq, index) => (
              <div key={index} className="group p-8 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 border border-gray-100 dark:border-gray-800">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="inline-block p-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl group-hover:from-blue-700 group-hover:to-blue-800 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
                      {faq.question}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Still have questions?{" "}
              <a href="#contact-form" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Contact us directly
              </a>
            </p>
          </div>
        </div>
      </section>
    </section>
  )
}