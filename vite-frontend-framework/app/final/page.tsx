"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function FinalPage() {
  const router = useRouter()

  useEffect(() => {
    sessionStorage.clear()
  }, [])

  const handleBackToHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500">
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
      <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4">
            <span className="text-green-400">Green</span>
            <span className="text-white">.Post</span>
          </h1>
          <p className="text-white text-lg">
            Pisahkan sampahmu di sini dan dapatkan poin di <span className="font-bold">MyMRTJ</span>
          </p>
        </div>

        {/* Content area with QR and info */}
        <div className="flex items-start gap-8 mb-12">
          {/* Left side - QR Code */}
          <div className="flex flex-col items-center">
            <p className="text-white font-semibold mb-4">
              Download
              <br />
              MyMRTJ
            </p>
            <div className="bg-white p-4 rounded-2xl shadow-xl">
              <div className="w-40 h-40 bg-white flex items-center justify-center">
                <img src="/qr-code-for-mymrtj-app.jpg" alt="QR Code" className="w-full h-full" />
              </div>
            </div>
          </div>

          {/* Right side - Info box */}
          <div className="bg-green-500 rounded-3xl p-6 max-w-md shadow-xl">
            <h3 className="text-white font-bold text-lg mb-4">Syarat & Ketentuan Berlaku:</h3>
            <ul className="text-white space-y-2 text-sm">
              <li>• Pastikan Anda sudah Download Aplikasi MyMRTJ</li>
              <li>• Pastikan Anda sudah memiliki akun keanggotaan MyMRTJ</li>
              <li>• Scan barcode keanggotaan anda melalui Green.Post</li>
              <li>• Masukkan sampah yang sudah dipisahkan berdasarkan kategorinya</li>
              <li>• Dapatkan poin</li>
              <li>• Scan barcode, scan barcode lembali untuk update poinmu!</li>
            </ul>
          </div>
        </div>

        {/* Start button */}
        <Button
          onClick={handleBackToHome}
          className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-6 text-xl font-bold rounded-lg shadow-xl transition-all hover:scale-105"
        >
          Mulai Scan
        </Button>
      </div>

      {/* Bottom decoration - green wave */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-green-500 rounded-t-[100px]"></div>

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
