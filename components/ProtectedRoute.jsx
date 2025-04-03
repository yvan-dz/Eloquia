"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Loading from "@/app/loading"

export default function ProtectedRoute({ children }) {
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
      } else {
        router.push("/login")
      }
      setCheckingAuth(false)
    })

    return () => unsubscribe()
  }, [router])

  if (checkingAuth) {
    return <Loading /> // ton loader fluide
  }

  // 🔒 Sécurité supplémentaire : ne rien afficher si pas loggé
  if (!user) return null

  return <>{children}</>
}
