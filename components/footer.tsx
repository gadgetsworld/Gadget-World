import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t sm:px-6 lg:px-12">
      <div className="container px-6 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
          {/* Company Info */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/" className="flex items-center gap-3 min-w-0 group">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg group-hover:scale-105 transition-transform duration-200">
                  <span className="text-white font-bold text-lg">GW</span>
                  </div>
                  <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                     Gadgets World
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Premium Products</span>
                </div>
              </Link>            
            </div>
            <p className="max-w-lg text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Buy, sell, and repair phones, laptops, and tablets. Doorstep pickup, instant quotes, and expert service.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="flex flex-col mx-auto mt-6 space-y-3 md:space-y-0 md:flex-row">
              <input 
                id="email" 
                type="text" 
                className="px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-40"
                placeholder="Enter your email"
              />
              <button className="w-full px-6 py-3 text-sm font-semibold tracking-wider text-white transition-colors duration-300 transform md:w-auto md:ml-4 focus:outline-none bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-300 focus:ring-opacity-80">
                Subscribe
              </button>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="font-semibold text-gray-800 dark:text-white text-lg mb-6">Services</p>
            <div className="flex flex-col items-start space-y-1">
              <a href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 text-base font-medium">
                Home
              </a>
              <a href="/sell-phone" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 text-base font-medium">
                Sell Your Device
              </a>
              <a href="/repair-phone" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 text-base font-medium">
                Repair Your Device
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="font-semibold text-gray-800 dark:text-white text-lg mb-6">Contact</p>
            <div className="flex flex-col items-start space-y-1">
              <a href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 text-base font-medium">
                Contact Us
              </a>
              <div className="text-gray-600 dark:text-gray-300 text-base font-medium">
                Email: support@gadgetsworld.app
              </div>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <hr className="my-8 border-gray-200 dark:border-gray-700" />
        
        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 min-w-0 group">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg group-hover:scale-105 transition-transform duration-200">
            <span className="text-white font-bold text-lg">GW</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Gadgets World
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Premium Products</span>
          </div>
        </Link>
          </div>
          
          <div className="mt-4 md:mt-0 text-center md:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              © 2025 Gadgets World. All rights reserved.
            </p>
          </div>
          
          {/* Social Links */}
          <div className="flex mt-4 md:mt-0 -mx-2">
            <a href="#" className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" aria-label="Facebook">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.00195 12.002C2.00312 16.9214 5.58036 21.1101 10.439 21.881V14.892H7.90195V12.002H10.442V9.80204C10.3284 8.75958 10.6845 7.72064 11.4136 6.96698C12.1427 6.21332 13.1693 5.82306 14.215 5.90204C14.9655 5.91417 15.7141 5.98101 16.455 6.10205V8.56104H15.191C14.7558 8.50405 14.3183 8.64777 14.0017 8.95171C13.6851 9.25566 13.5237 9.68693 13.563 10.124V12.002H16.334L15.891 14.893H13.563V21.881C18.8174 21.0506 22.502 16.2518 21.9475 10.9611C21.3929 5.67041 16.7932 1.73997 11.4808 2.01722C6.16831 2.29447 2.0028 6.68235 2.00195 12.002Z" />
              </svg>
            </a>

            <a href="#" className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" aria-label="Twitter">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.3955C5.36074 6.60515 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z" />
              </svg>
            </a>

            <a href="#" className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" aria-label="Instagram">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" />
              </svg>
            </a>

            <a href="#" className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" aria-label="LinkedIn">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.846 15.041 11.846C13.188 11.846 12.905 13.291 12.905 14.785V20.452H9.351V9H12.765V10.561H12.811C13.288 9.661 14.448 8.711 16.181 8.711C19.782 8.711 20.448 11.081 20.448 14.166V20.452H20.447ZM5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.368C3.274 4.23 4.194 3.305 5.337 3.305C6.477 3.305 7.401 4.23 7.401 5.368C7.401 6.507 6.476 7.433 5.337 7.433ZM7.119 20.452H3.555V9H7.119V20.452ZM22.225 0H1.771C0.792 0 0 0.774 0 1.729V22.271C0 23.227 0.792 24 1.771 24H22.222C23.2 24 24 23.227 24 22.271V1.729C24 0.774 23.2 0 22.222 0H22.225Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}