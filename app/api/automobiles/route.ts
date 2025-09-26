import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { sendNotifications } from "@/lib/notify"

export async function POST(req: Request) {
  try {
    const { name, phone, city, brand, model, year } = await req.json()
    if (!name || !phone || !brand || !model) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    const db = await getDb()
    await db.collection("automobiles").insertOne({
      name,
      phone,
      city,
      brand,
      model,
      year,
      createdAt: new Date(),
    })
    const subject = `Automobile Lead: ${brand} ${model}`
    const text = `Name: ${name}
Phone: ${phone}
City: ${city || "-"}
Brand: ${brand}
Model: ${model}
Year: ${year || "-"}`
    await sendNotifications({ subject, text })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
