"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, AlarmClock, Mic, CheckCircle } from "lucide-react";

const speakingTimeByLevel = {
    A1: 60,
    A2: 90,
    B1: 120,
    B2: 150,
    C1: 180,
    C2: 210,
};

export default function StepSpeakingAI({ language = "English", level = "A1", onNext }) {
    const [loading, setLoading] = useState(true);
    const [evaluating, setEvaluating] = useState(false);
    const [theme, setTheme] = useState("");
    const [phase, setPhase] = useState("prep"); // prep | speaking | done
    const [prepTime, setPrepTime] = useState(120);
    const [speakTime, setSpeakTime] = useState(speakingTimeByLevel[level] || 120);
    const [recording, setRecording] = useState(false);
    const [score, setScore] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [transcript, setTranscript] = useState("");
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const streamRef = useRef(null);

    // 🎯 Obtenir le sujet
    useEffect(() => {
        const fetchTopic = async () => {
            try {
                const res = await fetch("/api/speaking/topic", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ language, level }),
                });
                const data = await res.json();
                setTheme(data.topic || "Describe a recent experience and how you felt.");
            } catch (err) {
                setTheme("Describe a personal experience and how it changed you.");
            } finally {
                setLoading(false);
            }
        };
        fetchTopic();
    }, [language, level]);

    // ⏱️ Timer de préparation
    useEffect(() => {
        if (phase === "prep" && prepTime > 0) {
            const timer = setInterval(() => setPrepTime((t) => t - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [phase, prepTime]);

    // 🎤 Timer de parole
    useEffect(() => {
        if (phase === "speaking" && speakTime > 0) {
            const timer = setInterval(() => setSpeakTime((t) => t - 1), 1000);
            return () => clearInterval(timer);
        }
        if (phase === "speaking" && speakTime <= 0) {
            stopRecordingAndEvaluate();
        }
    }, [phase, speakTime]);

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60).toString().padStart(2, "0");
        const s = (sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const startSpeaking = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            audioChunks.current = [];
            mediaRecorder.current = new MediaRecorder(stream);

            mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
            mediaRecorder.current.onstop = handleEvaluation;

            mediaRecorder.current.start();
            setRecording(true);
            setPhase("speaking");
        } catch (err) {
            alert("Microphone access denied or unavailable.");
        }
    };

    const stopRecordingAndEvaluate = () => {
        mediaRecorder.current?.stop();
        streamRef.current?.getTracks().forEach((track) => track.stop());
        setRecording(false);
        setPhase("done");
        setEvaluating(true);
    };

    const handleEvaluation = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const base64 = await blobToBase64(audioBlob);

        try {
            const res = await fetch("/api/speaking/evaluate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    audioBase64: base64.split(",")[1],
                    level,
                    language,
                    theme,
                }),
            });

            const data = await res.json();
            if (data?.score !== undefined && data?.feedback) {
                setScore(data.score);
                setFeedback(data.feedback);
                setTranscript(data.transcript || "");
                localStorage.setItem("leveltest-speaking", JSON.stringify({ score: data.score, total: 20, level }));


            }
            else {
                setFeedback("❌ Réponse invalide. Essayez encore.");
            }
        } catch (err) {
            setFeedback("❌ Échec de l'évaluation. Veuillez réessayer.");
        } finally {
            setEvaluating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-white">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Chargement du sujet...
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 text-white space-y-6 mt-10">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
                🗣️ Speaking – {language}, Niveau {level}
            </h2>

            <div className="bg-white/10 p-4 rounded">
                <p className="font-semibold text-sm text-white/70">🎯 Sujet :</p>
                <p className="mt-2">{theme}</p>
            </div>

            {phase === "prep" && (
                <div className="text-center space-y-4">
                    <p className="text-yellow-300 font-mono text-sm flex justify-center items-center gap-2">
                        <AlarmClock className="w-4 h-4" /> Temps de préparation : {formatTime(prepTime)}
                    </p>
                    <Button
                        onClick={startSpeaking}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110"
                    >
                        <Mic className="w-4 h-4 mr-2" /> Commencer à parler
                    </Button>
                </div>
            )}

            {phase === "speaking" && (
                <div className="text-center space-y-4">
                    <p className="text-emerald-400 font-mono text-sm flex justify-center items-center gap-2">
                        <AlarmClock className="w-4 h-4" /> Temps restant : {formatTime(speakTime)}
                    </p>
                    {recording && (
                        <Button
                            onClick={stopRecordingAndEvaluate}
                            className="bg-gradient-to-r from-red-500 to-pink-600 hover:brightness-110"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" /> Envoyer ma réponse
                        </Button>
                    )}
                </div>
            )}

            {phase === "done" && (
                <div className="text-center space-y-4">
                    <p className="text-green-400 font-semibold">🎉 Merci ! Votre réponse a été enregistrée.</p>

                    {evaluating && (
                        <p className="text-white/60 italic animate-pulse">⏳ Évaluation de votre réponse...</p>
                    )}

                    {!evaluating && score !== null && (
                        <div className="bg-white/10 p-4 rounded-xl text-sm space-y-4">
                            <p className="text-green-300 font-semibold">📝 Score : {score} / 20</p>
                            <p className="text-white/70">{feedback}</p>
                            {transcript && (
                                <div className="bg-black/10 mt-4 p-3 rounded text-left text-white/60 text-sm whitespace-pre-wrap">
                                    <span className="font-bold text-white">📃 Transcription:</span><br />
                                    {transcript}
                                </div>
                            )}
                        </div>
                    )}


                    {!evaluating && (
                        <Button
                            onClick={onNext}
                            className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:brightness-110"
                        >
                            Continuer
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

const blobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
