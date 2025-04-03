"use client"

import { ShieldCheck, FileLock, Trash2, EyeOff } from "lucide-react"

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen px-6 py-24 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <div className="max-w-4xl mx-auto space-y-14">
        {/* Titre principal */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 text-transparent bg-clip-text">
            🔒 Politique de Confidentialité
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Transparence, respect et sécurité. Découvrez comment nous protégeons votre vie privée.
          </p>
        </div>

        {/* Principes clés */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <ShieldCheck className="text-pink-400 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Zéro collecte abusive</h3>
            <p className="text-white/70 text-sm">
              Aucune donnée personnelle n’est collectée sans votre accord explicite. Le respect de votre vie privée est une priorité.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <FileLock className="text-purple-400 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune conservation</h3>
            <p className="text-white/70 text-sm">
              Les fichiers sont traités en mémoire vive et immédiatement supprimés après la transcription. Aucune trace, aucun stockage.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <Trash2 className="text-yellow-400 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Suppression instantanée</h3>
            <p className="text-white/70 text-sm">
              Toutes vos vidéos et audios sont effacés automatiquement après usage. Vous restez maître de votre contenu.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <EyeOff className="text-teal-400 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune publicité</h3>
            <p className="text-white/70 text-sm">
              Vos données ne seront jamais utilisées à des fins marketing ou vendues à des tiers. Zéro publicité. Zéro tracking.
            </p>
          </div>
        </div>

        {/* Conclusion */}
        <div className="text-center pt-8 text-white/60 text-sm">
          Cette politique de confidentialité peut évoluer. Nous vous tiendrons informé de tout changement majeur.
        </div>
      </div>
    </div>
  )
}
