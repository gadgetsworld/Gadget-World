"use client"
import { usePageLoader } from "@/components/loader"
import { ToastProvider } from "@/components/toast-provider"

export function LayoutClient({ children }: { children: React.ReactNode }) {
  usePageLoader()
  return (
    <>
      <ToastProvider />
      {children}
    </>
  )
}
