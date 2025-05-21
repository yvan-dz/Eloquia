"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, AlarmClock } from "lucide-react";

export default function StepReadingAI({ language = "English", level = "A1", onNext }) {
  const [text, setText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [raw, setRaw] = useState("");

  const [timeLeft, setTimeLeft] = useState(0);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const fetchAIContent = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/reading", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language, level }),
        });
        const data = await res.json();
        if (data.error) {
          setError(data.error);
          setRaw(data.raw || "");
        } else {
          setText(data.text);
          setQuestions(data.questions);
          const calculatedDuration = (data.questions.length || 5) * 60; // 🧠 1 min / question
          setTimeLeft(calculatedDuration);
        }
      } catch (e) {
        setError("Server error: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAIContent();
  }, [language, level]);

  useEffect(() => {
    if (loading || expired || answers.length >= questions.length) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, expired, answers.length, questions.length]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleAnswer = (choice) => {
    const updated = [...answers, choice];
    setAnswers(updated);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    }
  };

  const total = questions.length;
  const score = questions.reduce((count, q, i) => {
    const userAnswer = answers[i];
    const correct = q.correct;
    return userAnswer && correct && userAnswer.trim() === correct.trim()
      ? count + 1
      : count;
  }, 0);

localStorage.setItem("leveltest-reading", JSON.stringify({ score, total, level }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Generating your test...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto text-red-400 text-center p-4">
        <p className="text-lg font-bold">❌ Error loading reading test</p>
        <p className="mt-2 text-sm">{error}</p>
        {raw && (
          <details className="mt-2 text-white text-left">
            <summary className="cursor-pointer text-yellow-400">Show raw response</summary>
            <pre className="text-xs whitespace-pre-wrap mt-2">{raw}</pre>
          </details>
        )}
      </div>
    );
  }

  const showRecap = expired || answers.length === questions.length;



  return (
    <div className="space-y-6 text-white max-w-2xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
          📖 Reading – {language}, Level {level}
        </h2>
        {!showRecap && (
          <div className="flex items-center gap-2 text-sm text-yellow-300 font-mono">
            <AlarmClock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <p className="bg-white/10 p-4 rounded text-sm whitespace-pre-wrap max-h-60 overflow-auto">
        {text}
      </p>

      {showRecap ? (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-xl font-bold text-green-400">✅ Score: {score} / {total}</p>
            <p className="text-white/60 text-sm italic">Review your answers:</p>
          </div>

          <div className="space-y-4">
            {questions.map((q, i) => {
              const user = answers[i];
              const correct = q.correct;
              const isCorrect = user === correct

              return (
                <div
                  key={i}
                  className={`p-4 rounded-xl border ${user
                    ? user.trim() === correct.trim()
                      ? "border-green-500 bg-green-500/10"
                      : "border-red-500 bg-red-500/10"
                    : "border-yellow-500 bg-yellow-500/10"
                    }`}
                >

                  <p className="font-semibold text-sm mb-2">Q{i + 1}. {q.q}</p>
                  <ul className="text-sm space-y-1">
                    {q.options.map((opt, j) => {
                      const isCorrectAnswer = opt.trim() === (correct?.trim() || "");
                      const isUserWrong = opt.trim() === (user?.trim() || "") && opt.trim() !== (correct?.trim() || "");

                      return (
                        <li
                          key={j}
                          className={`px-2 py-1 rounded ${isCorrectAnswer
                            ? "text-green-400 font-semibold"
                            : isUserWrong
                              ? "text-red-400"
                              : "text-white/60"
                            }`}
                        >
                          {opt}
                          {isCorrectAnswer && " ✅"}
                          {isUserWrong && " ❌"}
                        </li>
                      );
                    })}
                  </ul>

                </div>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <Button
              onClick={onNext}
              className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:brightness-110"
            >
              Continue
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{questions[current]?.q}</h3>
          <div className="space-y-2">
            {questions[current]?.options.map((opt, i) => (
              <Button
                key={i}
                onClick={() => handleAnswer(opt)}
                className="w-full bg-white/10 hover:bg-white/20"
              >
                {opt}
              </Button>
            ))}
          </div>
          <p className="text-white/60 text-sm">Question {current + 1} of {total}</p>
        </div>
      )}
    </div>
  );
  
}
