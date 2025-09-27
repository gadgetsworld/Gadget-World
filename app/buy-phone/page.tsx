"use client"

type Category = "phones" | "buds" | "smartwatch" | "headphones"
type Brand = "Apple" | "Samsung" | "OnePlus" | "Google" | "Xiaomi" | "Realme" | "Oppo" | "Vivo" | "Motorola" | "Asus"
import { useState } from "react"
import { brands } from "@/lib/data"
import router from "next/router"

const CATEGORIES = [
  { key: "phones", label: "Phones", icon: "📱" },
  { key: "buds", label: "Buds", icon: "🎧" },
  { key: "smartwatch", label: "Smartwatch", icon: "⌚" },
  { key: "headphones", label: "Headphones", icon: "🔊" },
]

const BRANDS = brands.map(b => b.name)

export default function BuyFlowPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [category, setCategory] = useState<string>("")
  const [brand, setBrand] = useState<string>("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [city, setCity] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
  setLoading(true); // Add this line
  const { default: NProgress } = await import("nprogress")
  const { toast } = await import("react-toastify")
  NProgress.start()
  if (!category || !brand || !name || !phone) {
    toast.error("Please fill required fields.")
    NProgress.done()
    setLoading(false); 
    return
  }
  const payload = { category, brand, name, phone, email, city, notes }
  try {
    const res = await fetch("/api/buy-intent", { method: "POST", body: JSON.stringify(payload) })
    const waText = `Buy Request\nCategory: ${category}\nBrand: ${brand}\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email || "-"}\nCity: ${city || "-"}\nNotes: ${notes || "-"}`
    if (typeof window !== "undefined") {
      const url = "https://wa.me/917018021841?text=" + encodeURIComponent(waText)
      window.open(url, "_blank", "noopener,noreferrer")
    }
    if (res.ok) {
      toast.success("Thanks! We'll contact you shortly.")
      setTimeout(() => router.push("/repair-phone/success"), 1500)
    } else {
      toast.error("Something went wrong. Please try again.")
    }
  } catch {
    toast.error("Network error. Please try again.")
  } finally {
    NProgress.done()
    setLoading(false); // Add this line
  }
}

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-16">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
          Find Your Perfect Device
        </h1>
        <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
          Tell us what you're looking for and we'll match you with the best options available.
        </p>
      </div>

      {/* Improved Progress Steps - Mobile Responsive */}
      <div className="mb-8 sm:mb-12">
        {/* Progress Bar */}
        <div className="mt-6 sm:mt-8 max-w-md mx-auto px-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>Step {step} of 3</span>
            <span>{Math.round(((step - 1) / 2) * 100)}% Complete</span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-6 md:p-8">
        {step === 1 && (
          <div>
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Choose a Category</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">What type of device are you looking for?</p>
            </div>
            
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                    category === c.key 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{c.icon}</div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">{c.label}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Browse our collection of {c.label.toLowerCase()}
                  </p>
                </button>
              ))}
            </div>
            
            <div className="flex justify-end mt-6 sm:mt-8">
              <button
                disabled={!category}
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105 text-sm sm:text-base"
              >
                Continue to Brand Selection
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Select Your Preferred Brand</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Choose from our trusted brands</p>
            </div>
            
             <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {BRANDS.map((b) => {
                // Find the brand object from your data file that matches the current brand `b`
                const brandData = brands.find((brandObject) => brandObject.name === b);

                return (
                  <button
                    key={b}
                    onClick={() => setBrand(b)}
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                      brand === b 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                    }`}
                  >
                    <div className="h-12 sm:h-16 rounded-lg grid place-items-center mb-2">
                      {/* Correctly use the image from the found brandData object */}
                      <img src={brandData?.image || ''} alt={b} className="h-10 sm:h-12 w-auto opacity-80" />
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white text-center text-xs sm:text-sm">{b}</div>
                  </button>
                );
              })}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
              <button
                onClick={() => setStep(1)}
                className="order-2 sm:order-1 w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Category
              </button>
              <button
                disabled={!brand}
                onClick={() => setStep(3)}
                className="order-1 sm:order-2 w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105 text-sm sm:text-base"
              >
                Continue to Details
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Contact Details</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                We'll use this information to contact you with the best options
              </p>
              <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 sm:gap-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Looking for: <span className="font-semibold capitalize">{category}</span> • <span className="font-semibold">{brand}</span>
              </div>
            </div>
            
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                  Full Name *
                </label>
                <input
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                  Phone Number *
                </label>
                <input
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="Your contact number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                  City
                </label>
                <input
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Your city"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                  Additional Notes
                </label>
                <textarea
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 text-sm sm:text-base"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific requirements, preferences, or questions..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
              <button
                onClick={() => setStep(2)}
                className="order-2 sm:order-1 w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Brand
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !name || !phone}
                className="order-1 sm:order-2 w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-400 disabled:to-green-500 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
                  <>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}