import { NextResponse } from "next/server"
// import { getDb } from "@/lib/mongodb"
import { sendNotifications } from "@/lib/notify"

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()
    if (!name || !email || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  // const db = await getDb()
  // await db.collection("contacts").insertOne({ name, email, message, createdAt: new Date() })
    const subject = `Contact Form: ${name}`
    const text = `Name: ${name}
Email: ${email}
Message:
${message}`
    await sendNotifications({ subject, text })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
