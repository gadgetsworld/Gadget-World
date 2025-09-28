import { NextResponse } from "next/server"
// // import { getDb } from "@/lib/mongodb"
// // import { getCurrentUser } from "@/lib/auth"


export async function GET(req: Request) {
	// Return static or empty data since MongoDB is removed
	return NextResponse.json({ devices: [] })
}

export async function POST(req: Request) {
	// Accept POST but do nothing since MongoDB is removed
	const body = await req.json()
	const { title, brand, model, storage, condition, price, images } = body || {}
	if (!title || !brand || !model || !price) return NextResponse.json({ error: "Missing fields" }, { status: 400 })
	return NextResponse.json({ ok: true, id: "static-id" })
}
