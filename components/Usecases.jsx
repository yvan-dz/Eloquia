// components/Usecases.jsx
"use client";

const useCases = [
  {
    title: "🎙️ Créateurs de contenu",
    desc: "Transcrivez vos vidéos YouTube, TikTok ou podcasts automatiquement. Gagnez du temps pour les sous-titres, résumés et scripts.",
  },
  {
    title: "📢 Journalistes & Interviewers",
    desc: "Importez vos interviews, résumez-les, extrayez les moments clés ou interrogez directement le contenu.",
  },
  {
    title: "⚖️ Juridique & RH",
    desc: "Analyse de réunions, comptes rendus juridiques, synthèse de documents audios confidentiels en toute sécurité.",
  },
  {
    title: "🧑‍🏫 Enseignants & Étudiants",
    desc: "Transcription de cours, résumés intelligents, révisions guidées. Eloquia devient votre assistant de révision.",
  },
  {
    title: "👩‍💼 Services clients & CRM",
    desc: "Enregistrez vos appels ou réunions avec vos clients et transformez-les en comptes rendus automatiques exploitables.",
  },
  {
    title: "💡 Startups & Produit",
    desc: "Regroupez vos notes vocales, brainstormings, retours utilisateurs et construisez vos décisions produit plus rapidement.",
  },
];

export default function Usecases() {
  return (
    <section className="text-center py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-700/10 to-yellow-500/10 blur-[100px] opacity-30 z-0" />
      <div className="relative z-10 space-y-12 max-w-6xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 text-transparent bg-clip-text drop-shadow">
          ✨ Cas d’usage concrets d’Eloquia
        </h3>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Eloquia s’adapte à tous les métiers. Découvrez comment notre IA change la donne selon votre secteur.
        </p>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          {useCases.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3 hover:shadow-pink-500/20 transition-all"
            >
              <div className="text-yellow-300 font-bold text-lg">{item.title}</div>
              <p className="text-white/70 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
