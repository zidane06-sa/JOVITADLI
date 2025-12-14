"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Trash2 } from "lucide-react"

const wasteTypes = [
  { id: "besi", name: "Besi", color: "bg-gray-600 hover:bg-gray-700" },
  { id: "kardus", name: "Kardus", color: "bg-amber-600 hover:bg-amber-700" },
  { id: "kertas", name: "Kertas", color: "bg-blue-600 hover:bg-blue-700" },
  { id: "plastik", name: "Plastik", color: "bg-yellow-500 hover:bg-yellow-600" },
]

export default function SelectWastePage() {
  const router = useRouter()

  const handleSelectWaste = (wasteType: string) => {
    sessionStorage.setItem("selectedWaste", wasteType)
    router.push("/input-quantity")
  }

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center p-8"
      style={{
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/40" />

      {/* Logo kecil di atas */}
      <div className="relative z-10 mb-8">
        <Image src="/images/mrt-logo.jpg" alt="MRT Logo" width={80} height={80} className="object-contain" />
      </div>

      {/* Judul */}
      <h1 className="relative z-10 text-4xl font-bold text-emerald-700 mb-12 text-center">Pilih Jenis Sampah</h1>

      {/* Grid pilihan sampah - 2x2 */}
      <div className="relative z-10 grid grid-cols-2 gap-6 max-w-2xl">
        {wasteTypes.map((waste) => (
          <Button
            key={waste.id}
            onClick={() => handleSelectWaste(waste.id)}
            className={`${waste.color} text-white p-12 h-auto flex flex-col items-center gap-4 rounded-3xl shadow-xl transition-all hover:scale-105`}
          >
            <Trash2 size={80} strokeWidth={2.5} />
            <span className="text-2xl font-bold">{waste.name}</span>
          </Button>
        ))}
      </div>

      {/* Call center di kanan bawah */}
      <div className="absolute bottom-8 right-8 z-10">
        <Image src="/images/call-center.jpg" alt="Call Center" width={64} height={64} className="object-contain" />
      </div>
    </div>
  )
}
