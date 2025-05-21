"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const faqs = [
  {
    question: "What can Eloquia do?",
    answer:
      "Eloquia transcribes video or audio files, summarizes the content, answers your questions, evaluates your speaking and writing skills, and determines your CEFR language level through personalized tests.",
  },
  {
    question: "Can I transcribe online videos?",
    answer:
      "Yes. Just paste a YouTube or other supported link, and Eloquia will handle the transcription automatically.",
  },
  {
    question: "Can I chat with the AI after transcription?",
    answer:
      "Absolutely. Once your transcript is ready, you can ask questions, get summaries, or discuss the content with Eloquia like with a real assistant.",
  },
  {
    question: "Is my data stored?",
    answer:
      "No. We do not store any audio, video, or transcription data. Everything is processed temporarily and deleted for your privacy.",
  },
  {
    question: "Can Eloquia correct my texts or improve my writing?",
    answer:
      "Yes. Eloquia provides stylistic improvements, grammar corrections, and clear reformulations while respecting your original intent.",
  },
  {
    question: "What is the CEFR level test?",
    answer:
      "The level test evaluates your reading, listening, speaking, and writing based on CEFR standards. You receive individual scores and a final level with detailed AI feedback in your chosen language.",
  },
  {
    question: "Can I export my results?",
    answer:
      "Yes. You can export your transcriptions or AI discussions in plain text format for further use.",
  }
]


export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState(null)

  const toggle = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index))
  }

  return (
    <div className="min-h-screen px-6 py-20 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <div className="max-w-5xl mx-auto space-y-14">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 bg-clip-text text-transparent">
            ✨ Frequently Asked Questions
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Got a question? We’ve got the answer. Here are the most common questions about our AI video assistant.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((item, index) => {
            const isOpen = activeIndex === index
            return (
              <div
                key={index}
                className={`border border-white/10 bg-white/5 rounded-xl overflow-hidden transition-all duration-300 shadow-md ${
                  isOpen ? "shadow-pink-500/20" : ""
                }`}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-white/10 transition duration-300"
                >
                  <span className="text-lg font-semibold tracking-wide">{item.question}</span>
                  <motion.div
                    initial={false}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-white" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white" />
                    )}
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.97 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="px-6 pb-5 text-white/80 text-sm leading-relaxed"
                    >
                      {item.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
