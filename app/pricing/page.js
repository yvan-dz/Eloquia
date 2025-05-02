"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, Users, Star } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    title: "🎧 Discovery",
    price: "€4.99/month",
    description: "Perfect for gently trying out Eloquia.",
    features: [
      "3 hours/month included",
      "Standard transcription",
      "TXT export",
      "Automatic summary",
      "Basic AI Q&A",
    ],
  },
  {
    title: "🚀 Standard",
    price: "€13.99/month",
    description: "For regular and versatile use.",
    highlight: true,
    features: [
      "10 hours/month",
      "Advanced transcription",
      "Summary + AI chat",
      "TXT & PDF export",
      "Priority email support",
    ],
  },
  {
    title: "🔥 Pro",
    price: "€29.99/month",
    description: "Designed for creators, freelancers, and professionals.",
    features: [
      "20 hours/month",
      "All AI features",
      "3 hours of live transcription included",
      "Unlimited PDF export",
      "Early access to new features",
      "Ultra-priority support",
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen py-20 px-6 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <div className="max-w-6xl mx-auto space-y-20">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
            💸 Our Plans for Every Need
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Whether you're a creator, freelancer, or a company, Eloquia has a solution for you. Discover our commitment-free plans.
          </p>
        </header>

        {/* Individual plans */}
        <section className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 border backdrop-blur-md transition hover:scale-[1.02] space-y-6 ${
                plan.highlight ? "bg-white/10 border-pink-400/20 shadow-2xl" : "bg-white/5 border-white/10"
              }`}
            >
              <h3 className="text-2xl font-bold">{plan.title}</h3>
              <p className="text-3xl font-extrabold">{plan.price}</p>
              <p className="text-white/60 text-sm">{plan.description}</p>
              <ul className="space-y-2 text-white/80 text-sm pt-2">
                {plan.features.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
              <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110">
                Choose this plan
              </Button>
            </div>
          ))}
        </section>

        {/* Business offer */}
        <section className="mt-10 relative overflow-hidden rounded-3xl border border-yellow-300/20 bg-gradient-to-br from-yellow-900/30 via-pink-800/20 to-purple-900/30 p-10 shadow-2xl">
          <div className="absolute -top-10 -left-10 w-[500px] h-[500px] bg-gradient-radial from-yellow-400/30 to-transparent rounded-full blur-3xl z-0" />
          <div className="relative z-10 space-y-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 text-transparent bg-clip-text">
              🏢 Business & Team Plan
            </h2>

            <p className="text-white/70 max-w-2xl mx-auto text-lg">
              Are you a school, media outlet, or large organization? Get personalized access, custom quotas, and premium support.
            </p>

            <p className="text-white/70 max-w-2xl mx-auto text-sm italic">
              🔐 For companies and organizations with strict <strong>confidentiality, security, or performance</strong> requirements, we offer a fully <strong>local</strong> version of the service. No data goes through our servers: everything is processed on your own infrastructure, ensuring maximum privacy.
            </p>

            <div className="flex justify-center items-center gap-4 text-sm font-medium text-white/90">
              <Users className="w-5 h-5 text-yellow-400" />
              <span>Multi-user</span>
              <Star className="w-5 h-5 text-pink-400" />
              <span>API & integrations</span>
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Dedicated 24/7 support</span>
            </div>

            <Link href="/contact">
              <Button className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 hover:scale-105 text-black font-semibold shadow-lg">
                Request a custom quote →
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer note */}
        <p className="text-center text-sm text-white/60 italic pt-10">
          All our subscriptions are commitment-free. Cancel anytime.
        </p>
      </div>
    </div>
  )
}
