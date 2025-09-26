// Popular loader using nprogress
"use client"
import { useEffect } from "react"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

export function usePageLoader() {
  useEffect(() => {
    NProgress.configure({ showSpinner: false })
    const handleStart = () => NProgress.start()
    const handleStop = () => NProgress.done()
    window.addEventListener("routeChangeStart", handleStart)
    window.addEventListener("routeChangeComplete", handleStop)
    window.addEventListener("routeChangeError", handleStop)
    return () => {
      window.removeEventListener("routeChangeStart", handleStart)
      window.removeEventListener("routeChangeComplete", handleStop)
      window.removeEventListener("routeChangeError", handleStop)
    }
  }, [])
}

export function Loader() {
  // This is just a placeholder for manual loader usage
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary" />
    </div>
  )
}
