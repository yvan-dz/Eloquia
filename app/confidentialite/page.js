"use client"

import { ShieldCheck, FileLock, Trash2, EyeOff } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen px-6 py-24 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <div className="max-w-4xl mx-auto space-y-14">

        {/* Main Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 text-transparent bg-clip-text">
            🔒 Privacy Policy
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Transparency, respect, and security. Here's how your data is protected on our platform.
          </p>
        </div>

        {/* Key Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* No hidden tracking */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <ShieldCheck className="text-pink-400 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Zero Hidden Collection</h3>
            <p className="text-white/70 text-sm">
              No personal data is collected without your knowledge. We do not store your name, address, or usage history.
            </p>
          </div>

          {/* No database */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <FileLock className="text-purple-400 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Temporary Processing</h3>
            <p className="text-white/70 text-sm">
              Your files are processed directly in memory. They are never stored on our servers or transferred to third parties.
            </p>
          </div>

          {/* Auto deletion */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <Trash2 className="text-yellow-400 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Immediate Deletion</h3>
            <p className="text-white/70 text-sm">
              As soon as the transcription or AI response is complete, the files are automatically deleted. No saving, no backups.
            </p>
          </div>

          {/* No ads or tracking */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition">
            <EyeOff className="text-teal-400 w-7 h-7 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Advertising</h3>
            <p className="text-white/70 text-sm">
              We do not serve ads, share any data, or perform marketing tracking. Your navigation is free, anonymous, and respected.
            </p>
          </div>
        </div>

        {/* Your Rights */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-8 shadow-lg">
          <h3 className="text-lg font-semibold mb-2 text-white">Your Rights & Your Control</h3>
          <p className="text-white/70 text-sm leading-relaxed">
            You retain full control over the content you process on our platform. No input, transmission, or generated data is kept or used for any purpose other than your immediate use. If you have any questions or want to request manual deletion, feel free to contact us at any time.
          </p>
        </div>

        {/* Update date */}
        <div className="text-center pt-10 text-white/60 text-sm">
          Policy last updated on{" "}
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
