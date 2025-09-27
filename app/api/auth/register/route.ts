import { NextResponse } from "next/server"
// import { getDb } from "@/lib/mongodb"
import { hashPassword, createSession } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    if (!name || !email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    // const db = await getDb()
    // const users = db.collection("users")
    // const exists = await users.findOne({ email })
    // if (exists) return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    const passwordHash = await hashPassword(password)
    // const { insertedId } = await users.insertOne({ name, email, passwordHash, createdAt: new Date() })
    // await createSession({ userId: String(insertedId), email, name })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
