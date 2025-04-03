"use client"

import { useState } from "react"
import { Send, User, Mail, MessageCircle, CheckCircle } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [toast, setToast] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await addDoc(collection(db, "messages"), {
        ...form,
        timestamp: serverTimestamp(),
      })

      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      setForm({ name: "", email: "", message: "" })
      setToast(true)
      setTimeout(() => setToast(false), 3000)
    } catch (error) {
      console.error("Erreur d'envoi :", error)
      alert("Une erreur est survenue. Merci d’essayer plus tard.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#1a1a2e] text-white px-6 py-20 space-y-24">
      <div className="max-w-2xl mx-auto space-y-12 relative">

        {/* ✅ Toast animé */}
        {toast && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-xl animate-slide-down z-50">
            <CheckCircle className="w-4 h-4" />
            Message envoyé avec succès !
          </div>
        )}

        {/* 📬 En-tête */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 bg-clip-text text-transparent">
            📬 Contactez-nous
          </h1>
          <p className="text-white/70 text-lg">
            Une question, une idée ou un projet ambitieux ? Nous sommes à votre écoute.
          </p>
        </div>

        {/* ✉️ Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 space-y-6 shadow-2xl transition-all">
          <FormInput icon={<User />} type="text" name="name" value={form.name} onChange={handleChange} placeholder="Jean Dupont" label="Votre nom" />
          <FormInput icon={<Mail />} type="email" name="email" value={form.email} onChange={handleChange} placeholder="jean@email.com" label="Adresse e-mail" />
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Votre message</label>
            <div className="flex items-start bg-white/10 border border-white/20 rounded-lg px-3 py-2">
              <MessageCircle className="w-4 h-4 mt-1 mr-2 text-white/50" />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                required
                placeholder="Décrivez votre besoin, vos idées ou vos objectifs..."
                className="w-full bg-transparent text-white placeholder:text-white/50 focus:outline-none resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {loading ? "Envoi en cours..." : "Envoyer"}
          </button>
        </form>
      </div>

      {/* 💼 CTA Entreprises - version glamour */}
      <section className="max-w-4xl mx-auto text-center space-y-6 border-t pt-16 border-white/10 px-4">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 text-transparent bg-clip-text">
          🤝 Vous êtes une entreprise ? Collaborons.
        </h2>
        <p className="text-white/80 text-lg leading-relaxed">
          Eloquia accompagne les entreprises ambitieuses dans la transformation de leurs contenus audio et vidéo grâce à l’intelligence artificielle.
          Nous vous offrons bien plus qu’une solution technique : <span className="font-semibold text-white">nous sommes votre partenaire de confiance</span>.
        </p>
        <p className="text-white/60">
          Que vous soyez une startup, une agence de création, une école ou une entreprise internationale,
          notre solution s’adapte à vos besoins avec <span className="text-pink-400 font-medium">précision, confidentialité</span> et <span className="text-yellow-300 font-medium">rapidité</span>.
        </p>
        <p className="text-white/50 italic">
          👉 Nous répondons à toutes les demandes sous 24h. Ensemble, transformons votre façon de travailler avec la voix et la vidéo.
        </p>
        <div className="mt-6">
          <a
            href="mailto:yvandzefak1@gmail.com"
            className="inline-block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:scale-105 transition transform"
          >
            📩 Discutons de votre projet
          </a>
        </div>
      </section>
    </div>
  )
}

function FormInput({ icon, type, name, value, onChange, placeholder, label }) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium text-white/80">{label}</label>
      <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-3 py-2">
        <div className="text-white/50 mr-2">{icon}</div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full bg-transparent text-white placeholder:text-white/50 focus:outline-none"
        />
      </div>
    </div>
  )
}
