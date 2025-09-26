"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SellAutomobilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setMessage(null)
    const payload = {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      city: String(formData.get("city") || ""),
      brand: String(formData.get("brand") || ""),
      model: String(formData.get("model") || ""),
      year: String(formData.get("year") || ""),
    }
    const res = await fetch("/api/automobiles", { method: "POST", body: JSON.stringify(payload) })
    setLoading(false)
    if (res.ok) {
      setMessage("Thanks! Our team will contact you about your vehicle.")
      setTimeout(() => router.push("/"), 1500)
    } else {
      setMessage("Something went wrong. Please try again.")
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Sell your automobile</h1>
      <p className="text-sm text-muted-foreground mt-1">Submit a quick lead and we will reach out.</p>

      <form className="mt-6 grid gap-4" action={onSubmit}>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm">Brand</label>
            <input name="brand" required className="mt-1 w-full rounded-md border bg-background p-2" />
          </div>
          <div>
            <label className="text-sm">Model</label>
            <input name="model" required className="mt-1 w-full rounded-md border bg-background p-2" />
          </div>
          <div>
            <label className="text-sm">Year</label>
            <input name="year" className="mt-1 w-full rounded-md border bg-background p-2" />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm">Your Name</label>
            <input name="name" required className="mt-1 w-full rounded-md border bg-background p-2" />
          </div>
          <div>
            <label className="text-sm">Phone</label>
            <input name="phone" required className="mt-1 w-full rounded-md border bg-background p-2" />
          </div>
          <div>
            <label className="text-sm">City</label>
            <input name="city" className="mt-1 w-full rounded-md border bg-background p-2" />
          </div>
        </div>
        <button disabled={loading} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">
          {loading ? "Submitting..." : "Submit Lead"}
        </button>
        {message && <div className="text-sm mt-2">{message}</div>}
      </form>
    </section>
  )
}
