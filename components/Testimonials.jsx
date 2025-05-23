"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote:
      "I finally found a tool where I can speak in French and get AI replies that sound truly human. It’s like having a multilingual coach.",
    name: "Alicia V.",
    role: "Language Learner",
  },
  {
    quote:
      "Eloquia helped me transcribe a full workshop video in seconds. I could ask AI specific questions about the content — incredible!",
    name: "Thomas G.",
    role: "Design Thinking Coach",
  },
  {
    quote:
      "The CEFR test felt smooth and smart. I got instant feedback on my speaking and writing. Way better than other platforms I tried.",
    name: "Lina K.",
    role: "International Student",
  },
  {
    quote:
      "I use Eloquia to review business meetings with my German team. The AI chat is super helpful and fast.",
    name: "Marc S.",
    role: "Startup Founder",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const current = testimonials[index];

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 text-transparent bg-clip-text drop-shadow">
        💬 Trusted by Our Users
      </h2>

      <div className="relative max-w-2xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl shadow-xl transition-all duration-500">
        <p className="italic text-white/80 text-lg text-center min-h-[100px] transition-opacity duration-500 ease-in-out">
          “{current.quote}”
        </p>
        <p className="text-center text-white font-semibold mt-4">
          — {current.name},{" "}
          <span className="text-white/60">{current.role}</span>
        </p>

        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 px-2">
          <button
            onClick={prev}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition text-white"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 px-2">
          <button
            onClick={next}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition text-white"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${i === index ? "bg-pink-400" : "bg-white/20"} transition`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
