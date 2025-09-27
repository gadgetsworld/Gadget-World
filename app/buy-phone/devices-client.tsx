"use client"

import useSWR from "swr"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const BRANDS = ["Apple", "Samsung", "OnePlus", "Google", "Xiaomi", "Realme", "Oppo", "Vivo", "Motorola", "Asus"]

const WA_PHONE = "917018021841"

export default function DevicesClient({ initial }: { initial: any[] }) {
  const [brand, setBrand] = useState("")
  const { data } = useSWR(`/api/devices${brand ? `?brand=${encodeURIComponent(brand)}` : ""}`, fetcher, {
    fallbackData: { devices: initial },
  })
  const devices = data?.devices || []

  const [activeId, setActiveId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", phone: "", city: "" })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function submitBuyIntent(d: any) {
    setSubmitting(true)
    setDone(false)
    const res = await fetch("/api/buy-intent", {
      method: "POST",
      body: JSON.stringify({
        deviceId: d._id,
        title: d.title,
        price: d.price,
        name: form.name,
        phone: form.phone,
        email: null,
        address: null,
        city: form.city,
        notes: null,
      }),
    })
    setSubmitting(false)
    if (res.ok) {
      setDone(true)
      setForm({ name: "", phone: "", city: "" })
      setTimeout(() => setActiveId(null), 1200)
    } else {
      alert("Something went wrong. Please try again.")
    }
  }

  function whatsappOrder(d: any) {
    if (!form.name || !form.phone) {
      alert("Please enter your name and phone number.")
      return
    }
    const msg = [
      `Buy Request`,
      `Device: ${d.title}`,
      `Price: ₹${Number(d.price).toLocaleString()}`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.city ? `City: ${form.city}` : null,
    ]
      .filter(Boolean)
      .join("\n")
    const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`
    window.open(url, "_blank")
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Buy Refurbished Devices
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover high-quality refurbished devices with warranty. All devices are thoroughly tested and certified.
        </p>
      </div>

      {/* Brand Selection */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          Filter by Brand
        </h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
          {BRANDS.map((b) => (
            <button
              key={b}
              onClick={() => setBrand((curr) => (curr === b ? "" : b))}
              className={`rounded-2xl border-2 p-6 text-center transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${
                brand === b 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md" 
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300"
              }`}
              aria-pressed={brand === b}
            >
              <div className="h-16 bg-gray-100 dark:bg-gray-700 grid place-items-center rounded-xl mb-3">
                <img 
                  src="/generic-brand-logo.png" 
                  alt={`${b} logo`} 
                  className="h-8 w-auto opacity-80" 
                />
              </div>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">{b}</div>
              <div className={`text-xs mt-1 ${
                brand === b ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
              }`}>
                {brand === b ? "Selected" : "Click to filter"}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Devices Grid */}
      {devices.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No devices found</h3>
          <p className="text-gray-600 dark:text-gray-300">
            {brand ? `No ${brand} devices available at the moment.` : "Please check back later for new arrivals."}
          </p>
          {brand && (
            <button
              onClick={() => setBrand("")}
              className="mt-4 px-4 py-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Available Devices {brand && `- ${brand}`}
            </h2>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {devices.length} device{devices.length !== 1 ? 's' : ''} found
            </span>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {devices.map((d: any) => (
              <div key={d._id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:shadow-lg transition-all duration-200">
                <div className="h-48 bg-gray-50 dark:bg-gray-700 rounded-xl grid place-items-center mb-4 overflow-hidden">
                  <img
                    src={d.images?.[0] || "/placeholder.svg?height=120&width=200&query=Phone image placeholder"}
                    alt={d.title}
                    className="h-32 w-auto object-contain"
                  />
                </div>
                
                <div className="mb-3">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">{d.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{d.storage}</span>
                    <span className="text-gray-400">•</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      d.condition === 'Excellent' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : d.condition === 'Good'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {d.condition}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{d.price.toLocaleString()}</span>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">In Stock</span>
                </div>

                <button
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
                  onClick={() => {
                    setActiveId((id) => (id === d._id ? null : d._id))
                    setDone(false)
                  }}
                >
                  {activeId === d._id ? "Close Details" : "Buy Now"}
                </button>

                {activeId === d._id && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                    {done ? (
                      <div className="text-center py-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-green-600 dark:text-green-400 font-semibold">Thank You!</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">We'll contact you shortly</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <input
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Full name *"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                        <input
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Phone number *"
                          inputMode="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                        <input
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="City (optional)"
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                        />

                        <button
                          className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                          onClick={() => whatsappOrder(d)}
                          disabled={!form.name || !form.phone}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          Order via WhatsApp
                        </button>

                        <button
                          disabled={submitting || !form.name || !form.phone}
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          onClick={() => submitBuyIntent(d)}
                        >
                          {submitting ? (
                            <>
                              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              Request Callback
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}