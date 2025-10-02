"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { repairBrands, smartwatchBrands, budsBrands, laptopBrands, tabletBrands } from "@/lib/data"

// Device type options including new categories
const DEVICE_TYPES = [
  { key: "phone", label: "Phone", icon: "📞", description: "Smartphones & Mobile Devices" },
  { key: "macbook", label: "MacBook", icon: "💻", description: "Apple MacBooks & Laptops" },
  { key: "laptop", label: "Laptop", icon: "💻", description: "Windows & Other Laptops" },
  { key: "tablet", label: "Tablet", icon: "📱", description: "Tablets & iPads" },
  { key: "smartwatch", label: "Smartwatch", icon: "⌚", description: "Smart Watches & Wearables" },
  { key: "airbuds", label: "Airbuds", icon: "🎧", description: "Wireless Earbuds & Headphones" },
] as const

type DeviceType = typeof DEVICE_TYPES[number]['key']
type Step = 1 | 2 | 3

export default function RepairPhonePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [deviceType, setDeviceType] = useState<DeviceType>("phone")
  const [brand, setBrand] = useState<string>("")
  const [model, setModel] = useState<string>("")
  const [issue, setIssue] = useState("")
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
  })
  const [loading, setLoading] = useState(false)

  const progressBarRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to progress bar when step changes to 2 or 3
  useEffect(() => {
    if ((step === 2 || step === 3) && progressBarRef.current) {
      progressBarRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
    }
  }, [step])

  // Reset brand and model when device type changes
  useEffect(() => {
    setBrand("")
    setModel("")
    setIssue("")
  }, [deviceType])

  // Check if current device type should skip brand selection
  const shouldSkipBrandSelection = (device?: DeviceType) => {
    const currentDevice = device || deviceType
    return currentDevice === "macbook"
  }

  // Get brands based on device type
  const getBrandsByDeviceType = () => {
    switch (deviceType) {
      case "phone":
        return repairBrands
      case "smartwatch":
        return smartwatchBrands
      case "airbuds":
        return budsBrands
      case "laptop":
        return laptopBrands
      case "tablet":
        return tabletBrands
      case "macbook":
        return []
      default:
        return repairBrands
    }
  }

  // Handle device type selection
  const handleDeviceTypeSelect = (selectedDeviceType: DeviceType) => {
    setDeviceType(selectedDeviceType)
    
    if (shouldSkipBrandSelection(selectedDeviceType)) {
      setBrand("Apple") // Auto-set brand for MacBook
      setStep(3) // Skip to step 3 (form)
    } else {
      setStep(2) // Go to brand selection
    }
  }

  // Handle brand selection
  const handleBrandSelect = (selectedBrand: string) => {
    setBrand(selectedBrand)
    setModel("")
    setStep(3) // Go to details step
  }

  // Handle back step
  const handleBackStep = () => {
    if (step === 3 && shouldSkipBrandSelection()) {
      setStep(1) // Go back to device type if we skipped brand selection
      setBrand("") // Clear brand when going back
    } else if (step === 2) {
      setStep(1) // Go back to device type from brand selection
    } else if (step === 3 && !shouldSkipBrandSelection()) {
      setStep(2) // Go back to brand selection from form
    }
  }

  // Function to clear all form fields
  const clearAllFields = () => {
    setDeviceType("phone")
    setBrand("")
    setModel("")
    setIssue("")
    setUserInfo({
      name: "",
      phone: "",
      email: "",
      city: "",
      address: "",
    })
    setStep(1)
  }

  // Common repair issues
  const COMMON_ISSUES = [
    "Screen Damage",
    "Battery Replacement",
    "Camera Issues",
    "Charging Port",
    "Water Damage",
    "Software Issues",
    "Speaker/Microphone",
    "Button Not Working",
    "Other Issues"
  ]

  async function handleSubmit() {
    const { default: NProgress } = await import("nprogress")
    const { toast } = await import("react-toastify")
    
    NProgress.start()
    setLoading(true)
    
    if (!brand || !userInfo.name || !userInfo.phone || !model || !issue) {
      toast.error("Please fill all required fields.")
      NProgress.done()
      setLoading(false)
      return
    }

    const payload = {
      deviceType,
      brand,
      model,
      issue,
      name: userInfo.name,
      phone: userInfo.phone,
      email: userInfo.email,
      city: userInfo.city,
      address: userInfo.address,
    }

    const waText = `Repair Request\nDevice Type: ${deviceType}\nBrand: ${brand}\nModel: ${model}\nIssue: ${issue}\n\nName: ${userInfo.name}\nPhone: ${userInfo.phone}\nEmail: ${userInfo.email || "-"}\nCity: ${userInfo.city || "-"}\nAddress: ${userInfo.address || "-"}`

    if (typeof window !== "undefined") {
      const url = "https://wa.me/917827672674?text=" + encodeURIComponent(waText)
      window.open(url, "_blank", "noopener,noreferrer")
    }

    try {
      const res = await fetch("/api/repair", { 
        method: "POST", 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload) 
      })
      
      if (res.ok) {
        toast.success("Thanks! Our technician will contact you shortly.")
        clearAllFields()
        router.push("/repair-phone/success")
      } else {
        const err = await res.json().catch(() => ({}))
        toast.error(err?.error || "Something went wrong. Please try again.")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      NProgress.done()
      setLoading(false)
    }
  }

  const currentBrands = getBrandsByDeviceType()
  const skipBrandSelection = shouldSkipBrandSelection()

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-12">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
          Professional Repair Service
        </h1>
        <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
          Get your device fixed with genuine parts, expert technicians, and quick turnaround time. 
          We offer doorstep service and warranty on all repairs.
        </p>
      </div>

      {/* Improved Progress Steps with ref for scrolling */}
      <div ref={progressBarRef} className="mb-8 sm:mb-12">
        <div className="mt-6 sm:mt-8 max-w-md mx-auto px-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: skipBrandSelection && step === 3 
                  ? '100%' 
                  : `${((step - 1) / (skipBrandSelection ? 2 : 2)) * 100}%` 
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>
              Step {skipBrandSelection && step === 3 ? '2' : step} of {skipBrandSelection ? '2' : '3'}
            </span>
            <span>
              {skipBrandSelection && step === 3 
                ? '100%' 
                : `${Math.round(((step - 1) / (skipBrandSelection ? 2 : 2)) * 100)}%`} Complete
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
          {/* Step 1: Device Type Selection */}
          {step === 1 && (
            <div>
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Choose Device Type
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  What type of device needs repair?
                </p>
              </div>
              
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {DEVICE_TYPES.map((device) => (
                  <button
                    key={device.key}
                    onClick={() => handleDeviceTypeSelect(device.key)}
                    className={`p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl border-2 transition-all duration-200 transform hover:scale-105 min-h-[120px] sm:min-h-[140px] ${
                      deviceType === device.key 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">
                      {device.icon}
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                      {device.label}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {device.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Brand Selection */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Select Your Brand
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  Choose the brand of your {deviceType}
                </p>
              </div>
              
              <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                {currentBrands.map((brandData) => (
                  <button
                    key={brandData.name}
                    onClick={() => handleBrandSelect(brandData.name)}
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 transform hover:scale-105 min-h-[100px] sm:min-h-[120px] ${
                      brand === brandData.name 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                    }`}
                  >
                    <div className="h-12 sm:h-16 rounded-lg grid place-items-center mb-2 sm:mb-3">
                      {brandData.image ? (
                        <img 
                          src={brandData.image} 
                          alt={`${brandData.name} logo`} 
                          className="h-10 sm:h-12 w-auto opacity-80 object-contain" 
                        />
                      ) : (
                        <div className="text-2xl sm:text-3xl opacity-70">
                          {deviceType === 'smartwatch' ? '⌚' : 
                           deviceType === 'airbuds' ? '🎧' : '📱'}
                        </div>
                      )}
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white text-center text-sm sm:text-base">
                      {brandData.name}
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 sm:mt-8">
                <button 
                  onClick={handleBackStep}
                  className="px-4 py-3 sm:px-6 sm:py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Device Type
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Repair & Contact Details */}
          {step === 3 && (
            <div>
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Repair & Contact Details
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  Provide details about the issue and how we can contact you
                </p>
                {deviceType && (
                  <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg text-xs sm:text-sm">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Selected: <span className="font-semibold capitalize">{deviceType}</span>
                    {brand && !skipBrandSelection && <span> • <span className="font-semibold">{brand}</span></span>}
                  </div>
                )}
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  await handleSubmit()
                }}
                className="space-y-4 sm:space-y-6"
              >
                {/* Device Details */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3 sm:mb-4">
                    Device Information
                  </h3>
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                    {/* Show brand input for device types that skipped brand selection */}
                    {skipBrandSelection && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Brand *
                        </label>
                        <input
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                          value="Apple"
                          readOnly
                          required
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          MacBook devices are exclusively from Apple
                        </p>
                      </div>
                    )}
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Model *
                      </label>
                      <input
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder={
                          deviceType === 'macbook' ? 'e.g. MacBook Air M1, MacBook Pro 14"' :
                          deviceType === 'laptop' ? 'e.g. XPS 13, ThinkPad X1' :
                          deviceType === 'smartwatch' ? 'e.g. Apple Watch Series 9, Galaxy Watch 6' :
                          deviceType === 'airbuds' ? 'e.g. AirPods Pro, Galaxy Buds 2' :
                          deviceType === 'tablet' ? 'e.g. iPad Pro, Galaxy Tab S9' :
                          'e.g. iPhone 13, Galaxy S23'
                        }
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Issue Description *
                      </label>
                      <select
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        value={issue}
                        onChange={(e) => setIssue(e.target.value)}
                        required
                      >
                        <option value="">Select the main issue</option>
                        {COMMON_ISSUES.map((issueItem) => (
                          <option key={issueItem} value={issueItem}>{issueItem}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Additional Details
                      </label>
                      <textarea
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                        placeholder="Provide more details about the issue, when it started, any error messages, etc..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3 sm:mb-4">
                    Your Contact Information
                  </h3>
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        value={userInfo.name}
                        placeholder="Your full name"
                        onChange={(e) => setUserInfo((s) => ({ ...s, name: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        value={userInfo.phone}
                        placeholder="Your phone number"
                        onChange={(e) => setUserInfo((s) => ({ ...s, phone: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo((s) => ({ ...s, email: e.target.value }))}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        value={userInfo.city}
                        onChange={(e) => setUserInfo((s) => ({ ...s, city: e.target.value }))}
                        placeholder="Your city"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Full Address
                      </label>
                      <textarea
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                        value={userInfo.address}
                        onChange={(e) => setUserInfo((s) => ({ ...s, address: e.target.value }))}
                        placeholder="Enter your complete address for doorstep service"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={handleBackStep}
                    className="px-4 py-3 sm:px-6 sm:py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base order-2 sm:order-1"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {skipBrandSelection ? 'Back to Device Type' : 'Back to Brand Selection'}
                  </button>
                  
                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-4 py-3 sm:px-8 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base order-1 sm:order-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Book Repair Now
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <RepairSidebar />
      </div>

      {/* Mobile Help Section */}
      <RepairMobileHelpSection />
    </div>
  )
}

// Repair Sidebar Component
function RepairSidebar() {
  return (
    <aside className="hidden lg:block space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Why Choose Our Repair Service?</h3>
        <div className="space-y-3">
          {[
            { icon: "🚚", text: "Free Doorstep Service" },
            { icon: "🔧", text: "Expert Technicians" },
            { icon: "⚡", text: "Same Day Repair" },
            { icon: "🛡️", text: "Warranty on Repairs" },
            { icon: "💎", text: "Genuine Parts" }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Need Immediate Help?</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Our technicians are available to answer your questions and provide quick solutions.
        </p>
        <a
          href="https://wa.me/917827672674"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          <WhatsAppIcon />
          Chat on WhatsApp
        </a>
      </div>
    </aside>
  )
}

// Repair Mobile Help Section Component
function RepairMobileHelpSection() {
  return (
    <div className="lg:hidden mt-6 space-y-4">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Why Choose Our Repair Service?</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "🚚", text: "Free Service" },
            { icon: "🔧", text: "Expert Techs" },
            { icon: "⚡", text: "Same Day" },
            { icon: "🛡️", text: "Warranty" }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs text-gray-700 dark:text-gray-300">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Need Immediate Help?</h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
          Our technicians are available to answer your questions.
        </p>
        <a
          href="https://wa.me/917827672674"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
        >
          <WhatsAppIcon />
          Chat on WhatsApp
        </a>
      </div>
    </div>
  )
}

// WhatsApp Icon Component
function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}