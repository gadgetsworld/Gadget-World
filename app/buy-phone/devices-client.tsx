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
    // Prefer opening in new tab for better UX; on mobile it opens WA
    window.open(url, "_blank")
  }

  return (
    <div className="mt-6">
      {/* Brand selection grid */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        {BRANDS.map((b) => (
          <button
            key={b}
            onClick={() => setBrand((curr) => (curr === b ? "" : b))}
            className={`rounded-xl border p-4 text-left hover:shadow-sm transition ${brand === b ? "ring-2 ring-primary" : ""}`}
            aria-pressed={brand === b}
          >
            <div className="h-20 bg-muted grid place-items-center rounded-md">
              <img src="/generic-brand-logo.png" alt={`${b} logo`} className="h-10 w-auto" />
            </div>
            <div className="mt-3 font-semibold text-sm">{b}</div>
            <div className="text-xs text-muted-foreground">{brand === b ? "Selected" : "Tap to filter"}</div>
          </button>
        ))}
      </div>

      {/* Devices grid */}
      {devices.length === 0 ? (
        <div className="mt-6 text-sm text-muted-foreground">No devices found. Please check back later.</div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {devices.map((d: any) => (
            <div key={d._id} className="rounded-xl border p-4 bg-card">
              <div className="h-36 rounded-md bg-muted grid place-items-center overflow-hidden">
                <img
                  src={d.images?.[0] || "/placeholder.svg?height=120&width=200&query=Phone image placeholder"}
                  alt={d.title}
                  className="h-24 w-auto"
                />
              </div>
              <div className="mt-3 font-semibold">{d.title}</div>
              <div className="text-sm text-muted-foreground">
                {d.storage} • {d.condition}
              </div>
              <div className="mt-2 font-semibold">₹{d.price.toLocaleString()}</div>
              <button
                className="mt-3 w-full px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm"
                onClick={() => {
                  setActiveId((id) => (id === d._id ? null : d._id))
                  setDone(false)
                }}
              >
                {activeId === d._id ? "Close" : "Buy Now"}
              </button>

              {activeId === d._id && (
                <div className="mt-4 rounded-lg border p-3 bg-background">
                  {done ? (
                    <div className="text-sm">Thanks! We’ll contact you shortly.</div>
                  ) : (
                    <div className="grid gap-2">
                      <input
                        className="w-full rounded-md border bg-background p-2 text-sm"
                        placeholder="Full name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                      <input
                        className="w-full rounded-md border bg-background p-2 text-sm"
                        placeholder="Phone number"
                        inputMode="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                      <input
                        className="w-full rounded-md border bg-background p-2 text-sm"
                        placeholder="City (optional)"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                      />

                      <button
                        className="mt-1 px-3 py-2 rounded-md bg-green-600 text-white text-sm"
                        onClick={() => whatsappOrder(d)}
                      >
                        Order via WhatsApp
                      </button>

                      <button
                        disabled={submitting || !form.name || !form.phone}
                        className="px-3 py-2 rounded-md bg-secondary text-sm disabled:opacity-50"
                        onClick={() => submitBuyIntent(d)}
                      >
                        {submitting ? "Submitting..." : "Request Callback"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
