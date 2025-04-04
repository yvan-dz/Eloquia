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
            Ces informations sont fournies en conformité avec les obligations légales afin de garantir la transparence et la confiance envers les utilisateurs.
          </p>
        </div>

        {/* Bloc infos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Éditeur */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <User2 className="text-purple-400 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-1">Éditeur du site</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Ce site est édité par :<br />
              <strong>Yvan R.</strong><br />
              Développeur indépendant – Fondateur de la plateforme <strong>Assistant Vidéo IA</strong>.
              <br />
              Le site est destiné à fournir un service automatisé de transcription audio/vidéo assisté par intelligence artificielle.
            </p>
          </div>

          {/* Hébergeur */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <Server className="text-pink-400 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-1">Hébergement</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Le site est hébergé par :
              <br />
              <strong>Render.com</strong><br />
              300 California St, Floor 4,<br />
              San Francisco, CA 94104, États-Unis.
              <br />
              Render assure l’infrastructure technique, mais n’est pas responsable du contenu publié sur ce site.
            </p>
          </div>


          {/* Contact */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <Mail className="text-yellow-300 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-1">Contact</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Pour toute question ou réclamation, vous pouvez contacter l’éditeur à l’adresse suivante :
              <br />
              📩{" "}
              <a href="mailto:assistant-ia@yvan.dev" className="underline hover:text-white">
                assistant-ia@yvan.dev
              </a>
            </p>
          </div>

          {/* Droits & RGPD */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <Gavel className="text-teal-300 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-1">Conditions & Confidentialité</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              L'ensemble du contenu de ce site (textes, codes, interface) est protégé par le droit d'auteur.
              Toute reproduction ou diffusion, même partielle, est strictement interdite sans accord préalable écrit.
              <br /><br />
              Les fichiers traités (audio, vidéo, textes) ne sont ni enregistrés ni stockés. Toutes les données transmises restent strictement confidentielles et sont automatiquement supprimées après traitement.
              Aucune donnée personnelle n’est conservée.
            </p>
          </div>
        </div>

        {/* Clause responsabilité */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-8 shadow-lg">
          <h3 className="text-lg font-semibold mb-2 text-white">Clause de responsabilité</h3>
          <p className="text-white/70 text-sm leading-relaxed">
            L’éditeur met tout en œuvre pour assurer l’exactitude des informations proposées sur le site. Toutefois, sa responsabilité ne saurait être engagée en cas d’omission, d’erreur ou de résultats obtenus via l’usage des outils proposés. L’utilisateur reste seul responsable de l’usage qu’il fait des transcriptions générées.
          </p>
        </div>

        <div className="text-center pt-10 text-white/60 text-sm">
          Dernière mise à jour :{" "}
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
