"use client"

import React from "react"
import Link from "next/link"
import { brands, testimonials as testimonialsData } from "@/lib/data"


function DotNav({ count, index, setIndex }: { count: number; index: number; setIndex: (i: number) => void }) {
  return (
    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          aria-label={`Go to slide ${i + 1}`}
          className={`h-2 w-2 rounded-full transition-all duration-300 transform hover:scale-125 ${
            i === index ? "bg-primary scale-125" : "bg-muted"
          }`}
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
      ctaA: { href: "/sell-phone", label: "Sell a Device" },
      ctaB: { href: "/repair-phone", label: "Repair Device" },
      img: "/buy-refurbished-phones.jpg",
      gradient: "from-blue-600 to-purple-600",
    },
    {
      title: "Expert phone repairs",
      desc: "Genuine parts, transparent pricing, quick turnaround.",
      ctaA: { href: "/repair-phone", label: "Book a Repair" },
      ctaB: { href: "/sell-phone", label: "Sell Device" },
      img: "/oneplus-9.jpg",
      gradient: "from-orange-600 to-red-600",
    },
  ]
  const [index, setIndex] = React.useState(0)
  React.useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 3500)
    return () => clearInterval(id)
  }, [])

  const s = slides[index]
  return (
    <section className={`bg-gradient-to-br ${s.gradient} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-20 grid gap-8 md:grid-cols-2 items-center">
        <div className="animate-in fade-in slide-in-from-left-8 duration-700">
          <h1 className="text-balance text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {s.title}
          </h1>
          <p className="mt-4 text-lg text-white/90">{s.desc}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link 
              href={s.ctaA.href} 
              className="px-8 py-3 rounded-xl bg-white text-gray-900 font-semibold text-lg hover:scale-105 transform transition-all duration-300 shadow-2xl hover:shadow-3xl text-center"
            >
              {s.ctaA.label}
            </Link>
            <Link 
              href={s.ctaB.href} 
              className="px-8 py-3 rounded-xl border-2 border-white text-white font-semibold text-lg hover:bg-white/10 transform transition-all duration-300 text-center"
            >
              {s.ctaB.label}
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <Stat value="250k+" label="Devices Traded" />
            <Stat value="4.8★" label="Customer Rating" />
            <Stat value="48h" label="Avg. Payout" />
          </div>
        </div>
        <div className="relative animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="overflow-hidden rounded-2xl border-4 border-white/20 bg-white/10 backdrop-blur-sm shadow-2xl">
            <img 
              src={s.img || "/placeholder.svg"} 
              alt="Gadgets World highlight" 
              className="block h-auto w-full transform hover:scale-105 transition-transform duration-700"
            />
          </div>
          <DotNav count={slides.length} index={index} setIndex={setIndex} />
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-4 text-center text-white">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-white/80">{label}</div>
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
      icon: "💰",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Repair Device",
      desc: "Genuine parts, expert technicians, fast service.",
      href: "/repair-phone",
      img: "/repair-phone.jpg",
      icon: "🔧",
      gradient: "from-green-500 to-emerald-500",
    },
  ]
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">What do you want to do?</h2>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Choose from our premium services designed to give you the best experience
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((it, index) => (
          <div 
            key={it.title} 
            className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 animate-in fade-in"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${it.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
            <div className="relative p-6">
              <div className="text-4xl mb-4">{it.icon}</div>
              <div className="h-40 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 overflow-hidden mb-4">
                <img 
                  src={it.img || "/placeholder.svg"} 
                  alt={it.title} 
                  className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{it.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{it.desc}</p>
              <Link
                href={it.href}
                className={`mt-6 inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  it.primary 
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl" 
                    : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                }`}
              >
                {it.primary ? "Sell Device" : "Repair Device"}
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function BannerCTA() {
  return (
    <section className="bg-gradient-to-tl from-gray-600 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
      <div className="relative mx-auto max-w-7xl px-4 py-16 grid gap-8 lg:grid-cols-2 items-center">
        <div className="animate-in fade-in slide-in-from-left-8 duration-700">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Free Pickup. Fast Payout. Trusted Service.
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            We handle everything from doorstep pickup to secure payments. Join thousands of happy customers.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { value: "24h", label: "Quick Response" },
              { value: "100%", label: "Secure Payment" },
              { value: "500+", label: "Cities Served" },
              { value: "4.8★", label: "Rating" }
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-8 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="text-sm text-gray-400 font-semibold uppercase tracking-wide">Why choose us</div>
          <ul className="mt-6 space-y-4">
            {[
              "Transparent, instant pricing",
              "Genuine parts for repairs",
              "Warranty on refurbished phones",
              "Friendly, responsive support",
              "Free doorstep pickup",
              "Instant payment processing"
            ].map((item, i) => (
              <li key={i} className="flex items-center text-white">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/sell-phone"
            className="mt-8 w-full inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:scale-105 transform transition-all duration-300 shadow-lg"
          >
            Sell Your Device
          </Link>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const [index, setIndex] = React.useState(0)
  React.useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonialsData.length), 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">What Our Customers Say</h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">Trusted by thousands of satisfied customers</p>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700">
            <div key={index} className="p-8 md:p-12 animate-in fade-in duration-500">
              <div className="flex items-center justify-center mb-6">
                <div className="flex text-yellow-400 text-2xl">
                  {"★".repeat(5)}
                </div>
              </div>
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 text-center leading-relaxed italic">
                "{testimonialsData[index].text}"
              </p>
              <div className="mt-8 flex items-center justify-center">
                <img 
                  src={testimonialsData[index].image} 
                  alt={testimonialsData[index].name} 
                  className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
                />
                <div className="ml-4 text-left">
                  <div className="font-bold text-gray-900 dark:text-white">{testimonialsData[index].name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Verified Customer</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center gap-3">
            {testimonialsData.map((_, i) => (
              <button
                key={i}
                className={`h-3 w-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                  i === index ? "bg-blue-600 scale-125" : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function BrandsSection() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  
  const brandGroups = [];
  for (let i = 0; i < brands.length; i += 5) {
    brandGroups.push(brands.slice(i, i + 5));
  }

  // Single useEffect for auto-sliding
  React.useEffect(() => {
    const timer = setInterval(() => {
      if (!isTransitioning) {
        handleNext();
      }
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, [brandGroups.length, isTransitioning]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % brandGroups.length);
    setTimeout(() => setIsTransitioning(false), 700); // Match transition duration
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + brandGroups.length) % brandGroups.length);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Trusted Brands</h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">We work with all major smartphone brands</p>
        </div>

        {/* Brand Carousel */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-6 md:p-8">
          <div className="relative h-32 md:h-40 overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {brandGroups.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className="flex-shrink-0 w-full grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 items-center justify-center px-2"
                >
                  {group.map((brand, brandIndex) => (
                    <div 
                      key={brand.name} 
                      className="flex flex-col items-center justify-center p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700"
                    >
                      <div className="h-12 w-12 md:h-14 md:w-14 mb-2 md:mb-3 flex items-center justify-center rounded-lg p-2">
                        <img 
                          src={brand.image} 
                          alt={brand.name} 
                          className="h-10 w-auto max-w-full object-contain filter hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                      <div className="font-semibold text-xs md:text-sm text-center text-gray-900 dark:text-white leading-tight">
                        {brand.name}
                      </div>
                      <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 text-center mt-1 leading-tight">
                        {brand.description}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Arrows - Only show if multiple slides */}
          {brandGroups.length > 1 && (
            <>
              <button 
                onClick={handlePrev}
                disabled={isTransitioning}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-700 rounded-full p-2 z-10 shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous brands"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5 text-gray-800 dark:text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button 
                onClick={handleNext}
                disabled={isTransitioning}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-700 rounded-full p-2 z-10 shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next brands"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5 text-gray-800 dark:text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}

          {/* Navigation Dots - Only show if multiple slides */}
          {brandGroups.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {brandGroups.map((_, i) => (
                <button
                  key={i}
                  disabled={isTransitioning}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentSlide 
                      ? "bg-blue-600 w-6 md:w-8 scale-110" 
                      : "bg-gray-300 dark:bg-gray-600 w-2 hover:bg-gray-400 dark:hover:bg-gray-500"
                  } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={() => goToSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === currentSlide ? 'true' : 'false'}
                />
              ))}
            </div>
          )}
        </div>

        {/* Brand Promotions */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Apple Premium Partner",
              desc: "Certified Apple device trade-in and repair services",
              icon: "🍎",
              color: "from-teal-500 to-blue-700"
            },
            {
              title: "Samsung Authorized",
              desc: "Official Samsung repair and buyback services",
              icon: "📱",
              color: "from-violet-500 to-blue-700"
            },
            {
              title: "Multi-Brand Experts",
              desc: "Expert services for all major smartphone brands",
              icon: "⭐",
              color: "from-purple-500 to-pink-500"
            }
          ].map((promo, i) => (
            <div 
              key={i} 
              className={`bg-gradient-to-tl ${promo.color} rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 animate-in fade-in`}
              style={{ animationDelay: `${i * 200}ms` }}
            >
              <div className="text-3xl mb-3">{promo.icon}</div>
              <h3 className="font-bold text-lg mb-2">{promo.title}</h3>
              <p className="text-white/80 text-sm">{promo.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <ActionCards />
      <BannerCTA />
      <BrandsSection />
      <Testimonials />
    </div>
  )
}