"use client"

type Category = "phones" | "buds" | "smartwatch" | "headphones"
type Brand = "Apple" | "Samsung" | "OnePlus" | "Google" | "Xiaomi" | "Realme" | "Oppo" | "Vivo" | "Motorola" | "Asus"
import { useState } from "react"
import { brands } from "@/lib/data"

const CATEGORIES = [
  { key: "phones", label: "Phones" },
  { key: "buds", label: "Buds" },
  { key: "smartwatch", label: "Smartwatch" },
  { key: "headphones", label: "Headphones" },
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

  async function handleSubmit() {
    const { default: NProgress } = await import("nprogress")
    const { toast } = await import("react-toastify")
    NProgress.start()
    if (!category || !brand || !name || !phone) {
      toast.error("Please fill required fields.")
      NProgress.done()
      return
    }
    // Send notification via server (email) + open WhatsApp chat
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
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      NProgress.done()
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-balance">Buy gadgets</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Choose a category and brand. We’ll reach out with availability and pricing.
      </p>

      <ol className="mt-6 grid gap-2 md:grid-cols-3 text-xs text-muted-foreground">
        {["Category", "Brand", "Your details"].map((label, i) => {
          const s = (i + 1) as 1 | 2 | 3
          const active = s === step
          const done = s < step
          return (
            <li
              key={label}
              className={`rounded-md border p-2 text-center ${
                active ? "bg-primary text-primary-foreground" : done ? "bg-muted" : "bg-card"
              }`}
            >
              {label}
            </li>
          )
        })}
      </ol>

      <div className="mt-6 grid gap-6">
        {step === 1 && (
          <section>
            <h2 className="font-semibold">Select a category</h2>
            <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-4">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className={`rounded-xl border p-4 text-sm text-left hover:shadow-sm transition ${
                    category === c.key ? "ring-2 ring-primary" : ""
                  }`}
                  aria-pressed={category === c.key}
                >
                  <div className="h-24 bg-muted grid place-items-center rounded-md">
                    <span className="text-lg font-semibold">{c.label}</span>
                  </div>
                  <div className="mt-3 font-semibold">{c.label}</div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-end">
              <button
                disabled={!category}
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h2 className="font-semibold">Select brand</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 md:grid-cols-4">
              {BRANDS.map((b) => (
                <button
                  key={b}
                  onClick={() => setBrand(b)}
                  className={`rounded-xl border p-4 text-sm text-left hover:shadow-sm transition ${
                    brand === b ? "ring-2 ring-primary" : ""
                  }`}
                  aria-pressed={brand === b}
                >
                  <div className="h-24 bg-muted grid place-items-center rounded-md">
                    <img src="/generic-brand-logo.png" alt={`${b} logo`} className="h-10 w-auto" />
                  </div>
                  <div className="mt-3 font-semibold">{b}</div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button className="text-sm underline" onClick={() => setStep(1)}>
                Back
              </button>
              <button
                disabled={!brand}
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <h2 className="font-semibold">Your details</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Category: <span className="font-medium">{category}</span> • Brand:{" "}
              <span className="font-medium">{brand}</span>
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm">Name</label>
                <input
                  className="mt-1 w-full rounded-md border bg-background p-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm">Phone</label>
                <input
                  className="mt-1 w-full rounded-md border bg-background p-2"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm">Email (optional)</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-md border bg-background p-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm">City (optional)</label>
                <input
                  className="mt-1 w-full rounded-md border bg-background p-2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm">Notes (optional)</label>
                <textarea
                  className="mt-1 w-full rounded-md border bg-background p-2 h-24"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any preferences or questions"
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button className="text-sm underline" onClick={() => setStep(2)}>
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm"
              >
                Submit
              </button>
            </div>
          </section>
        )}
      </div>
    </section>
  )
}
