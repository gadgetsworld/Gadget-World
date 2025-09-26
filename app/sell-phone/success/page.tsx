export default function SellSuccessPage() {
  const subject = "Sell Request Confirmation"
  const prefilled = [
    subject,
    "Hi Gadgets World, I just submitted a sell request.",
    "Please reach out to me on WhatsApp to schedule a pickup.",
  ].join("\n")
  const waLink = `https://wa.me/917018021841?text=${encodeURIComponent(prefilled)}`
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">Request received</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You’ll be notified shortly. Our team will contact you to schedule a free pickup and verify your device.
      </p>
      <a
        href="/sell-phone"
        className="mt-6 inline-block px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm"
      >
        Sell another device
      </a>
      <a href="/buy-phone" className="mt-2 ml-2 inline-block px-4 py-2 rounded-md border text-sm">
        Browse phones
      </a>
      <div className="mt-6">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm"
          aria-label="Open WhatsApp with prefilled message"
        >
          Message us on WhatsApp
        </a>
      </div>
    </section>
  )
}
