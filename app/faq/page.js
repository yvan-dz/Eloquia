"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const faqs = [
  {
    question: "Comment fonctionne la transcription vidéo ?",
    answer:
      "L’assistant convertit automatiquement vos fichiers audio ou vidéo en texte, pour vous permettre une analyse fluide, rapide et intuitive.",
  },
  {
    question: "Mes données sont-elles enregistrées ?",
    answer:
      "Non. Par respect total de votre vie privée, aucune donnée personnelle ni transcription n’est stockée. Vos fichiers sont traités en temps réel et supprimés ensuite.",
  },
  {
    question: "Puis-je discuter avec l’IA après la transcription ?",
    answer:
      "Oui. Une fois la transcription terminée, vous pouvez poser des questions, demander un résumé ou poursuivre la discussion comme avec un véritable assistant personnel.",
  },
  {
    question: "Peut-elle corriger les fautes ou améliorer le style ?",
    answer:
      "Absolument. L’IA corrige les erreurs et reformule élégamment votre texte tout en restant fidèle à l’intention originale.",
  },
  {
    question: "Puis-je utiliser l’assistant avec des vidéos en ligne ?",
    answer:
      "Oui. Il vous suffit de coller un lien vers la vidéo concernée. Le système se chargera du reste, automatiquement.",
  },
  {
    question: "Existe-t-il une version en direct (live) ?",
    answer:
      "Oui. Un mode spécial permet d’enregistrer et transcrire en direct, avec la possibilité d’interagir avec l’IA en temps réel.",
  },
  {
    question: "Puis-je exporter mes transcriptions ?",
    answer:
      "Bien sûr. Vous pouvez télécharger votre transcription ou la conversation avec l’IA à tout moment, au format texte.",
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
            ✨ Foire Aux Questions
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Vous avez une question ? Nous avons la réponse. Voici les interrogations les plus fréquentes à propos de notre assistant vidéo IA.
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
