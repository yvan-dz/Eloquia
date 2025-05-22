"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Volume2, AlarmClock } from "lucide-react";

export default function StepListeningAI({ language = "English", level = "A1", onNext }) {
    const [audioSrc, setAudioSrc] = useState("");
    const [text, setText] = useState("");
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [raw, setRaw] = useState("");

    const [step, setStep] = useState("waiting"); // waiting | playing1 | waiting2 | playing2 | ending | done
    const [countdown, setCountdown] = useState(10);
    const [submitted, setSubmitted] = useState(false);

    const timerRef = useRef(null);
    const audioRef = useRef(null);
    const normalize = (str) =>
        str?.trim().toLowerCase().replace(/\s+/g, "").replace(/[^\wÀ-ÿ]/g, "") || "";


    // 1. Fetch audio + questions
    useEffect(() => {
        const fetchAudio = async () => {
            try {
                const res = await fetch("/api/listening", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ language, level }),
                });
                const data = await res.json();
                if (data.error) {
                    setError(data.error);
                    setRaw(data.raw || "");
                } else {
                    setAudioSrc(`data:audio/mp3;base64,${data.audio}`);
                    const filtered = data.questions.filter((q, i) => {
                        const valid = q.options.some(opt => normalize(opt) === normalize(q.correct));
                        if (!valid) {
                            console.warn(`⚠️ Q${i + 1} – Réponse correcte absente des options`, {
                                correct: q.correct,
                                options: q.options,
                            });
                        }
                        return valid;
                    });

                    if (filtered.length === 0) {
                        setError("Aucune question valide n’a été générée. Veuillez réessayer.");
                        return;
                    }

                    console.log("🎧 Questions valides reçues :", filtered);
                    setQuestions(filtered);

                    setText(data.text);
                }
            } catch (e) {
                setError("Server error: " + e.message);
            } finally {
                setLoading(false);
                setStep("waiting");
                setCountdown(10);
            }
        };
        fetchAudio();
    }, [language, level]);

    // 2. Timers automatiques
    useEffect(() => {
        if (step === "waiting" || step === "waiting2" || step === "ending") {
            timerRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        if (step === "waiting") handlePlay();
                        else if (step === "waiting2") handlePlay();
                        else if (step === "ending") setStep("done");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [step]);

    const handlePlay = () => {
        clearInterval(timerRef.current);

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;

            setTimeout(() => {
                audioRef.current
                    ?.play()
                    .catch((err) => console.warn("Playback error:", err));
            }, 150); // délai pour laisser le temps au navigateur de "libérer"
        }

        if (step === "waiting") setStep("playing1");
        else if (step === "waiting2") setStep("playing2");
        else if (step === "done" || submitted) setStep("playing2");
    };



    const handleAudioEnd = () => {
        if (step === "playing1") {
            setStep("waiting2");
            setCountdown(10);
        } else if (step === "playing2") {
            setStep("ending");
            setCountdown(10);
        }
    };

    const handleAnswer = (qid, choice) => {
        setAnswers((prev) => ({ ...prev, [qid]: choice }));
    };

    const showRecap = step === "done" || submitted;
    const total = questions.length;

    const score = questions.reduce((count, q, i) => {
        const user = answers[i];
        const correct = q.correct;
        const isCorrect = normalize(user) === normalize(correct);
        console.log(`🧠 Q${i + 1}:`, {
            question: q.q,
            user,
            correct,
            isCorrect,
            options: q.options,
        });
        return isCorrect ? count + 1 : count;
    }, 0);

    localStorage.setItem("leveltest-listening", JSON.stringify({ score, total, level }));

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-white">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Generating listening test...
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto text-red-400 text-center p-4">
                <p className="text-lg font-bold">❌ Error loading listening test</p>
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-4 py-10">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
                        🎧 Listening – {language}, Level {level}
                    </h2>
                    {(step === "waiting" || step === "waiting2" || step === "ending") && (
                        <div className="flex items-center gap-2 text-yellow-300 text-sm font-mono">
                            <AlarmClock className="w-4 h-4" />
                            {countdown}s
                        </div>
                    )}
                </div>

                <div className="bg-white/10 p-4 rounded flex items-center justify-between">
                    <p className="text-sm text-white/80">
                        {step.includes("waiting") || step === "ending"
                            ? "The audio will play automatically..."
                            : "Audio playing"}
                    </p>
                    <Button
                        onClick={handlePlay}
                        className="..."
                        disabled={
                            !audioSrc ||
                            step === "playing1" ||
                            step === "playing2" ||
                            (step === "ending" && !submitted) ||
                            (step === "done" && !submitted && !showRecap)
                        }
                    >

                        <Volume2 className="w-4 h-4 mr-2" />
                        Play now
                    </Button>
                    <audio
                        ref={audioRef}
                        src={audioSrc}
                        onEnded={handleAudioEnd}
                        hidden
                        controls
                    />
                </div>

                {!showRecap && (
                    <>
                        <div className="space-y-4 pt-2">
                            {questions.map((q, i) => (
                                <div key={i} className="bg-white/5 p-4 rounded-xl">
                                    <p className="font-semibold text-sm mb-2">Q{i + 1}. {q.q}</p>
                                    <div className="space-y-2">
                                        {q.options.map((opt, j) => {
                                            const selected = answers[i];
                                            const isSelected = selected === opt;
                                            return (
                                                <Button
                                                    key={j}
                                                    onClick={() => handleAnswer(i, opt)}
                                                    className={`w-full ${isSelected
                                                        ? "bg-pink-600 text-white"
                                                        : "bg-white/10 hover:bg-white/20 text-white"
                                                        }`}
                                                >
                                                    {opt}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {(step === "ending" || step === "waiting2") && (
                            <div className="text-center pt-6">
                                <Button
                                    onClick={() => {
                                        // Stop audio
                                        if (audioRef.current) {
                                            audioRef.current.pause();
                                            audioRef.current.currentTime = 0;
                                        }

                                        // Stop timer
                                        clearInterval(timerRef.current);

                                        // Marquer comme soumis
                                        setSubmitted(true);

                                        // Forcer l'état à "done" pour réactiver "Play now"
                                        setStep("done");
                                    }}
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:brightness-110"
                                >
                                    ✅ Submit answers
                                </Button>


                            </div>
                        )}
                    </>
                )}

                {showRecap && (
                    <div className="space-y-6 pt-6">
                        <div className="text-center space-y-2">
                            <p className="text-xl font-bold text-green-400">
                                ✅ Score: {score} / {total}
                            </p>
                            <p className="text-white/60 text-sm italic">Review your answers below:</p>
                        </div>

                        <div className="space-y-4">
                            {questions.map((q, i) => {
                                const user = answers[i];
                                const correct = q.correct;
                                const isCorrect = normalize(user) === normalize(correct);
                                console.log(`🧠 Q${i + 1}:`, {
                                    question: q.q,
                                    user,
                                    correct,
                                    isCorrect,
                                    options: q.options,
                                });


                                return (
                                    <div
                                        key={i}
                                        className={`p-4 rounded-xl border ${user
                                            ? isCorrect
                                                ? "border-green-500 bg-green-500/10"
                                                : "border-red-500 bg-red-500/10"
                                            : "border-yellow-500 bg-yellow-500/10"
                                            }`}
                                    >
                                        <p className="font-semibold text-sm mb-2">Q{i + 1}. {q.q}</p>
                                        <ul className="text-sm space-y-1">
                                            {q.options.map((opt, j) => {
                                                const isCorrectAnswer = normalize(opt) === normalize(correct);
                                                const isUserWrong = normalize(opt) === normalize(user) && !isCorrectAnswer;

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

                        <div className="pt-6">
                            <p className="text-sm text-white/60 italic mb-2">📝 Transcription:</p>
                            <p className="text-sm bg-white/10 rounded p-4 whitespace-pre-wrap">{text}</p>
                        </div>

                        <div className="text-center">
                            <Button
                                onClick={onNext}
                                className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:brightness-110"
                            >
                                Continue
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
