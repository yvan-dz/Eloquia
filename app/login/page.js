"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/")
    } catch (err) {
      setError("Identifiants invalides ou compte inexistant.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-6 text-white">
      <div className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 text-transparent bg-clip-text">
          🔐 Connexion à Eloquia
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
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

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                Connexion...
              </span>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-white/60">
          Pas encore de compte ?{" "}
          <a href="/register" className="text-pink-400 hover:underline">
            Créer un compte
          </a>
        </p>
      </div>
    </div>
  )
}
