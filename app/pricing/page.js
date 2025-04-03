// app/pricing/page.js
"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, Users, Star } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    title: "🎧 Découverte",
    price: "4,99€/mois",
    description: "Parfait pour tester Eloquia en douceur.",
    features: [
      "3 heures/mois incluses",
      "Transcription standard",
      "Export TXT",
      "Résumé automatique",
      "IA basique pour questions",
    ],
  },
  {
    title: "🚀 Standard",
    price: "13,99€/mois",
    description: "Pour un usage régulier et polyvalent.",
    highlight: true,
    features: [
      "10 heures/mois",
      "Transcription avancée",
      "Résumé + chat IA",
      "Export TXT & PDF",
      "Support email prioritaire",
    ],
  },
  {
    title: "🔥 Pro",
    price: "29,99€/mois",
    description: "Pensé pour les créateurs, indépendants et pros.",
    features: [
      "20 heures/mois",
      "Toutes les fonctionnalités IA",
      "3h de transcription live incluses",
      "Export PDF illimité",
      "Accès anticipé aux nouveautés",
      "Support ultra-prioritaire",
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen py-20 px-6 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <div className="max-w-6xl mx-auto space-y-20">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
            💸 Nos Offres, Pour Tous les Usages
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Que vous soyez créateur, freelance ou une entreprise, Eloquia a une solution adaptée. Découvrez nos offres sans engagement.
          </p>
        </header>

        {/* Offres individuelles */}
        <section className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 border backdrop-blur-md transition hover:scale-[1.02] space-y-6 ${
                plan.highlight ? "bg-white/10 border-pink-400/20 shadow-2xl" : "bg-white/5 border-white/10"
              }`}
            >
              <h3 className="text-2xl font-bold">{plan.title}</h3>
              <p className="text-3xl font-extrabold">{plan.price}</p>
              <p className="text-white/60 text-sm">{plan.description}</p>
              <ul className="space-y-2 text-white/80 text-sm pt-2">
                {plan.features.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
              <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110">
                Choisir cette offre
              </Button>
            </div>
          ))}
        </section>

        {/* Offre entreprise */}
        <section className="mt-10 relative overflow-hidden rounded-3xl border border-yellow-300/20 bg-gradient-to-br from-yellow-900/30 via-pink-800/20 to-purple-900/30 p-10 shadow-2xl">
          <div className="absolute -top-10 -left-10 w-[500px] h-[500px] bg-gradient-radial from-yellow-400/30 to-transparent rounded-full blur-3xl z-0" />
          <div className="relative z-10 space-y-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 text-transparent bg-clip-text">
              🏢 Offre Entreprise & Équipe
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto text-lg">
              Vous êtes une école, un média ou une grande structure ? Profitez d’un accès personnalisé, de quotas sur mesure et d’un accompagnement premium.
            </p>
            <div className="flex justify-center items-center gap-4 text-sm font-medium text-white/90">
              <Users className="w-5 h-5 text-yellow-400" />
              <span>Multi-utilisateurs</span>
              <Star className="w-5 h-5 text-pink-400" />
              <span>API & intégrations</span>
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Support dédié 7j/7</span>
            </div>
            <Link href="/contact">
              <Button className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 hover:scale-105 text-black font-semibold shadow-lg">
                Demander un devis sur mesure →
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer note */}
        <p className="text-center text-sm text-white/60 italic pt-10">
          Tous nos abonnements sont sans engagement. Annulez à tout moment.
        </p>
      </div>
    </div>
  )
}
