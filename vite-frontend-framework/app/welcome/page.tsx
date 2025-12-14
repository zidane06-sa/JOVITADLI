"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { triggerServo } from "@/lib/api"

export default function WelcomePage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username")
    if (!storedUsername) {
      router.push("/login")
    } else {
      setUsername(storedUsername)
    }
  }, [router])

  const handleSelectWaste = async (wasteType: string, servoBin: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Trigger servo untuk membuka bin yang sesuai
      await triggerServo(servoBin)
      
      // Simpan pilihan ke sessionStorage
      sessionStorage.setItem("selectedWaste", wasteType)
      
      // Tunggu sebentar untuk servo bergerak, lalu lanjut
      setTimeout(() => {
        router.push("/input-quantity")
        setIsLoading(false)
      }, 1500)
    } catch (err) {
      console.error('Error:', err)
      setError("Gagal menggerakkan servo. Silakan coba lagi.")
      setIsLoading(false)
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-8">
            Halo, {username}
            <br />
            <span className="text-3xl">Kamu mau buang sampah apa?</span>
          </h1>
        </div>

        {/* Waste type selection grid */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl max-w-3xl">
          {error && (
            <div className="mb-6 bg-red-500 text-white px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {/* Plastik */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                <div className="text-white text-4xl">🛍️</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">Kamu buang 1kg plastik</div>
                <div className="text-sm font-bold text-blue-600">dan kamu akan dapat</div>
                <div className="text-xs text-gray-600">1 point Aplikasi MyMRTJ</div>
              </div>
            </div>

            {/* Kaleng */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                <div className="text-white text-4xl">🥫</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">Kamu buang 1kg kaleng</div>
                <div className="text-sm font-bold text-green-600">dan kamu akan dapat</div>
                <div className="text-xs text-gray-600">1 point Aplikasi MyMRTJ</div>
              </div>
            </div>

            {/* Kertas */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-3 shadow-lg">
                <div className="text-white text-4xl">📄</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">Kamu buang 1kg kertas</div>
                <div className="text-sm font-bold text-blue-600">dan kamu akan dapat</div>
                <div className="text-xs text-gray-600">1 point Aplikasi MyMRTJ</div>
              </div>
            </div>

            {/* Keyu */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                <div className="text-white text-4xl">🔧</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">Kamu buang 1kg keyu</div>
                <div className="text-sm font-bold text-gray-600">dan kamu akan dapat</div>
                <div className="text-xs text-gray-600">1 point Aplikasi MyMRTJ</div>
              </div>
            </div>
          </div>

          {/* Button untuk setiap jenis sampah */}
          <div className="grid grid-cols-4 gap-4">
            <Button
              onClick={() => handleSelectWaste("plastik", "PLASTIK")}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
              Plastik
            </Button>
            <Button
              onClick={() => handleSelectWaste("kaleng", "BESI")}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-full py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
              Kaleng
            </Button>
            <Button
              onClick={() => handleSelectWaste("kertas", "KERTAS")}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
              Kertas
            </Button>
            <Button
              onClick={() => handleSelectWaste("keyu", "KARDUS")}
              disabled={isLoading}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-full py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
              Keyu
            </Button>
          </div>
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
