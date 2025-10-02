"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { brands, smartwatchBrands, budsBrands, laptopBrands, tabletBrands } from "@/lib/data"

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

export default function SellPhonePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [deviceType, setDeviceType] = useState<DeviceType>("phone")
  const [brand, setBrand] = useState<string>("")
  const [model, setModel] = useState<string>("")
  const [variant, setVariant] = useState<string>("")
  const [condition, setCondition] = useState("")
  const [issues, setIssues] = useState("")
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
  })

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
    setVariant("")
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
        return brands
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
        return brands
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
    setVariant("")
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
    setVariant("")
    setCondition("")
    setIssues("")
    setUserInfo({
      name: "",
      phone: "",
      email: "",
      city: "",
      address: "",
    })
    setStep(1)
  }

  async function handleSubmit() {
    const { default: NProgress } = await import("nprogress")
    const { toast } = await import("react-toastify")
    NProgress.start()
    
    if (!brand || !userInfo.name || !userInfo.phone || !model || !variant || !condition) {
      toast.error("Please fill all required fields.")
      NProgress.done()
      return
    }

    const payload = {
      deviceType,
      brand,
      model,
      storage: variant,
      name: userInfo.name,
      phone: userInfo.phone,
      email: userInfo.email,
      city: userInfo.city,
      address: userInfo.address,
      condition,
      issues,
    }

    const waText = `Sell Request\nDevice Type: ${deviceType}\nBrand: ${brand}\nModel: ${model}\nStorage: ${variant}\nCondition: ${condition}\nIssues: ${issues || "-"}\n\nName: ${userInfo.name}\nPhone: ${userInfo.phone}\nEmail: ${userInfo.email || "-"}\nCity: ${userInfo.city || "-"}\nAddress: ${userInfo.address || "-"}`

    if (typeof window !== "undefined") {
      const url = "https://wa.me/917827672674?text=" + encodeURIComponent(waText)
      window.open(url, "_blank", "noopener,noreferrer")
    }

    try {
      const res = await fetch("/api/sell", { 
        method: "POST", 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload) 
      })
      
      if (res.ok) {
        toast.success("Request submitted! You'll be contacted soon.")
        clearAllFields()
        router.push("/sell-phone/success")
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    } catch (err) {
      toast.error("Network error. Please try again.")
    } finally {
      NProgress.done()
    }
  }

  const currentBrands = getBrandsByDeviceType()
  const skipBrandSelection = shouldSkipBrandSelection()

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-12">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
          Sell Your Device
        </h1>
        <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
          Get an instant estimate, free pickup, and quick payout. We offer the best prices for your used devices.
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
                  What type of device do you want to sell?
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

          {/* Step 3: Device & Contact Details */}
          {step === 3 && (
            <div>
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Device & Contact Details
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  Provide details about your device and how we can contact you
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
                        {deviceType === 'macbook' || deviceType === 'laptop' ? 'Storage/RAM *' : 
                         deviceType === 'smartwatch' ? 'Size/Version *' :
                         deviceType === 'airbuds' ? 'Version *' : 
                         deviceType === 'tablet' ? 'Storage/Size *' : 'Storage/Variant *'}
                      </label>
                      <input
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder={
                          deviceType === 'macbook' || deviceType === 'laptop' ? 'e.g. 256GB SSD, 8GB RAM' :
                          deviceType === 'smartwatch' ? 'e.g. 44mm, GPS + Cellular' :
                          deviceType === 'airbuds' ? 'e.g. 2nd Generation, with Case' :
                          deviceType === 'tablet' ? 'e.g. 128GB, 11 inch' :
                          'e.g. 128GB, 256GB'
                        }
                        value={variant}
                        onChange={(e) => setVariant(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Overall Condition *
                      </label>
                      <select
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        required
                      >
                        <option value="">Select condition</option>
                        <option value="Like New">Like New - Minimal signs of use</option>
                        <option value="Good">Good - Light scratches, fully functional</option>
                        <option value="Fair">Fair - Visible wear, works well</option>
                        <option value="Needs Repair">Needs Repair - Issues present</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Issues Description
                      </label>
                      <textarea
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                        placeholder="Describe any issues, damage, or special notes about your device..."
                        value={issues}
                        onChange={(e) => setIssues(e.target.value)}
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
                        placeholder="Enter your complete address for pickup"
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
                    className="px-4 py-3 sm:px-8 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base order-1 sm:order-2"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Submit Sell Request
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>

      {/* Mobile Help Section */}
      <MobileHelpSection />
    </div>
  )
}

// Sidebar Component
function Sidebar() {
  return (
    <aside className="hidden lg:block space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Why Sell With Us?</h3>
        <div className="space-y-3">
          {[
            { icon: "🚚", text: "Free Doorstep Pickup" },
            { icon: "💰", text: "Best Price Guarantee" },
            { icon: "⚡", text: "Instant Payment" },
            { icon: "🛡️", text: "Secure & Safe Process" },
            { icon: "📞", text: "Dedicated Support" }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Need Help?</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Our team is here to help you with the selling process.
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

// Mobile Help Section Component
function MobileHelpSection() {
  return (
    <div className="lg:hidden mt-6 space-y-4">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Why Sell With Us?</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "🚚", text: "Free Pickup" },
            { icon: "💰", text: "Best Price" },
            { icon: "⚡", text: "Instant Payment" },
            { icon: "🛡️", text: "Secure Process" }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs text-gray-700 dark:text-gray-300">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Need Help?</h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
          Our team is here to help you with the selling process.
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