"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    }
    const res = await fetch("/api/auth/register", { method: "POST", body: JSON.stringify(payload) })
    setLoading(false)
    if (res.ok) router.push("/")
    else setError((await res.json().catch(() => ({})))?.error || "Could not create account")
  }

  return (
    <section className="mx-auto max-w-sm px-4 py-10">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <form className="mt-6 grid gap-4" action={onSubmit}>
        <div>
          <label className="text-sm">Full name</label>
          <input name="name" required className="mt-1 w-full rounded-md border bg-background p-2" />
        </div>
        <div>
          <label className="text-sm">Email</label>
          <input name="email" type="email" required className="mt-1 w-full rounded-md border bg-background p-2" />
        </div>
        <div>
          <label className="text-sm">Password</label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="mt-1 w-full rounded-md border bg-background p-2"
          />
        </div>
        <button disabled={loading} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">
          {loading ? "Creating..." : "Sign up"}
        </button>
        {error && <div className="text-sm text-destructive">{error}</div>}
      </form>
      <p className="text-sm mt-3">
        Already have an account?{" "}
        <a href="/login" className="underline">
          Log in
        </a>
      </p>
    </section>
  )
}
