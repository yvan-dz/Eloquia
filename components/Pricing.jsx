"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
  {
    title: "Découverte",
    price: "4.99€/mois",
    features: [
      "3 heures/mois",
      "Transcription standard",
      "Export TXT",
      "IA de base : résumé & questions",
    ],
  },
  {
    title: "Standard",
    price: "13.99€/mois",
    highlight: true,
    features: [
      "10 heures/mois",
      "Transcription avancée",
      "Résumé & chat IA",
      "Export TXT & PDF",
      "Support email prioritaire",
    ],
  },
  {
    title: "Pro",
    price: "29.99€/mois",
    features: [
      "20 heures/mois",
      "Toutes les fonctionnalités IA",
      "3h de transcription live (micro + texte en temps réel)",
      "Export PDF illimité",
      "Accès anticipé aux nouveautés",
      "Support prioritaire",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="text-center space-y-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
        💸 Tarification flexible
      </h2>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl border border-white/10 ${
              plan.highlight ? "bg-white/10 shadow-xl" : "bg-white/5"
            } space-y-4 transition hover:scale-[1.02]`}
          >
            <h3 className="text-xl font-bold">{plan.title}</h3>
            <p className="text-3xl font-extrabold">{plan.price}</p>
            <ul className="text-white/70 text-sm space-y-1">
              {plan.features.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
            <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110">
              Choisir
            </Button>
          </div>
        ))}
      </div>

      <div className="text-sm text-white/60 italic max-w-xl mx-auto pt-4">
        Besoin de plus ? Pour les usages intensifs (écoles, médias, entreprises…)
        <Link
          href="/contact"
          className="text-pink-400 font-semibold hover:underline ml-1"
        >
          contactez-nous pour un tarif sur mesure →
        </Link>
      </div>
    </section>
  );
}
