"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

export default function InputQuantityPage() {
  const router = useRouter()
  const [quantity, setQuantity] = useState(0)

  const handleSubmit = () => {
    if (quantity > 0) {
      sessionStorage.setItem("targetQuantity", quantity.toString())
      
      // Reset backend item counter sebelum mulai transaksi baru
      fetch('http://localhost:5000/api/servo/reset-item-count', { method: 'POST' })
        .then((res) => res.json())
        .then((data) => {
          console.log('Backend counter reset:', data)
          router.push("/waiting")
        })
        .catch((err) => {
          console.warn('Failed to reset counter, proceeding anyway:', err)
          router.push("/waiting")
        })
    }
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500">
      {/* Large circles in background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400 rounded-full"></div>
      </div>

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

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-12 text-center">
          Berapa Jumlah Sampah yang
          <br />
          Kamu Masukkan?
        </h1>

        {/* Counter */}
        <div className="flex items-center gap-6 mb-12">
          <Button
            onClick={() => setQuantity(Math.max(0, quantity - 1))}
            className="w-20 h-20 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-xl"
          >
            <Minus size={40} className="text-white" strokeWidth={3} />
          </Button>

          <div className="w-72 h-32 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
            <span className="text-8xl font-bold text-gray-800">{quantity}</span>
          </div>

          <Button
            onClick={() => setQuantity(quantity + 1)}
            className="w-20 h-20 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-xl"
          >
            <Plus size={40} className="text-white" strokeWidth={3} />
          </Button>
        </div>

        {/* Lanjutkan button */}
        <Button
          onClick={handleSubmit}
          disabled={quantity <= 0}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-12 py-4 text-lg font-bold rounded-lg shadow-xl transition-all hover:scale-105"
        >
          Lanjutkan
        </Button>
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
