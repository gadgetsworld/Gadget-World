import { NextResponse } from "next/server"
// import { getDb } from "@/lib/mongodb"
// import { comparePassword, createSession } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    // const db = await getDb()
    // const user = await db.collection("users").findOne({ email })
    // if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    // const ok = await comparePassword(password, user.passwordHash)
    // if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    // await createSession({ userId: String(user._id), email: user.email, name: user.name })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
