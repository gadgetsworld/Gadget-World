"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RepairPhonePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    const { default: NProgress } = await import("nprogress")
    const { toast } = await import("react-toastify")
    NProgress.start()
    setLoading(true)
    const payload = {
      brand: String(formData.get("brand") || ""),
      model: String(formData.get("model") || ""),
      issue: String(formData.get("issue") || ""),
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
    }
    // WhatsApp message logic
    const waText = `Repair Request\nBrand: ${payload.brand}\nModel: ${payload.model}\nIssue: ${payload.issue}\nName: ${payload.name}\nPhone: ${payload.phone}`
    if (typeof window !== "undefined") {
      const url = "https://wa.me/919882154418?text=" + encodeURIComponent(waText)
      window.open(url, "_blank", "noopener,noreferrer")
    }
    try {
      const res = await fetch("/api/repair", { method: "POST", body: JSON.stringify(payload) })
      if (res.ok) {
        toast.success("Thanks! Our technician will contact you shortly.")
        setTimeout(() => router.push("/repair-phone/success"), 1500)
      } else {
        const err = await res.json().catch(() => ({}))
        toast.error(err?.error || "Something went wrong. Please try again.")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      NProgress.done()
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Professional Phone Repair Service
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Get your device fixed with genuine parts, expert technicians, and quick turnaround time. 
          We offer doorstep service and warranty on all repairs.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="text-center p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quick Service</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Same-day repair available for most devices</p>
        </div>

        <div className="text-center p-6 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Genuine Parts</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">High-quality original components used</p>
        </div>

        <div className="text-center p-6 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Doorstep Service</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Free pickup and delivery available</p>
        </div>
      </div>

      {/* Repair Form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Book Your Repair</h2>
          <p className="text-gray-600 dark:text-gray-300">Fill in the details below and we'll contact you within 30 minutes</p>
        </div>

        <form className="space-y-6" action={onSubmit}>
          {/* Device Information */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Brand *
              </label>
              <input 
                name="brand" 
                required 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., Apple, Samsung"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Model *
              </label>
              <input 
                name="model" 
                required 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., iPhone 14, Galaxy S23"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Issue *
              </label>
              <input
                name="issue"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Screen, Battery, Camera..."
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Your Name *
              </label>
              <input 
                name="name" 
                required 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Phone Number *
              </label>
              <input 
                name="phone" 
                required 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Your contact number"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4 pt-4">
            <button 
              disabled={loading} 
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Book Repair Now
                </>
              )}
            </button>
            {message && (
              <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {message}
              </span>
            )}
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">What happens next?</p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                After submitting this form, you'll be redirected to WhatsApp where our technician will confirm your repair details and schedule a convenient time for service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}