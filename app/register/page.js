"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    try {
      setLoading(true)
      await createUserWithEmailAndPassword(auth, email, password)
      router.push("/")
    } catch (err) {
      setError("Erreur lors de la création du compte. Email déjà utilisé ?")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-6 text-white">
      <div className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
          📝 Créer un compte Eloquia
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-white/80">Adresse e-mail</label>
            <Input
              type="email"
              placeholder="exemple@eloquia.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-800/60 border-white/10 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/80">Mot de passe</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-slate-800/60 border-white/10 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/80">Confirmer le mot de passe</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-slate-800/60 border-white/10 text-white"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-full shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                Création du compte...
              </span>
            ) : (
              "Créer mon compte"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-white/60">
          Déjà inscrit ?{" "}
          <a href="/login" className="text-yellow-300 hover:underline">
            Me connecter
          </a>
        </p>
      </div>
    </div>
  )
}
