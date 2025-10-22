"use client"

import { useState } from "react"

export default function BuyPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  
  const CATEGORIES = [
    { key: "buds", label: "AirPods", icon: "🎧", message: "Hi, I'm interested in buying premium AirPods/Earbuds" },
    { key: "smartwatch", label: "Smartwatch", icon: "⌚", message: "Hi, I'm interested in buying premium Smartwatches" },
    { key: "headphones", label: "Headphones", icon: "🔊", message: "Hi, I'm interested in buying premium Headphones" },
  ]

  // Function to handle category selection and WhatsApp redirect
  const handleCategoryClick = (category: typeof CATEGORIES[0]) => {
    setSelectedCategory(category.key)
    if (typeof window !== "undefined") {
      const url = "https://wa.me/917827672674?text=" + encodeURIComponent(category.message)
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-12">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
          Buy Premium Devices
        </h1>
        <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
          Premium quality headphones, smartwatches, and AirPods. Click on any category to get in touch via WhatsApp.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Choose a Category
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              What type of device are you looking for?
            </p>
          </div>
          
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => (
              <button
                key={category.key}
                onClick={() => handleCategoryClick(category)}
                className={`p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl border-2 transition-all duration-200 transform hover:scale-105 min-h-[120px] sm:min-h-[140px] ${
                  selectedCategory === category.key 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                }`}
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                  {category.label}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Click to inquire
                </p>
              </button>
            ))}
          </div>

          {/* Call to Action Footer */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-blue-200 dark:border-blue-700 mt-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
              Need Help Choosing?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Our experts are here to help you find the perfect device for your needs.
            </p>
            <button
              className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 mx-auto text-sm sm:text-base"
              onClick={() => {
                const waText = "Hi, I need help choosing the right device for me."
                if (typeof window !== "undefined") {
                  const url = "https://wa.me/917018021841?text=" + encodeURIComponent(waText)
                  window.open(url, "_blank", "noopener,noreferrer")
                }
              }}
            >
              <WhatsAppIcon />
              Chat with Expert on WhatsApp
            </button>
          </div>
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
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Why Buy From Us?</h3>
        <div className="space-y-3">
          {[
            { icon: "🛡️", text: "Authentic Products" },
            { icon: "💰", text: "Best Prices" },
            { icon: "🚚", text: "Fast Delivery" },
            { icon: "🔧", text: "Warranty Included" },
            { icon: "📞", text: "Expert Support" }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

// Mobile Help Section Component
function MobileHelpSection() {
  return (
    <div className="lg:hidden mt-6 space-y-4">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Why Buy From Us?</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "🛡️", text: "Authentic" },
            { icon: "💰", text: "Best Price" },
            { icon: "🚚", text: "Fast Delivery" },
            { icon: "🔧", text: "Warranty" }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs text-gray-700 dark:text-gray-300">{item.text}</span>
            </div>
          ))}
        </div>
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