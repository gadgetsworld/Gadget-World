import { NextResponse } from "next/server"
// import { getDb } from "@/lib/mongodb"
// import { getCurrentUser } from "@/lib/auth"
import { sendNotifications } from "@/lib/notify"

export async function POST(req: Request) {
  try {
  // const user = await getCurrentUser()
  const body = await req.json()

    const {
      deviceType,
      brand,
      model,
      storage,
      // legacy field kept: expectedPrice (optional)
      expectedPrice,
      // new fields:
      evaluation,
      computedPrice,
      pickup,
      name,
      phone,
      email,
      city,
      address,
    } = body || {}

    if (!deviceType || !brand || !model || !storage || !name || !phone) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    const subject = `New Trade-in: ${brand} ${model} ${storage}`
    const text = `Device Type: ${deviceType}
Brand: ${brand}
Model: ${model}
Storage: ${storage}
Computed Price: ₹${Number(computedPrice || expectedPrice || 0)}
Name: ${name}
Phone: ${phone}
Email: ${email || "-"}
City: ${city || "-"}
Address: ${address || "-"}

Evaluation: ${JSON.stringify(evaluation ?? {}, null, 2)}`
    await sendNotifications({ subject, text })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
