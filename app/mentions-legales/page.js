"use client"

import { Gavel, Mail, Server, User2 } from "lucide-react"

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen px-6 py-24 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <div className="max-w-4xl mx-auto space-y-14">
        {/* Titre principal */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 text-transparent bg-clip-text">
            ⚖️ Mentions Légales
          </h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Informations officielles concernant le site, son éditeur et son hébergement.
          </p>
        </div>

        {/* Contenu détaillé */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <User2 className="text-purple-400 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-1">Éditeur</h3>
            <p className="text-white/70 text-sm">
              Yvan R. – Développeur indépendant<br />
              Créateur du site <strong>Assistant Vidéo IA</strong>
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <Server className="text-pink-400 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-1">Hébergement</h3>
            <p className="text-white/70 text-sm">
              Vercel Inc.<br />
              440 N Barranca Ave #4133, Covina, CA 91723
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <Mail className="text-yellow-300 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-1">Contact</h3>
            <p className="text-white/70 text-sm">
              📩 <a href="mailto:assistant-ia@yvan.dev" className="underline hover:text-white">
                assistant-ia@yvan.dev
              </a>
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <Gavel className="text-teal-300 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-1">Droits & Licences</h3>
            <p className="text-white/70 text-sm">
              Toute reproduction partielle ou totale du contenu sans autorisation est interdite. Ce site respecte le RGPD et ne collecte aucune donnée personnelle sans consentement.
            </p>
          </div>
        </div>

        <div className="text-center pt-8 text-white/60 text-sm">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>
    </div>
  )
}
