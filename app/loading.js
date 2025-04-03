"use client"
import { useEffect, useState } from "react"

export default function Loading() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100) // ⏳ Petit délai anti-flash
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white text-center">
      {/* Spinner responsive */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-purple-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-pink-400 animate-spin [animation-duration:1.2s]" />
        <div className="absolute inset-4 rounded-full border-4 border-t-transparent border-yellow-300 animate-spin [animation-duration:1.6s]" />
      </div>

      {/* Texte responsive */}
      <p className="mt-10 text-white/80 text-base sm:text-sm animate-pulse max-w-xs sm:max-w-md">
        L’univers <span className="text-pink-400 font-semibold">Eloquia</span> se prépare...
      </p>
    </div>
  )
}
