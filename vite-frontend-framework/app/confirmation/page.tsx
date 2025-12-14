"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { getApiUrl } from "@/lib/api"

export default function ConfirmationPage() {
  const router = useRouter()

  const handleContinue = () => {
    router.push("/welcome")
  }

  const handleFinish = () => {
    router.push("/summary")
  }

  // Center servos when this page mounts
  useEffect(() => {
    // Use the correct API URL based on current protocol
    fetch(`${getApiUrl()}/api/servo/center`, { method: 'GET' })
      .then((res) => res.json().catch(() => null))
      .then((data) => {
        console.log('Servo center response:', data)
      })
      .catch((err) => {
        console.warn('Failed to send center command', err)
      })
  }, [])

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500">
      {/* Large circles in background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400 rounded-full"></div>
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

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl font-bold text-white mb-4 text-center">Scan Lagi Yukk!</h1>

        <div className="bg-white rounded-3xl px-12 py-4 shadow-xl mb-12">
          <p className="text-blue-600 text-lg">
            Supaya poin Kamu ter-<span className="italic">update</span> di{" "}
            <span className="inline-flex items-center gap-1">
              <span className="font-bold text-orange-500">marti</span>
              <span className="font-bold text-blue-600">poin</span>
            </span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-6">
          <Button
            onClick={handleContinue}
            className="bg-green-500 hover:bg-green-600 text-white px-16 py-6 text-xl font-bold rounded-lg shadow-xl transition-all hover:scale-105"
          >
            Mau Scan Lagi
          </Button>

          <Button
            onClick={handleFinish}
            className="bg-red-500 hover:bg-red-600 text-white px-16 py-6 text-xl font-bold rounded-lg shadow-xl transition-all hover:scale-105"
          >
            Udah, Ga Mau
          </Button>
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
