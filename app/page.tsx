"use client"

import React from "react"
import Link from "next/link"

function DotNav({ count, index, setIndex }: { count: number; index: number; setIndex: (i: number) => void }) {
  return (
    <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          aria-label={`Go to slide ${i + 1}`}
          className={`h-2 w-2 rounded-full transition-colors ${i === index ? "bg-primary" : "bg-muted"}`}
          onClick={() => setIndex(i)}
        />
      ))}
    </div>
  )
}

function Hero() {
  const slides = [
    {
      title: "Sell your phone in minutes",
      desc: "Instant quote, free pickup, fast payout. Zero hidden fees.",
      ctaA: { href: "/sell-phone", label: "Get Instant Quote" },
      ctaB: { href: "/buy-phone", label: "Shop Refurbs" },
      img: "/smartphone-trade-in-banner.jpg",
    },
    {
      title: "Certified refurbished phones",
      desc: "Quality-checked devices with warranty at great prices.",
      ctaA: { href: "/buy-phone", label: "Browse Phones" },
      ctaB: { href: "/repair-phone", label: "Repair Phone" },
      img: "/refurbished-smartphones-banner.jpg",
    },
    {
      title: "Expert phone repairs",
      desc: "Genuine parts, transparent pricing, quick turnaround.",
      ctaA: { href: "/repair-phone", label: "Book a Repair" },
      ctaB: { href: "/sell-phone", label: "Sell Device" },
      img: "/phone-repair-service-banner.jpg",
    },
  ]
  const [index, setIndex] = React.useState(0)
  React.useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 3500)
    return () => clearInterval(id)
  }, [])

  const s = slides[index]
  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 grid gap-8 md:grid-cols-2 items-center">
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
          <h1 className="text-balance text-3xl md:text-5xl font-semibold">{s.title}</h1>
          <p className="mt-3 text-muted-foreground">{s.desc}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={s.ctaA.href} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">
              {s.ctaA.label}
            </Link>
            <Link href={s.ctaB.href} className="px-4 py-2 rounded-md bg-secondary text-sm">
              {s.ctaB.label}
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <Stat value="250k+" label="Devices Traded" />
            <Stat value="4.8★" label="Customer Rating" />
            <Stat value="48h" label="Avg. Payout" />
          </div>
        </div>
        <div className="relative animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="overflow-hidden rounded-xl border bg-card">
            <img src={s.img || "/placeholder.svg"} alt="Gadgets World highlight" className="block h-auto w-full" />
          </div>
          <DotNav count={slides.length} index={index} setIndex={setIndex} />
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border bg-card p-4 text-center">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

function ActionCards() {
  const items = [
    {
      title: "Sell Device",
      desc: "Instant quotes, doorstep pickup, quick payment.",
      href: "/sell-phone",
      img: "/sell-your-phone.jpg",
      primary: true,
    },
    {
      title: "Repair Phone",
      desc: "Genuine parts, expert technicians, fast service.",
      href: "/repair-phone",
      img: "/repair-phone.jpg",
    },
    {
      title: "Buy Refurbished",
      desc: "Certified devices with warranty and great prices.",
      href: "/buy-phone",
      img: "/buy-refurbished-phone.jpg",
    },
  ]
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl font-semibold text-balance">What do you want to do?</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="rounded-xl border p-6 bg-card animate-in fade-in duration-500">
            <div className="h-40 rounded-md bg-muted grid place-items-center overflow-hidden">
              <img src={it.img || "/placeholder.svg"} alt={it.title} className="h-full w-full object-cover" />
            </div>
            <h3 className="mt-4 font-semibold">{it.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{it.desc}</p>
            <Link
              href={it.href}
              className={`mt-4 inline-block text-sm px-3 py-2 rounded-md ${
                it.primary ? "bg-primary text-primary-foreground" : "bg-secondary"
              }`}
            >
              {it.primary ? "Get Started" : "Learn More"}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

function BannerCTA() {
  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-6 md:grid-cols-[1fr_320px] items-center">
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
          <h2 className="text-2xl font-semibold text-balance">Free Pickup. Fast Payout. Trusted Service.</h2>
          <p className="mt-2 text-muted-foreground">
            We handle everything from doorstep pickup to secure payments. Join thousands of happy customers.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-sm text-muted-foreground">Why choose us</div>
          <ul className="mt-3 grid gap-2 text-sm">
            <li>• Transparent, instant pricing</li>
            <li>• Genuine parts for repairs</li>
            <li>• Warranty on refurbished phones</li>
            <li>• Friendly, responsive support</li>
          </ul>
          <Link
            href="/sell-phone"
            className="mt-4 inline-block px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm"
          >
            Get Instant Quote
          </Link>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const data = [
    { quote: "Sold my old iPhone and got paid the same day. Super smooth!", name: "Rohit" },
    { quote: "Repair service was top-notch and transparent.", name: "Sana" },
    { quote: "Bought a refurbished phone—like new and great value.", name: "Karan" },
  ]
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold text-balance">What customers say</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {data.map((t) => (
            <div key={t.name} className="rounded-xl border p-5 bg-card animate-in fade-in duration-500">
              <p className="text-pretty leading-relaxed">“{t.quote}”</p>
              <div className="mt-3 text-sm text-muted-foreground">— {t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div>
      <Hero />
      <ActionCards />
      <BannerCTA />
      <Testimonials />
    </div>
  )
}
