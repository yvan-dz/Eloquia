"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpenCheck, Languages } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute"
import StepReadingAI from "@/components/level-test/StepReadingAI";
import StepListeningAI from "@/components/level-test/StepListeningAI";
import StepSpeakingAI from "@/components/level-test/StepSpeakingAI";
import StepWritingAI from "@/components/level-test/StepWritingAI";
import StepFinalScore from "@/components/level-test/StepFinalScore";

export default function LevelTestPage() {
  const [language, setLanguage] = useState("English");
  const [level, setLevel] = useState("A1");
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState("start");

  const isReading = step === "reading";
  const isListening = step === "listening";
  const isSpeaking = step === "speaking";
  const isWriting = step === "writing";
  const isDone = step === "final";

  const handleRestart = () => {
    localStorage.removeItem("leveltest-reading");
    localStorage.removeItem("leveltest-listening");
    localStorage.removeItem("leveltest-speaking");
    localStorage.removeItem("leveltest-writing");
    setStarted(false);
    setStep("start");
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-4 py-20 flex items-center justify-center">
        {!started ? (
          <div className="w-full max-w-xl bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-10 space-y-8">
            <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
              <Sparkles className="inline w-6 h-6 mb-1" /> Language Level Test
            </h1>

            <p className="text-white/60 text-center text-sm italic max-w-md mx-auto">
              Choose a target language and level to begin your personalized test.
            </p>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 mb-1 text-white/70 text-sm font-medium">
                  <Languages className="w-4 h-4" /> Target Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-sm shadow-inner"
                >
                  <option value="English">English</option>
                  <option value="French">Français</option>
                  <option value="German">Deutsch</option>
                  <option value="Spanish">Español</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 mb-1 text-white/70 text-sm font-medium">
                  <BookOpenCheck className="w-4 h-4" /> Estimated Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-sm shadow-inner"
                >
                  {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-400 text-yellow-200 text-sm p-4 rounded-xl">
                ⚠️ <strong>Important:</strong> During the test, please do not reload or leave the page. A slow internet connection or any interruption may cause the test to restart. We recommend staying on the page until the end.
              </div>

              <Button
                onClick={() => {
                  setStarted(true);
                  setStep("reading");
                }}
                className="w-full bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white py-3 text-sm font-semibold hover:brightness-110 rounded-xl"
              >
                Start Test
              </Button>
            </div>
          </div>
        ) : isReading ? (
          <StepReadingAI
            language={language}
            level={level}
            onNext={() => setStep("listening")}
          />
        ) : isListening ? (
          <StepListeningAI
            language={language}
            level={level}
            onNext={() => setStep("speaking")}
          />
        ) : isSpeaking ? (
          <StepSpeakingAI
            language={language}
            level={level}
            onNext={() => setStep("writing")}
          />
        ) : isWriting ? (
          <StepWritingAI
            language={language}
            level={level}
            onNext={() => setStep("final")}
          />
        ) : isDone ? (
          <StepFinalScore language={language} onRestart={handleRestart} />
        ) : null}
      </div>
  );

}
