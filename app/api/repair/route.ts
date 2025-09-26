import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { sendNotifications } from "@/lib/notify"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    const { brand, model, issue, name, phone } = await req.json()
    if (!brand || !model || !issue || !name || !phone) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    const db = await getDb()
    await db.collection("repairs").insertOne({
      userId: user?.userId || null,
      brand,
      model,
      issue,
      name,
      phone,
      createdAt: new Date(),
    })
    const subject = `Repair Request: ${brand} ${model}`
    const text = `Brand: ${brand}
Model: ${model}
Issue: ${issue}
Name: ${name}
Phone: ${phone}`
    await sendNotifications({ subject, text })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
