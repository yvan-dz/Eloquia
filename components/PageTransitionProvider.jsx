// src/components/PageTransitionProvider.jsx
"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Loading from "@/app/loading"

export default function PageTransitionProvider({ children }) {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timeout)
  }, [pathname])

  if (loading) return <Loading />
  return children
}
