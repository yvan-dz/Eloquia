"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import {
  updatePassword,
  deleteUser,
  onAuthStateChanged,
} from "firebase/auth"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Lock, Trash2, Mail } from "lucide-react"

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
    if (!newPassword) return setMessage("⚠️ New password required.")
    try {
      setLoading(true)
      await updatePassword(user, newPassword)
      setMessage("✅ Password successfully updated.")
      setNewPassword("")
    } catch (err) {
      setMessage("❌ Error while updating password.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This action is irreversible.")) return
    try {
      setLoading(true)
      await deleteUser(user)
      setMessage("🗑️ Account deleted.")
      router.push("/register")
    } catch (err) {
      setMessage("❌ Error. You must log in again to delete your account.")
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white py-20 px-4">
        <div className="max-w-lg mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-8 space-y-8">
          <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
            👤 My Profile
          </h1>

          <div className="text-center text-white/80 text-sm flex items-center justify-center gap-2">
            <Mail className="w-4 h-4 text-white/50" />
            <span className="truncate">{user?.email}</span>
          </div>

          <div className="space-y-4">
            <label className="block text-sm text-white/70">🔒 New password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-white/40" />
              <Input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 bg-slate-800/60 border-white/10 text-white"
              />
            </div>
            <Button
              onClick={handlePasswordChange}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Update password"}
            </Button>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleDeleteAccount}
              className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete my account
            </Button>
          </div>

          {message && (
            <p className="text-center text-sm pt-2 text-yellow-400">{message}</p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
