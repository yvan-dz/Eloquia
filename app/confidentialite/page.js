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
            Transparence, respect et sécurité. Voici comment vos données sont protégées sur notre plateforme.
          </p>
        </div>

        {/* Principes clés */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Aucun suivi */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <ShieldCheck className="text-pink-400 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Zéro collecte invisible</h3>
            <p className="text-white/70 text-sm">
              Aucune donnée personnelle n’est collectée à votre insu. Nous ne stockons ni nom, ni adresse, ni historique utilisateur.
            </p>
          </div>

          {/* Pas de base de données */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <FileLock className="text-purple-400 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Traitement temporaire</h3>
            <p className="text-white/70 text-sm">
              Vos fichiers sont traités directement en mémoire vive. Ils ne sont jamais stockés sur nos serveurs, ni transférés à des tiers.
            </p>
          </div>

          {/* Suppression automatique */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <Trash2 className="text-yellow-400 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Suppression immédiate</h3>
            <p className="text-white/70 text-sm">
              Dès que la transcription ou la réponse IA est terminée, les fichiers sont supprimés automatiquement. Aucun enregistrement, aucune sauvegarde.
            </p>
          </div>

          {/* Publicité & tracking */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <EyeOff className="text-teal-400 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune publicité</h3>
            <p className="text-white/70 text-sm">
              Nous ne diffusons aucune publicité, ne partageons aucune donnée, et n’effectuons aucun suivi marketing. Votre navigation est libre, anonyme et respectée.
            </p>
          </div>
        </div>

        {/* Vos droits */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-8 shadow-lg">
          <h3 className="text-lg font-semibold mb-2 text-white">Vos droits & votre contrôle</h3>
          <p className="text-white/70 text-sm leading-relaxed">
            Vous gardez le plein contrôle sur les contenus que vous traitez via notre plateforme. Aucune information saisie, transmise ou générée n’est conservée ou utilisée à d’autres fins que votre usage immédiat. Si vous avez une question ou souhaitez une suppression manuelle exceptionnelle, vous pouvez nous contacter à tout moment.
          </p>
        </div>

        {/* Mise à jour */}
        <div className="text-center pt-10 text-white/60 text-sm">
          Politique mise à jour le{" "}
          {new Date().toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  )
}
