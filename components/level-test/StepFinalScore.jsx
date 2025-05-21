"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Award, CheckCircle2 } from "lucide-react";

export default function StepFinalScore({ language = "English", onRestart }) {
  const [loading, setLoading] = useState(true);
  const [finalLevel, setFinalLevel] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [totalScore, setTotalScore] = useState(null);
  const [normalized, setNormalized] = useState({});
  const [individual, setIndividual] = useState({});

  useEffect(() => {
    const getResults = () => {
      const read = JSON.parse(localStorage.getItem("leveltest-reading") || "{}");
      const listen = JSON.parse(localStorage.getItem("leveltest-listening") || "{}");
      const speak = JSON.parse(localStorage.getItem("leveltest-speaking") || "{}");
      const write = JSON.parse(localStorage.getItem("leveltest-writing") || "{}");

      const results = {
        language,
        level: read.level || listen.level || speak.level || write.level || "A1",
        readingScore: read.score ?? 0,
        readingTotal: read.total ?? 4,
        listeningScore: listen.score ?? 0,
        listeningTotal: listen.total ?? 4,
        speakingScore: speak.score ?? 0,
        writingScore: write.score ?? 0,
      };

      setIndividual({
        reading: read.score ?? 0,
        readingTotal: read.total ?? 4,
        listening: listen.score ?? 0,
        listeningTotal: listen.total ?? 4,
        speaking: speak.score ?? 0,
        writing: write.score ?? 0,
      });

      return results;
    };

    const fetchFinalScore = async () => {
      const results = getResults();

      try {
        const res = await fetch("/api/final-score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(results),
        });

        const data = await res.json();
        setFinalLevel(data.level);
        setFeedback(data.feedback);
        setTotalScore(data.total);
        setNormalized(data.normalized || {});
      } catch (e) {
        setFeedback("❌ Failed to get final level.");
      } finally {
        setLoading(false);
      }
    };

    fetchFinalScore();
  }, [language]);

  const handleRestart = () => {
    localStorage.removeItem("leveltest-reading");
    localStorage.removeItem("leveltest-listening");
    localStorage.removeItem("leveltest-speaking");
    localStorage.removeItem("leveltest-writing");
    onRestart();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Calculating your final result...
      </div>
    );
  }

  return (
    <div className="text-white max-w-xl mx-auto mt-20 px-4 text-center space-y-6">
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-transparent bg-clip-text">
        🎓 Final Assessment
      </h2>

      <div className="text-center">
        <p className="text-lg font-semibold text-white/80 mb-2">Your evaluated level is:</p>
        <p className="text-6xl font-bold text-green-400 flex justify-center items-center gap-3">
          <Award className="w-10 h-10" /> {finalLevel}
        </p>
      </div>

      {totalScore !== null && (
        <p className="text-white/60 font-mono">Total Score: {totalScore} / 80</p>
      )}

      <div className="bg-white/10 rounded-xl p-4 text-left space-y-2">
        <p className="text-sm font-medium text-white/70">🧮 Scores:</p>
        <ul className="list-disc list-inside text-white/90 text-sm pl-4 space-y-1">
          <li>
            📖 Reading: {individual.reading} / {individual.readingTotal} → {normalized.reading ?? "-"} / 20
          </li>
          <li>
            🎧 Listening: {individual.listening} / {individual.listeningTotal} → {normalized.listening ?? "-"} / 20
          </li>
          <li>
            🗣️ Speaking: {individual.speaking} / 20
          </li>
          <li>
            ✍️ Writing: {individual.writing} / 20
          </li>
        </ul>
      </div>

      <div className="bg-white/10 rounded-xl p-4 text-left">
        <p className="text-sm font-medium text-white/70 mb-1">💬 Feedback:</p>
        <p className="text-white whitespace-pre-wrap">{feedback}</p>
      </div>

      <Button
        onClick={handleRestart}
        className="mt-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:brightness-110"
      >
        <CheckCircle2 className="w-4 h-4 mr-2" /> Restart Test
      </Button>
    </div>
  );
}
