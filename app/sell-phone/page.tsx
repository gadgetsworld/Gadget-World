"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

type DeviceType = "phone" | "laptop" | "tablet"
type Brand = "Apple" | "Samsung" | "OnePlus" | "Google" | "Xiaomi" | "Realme" | "Oppo" | "Vivo" | "Motorola" | "Asus"

type Variant = string

type Model = {
  name: string
  image: string
  variants: Variant[]
  basePrices: Record<Variant, number> // INR baseline for each variant
}

type Catalog = Record<Brand, Model[]>

// Minimal sample catalog; expand as needed
const CATALOG: Catalog = {
  Apple: [
    {
      name: "iPhone 13",
      image: "/iphone-13.png",
      variants: ["4/128GB", "4/256GB"],
      basePrices: { "4/128GB": 36000, "4/256GB": 39500 },
    },
    {
      name: "iPhone 12",
      image: "/iphone-12.png",
      variants: ["4/64GB", "4/128GB"],
      basePrices: { "4/64GB": 27000, "4/128GB": 30000 },
    },
  ],
  Samsung: [
    {
      name: "Galaxy S21",
      image: "/galaxy-s21.jpg",
      variants: ["8/128GB", "12/256GB"],
      basePrices: { "8/128GB": 30000, "12/256GB": 33500 },
    },
  ],
  OnePlus: [
    {
      name: "OnePlus 9",
      image: "/oneplus-9.jpg",
      variants: ["8/128GB", "12/256GB"],
      basePrices: { "8/128GB": 23000, "12/256GB": 26000 },
    },
  ],
  Google: [
    {
      name: "Pixel 6",
      image: "/pixel-6.jpg",
      variants: ["8/128GB"],
      basePrices: { "8/128GB": 28500 },
    },
  ],
  Xiaomi: [],
  Realme: [],
  Oppo: [],
  Vivo: [],
  Motorola: [],
  Asus: [
    {
      name: "ROG Phone 2 ZS660KL",
      image: "/rog-phone-2.jpg",
      variants: ["8/128GB", "12/512GB"],
      basePrices: { "8/128GB": 18000, "12/512GB": 23000 },
    },
  ],
}

type ScreenDetails = {
  touchWorking: "yes" | "no" | ""
  deadSpots: "none" | "small" | "large" | ""
  visibleLines: "none" | "some" | "many" | ""
  physical: "fine" | "cracked" | "shattered" | ""
}

type BodyCondition = "minor-scratches" | "major-scratches" | "heavy-dents" | "cracked-back" | "bent-panel" | "none"

type FunctionalIssue =
  | "front-camera"
  | "back-camera"
  | "volume-button"
  | "fingerprint"
  | "wifi"
  | "battery"
  | "speaker"
  | "power-button"
  | "charging-port"
  | "face-sensor"
  | "silent-button"
  | "audio-receiver"

type Accessories = {
  charger: boolean
  boxSameImei: boolean
  billSameImei: boolean
}

type Evaluation = {
  canCall: "yes" | "no" | ""
  screenDefect: "yes" | "no" | ""
  bodyDefect: "yes" | "no" | ""
  underWarranty: "yes" | "no" | ""
  gstBillAvailable: "yes" | "no" | ""
  screenDetails: ScreenDetails
  bodyCondition: BodyCondition
  functionalIssues: FunctionalIssue[]
  accessories: Accessories
}

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7

function computeEstimate(brand: Brand | "", model: string, variant: Variant, evaluation: Evaluation) {
  // baseline
  let base = 0
  if (brand && model && variant) {
    const models = CATALOG[brand] || []
    const m = models.find((mm) => mm.name === model)
    if (m) base = m.basePrices[variant] || 0
  }

  if (!base) return 0

  let price = base

  // Primary checks
  if (evaluation.canCall === "no") price *= 0.8 // -20%
  if (evaluation.screenDefect === "yes") price *= 0.85 // -15%

  // Screen details (only if screen defective)
  if (evaluation.screenDefect === "yes") {
    const s = evaluation.screenDetails
    if (s.touchWorking === "no") price *= 0.8 // -20%
    if (s.deadSpots === "small") price *= 0.95 // -5%
    if (s.deadSpots === "large") price *= 0.9 // -10%
    if (s.visibleLines === "some") price *= 0.95 // -5%
    if (s.visibleLines === "many") price *= 0.9 // -10%
    if (s.physical === "cracked") price *= 0.75 // -25%
    if (s.physical === "shattered") price *= 0.6 // -40%
  }

  // Body condition
  if (evaluation.bodyDefect === "yes") price *= 0.9 // -10%
  switch (evaluation.bodyCondition) {
    case "major-scratches":
      price *= 0.95
      break
    case "heavy-dents":
      price *= 0.9
      break
    case "cracked-back":
      price *= 0.85
      break
    case "bent-panel":
      price *= 0.8
      break
    default:
      break
  }

  // Functional issues (-3% to -8% each)
  const issuePenalty: Record<FunctionalIssue, number> = {
    "front-camera": 0.95,
    "back-camera": 0.92,
    "volume-button": 0.97,
    fingerprint: 0.94,
    wifi: 0.95,
    battery: 0.9,
    speaker: 0.94,
    "power-button": 0.92,
    "charging-port": 0.9,
    "face-sensor": 0.95,
    "silent-button": 0.97,
    "audio-receiver": 0.94,
  }
  for (const i of evaluation.functionalIssues) {
    price *= issuePenalty[i] ?? 1
  }

  // Warranty + GST bill bonus
  if (evaluation.underWarranty === "yes" && evaluation.gstBillAvailable === "yes") {
    price *= 1.05 // +5%
  }

  // Accessories small bumps
  if (evaluation.accessories.charger) price *= 1.02
  if (evaluation.accessories.boxSameImei) price *= 1.02
  if (evaluation.accessories.billSameImei) price *= 1.03

  // Round to nearest 100
  return Math.max(0, Math.round(price / 100) * 100)
}

export default function SellPhonePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [deviceType, setDeviceType] = useState<DeviceType>("phone")
  const [brand, setBrand] = useState<Brand | "">("")
  const [model, setModel] = useState("")
  const [variant, setVariant] = useState<Variant>("")
  const [condition, setCondition] = useState("")
  const [issues, setIssues] = useState("")

  const [evaluation, setEvaluation] = useState<Evaluation>({
    canCall: "",
    screenDefect: "",
    bodyDefect: "",
    underWarranty: "",
    gstBillAvailable: "",
    screenDetails: { touchWorking: "", deadSpots: "", visibleLines: "", physical: "" },
    bodyCondition: "none",
    functionalIssues: [],
    accessories: { charger: false, boxSameImei: false, billSameImei: false },
  })

  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
  })

  const estimatedPrice = useMemo(
    () => computeEstimate(brand, model, variant, evaluation),
    [brand, model, variant, evaluation],
  )

  const canContinueFromStep1 = !!brand
  const canContinueFromStep2 = !!model
  const canContinueFromStep3 = !!variant
  const canContinueFromStep4 =
    evaluation.canCall &&
    evaluation.screenDefect &&
    evaluation.bodyDefect &&
    evaluation.underWarranty &&
    evaluation.gstBillAvailable
  const canContinueFromStep5 =
    evaluation.screenDefect === "no" ||
    (evaluation.screenDetails.touchWorking &&
      evaluation.screenDetails.deadSpots &&
      evaluation.screenDetails.visibleLines &&
      evaluation.screenDetails.physical)
  const canContinueFromStep6 = true // accessories/functional issues optional
  const canSubmitFromStep7 = userInfo.name && userInfo.phone

  async function handleSubmit() {
    const payload = {
      deviceType,
      brand,
      model,
      storage: variant,
      evaluation,
      computedPrice: estimatedPrice,
      pickup: { charges: 0, type: "Free Pickup" },
      name: userInfo.name,
      phone: userInfo.phone,
      email: userInfo.email,
      city: userInfo.city,
      address: userInfo.address,
    }
    const res = await fetch("/api/sell", { method: "POST", body: JSON.stringify(payload) })
    if (res.ok) {
      router.push("/sell-phone/success")
    } else {
      alert("Something went wrong. Please try again.")
    }
  }

  const BRANDS: Brand[] = [
    "Apple",
    "Samsung",
    "OnePlus",
    "Google",
    "Xiaomi",
    "Realme",
    "Oppo",
    "Vivo",
    "Motorola",
    "Asus",
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-balance">Sell your device</h1>
      <p className="text-sm text-muted-foreground mt-1">Get an instant estimate, free pickup, and quick payout.</p>

      {/* Steps */}
      <ol className="mt-6 grid gap-2 md:grid-cols-3 text-xs text-muted-foreground">
        {["Device", "Brand", "Details"].map((label, idx) => {
          const s = (idx + 1) as Step
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

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
        {/* Left column: wizard */}
        <div className="grid gap-6">
          {step === 1 && (
            <section>
              <h2 className="font-semibold">Choose device type</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {(["phone", "laptop", "tablet"] as DeviceType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setDeviceType(t)}
                    className={`px-3 py-2 rounded-md border text-sm ${deviceType === t ? "bg-primary text-primary-foreground" : "bg-background"}`}
                    aria-pressed={deviceType === t}
                  >
                    {t[0].toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div />
                <button
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm"
                  onClick={() => setStep(2)}
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
                    onClick={() => {
                      setBrand(b)
                      setModel("")
                      setVariant("")
                    }}
                    className={`rounded-xl border p-4 text-sm text-left hover:shadow-sm transition ${
                      brand === b ? "ring-2 ring-primary" : ""
                    }`}
                    aria-pressed={brand === b}
                  >
                    <div className="h-24 bg-muted grid place-items-center rounded-md">
                      <img src="/generic-brand-logo.png" alt={`${b} logo`} className="h-10 w-auto" />
                    </div>
                    <div className="mt-3 font-semibold">{b}</div>
                    <div className="text-xs text-muted-foreground">{CATALOG[b]?.length || 0} popular models</div>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <button className="text-sm underline" onClick={() => setStep(1)}>
                  Back
                </button>
                <button
                  disabled={!canContinueFromStep1}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-50"
                  onClick={() => setStep(3)}
                >
                  Continue
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <h2 className="font-semibold">Device & your details</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Selected brand: <span className="font-medium">{brand || "—"}</span>
              </p>

              <form
                className="mt-4 grid gap-6"
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!brand || !userInfo.name || !userInfo.phone) {
                    alert("Please fill required fields.")
                    return
                  }
                  const payload = {
                    deviceType,
                    brand,
                    model,
                    storage: variant,
                    evaluation: null,
                    computedPrice: 0,
                    pickup: { charges: 0, type: "Free Pickup" },
                    name: userInfo.name,
                    phone: userInfo.phone,
                    email: userInfo.email,
                    city: userInfo.city,
                    address: userInfo.address,
                    // extra fields from this compact form:
                    condition,
                    issues,
                  }
                  const res = await fetch("/api/sell", { method: "POST", body: JSON.stringify(payload) })
                  const waText = `Sell Request
Brand: ${brand}
Model: ${model || "-"}
Storage: ${variant || "-"}
Condition: ${condition || "-"}
Issues: ${issues || "-"}

Name: ${userInfo.name}
Phone: ${userInfo.phone}
Email: ${userInfo.email || "-"}
City: ${userInfo.city || "-"}
Address: ${userInfo.address || "-"}`

                  // open WhatsApp chat with prefilled text
                  if (typeof window !== "undefined") {
                    const url = "https://wa.me/917018021841?text=" + encodeURIComponent(waText)
                    window.open(url, "_blank", "noopener,noreferrer")
                  }

                  if (res.ok) {
                    router.push("/sell-phone/success")
                  } else {
                    alert("Something went wrong. Please try again.")
                  }
                }}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm">Model</label>
                    <input
                      className="mt-1 w-full rounded-md border bg-background p-2"
                      placeholder="e.g. iPhone 13"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm">Storage/Variant</label>
                    <input
                      className="mt-1 w-full rounded-md border bg-background p-2"
                      placeholder="e.g. 128GB"
                      value={variant}
                      onChange={(e) => setVariant(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm">Overall condition</label>
                    <select
                      className="mt-1 w-full rounded-md border bg-background p-2"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                    >
                      <option value="">Select condition</option>
                      <option value="Like New">Like New</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Needs Repair">Needs Repair</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm">Issues (optional)</label>
                    <textarea
                      className="mt-1 w-full rounded-md border bg-background p-2 h-28"
                      placeholder="Describe any issues or damage"
                      value={issues}
                      onChange={(e) => setIssues(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm">Your Name</label>
                    <input
                      className="mt-1 w-full rounded-md border bg-background p-2"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo((s) => ({ ...s, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm">Phone</label>
                    <input
                      className="mt-1 w-full rounded-md border bg-background p-2"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo((s) => ({ ...s, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm">Email (optional)</label>
                    <input
                      type="email"
                      className="mt-1 w-full rounded-md border bg-background p-2"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo((s) => ({ ...s, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm">City (optional)</label>
                    <input
                      className="mt-1 w-full rounded-md border bg-background p-2"
                      value={userInfo.city}
                      onChange={(e) => setUserInfo((s) => ({ ...s, city: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm">Address (optional)</label>
                    <textarea
                      className="mt-1 w-full rounded-md border bg-background p-2 h-20"
                      value={userInfo.address}
                      onChange={(e) => setUserInfo((s) => ({ ...s, address: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button type="button" className="text-sm underline" onClick={() => setStep(2)}>
                    Back
                  </button>
                  <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">Submit</button>
                </div>
              </form>
            </section>
          )}
        </div>

        <aside className="space-y-4"></aside>
      </div>
    </div>
  )
}
