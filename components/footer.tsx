export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-8 w-8 rounded-md bg-primary" aria-hidden />
            <span className="font-semibold">Gadgets World</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Buy, sell, and repair phones, laptops, and tablets. Doorstep pickup, instant quotes, and expert service.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Services</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/sell-phone" className="hover:underline">
                Sell Phone/Laptop/Tablet
              </a>
            </li>
            <li>
              <a href="/buy-phone" className="hover:underline">
                Buy Refurbished Phones
              </a>
            </li>
            <li>
              <a href="/repair-phone" className="hover:underline">
                Repair Phone
              </a>
            </li>
            <li>
              <a href="/sell-automobile" className="hover:underline">
                Sell Automobile
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/contact" className="hover:underline">
                Contact Us
              </a>
            </li>
            <li>Email: support@gadgetsworld.app</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Gadgets World. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
