"use client"

import Image from "next/image"
import { Sparkles, Users, ShieldCheck } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-6 py-20">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Main Title */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
            🙋‍♂️ About the Eloquia Project
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            A powerful technology born from a passion for AI, voice, and innovation. Built with precision and a strong focus on user privacy.
          </p>
        </header>

        {/* Team / Founder Section */}
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
              Yvan Dzefak – Founder & Lead Developer
            </h2>
            <p className="text-white/70 text-base leading-relaxed">
              I’m a web & cloud developer passionate about artificial intelligence, user experience, and SaaS solutions.
              This project is the result of several months of design and development with a dedicated team, centered around one clear goal:
              to deliver a modern, intuitive, ethical, and high-performance solution.
            </p>
            <p className="text-white/60 text-sm italic">
              “Every feature is designed to meet a real need, not just to look pretty.”
            </p>
          </div>
        </section>

        {/* Project Values */}
        <section className="text-center space-y-8">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 text-transparent bg-clip-text">
            🌟 Our Pillars
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card icon={<Sparkles className="w-6 h-6 text-pink-400" />} title="Continuous Innovation" desc="We integrate the latest technologies to offer you cutting-edge AI experiences." />
            <Card icon={<Users className="w-6 h-6 text-yellow-300" />} title="Human-Centered Approach" desc="We listen to users' needs and adapt our evolution accordingly." />
            <Card icon={<ShieldCheck className="w-6 h-6 text-purple-400" />} title="Respect & Privacy" desc="Your data is sacred. No resale, no external analysis, ever." />
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center pt-10">
          <p className="text-white/80 text-lg">Want to know more or collaborate with us?</p>
          <a
            href="/contact"
            className="inline-block mt-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition"
          >
            Contact us →
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
