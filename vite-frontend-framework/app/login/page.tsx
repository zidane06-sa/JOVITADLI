"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username) {
      sessionStorage.setItem("username", username)
      router.push("/welcome")
    }
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500">
      {/* Large MRT watermark in background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <span className="text-[20rem] font-bold text-white">MRT</span>
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

      {/* Login form */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Login</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-2 border-blue-300 focus:border-blue-600 focus:ring-blue-600 py-6 text-lg rounded-xl"
                placeholder="Masukkan username"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-xl font-bold rounded-full shadow-lg transition-all hover:scale-105"
            >
              Masuk
            </Button>
          </form>
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
