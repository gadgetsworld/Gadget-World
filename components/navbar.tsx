"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)

  useEffect(() => {
    let active = true
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" })
        if (!active) return
        if (res.ok) {
          const data = await res.json()
          setUser(data?.user ?? null)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      }
    }
    fetchUser()
    return () => {
      active = false
    }
  }, [pathname])

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    router.push("/")
  }

  const linkCls = (href: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      pathname === href ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
    }`

  return (
    <header className="border-b bg-background">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <span className="inline-block h-8 w-8 rounded-md bg-primary" aria-hidden />
          <span className="text-lg font-semibold text-pretty">Gadgets World</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/" className={linkCls("/")}>
            Home
          </Link>
          <Link href="/sell-phone" className={linkCls("/sell-phone")}>
            Sell 
          </Link>
          <Link href="/repair-phone" className={linkCls("/repair-phone")}>
            Repair 
          </Link>
          <Link href="/buy-phone" className={linkCls("/buy-phone")}>
            Buy
          </Link>
          <Link href="/contact" className={linkCls("/contact")}>
            Contact us
          </Link>
        </nav>

        <div className="hidden sm:flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <span className="text-sm truncate max-w-[120px]">Hi, {user.name?.split(" ")[0] || "User"}</span>
              <button onClick={logout} className="px-3 py-2 rounded-md bg-secondary hover:bg-muted text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-3 py-2 rounded-md bg-secondary hover:bg-muted text-sm">
                Log in
              </Link>
              <Link href="/register" className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm">
                Sign up
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <button aria-label="Open menu" className="px-3 py-2 rounded-md bg-secondary text-sm">
                Menu
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-sm p-0">
              <SheetHeader className="px-4 pt-4">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-4 grid gap-1 px-4 pb-4">
                <Link href="/" className="px-3 py-3 rounded-md hover:bg-secondary text-base">
                  Home
                </Link>
                <Link href="/sell-phone" className="px-3 py-3 rounded-md hover:bg-secondary text-base">
                  Sell Phone
                </Link>
                <Link href="/repair-phone" className="px-3 py-3 rounded-md hover:bg-secondary text-base">
                  Repair Phone
                </Link>
                <Link href="/buy-phone" className="px-3 py-3 rounded-md hover:bg-secondary text-base">
                  Buy
                </Link>
                <Link href="/contact" className="px-3 py-3 rounded-md hover:bg-secondary text-base">
                  Contact
                </Link>

                <div className="h-px bg-border my-2" />

                {user ? (
                  <>
                    <div className="text-sm px-3">Signed in as {user.email || user.name}</div>
                    <button onClick={logout} className="mt-1 px-3 py-3 rounded-md bg-secondary text-base text-left">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="px-3 py-3 rounded-md bg-secondary text-base">
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      className="px-3 py-3 rounded-md bg-primary text-primary-foreground text-base"
                    >
                      Sign up
                    </Link>
                  </>
                )}

                <a
                  href="https://wa.me/917018021841"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 px-3 py-3 rounded-md bg-emerald-600 text-white text-base text-center"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
