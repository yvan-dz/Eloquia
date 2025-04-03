// app/about/page.js
"use client"

import Image from "next/image"
import { Sparkles, Users, ShieldCheck } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-6 py-20">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Titre principal */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
            🙋‍♂️ À propos du projet Eloquia
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Une technologie puissante née d'une passion pour l'IA, la voix et l'innovation. Conçue avec rigueur et une attention particulière à la confidentialité des utilisateurs.
          </p>
        </header>

        {/* Section équipe / fondateur */}
        <section className="flex flex-col lg:flex-row items-center gap-12 bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl backdrop-blur-md">
        <div className="w-full lg:w-[380px] aspect-[3/4] overflow-hidden rounded-2xl shadow-xl border border-white/10">
  <Image
    src="/yvan.jpg"
    alt="Yvan Dzefak"
    width={500}
    height={666}
    className="object-cover w-full h-full"
  />
</div>

  <div className="flex-1 space-y-5 text-center lg:text-left">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 text-transparent bg-clip-text">
      Yvan Dzefak – Fondateur & Développeur principal
    </h2>
    <p className="text-white/70 text-base leading-relaxed">
      Je suis développeur web & cloud, passionné par l’intelligence artificielle, l’expérience utilisateur et les solutions SaaS.
      Ce projet est le fruit de plusieurs mois de conception et de développement avec une équipe impliquée, autour d’un objectif clair :
      proposer une solution moderne, intuitive, éthique et performante.
    </p>
    <p className="text-white/60 text-sm italic">
      “Chaque fonctionnalité est pensée pour résoudre un vrai besoin, pas juste pour faire joli.”
    </p>
  </div>
</section>


        {/* Valeurs du projet */}
        <section className="text-center space-y-8">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 text-transparent bg-clip-text">
            🌟 Nos piliers
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card icon={<Sparkles className="w-6 h-6 text-pink-400" />} title="Innovation continue" desc="Nous intégrons les dernières technologies pour vous offrir une expérience IA de pointe." />
            <Card icon={<Users className="w-6 h-6 text-yellow-300" />} title="Approche humaine" desc="Nous écoutons les besoins des utilisateurs et adaptons nos évolutions en fonction." />
            <Card icon={<ShieldCheck className="w-6 h-6 text-purple-400" />} title="Respect & confidentialité" desc="Vos données sont sacrées. Aucune revente, aucune analyse externe, jamais." />
          </div>
        </section>

        {/* Call to action */}
        <div className="text-center pt-10">
          <p className="text-white/80 text-lg">Vous souhaitez en savoir plus ou collaborer avec nous ?</p>
          <a
            href="/contact"
            className="inline-block mt-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition"
          >
            Contactez-nous →
          </a>
        </div>
      </div>
    </div>
  )
}

function Card({ icon, title, desc }) {
  return (
    <div className="bg-white/10 p-6 rounded-2xl border border-white/10 shadow-md hover:shadow-pink-500/30 transition-all space-y-3">
      <div className="text-center">{icon}</div>
      <h4 className="font-semibold text-lg">{title}</h4>
      <p className="text-white/70 text-sm">{desc}</p>
    </div>
  )
}
