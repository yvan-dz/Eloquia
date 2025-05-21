"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, AlarmClock, Pencil } from "lucide-react";

const writingTimeByLevel = {
  A1: 15 * 60,
  A2: 20 * 60,
  B1: 25 * 60,
  B2: 30 * 60,
  C1: 35 * 60,
  C2: 40 * 60,
};

export default function StepWritingAI({ language = "English", level = "A1", onNext }) {
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [questions, setQuestions] = useState([]);
  const [response, setResponse] = useState("");
  const [timeLeft, setTimeLeft] = useState(writingTimeByLevel[level] || 900);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await fetch("/api/writing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language, level }),
        });
        const data = await res.json();
        setPrompt(data.prompt || "No prompt found.");
        setQuestions(data.questions || []);
      } catch (err) {
        setPrompt("Describe a memorable day in your life and explain why it was special.");
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompt();
  }, [language, level]);

  useEffect(() => {
    if (submitted || loading) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, loading]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    setEvaluating(true); // ✅ Lancement de l'évaluation

    try {
      const res = await fetch("/api/writing/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, level, answer: response }),
      });

      const data = await res.json();
      setScore(data.score ?? null);
      localStorage.setItem("leveltest-writing", JSON.stringify({ score: data.score, total: 20, level }));
      setFeedback(data.comment || "❌ No feedback provided.");
    } catch (e) {
      setScore(null);
      setFeedback("❌ An error occurred while grading your answer.");
    } finally {
      setEvaluating(false); // ✅ Fin de l'évaluation
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Generating your writing task...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 text-white space-y-6 mt-10">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
        ✍️ Writing – {language}, Level {level}
      </h2>

      <div className="bg-white/10 p-4 rounded-xl shadow-lg space-y-2">
        <p className="font-semibold text-sm text-white/70">📝 Task:</p>
        <p>{prompt}</p>
        {questions.length > 0 && (
          <ul className="list-disc list-inside text-sm text-white/80 pl-2">
            {questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        )}
      </div>

      {!submitted && (
        <div className="text-yellow-300 font-mono text-sm flex items-center gap-2">
          <AlarmClock className="w-4 h-4" /> Time left: {formatTime(timeLeft)}
        </div>
      )}

      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        disabled={submitted}
        placeholder="Write your essay here..."
        className="w-full min-h-[300px] p-5 text-white bg-slate-950 rounded-xl border border-white/10 shadow-inner focus:outline-none resize-none leading-relaxed"
        style={{ fontFamily: "inherit", fontSize: "1rem" }}
        spellCheck={false}
      />

      {!submitted ? (
        <div className="text-center">
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:brightness-110 text-white"
          >
            <Pencil className="w-4 h-4 mr-2" /> Submit Essay
          </Button>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          {evaluating ? (
            <p className="italic text-white/60 animate-pulse">⏳ Evaluating your answer...</p>
          ) : score !== null ? (
            <>
              <p className="text-xl font-bold text-green-400">✅ Score: {score} / 20</p>
              <p className="italic text-white/70">💬 {feedback}</p>
            </>
          ) : (
            <p className="text-red-400 italic">❌ Score unavailable.</p>
          )}

          <Button
            onClick={onNext}
            className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:brightness-110 mt-4"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
