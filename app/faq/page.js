"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const faqs = [
  {
    question: "How does video transcription work?",
    answer:
      "The assistant automatically converts your audio or video files into text, allowing for smooth, fast, and intuitive analysis.",
  },
  {
    question: "Is my data stored?",
    answer:
      "No. Out of full respect for your privacy, no personal data or transcription is saved. Your files are processed in real time and then deleted.",
  },
  {
    question: "Can I talk to the AI after the transcription?",
    answer:
      "Yes. Once the transcription is complete, you can ask questions, request a summary, or continue the conversation like with a real personal assistant.",
  },
  {
    question: "Can it correct mistakes or improve writing style?",
    answer:
      "Absolutely. The AI corrects errors and elegantly rewrites your text while staying true to your original intent.",
  },
  {
    question: "Can I use the assistant with online videos?",
    answer:
      "Yes. You simply paste a link to the video. The system handles the rest automatically.",
  },
  {
    question: "Is there a live version?",
    answer:
      "Yes. A special mode allows real-time recording and transcription, with the ability to interact with the AI live.",
  },
  {
    question: "Can I export my transcriptions?",
    answer:
      "Of course. You can download your transcription or the AI conversation at any time in plain text format.",
  },
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
