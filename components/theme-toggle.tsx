"use client"

import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = typeof window !== "undefined" ? localStorage.getItem("gw-theme") : null
    const prefersDark =
      typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldDark = stored ? stored === "dark" : prefersDark
    document.documentElement.classList.toggle("dark", shouldDark)
    setIsDark(shouldDark)
  }, [])

  function toggle() {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("gw-theme", next ? "dark" : "light")
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggle}
      className="px-3 py-2 rounded-md border text-sm hover:bg-secondary"
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? "Light" : "Dark"}
    </button>
  )
}
