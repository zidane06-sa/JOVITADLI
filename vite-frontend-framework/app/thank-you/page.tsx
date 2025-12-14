"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ThankYouPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/final")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500">
      {/* Large "00!" watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <span className="text-[25rem] font-bold text-white leading-none">00!</span>
      </div>

      {/* Header dengan logo MRT dan EcoSync */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-white rounded-full px-6 py-3 shadow-lg flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">MRT</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">jakarta</span>
          </div>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 text-green-500">✓</div>
            <span className="text-sm font-semibold text-gray-700">EcoSync</span>
          </div>
        </div>
      </div>

      {/* Main content - Loading animation */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex gap-4">
          <div className="w-8 h-8 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-8 h-8 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-8 h-8 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>

      {/* Call center */}
      <div className="absolute bottom-6 right-6 z-20">
        <div className="bg-white rounded-full p-3 shadow-lg flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
          <div className="text-xs">
            <div className="text-gray-500">Call Center</div>
            <div className="font-bold text-gray-700">1500 332</div>
          </div>
        </div>
      </div>
    </div>
  )
}
