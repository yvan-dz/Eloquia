// components/LoaderWrapper.jsx
"use client"

import { useState, useEffect } from "react"
import Loading from "@/app/loading" // ton loader 3D personnalisé

export default function LoaderWrapper({ children, minDuration = 600 }) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, minDuration)

    return () => clearTimeout(timer)
  }, [minDuration])

  if (!showContent) return <Loading />
  return children
}
