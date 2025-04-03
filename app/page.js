"use client";
import Testimonials from "@/components/Testimonials"
import HeroSection from "@/components/HeroSection";
import Usecases from "@/components/Usecases";
import Pricing from "@/components/Pricing";
import Link from "next/link";
import { Video, Sparkles, Wand2, Lock, MessageCircle, Settings, Shield, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-[#0d0c1d] via-[#1f1a38] to-[#0d0c1d] text-white px-6 py-20">
      <div className="max-w-7xl mx-auto space-y-24">

        {/* HERO */}
        <HeroSection />

        {/* AVANTAGES */}
        <section>
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 text-transparent bg-clip-text mb-10">
            🔐 Vos avantages avec Eloquia
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Advantage icon={<Lock className="w-6 h-6" />} title="Sécurité" desc="Toutes vos données restent privées. Aucune conservation." />
            <Advantage icon={<Wand2 className="w-6 h-6" />} title="IA avancée" desc="Des résultats précis, même pour des contenus complexes." />
            <Advantage icon={<MessageCircle className="w-6 h-6" />} title="Interaction naturelle" desc="Discutez avec vos fichiers comme avec un humain." />
          </div>
        </section>

        {/* COMMENT CA MARCHE */}
        <section className="relative text-center space-y-6 py-16">
          <div className="absolute inset-0 blur-[120px] opacity-20 bg-gradient-to-r from-pink-500 via-purple-600 to-yellow-400 rounded-full z-0" />
          <h2 className="text-3xl font-bold z-10 relative bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 text-transparent bg-clip-text">
            🚀 Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto z-10 relative">
            {[
              ["Uploader un fichier", "Audio ou vidéo."],
              ["Transcription IA", "Rapide, fiable et multilingue."],
              ["Dialogue avec vos textes", "Posez vos questions."],
              ["Export", "Récupérez vos résultats en TXT/PDF."],
            ].map(([title, desc], i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-md hover:shadow-pink-400/30 transition-all">
                <p className="text-xl font-semibold">{title}</p>
                <p className="text-sm text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FONCTIONNALITÉS */}
        <section className="text-center space-y-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 text-transparent bg-clip-text">
            🧠 Fonctionnalités puissantes
          </h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            <Feature icon={<Video className="w-5 h-5 mr-2" />} text="Transcription audio & vidéo" />
            <Feature icon={<Sparkles className="w-5 h-5 mr-2" />} text="Résumé intelligent" />
            <Feature icon={<MessageCircle className="w-5 h-5 mr-2" />} text="Assistant conversationnel" />
            <Feature icon={<Shield className="w-5 h-5 mr-2" />} text="Données privées" />
            <Feature icon={<Settings className="w-5 h-5 mr-2" />} text="Export TXT & PDF" />
          </div>
        </section>

        {/* TÉMOIGNAGE */}
        <Testimonials />

        {/* TARIFS */}
        <Pricing />

        {/* NOUVELLE SECTION CTA : REJOIGNEZ LA COMMUNAUTÉ */}
        <Usecases />

      </div>
    </main>
  );
}

// COMPOSANTS
function Feature({ icon, text }) {
  return (
    <div className="bg-white/10 text-white border border-white/10 px-4 py-2 rounded-full flex items-center shadow hover:bg-white/20 transition">
      {icon}
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

function Advantage({ icon, title, desc }) {
  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-md hover:shadow-pink-500/30 transition-all text-center">
      <div className="text-pink-400 mb-2">{icon}</div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-white/70">{desc}</p>
    </div>
  );
}

function PricingPlan({ title, price, features, highlight = false }) {
  return (
    <div className={`p-6 rounded-2xl border border-white/10 ${highlight ? "bg-white/10 shadow-xl" : "bg-white/5"} space-y-4 transition hover:scale-[1.02]`}>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-3xl font-extrabold">{price}</p>
      <ul className="text-white/70 text-sm space-y-1">
        {features.map((f, i) => <li key={i}>• {f}</li>)}
      </ul>
      <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110">Choisir</Button>
    </div>
  );
}
