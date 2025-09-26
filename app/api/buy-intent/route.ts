import { NextResponse } from "next/server"
// import { getDb } from "@/lib/mongodb"
// import { getCurrentUser } from "@/lib/auth"
import { sendNotifications } from "@/lib/notify"

export async function POST(req: Request) {
  try {
    const { category, brand, name, phone, email, city, notes } = await req.json()
    if (!category || !brand || !name || !phone) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    const subject = `Buy Intent: ${brand} (${category})`
    const text = `Category: ${category}\nBrand: ${brand}\nName: ${name}\nPhone: ${phone}\nEmail: ${email || "-"}\nCity: ${city || "-"}\nNotes: ${notes || "-"}`
    await sendNotifications({ subject, text })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
