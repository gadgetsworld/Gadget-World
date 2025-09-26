"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RepairPhonePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setMessage(null)
    const payload = {
      brand: String(formData.get("brand") || ""),
      model: String(formData.get("model") || ""),
      issue: String(formData.get("issue") || ""),
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
    }
    const res = await fetch("/api/repair", { method: "POST", body: JSON.stringify(payload) })
    setLoading(false)
    if (res.ok) {
      setMessage("Thanks! Our technician will contact you shortly.")
      setTimeout(() => router.push("/"), 1500)
    } else {
      const err = await res.json().catch(() => ({}))
      setMessage(err?.error || "Something went wrong. Please try again.")
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-balance">Repair your phone</h1>
      <p className="text-sm text-muted-foreground mt-1">Book a repair with genuine parts and quick turnaround.</p>

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
            <label className="text-sm">Issue</label>
            <input
              name="issue"
              required
              className="mt-1 w-full rounded-md border bg-background p-2"
              placeholder="Screen, Battery, Camera..."
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Your Name</label>
            <input name="name" required className="mt-1 w-full rounded-md border bg-background p-2" />
          </div>
          <div>
            <label className="text-sm">Phone Number</label>
            <input name="phone" required className="mt-1 w-full rounded-md border bg-background p-2" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button disabled={loading} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">
            {loading ? "Submitting..." : "Book Repair"}
          </button>
          {message && <span className="text-sm">{message}</span>}
        </div>
      </form>
    </section>
  )
}
