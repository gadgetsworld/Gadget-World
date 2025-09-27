import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
// import { getDb } from "./mongodb"

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable")
}
const secret = new TextEncoder().encode(JWT_SECRET)
const COOKIE_NAME = "gw_session"

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}
export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function createSession(payload: { userId: string; email: string; name?: string }) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export function destroySession() {
  cookies().set(COOKIE_NAME, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 })
}

export async function getCurrentUser() {
  const cookie = cookies().get(COOKIE_NAME)?.value
  if (!cookie) return null
  try {
    const { payload } = await jwtVerify(cookie, secret)
    return {
      userId: String(payload.userId),
      email: String(payload.email),
      name: payload.name ? String(payload.name) : undefined,
    }
  } catch {
    return null
  }
}

export async function findUserByEmail(email: string) {
  // const db = await getDb()
  // return db.collection("users").findOne({ email })
}
