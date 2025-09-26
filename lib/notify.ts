import { headers } from "next/headers"

type NotifyOpts = {
  subject: string
  text: string
  html?: string
}

const EMAIL_TO = process.env.EMAIL_TO 
const EMAIL_FROM = process.env.EMAIL_FROM
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS

const WA_API_KEY = process.env.CALLMEBOT_API_KEY // https://www.callmebot.com/blog/free-api-whatsapp-messages/
const WA_PHONE = process.env.WA_PHONE // was: process.env.WA_PHONE || "+917018021841"

async function sendEmail({ subject, text, html }: NotifyOpts) {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.error("Missing SMTP configuration", { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS })
    return { ok: false, skipped: "smtp" }
  }
  const nodemailer = await import("nodemailer")
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject,
      text,
      html,
    })
    console.log("Email sent", info)
    return { ok: true, info }
  } catch (err) {
    console.error("Error sending email", err)
    return { ok: false, error: err }
  }
}

async function sendWhatsApp(message: string) {
  // CallMeBot requires an API key obtained by messaging the bot once from the WA number.
  // If not configured, skip gracefully.
  if (!WA_API_KEY || !WA_PHONE) {
    return { ok: false, skipped: "whatsapp" }
  }
  const url =
    `https://api.callmebot.com/whatsapp.php?` +
    new URLSearchParams({
      phone: WA_PHONE.replace(/\D/g, ""),
      text: message,
      apikey: WA_API_KEY,
    }).toString()
  const res = await fetch(url, { method: "GET" })
  return { ok: res.ok }
}

export async function sendNotifications(opts: NotifyOpts) {
  // Enrich with request origin if available (best-effort)
  let origin = ""
  try {
    const h = await headers()
    origin = h.get("origin") || ""
  } catch {}
  const subject = opts.subject
  const text = origin ? `${opts.text}\n\nOrigin: ${origin}` : opts.text
  const html = opts.html

  // Fire-and-forget parallel
  const [emailRes, waRes] = await Promise.allSettled([
    sendEmail({ subject, text, html }),
    sendWhatsApp(`${subject}\n${opts.text}`),
  ])
  return {
    email: emailRes.status === "fulfilled" ? emailRes.value : null,
    whatsapp: waRes.status === "fulfilled" ? waRes.value : null,
  }
}
