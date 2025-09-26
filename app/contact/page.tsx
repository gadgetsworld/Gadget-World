"use client"

import { useState } from "react"

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    const { default: NProgress } = await import("nprogress")
    const { toast } = await import("react-toastify")
    NProgress.start()
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      message: String(formData.get("message") || ""),
    }
    try {
      const res = await fetch("/api/contact", { method: "POST", body: JSON.stringify(payload) })
      const waText = `Contact Form\nName: ${payload.name}\nEmail: ${payload.email}\nMessage: ${payload.message}`
      if (typeof window !== "undefined") {
        const url = "https://wa.me/917018021841?text=" + encodeURIComponent(waText)
        window.open(url, "_blank", "noopener,noreferrer")
      }
      if (res.ok) {
        toast.success("Thanks! We will get back to you soon.")
      } else {
        toast.error("Something went wrong. Try again.")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      NProgress.done()
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-balance">Contact us</h1>
      <p className="text-sm text-muted-foreground mt-1">We usually respond within 24 hours.</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <form className="grid gap-4" action={onSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Name</label>
              <input name="name" required className="mt-1 w-full rounded-md border bg-background p-2" />
            </div>
            <div>
              <label className="text-sm">Email</label>
              <input name="email" type="email" required className="mt-1 w-full rounded-md border bg-background p-2" />
            </div>
          </div>
          <div>
            <label className="text-sm">Message</label>
            <textarea name="message" required className="mt-1 w-full rounded-md border bg-background p-2 h-32" />
          </div>
          <button disabled={loading} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">
            {loading ? "Sending..." : "Send Message"}
          </button>
          {message && <div className="text-sm mt-2">{message}</div>}
        </form>

        <div className="rounded-xl border bg-card overflow-hidden">
          <iframe
            title="Pune, India - Location"
            className="w-full h-72 md:h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Pune,India&output=embed"
          />
        </div>
      </div>
    </section>
  )
}
