"use client"

import { Gavel, Mail, Server, User2 } from "lucide-react"

export default function LegalNoticePage() {
  return (
    <div className="min-h-screen px-6 py-24 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <div className="max-w-4xl mx-auto space-y-14">

        {/* Main Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 text-transparent bg-clip-text">
            ⚖️ Legal Notice
          </h1>
          <p className="text-white/70 max-w-xl mx-auto">
            This information is provided in compliance with legal obligations to ensure transparency and build user trust.
          </p>
        </div>

        {/* Information Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Publisher */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <User2 className="text-purple-400 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-1">Site Publisher</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              This website is published by:<br />
              <strong>Yvan R.</strong><br />
              Independent developer – Founder of the <strong>AI Video Assistant</strong> platform.
              <br />
              The site is intended to provide an automated AI-powered audio/video transcription service.
            </p>
          </div>

          {/* Hosting */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <Server className="text-pink-400 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-1">Hosting</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              The site is hosted by:<br />
              <strong>Render.com</strong><br />
              300 California St, Floor 4,<br />
              San Francisco, CA 94104, United States.<br />
              Render provides the technical infrastructure but is not responsible for the content published on this site.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <Mail className="text-yellow-300 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-1">Contact</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              For any questions or complaints, you may contact the publisher at:
              <br />
              📩{" "}
              <a href="mailto:assistant-ia@yvan.dev" className="underline hover:text-white">
                assistant-ia@yvan.dev
              </a>
            </p>
          </div>

          {/* Rights & GDPR */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <Gavel className="text-teal-300 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-1">Terms & Privacy</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              All content on this site (texts, code, interface) is protected by copyright law.
              Any reproduction or distribution, even partial, is strictly prohibited without prior written consent.
              <br /><br />
              Processed files (audio, video, text) are neither stored nor saved. All transmitted data remains strictly confidential and is automatically deleted after processing.
              No personal data is retained.
            </p>
          </div>
        </div>

        {/* Liability Clause */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-8 shadow-lg">
          <h3 className="text-lg font-semibold mb-2 text-white">Liability Disclaimer</h3>
          <p className="text-white/70 text-sm leading-relaxed">
            The publisher strives to ensure the accuracy of the information provided on the site. However, they cannot be held liable for any omissions, errors, or results obtained from using the provided tools. Users are solely responsible for how they use the generated transcriptions.
          </p>
        </div>

        <div className="text-center pt-10 text-white/60 text-sm">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  )
}
