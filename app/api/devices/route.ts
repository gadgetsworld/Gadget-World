import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const brand = url.searchParams.get("brand") || undefined
  const db = await getDb()
  const q: any = {}
  if (brand) q.brand = brand
  const devices = await db.collection("devices").find(q).sort({ createdAt: -1 }).limit(60).toArray()
  return NextResponse.json({ devices: devices.map((d: any) => ({ ...d, _id: String(d._id) })) })
}

// Create device (simple admin: any logged-in user can add; refine as needed)
export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const { title, brand, model, storage, condition, price, images } = body || {}
  if (!title || !brand || !model || !price) return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  const db = await getDb()
  const { insertedId } = await db.collection("devices").insertOne({
    title,
    brand,
    model,
    storage,
    condition,
    price: Number(price),
    images: images || [],
    createdAt: new Date(),
  })
  return NextResponse.json({ ok: true, id: String(insertedId) })
}
