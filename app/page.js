"use client"

import Testimonials from "@/components/Testimonials"
import HeroSection from "@/components/HeroSection"
import Usecases from "@/components/Usecases"
import Pricing from "@/components/Pricing"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Video,
  Sparkles,
  Wand2,
  Lock,
  MessageCircle,
  Settings,
  Shield,
  Globe,
  Square,
  Send
} from "lucide-react";


export default function Home() {
  return (
    <main className="bg-gradient-to-br from-[#0d0c1d] via-[#1f1a38] to-[#0d0c1d] text-white px-6 py-20">
      <div className="max-w-7xl mx-auto space-y-24">

        {/* HERO */}
        <HeroSection />

        {/* ADVANTAGES */}
        <section>
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 text-transparent bg-clip-text mb-10">
            🔥 Why Choose Eloquia?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 📄 Transcription & Chat IA */}
            <Advantage
              icon={<Video className="w-6 h-6" />}
              title="AI-Powered Transcription"
              desc="Upload your audio/video and get fast, multilingual transcripts in seconds."
            />
            <Advantage
              icon={<MessageCircle className="w-6 h-6" />}
              title="Smart Chat Interface"
              desc="Ask questions directly about your transcript. Eloquia answers like a human."
            />
            <Advantage
              icon={<Send className="w-6 h-6" />}
              title="Instant Answers"
              desc="No lag, no delay. Type your message and receive context-aware replies instantly."
            />

            {/* 🎙️ Live Chat Vocal Multilingue */}
            <Advantage
              icon={<Globe className="w-6 h-6" />}
              title="Multilingual Voice Chat"
              desc="Speak in English, French, German or Spanish — Eloquia understands and speaks your language."
            />
            <Advantage
              icon={<Square className="w-6 h-6" />}
              title="Voice Control at Your Fingertips"
              desc="Pause or mute the AI voice at any time. You decide when to listen and when to think."
            />
            <Advantage
              icon={<Wand2 className="w-6 h-6" />}
              title="Natural Conversations"
              desc="Eloquia speaks like a real person — warm, responsive, and fully aware of your previous messages."
            />
          </div>
        </section>


        <section className="relative text-center py-24 px-6 md:px-12">
          <div className="absolute inset-0 blur-[160px] opacity-20 bg-gradient-to-br from-pink-500 via-purple-600 to-yellow-400 rounded-full z-0" />

          <h2 className="text-4xl font-extrabold z-10 relative bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 text-transparent bg-clip-text mb-10">
            🚀 How Does It Work?
          </h2>

          <div className="space-y-20 z-10 relative max-w-6xl mx-auto">

            {/* 🧾 Transcription & Chat */}
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white/90 mb-6 flex items-center justify-center gap-2">
                <span className="text-white/60">🎧</span> Transcribe and Ask
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  ["Upload your media", "Drop an audio or video file. Eloquia transcribes it in seconds."],
                  ["Read or Ask", "View the full transcript and ask anything — Eloquia responds instantly."],
                  ["Export your results", "Download the conversation or transcript as PDF or TXT."]
                ].map(([title, desc], i) => (
                  <div key={i} className="bg-white/5 border border-white/10 backdrop-blur p-6 rounded-xl shadow-md hover:shadow-pink-400/30 transition-all">
                    <p className="text-lg font-semibold mb-2">{`${i + 1}. ${title}`}</p>
                    <p className="text-sm text-white/60">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 🗣️ Live Chat Multilingue */}
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white/90 mb-6 flex items-center justify-center gap-2">
                <span className="text-white/60">🗣️</span> Speak and Learn
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  ["Choose your language", "Pick French, English, German or Spanish — Eloquia adapts instantly."],
                  ["Talk freely", "Use your voice. Eloquia replies naturally in real time."],
                  ["Practice everyday", "Start new conversations daily and grow your speaking skills."]
                ].map(([title, desc], i) => (
                  <div key={i} className="bg-white/5 border border-white/10 backdrop-blur p-6 rounded-xl shadow-md hover:shadow-purple-400/30 transition-all">
                    <p className="text-lg font-semibold mb-2">{`${i + 1}. ${title}`}</p>
                    <p className="text-sm text-white/60">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>


        {/* FEATURES */}
        <section className="text-center space-y-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 text-transparent bg-clip-text">
            🧠 Powerful Features
          </h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            <Feature icon={<Video className="w-5 h-5 mr-2" />} text="Audio & video transcription" />
            <Feature icon={<Sparkles className="w-5 h-5 mr-2" />} text="Smart summaries" />
            <Feature icon={<MessageCircle className="w-5 h-5 mr-2" />} text="Conversational assistant" />
            <Feature icon={<Shield className="w-5 h-5 mr-2" />} text="Private data" />
            <Feature icon={<Settings className="w-5 h-5 mr-2" />} text="TXT & PDF export" />
          </div>
        </section>

        {/* TESTIMONIALS */}
        <Testimonials />

        {/* PRICING */}
        <Pricing />

        {/* CTA COMMUNITY SECTION */}
        <Usecases />

      </div>
    </main>
  )
}

// COMPONENTS
function Feature({ icon, text }) {
  return (
    <div className="bg-white/10 text-white border border-white/10 px-4 py-2 rounded-full flex items-center shadow hover:bg-white/20 transition">
      {icon}
      <span className="text-sm font-medium">{text}</span>
    </div>
  )
}

function Advantage({ icon, title, desc }) {
  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-md hover:shadow-pink-500/30 transition-all text-center">
      <div className="text-pink-400 mb-2">{icon}</div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-white/70">{desc}</p>
    </div>
  )
}

function PricingPlan({ title, price, features, highlight = false }) {
  return (
    <div className={`p-6 rounded-2xl border border-white/10 ${highlight ? "bg-white/10 shadow-xl" : "bg-white/5"} space-y-4 transition hover:scale-[1.02]`}>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-3xl font-extrabold">{price}</p>
      <ul className="text-white/70 text-sm space-y-1">
        {features.map((f, i) => <li key={i}>• {f}</li>)}
      </ul>
      <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110">Choose</Button>
    </div>
  )
}
