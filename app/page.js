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
  Send,
  BookOpenCheck
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
            {/* 💬 Multilingual AI Chat */}
            <Advantage
              icon={<Globe className="w-6 h-6" />}
              title="Multilingual AI Chat"
              desc="Talk to an intelligent assistant in English, French, German or Spanish — naturally and instantly."
            />
            <Advantage
              icon={<Wand2 className="w-6 h-6" />}
              title="Context-Aware Replies"
              desc="Eloquia remembers what you said and responds with relevant, human-like answers."
            />

            {/* 📼 Video Transcription + Q&A */}
            <Advantage
              icon={<Video className="w-6 h-6" />}
              title="Smart Video Transcription"
              desc="Upload or link a video and get a full transcript. Ask the AI anything about it in seconds."
            />
            <Advantage
              icon={<MessageCircle className="w-6 h-6" />}
              title="Ask About the Video"
              desc="After transcription, simply chat with Eloquia to explore or clarify the video content."
            />

            {/* 🧪 Language Level Test */}
            <Advantage
              icon={<Sparkles className="w-6 h-6" />}
              title="Language Level Test"
              desc="Take a full CEFR test: reading, listening, speaking and writing — with instant feedback at the end."
            />
            <Advantage
              icon={<BookOpenCheck className="w-6 h-6" />}
              title="Instant Results"
              desc="Your level is clearly calculated and stored. Retake the test anytime to track your progress."
            />
          </div>
        </section>



        <section className="relative text-center py-24 px-6 md:px-12">
          <div className="absolute inset-0 blur-[160px] opacity-20 bg-gradient-to-br from-pink-500 via-purple-600 to-yellow-400 rounded-full z-0" />

          <h2 className="text-4xl font-extrabold z-10 relative bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 text-transparent bg-clip-text mb-10">
            🚀 How Does It Work?
          </h2>

          <div className="space-y-20 z-10 relative max-w-6xl mx-auto">

            {/* 🎧 Transcription + Questions */}
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white/90 mb-6 flex items-center justify-center gap-2">
                <span className="text-white/60">🎧</span> Transcribe and Explore
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  ["Drop your video", "Upload or paste a link — Eloquia transcribes it in seconds."],
                  ["Ask anything", "Ask about any part of the transcript. The AI gives you smart, instant answers."],
                  ["Save your session", "Export the transcript or chat as a file and keep your insights."]
                ].map(([title, desc], i) => (
                  <div key={i} className="bg-white/5 border border-white/10 backdrop-blur p-6 rounded-xl shadow-md hover:shadow-pink-400/30 transition-all">
                    <p className="text-lg font-semibold mb-2">{`${i + 1}. ${title}`}</p>
                    <p className="text-sm text-white/60">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 🗣️ Multilingual Chat */}
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white/90 mb-6 flex items-center justify-center gap-2">
                <span className="text-white/60">🗣️</span> Chat with AI
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  ["Select a language", "English, French, German or Spanish — Eloquia understands and replies instantly."],
                  ["Chat naturally", "Type or speak — the conversation flows like with a real person."],
                  ["Practice your fluency", "Build confidence by chatting every day with context-aware memory."]
                ].map(([title, desc], i) => (
                  <div key={i} className="bg-white/5 border border-white/10 backdrop-blur p-6 rounded-xl shadow-md hover:shadow-purple-400/30 transition-all">
                    <p className="text-lg font-semibold mb-2">{`${i + 1}. ${title}`}</p>
                    <p className="text-sm text-white/60">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 🧪 Level Test */}
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white/90 mb-6 flex items-center justify-center gap-2">
                <span className="text-white/60">🧪</span> Test Your Language Level
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  ["Start your CEFR test", "Choose your language and estimated level — Eloquia adapts accordingly."],
                  ["Complete 4 exercises", "Reading, listening, speaking and writing — all in one interactive flow."],
                  ["Get instant feedback", "Your score is calculated and shown right away, with a recap of your answers."]
                ].map(([title, desc], i) => (
                  <div key={i} className="bg-white/5 border border-white/10 backdrop-blur p-6 rounded-xl shadow-md hover:shadow-yellow-400/30 transition-all">
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
            <Feature icon={<Video className="w-5 h-5 mr-2" />} text="Video transcription & Q&A" />
            <Feature icon={<MessageCircle className="w-5 h-5 mr-2" />} text="Multilingual AI chat" />
            <Feature icon={<Sparkles className="w-5 h-5 mr-2" />} text="CEFR level test (A1–C2)" />
            <Feature icon={<Shield className="w-5 h-5 mr-2" />} text="Private & secure usage" />
            <Feature icon={<Settings className="w-5 h-5 mr-2" />} text="Export chat & transcript" />
            <Feature icon={<Wand2 className="w-5 h-5 mr-2" />} text="Natural, smart responses" />
          </div>
        </section>


        {/* TESTIMONIALS */}
        <Testimonials />

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
