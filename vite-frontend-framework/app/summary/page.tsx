"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getApiUrl } from "@/lib/api"

export default function SummaryPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [totalWaste, setTotalWaste] = useState(0)
  const [points, setPoints] = useState(0)

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username") || "User"
    const storedWaste = Number.parseInt(sessionStorage.getItem("totalWaste") || "0")
    const calculatedPoints = storedWaste * 1

    setUsername(storedUsername)
    setTotalWaste(storedWaste)
    setPoints(calculatedPoints)
  }, [])

  const handleFinish = () => {
    // Send transaction to backend and update user points
    const username = sessionStorage.getItem("username") || "User"
    const total = Number.parseInt(sessionStorage.getItem("totalWaste") || "0")
    const baseUrl = getApiUrl();

    fetch(`${baseUrl}/api/nama/upsert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    })
      .then((r) => r.json())
      .then((user) => {
        // Post per-jenis akumulasi; frontend stores selectedWaste earlier
        const jenis = sessionStorage.getItem("selectedWaste") || "plastik"
        return fetch(`${baseUrl}/api/sampah/${jenis}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user._id, jumlah_masuk: total })
        })
      })
      .then(() => router.push("/thank-you"))
      .catch(() => router.push("/thank-you"))
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500">
      {/* Large circles in background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full"></div>
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
      <div className="relative z-10 flex items-start gap-8">
        {/* Left side - Marti Poin card */}
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-8 shadow-2xl text-white text-center w-64">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="font-bold text-2xl text-orange-400">marti</span>
              <span className="font-bold text-2xl">poin</span>
            </div>
          </div>

          <div className="bg-white/20 rounded-2xl py-3 px-4 mb-4">
            <div className="text-sm mb-1">1 poin/Sampah</div>
          </div>

          <div className="text-sm leading-relaxed">
            Kumpulkan 20 poin
            <br />
            dan dapatkan
            <br />
            potongan harga
            <br />
            naik MRT!
          </div>
        </div>

        {/* Right side - Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl w-[400px]">
          <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Konfirmasi Poin</h2>

          <div className="space-y-6 mb-8">
            <div>
              <label className="text-blue-600 font-semibold mb-2 block">Nama Pengguna</label>
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-400">{username}</div>
            </div>

            <div>
              <label className="text-blue-600 font-semibold mb-2 block">Jumlah Sampah</label>
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-400">{totalWaste}</div>
            </div>

            <div>
              <label className="text-blue-600 font-semibold mb-2 block">Poin yang Didapatkan</label>
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-400">{points}</div>
            </div>
          </div>

          <Button
            onClick={handleFinish}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-bold rounded-lg shadow-lg transition-all hover:scale-105"
          >
            Ambil Poin
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
