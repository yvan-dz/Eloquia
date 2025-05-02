"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
  {
    title: "Discovery",
    price: "€4.99/month",
    features: [
      "3 hours/month",
      "Standard transcription",
      "TXT export",
      "Basic AI: summary & questions",
    ],
  },
  {
    title: "Standard",
    price: "€13.99/month",
    highlight: true,
    features: [
      "10 hours/month",
      "Advanced transcription",
      "Summary & AI chat",
      "TXT & PDF export",
      "Priority email support",
    ],
  },
  {
    title: "Pro",
    price: "€29.99/month",
    features: [
      "20 hours/month",
      "All AI features",
      "3h of live transcription (microphone + real-time text)",
      "Unlimited PDF export",
      "Early access to new features",
      "Priority support",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="text-center space-y-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
        💸 Flexible Pricing
      </h2>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl border border-white/10 ${
              plan.highlight ? "bg-white/10 shadow-xl" : "bg-white/5"
            } space-y-4 transition hover:scale-[1.02]`}
          >
            <h3 className="text-xl font-bold">{plan.title}</h3>
            <p className="text-3xl font-extrabold">{plan.price}</p>
            <ul className="text-white/70 text-sm space-y-1">
              {plan.features.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
            <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110">
              Choose
            </Button>
          </div>
        ))}
      </div>

      <div className="text-sm text-white/60 italic max-w-xl mx-auto pt-4">
        Need more? For high-volume use (schools, media, companies…)
        <Link
          href="/contact"
          className="text-pink-400 font-semibold hover:underline ml-1"
        >
          contact us for a custom plan →
        </Link>
      </div>
    </section>
  );
}
