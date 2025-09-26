import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { sendNotifications } from "@/lib/notify"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    const { deviceId, title, price, name, phone, email, address, city, notes } = await req.json()
    if (!deviceId || !title || !price || !name || !phone) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    const db = await getDb()
    await db.collection("buyIntents").insertOne({
      userId: user?.userId || null,
      deviceId,
      title,
      price: Number(price),
      name,
      phone,
      email: email || null,
      address: address || null,
      city: city || null,
      notes: notes || null,
      createdAt: new Date(),
    })
    const subject = `Buy Intent: ${title} @ ₹${Number(price).toLocaleString()}`
    const text = `Device: ${title}
Price: ₹${Number(price).toLocaleString()}
Name: ${name}
Phone: ${phone}
Email: ${email || "-"}
City: ${city || "-"}
Address: ${address || "-"}
Notes: ${notes || "-"}`
    await sendNotifications({ subject, text })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
