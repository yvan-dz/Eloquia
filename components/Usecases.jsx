"use client";

const useCases = [
  {
    title: "🎙️ Content Creators",
    desc: "Automatically transcribe your YouTube, TikTok or podcast videos. Save time on subtitles, summaries, and scripts.",
  },
  {
    title: "📢 Journalists & Interviewers",
    desc: "Import your interviews, summarize them, extract key moments or query the content directly.",
  },
  {
    title: "⚖️ Legal & HR",
    desc: "Securely analyze meetings, legal reports, or confidential audio documents with ease.",
  },
  {
    title: "🧑‍🏫 Teachers & Students",
    desc: "Transcribe lectures, get smart summaries, and guided revisions. Eloquia becomes your study assistant.",
  },
  {
    title: "👩‍💼 Customer Service & CRM",
    desc: "Record your calls or client meetings and turn them into actionable automated reports.",
  },
  {
    title: "💡 Startups & Product Teams",
    desc: "Gather voice notes, brainstorming sessions, and user feedback to build your product decisions faster.",
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
          Eloquia adapts to all professions. Discover how our AI transforms workflows in your sector.
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
