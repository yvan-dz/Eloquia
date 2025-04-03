"use client"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import {
  updatePassword,
  deleteUser,
  onAuthStateChanged,
  signOut,
} from "firebase/auth"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function UserPage() {
  const [user, setUser] = useState(null)
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login")
      } else {
        setUser(currentUser)
      }
    })
    return () => unsubscribe()
  }, [router])
  

  const handlePasswordChange = async () => {
    setMessage("")
    if (!newPassword) return setMessage("⚠️ Nouveau mot de passe requis.")
    try {
      setLoading(true)
      await updatePassword(user, newPassword)
      setMessage("✅ Mot de passe mis à jour avec succès.")
      setNewPassword("")
    } catch (err) {
      setMessage("❌ Erreur lors de la mise à jour.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Êtes-vous sûr ? Cette action est irréversible.")) return
    try {
      setLoading(true)
      await deleteUser(user)
      setMessage("🗑️ Compte supprimé.")
      router.push("/register")
    } catch (err) {
      setMessage("❌ Erreur. Vous devez vous reconnecter pour supprimer le compte.")
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-6 py-20">
      <div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-3xl backdrop-blur p-8 shadow-2xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
          👤 Mon Profil
        </h1>

        <p className="text-white/70 text-center">Adresse e-mail : <strong>{user?.email}</strong></p>

        <div className="space-y-4">
          <label className="block text-sm text-white/70">Nouveau mot de passe</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-slate-800/60 border-white/10 text-white"
          />
          <Button
            onClick={handlePasswordChange}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Mettre à jour"}
          </Button>
        </div>

        <div className="pt-6">
          <Button
            onClick={handleDeleteAccount}
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg"
          >
            Supprimer mon compte
          </Button>
        </div>

        {message && <p className="text-center text-sm pt-2 text-yellow-400">{message}</p>}
      </div>
    </div>
    </ProtectedRoute>
  )
}
