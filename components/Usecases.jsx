"use client";

const useCases = [
  {
    title: "🎙️ Content Creators",
    desc: "Transcribe your videos or podcasts, generate summaries, and ask AI for script ideas or highlights.",
  },
  {
    title: "📚 Language Learners",
    desc: "Take CEFR-level tests and improve your speaking, listening, reading, and writing with AI guidance.",
  },
  {
    title: "🌍 Multilingual Professionals",
    desc: "Chat with the AI in English, French, German or Spanish to practice fluency or get help across languages.",
  },
  {
    title: "🎥 Journalists & Researchers",
    desc: "Import interviews or reports, get transcripts and explore them with targeted AI questions.",
  },
  {
    title: "🧑‍🏫 Teachers & Students",
    desc: "Use Eloquia as your personal study assistant — summarize lectures, practice oral skills, and assess your level.",
  },
  {
    title: "💼 Remote Teams & Product Leads",
    desc: "Capture user calls or internal demos, transcribe them, and extract key insights for faster decisions.",
  },
];

export default function Usecases() {
  return (
    <section className="text-center py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-700/10 to-yellow-500/10 blur-[100px] opacity-30 z-0" />
      <div className="relative z-10 space-y-12 max-w-6xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 text-transparent bg-clip-text drop-shadow">
          ✨ Real Use Cases of Eloquia
        </h3>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Eloquia adapts to your voice, your goals, and your language. Discover how people use it every day.
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
