"use client"

import Link from "next/link"
import { ShieldCheck, Server, FileCheck2, LockKeyhole, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProPage() {
  return (
    <div className="min-h-screen px-6 py-24 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <div className="max-w-5xl mx-auto space-y-20">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
            🛡️ Eloquia Pro – Confidential AI for Professionals
          </h1>
          <p className="text-white/70 text-lg max-w-3xl mx-auto">
            Working with sensitive data? Eloquia Pro offers a <strong>100% local</strong>, <strong>secure</strong>, and <strong>privacy-first</strong> transcription and AI solution.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Feature icon={<ShieldCheck className="text-yellow-300 w-7 h-7" />} title="Absolute privacy">
            No data is ever sent to remote servers. Your videos, audios, and transcripts stay entirely within your environment.
          </Feature>
          <Feature icon={<Server className="text-pink-300 w-7 h-7" />} title="Installed on your machines">
            Flexible deployment: executable file, server installation or Docker. Transcription works even without an internet connection.
          </Feature>
          <Feature icon={<FileCheck2 className="text-purple-300 w-7 h-7" />} title="Professional-grade performance">
            Fast transcription, responsive AI, detailed summaries, contextual chat… optimized for demanding workflows.
          </Feature>
          <Feature icon={<LockKeyhole className="text-green-300 w-7 h-7" />} title="Security & compliance">
            Ideal for legal, education, healthcare, HR, and media sectors. Meet your obligations without exposing your data.
          </Feature>
        </div>

        {/* Use cases */}
        <section className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-10 space-y-10">
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300 text-transparent bg-clip-text">
            🧠 Who can benefit from Eloquia Pro?
          </h2>
          <p className="text-white/70 text-center max-w-3xl mx-auto text-lg">
            Eloquia Pro is designed for anyone dealing with confidential, strategic, or regulated content.
            Here are some typical users who already trust us:
          </p>

          <div className="grid md:grid-cols-2 gap-8 text-white/80 text-sm">
            <UseCase
              title="⚖️ Law Firms & Attorneys"
              content="Transcribe hearings, client meetings, or confidential memos without any file transfer to the cloud."
            />
            <UseCase
              title="🏫 Universities & Training Centers"
              content="Let teachers transcribe recorded or filmed lectures locally, with integrated AI for summaries."
            />
            <UseCase
              title="🎙️ Media & Journalists"
              content="Convert interviews, podcasts, or sensitive videos into usable text, without relying on external platforms."
            />
            <UseCase
              title="🏥 Healthcare Professionals"
              content="Transcribe medical voice notes or training videos while ensuring patient data privacy."
            />
          </div>
        </section>

        {/* Download block */}
        <section className="text-center space-y-8 p-8 border border-white/10 rounded-3xl backdrop-blur bg-white/5 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 text-transparent bg-clip-text drop-shadow">
            🖥️ Download Eloquia Pro for Desktop
          </h2>

          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Enjoy a smooth local experience with our dedicated app.<br />
            Ideal for schools, companies, law firms and media that want to go further.
          </p>

          <Link href="/Eloquia.Assistant.exe" target="_blank">
            <Button className="mt-4 bg-gradient-to-r from-pink-400 via-purple-500 to-yellow-400 hover:scale-105 transition-all duration-300 text-black font-bold shadow-xl rounded-full px-8 py-4 text-lg">
              🚀 Download Eloquia Pro for Desktop
            </Button>
          </Link>


          <div className="text-white/60 text-sm italic max-w-md mx-auto pt-6 space-y-3">
            <p>⚠️ An activation key is required to use the app.</p>
            <p>
              To get your key,
              <Link href="/contact" className="underline text-pink-400 hover:text-yellow-300 ml-1">
                contact us →
              </Link>
            </p>
          </div>
        </section>

        {/* Direct contact */}
        <div className="text-center pt-10 text-white/60 text-sm flex flex-col items-center gap-2">
          <Mail className="w-5 h-5 text-pink-400" />
          Prefer direct contact? Write to{" "}
          <a href="mailto:yvandzefak1@gmail.com" className="underline text-white hover:text-pink-300">Eloquia Team</a>
        </div>
      </div>
    </div>
  )
}

function Feature({ icon, title, children }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4 hover:scale-[1.015] transition">
      {icon}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-white/70 text-sm">{children}</p>
    </div>
  )
}

function UseCase({ title, content }) {
  return (
    <div className="bg-black/30 border border-white/10 rounded-xl p-5 hover:scale-[1.015] transition duration-300">
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70">{content}</p>
    </div>
  )
}
