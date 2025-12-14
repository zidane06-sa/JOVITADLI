"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getApiUrl } from "@/lib/api"

export default function WaitingPage() {
  const router = useRouter()
  const [currentCount, setCurrentCount] = useState(0)
  const [targetQuantity, setTargetQuantity] = useState(0)
  const [backendConnected, setBackendConnected] = useState(false)

  useEffect(() => {
    const target = Number.parseInt(sessionStorage.getItem("targetQuantity") || "0")
    setTargetQuantity(target)
  }, [])

  useEffect(() => {
    if (currentCount >= targetQuantity && targetQuantity > 0) {
      setTimeout(() => {
        const currentTotal = Number.parseInt(sessionStorage.getItem("totalWaste") || "0")
        sessionStorage.setItem("totalWaste", (currentTotal + targetQuantity).toString())
        router.push("/confirmation")
      }, 500)
    }
  }, [currentCount, targetQuantity, router])

  // Poll backend for item count (ESP32 triggers /api/servo/item-counted on IR 1->0)
  useEffect(() => {
    let pollCount = 0
    const pollItemCount = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/api/servo/item-status`)
        if (!res.ok) throw new Error(`status ${res.status}`)
        const data = await res.json()

        setBackendConnected(true)

        if (data.success && typeof data.totalCount !== 'undefined') {
          setCurrentCount(data.totalCount)
          console.log(`Backend item count: ${data.totalCount}`)
        }
      } catch (err) {
        console.warn('Failed to fetch item status:', err)
        setBackendConnected(false)
      }
    }

    const interval = setInterval(pollItemCount, 300) // Poll setiap 300ms
    pollItemCount() // Run immediately
    return () => clearInterval(interval)
  }, [targetQuantity])

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
        {/* Message box */}
        <div className="border-4 border-white/50 rounded-[3rem] p-16 mb-8">
          <h1 className="text-5xl font-bold text-white text-center mb-8">
            SILAKAN MASUKKAN
            <br />
            SAMPAH ANDA
          </h1>

          {/* Waste icons */}
          <div className="flex items-center justify-center gap-8">
            <div className="text-6xl">🛍️</div>
            <div className="text-6xl">🥫</div>
            <div className="text-6xl">⚪</div>
            <div className="text-6xl">🔧</div>
          </div>
        </div>

        {/* Counter display */}
        {currentCount < targetQuantity && (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <div className="text-white text-2xl font-bold text-center">
              {currentCount} / {targetQuantity} sampah terdeteksi
            </div>
          </div>
        )}

        {currentCount >= targetQuantity && (
          <div className="text-white font-bold text-2xl animate-pulse">Menuju halaman berikutnya...</div>
        )}
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
