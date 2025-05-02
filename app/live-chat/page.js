"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import '@/i18n/i18nClient'; // <--- initialise i18n
import { useTranslation } from 'react-i18next';
import LanguageSelector from "@/components/LanguageSelector";
import ProtectedRoute from "@/components/ProtectedRoute"


import { Send, VolumeX, Volume2, Square } from "lucide-react";

export default function LiveChatPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { t, i18n } = useTranslation("chat");
  const chatRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [micState, setMicState] = useState("idle"); // "idle" | "recording" | "processing"
  const [audioRef, setAudioRef] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return t("greetingMorning");
    if (h < 18) return t("greetingAfternoon");
    return t("greetingEvening");
  };

  const appendMessage = (text, sender) => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  const stopAudioPlayback = () => {
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
      setAudioRef(null);
    }
  };

  const askGemini = async (text) => {
    const newHistory = [...messages, { text, sender: "user" }];

    setMessages(newHistory);

    try {
      const res = await fetch("/api/ask-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          lang: i18n.language,
          history: newHistory.slice(-6),
        }),
      });


      const data = await res.json();
      appendMessage(data.reply || t("defaultBotReply"), "bot");

      if (!isMuted && data.audio) {
        const audio = new Audio("data:audio/mp3;base64," + data.audio);
        setAudioRef(audio);
        audio.play();
        audio.onended = () => setAudioRef(null);
      }
    } catch (err) {
      console.error("Erreur Gemini:", err);
      appendMessage(t("errorAI"), "bot");
    }
  };

  const handleSend = () => {
    if (!prompt.trim()) return;
    askGemini(prompt.trim());
    setPrompt("");
  };

  const handleMicClick = async () => {
    if (micState === "idle") {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      setMicState("recording");

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        setMicState("processing");
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const arrayBuffer = await blob.arrayBuffer();
        const base64Audio = btoa(
          new Uint8Array(arrayBuffer).reduce((acc, byte) => acc + String.fromCharCode(byte), "")
        );

        try {
          const res = await fetch("/api/stt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              audioContent: base64Audio,
              lang: i18n.language,
            }),
          });


          const data = await res.json();
          if (data.text) {
            await askGemini(data.text);
          } else {
            appendMessage(t("defaultBotReply"), "bot");
          }
        } catch (err) {
          console.error("Erreur STT :", err);
          appendMessage(t("errorSTT"), "bot");
        }

        stream.getTracks().forEach((t) => t.stop());
        setMicState("idle");
      };

      recorder.start();
    } else if (micState === "recording") {
      mediaRecorderRef.current?.stop();
    }
  };

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1f0d2c] via-[#221a35] to-[#0c0c14] text-white font-sans relative overflow-hidden">

        {/* Halo décoratif */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="w-96 h-96 bg-fuchsia-600/20 blur-3xl rounded-full absolute -top-40 -left-20 animate-pulse-slow" />
          <div className="w-80 h-80 bg-indigo-500/10 blur-2xl rounded-full absolute bottom-10 right-10 animate-pulse-slower" />
        </div>

        {/* Avatar, intro & langue */}
        <div className="flex flex-col items-center gap-4 pt-24 z-10 relative text-center">
          <div className="relative w-32 h-32 rounded-full border-4 border-fuchsia-500 shadow-lg overflow-hidden">
            <img src="https://img.freepik.com/free-photo/girl-afro_1450-331.jpg?w=740" alt="Eloquia" className="w-full h-full object-cover" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-fuchsia-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent drop-shadow">
            {getGreeting()}
          </h1>

          <p className="text-white/60 text-base md:text-lg italic">
            {t("saySomething")}
          </p>

          {/* Sélecteur de langue visible & intégré */}
          <div className="mt-2">
            <LanguageSelector currentLang={i18n.language} onChange={i18n.changeLanguage} />
          </div>
        </div>

        {/* Zone messages */}
        <div className="flex-1 overflow-y-auto px-4 mt-6 mb-2 max-w-3xl w-full mx-auto" ref={chatRef}>
          <div className="space-y-4 pb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                <div className={`max-w-[85%] whitespace-pre-line break-words px-5 py-3 rounded-2xl shadow-md text-sm leading-relaxed ${msg.sender === "user"
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none"
                  : "bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white rounded-bl-none"
                  }`}>
                  <div className="font-semibold mb-1">{msg.sender === "user" ? t("you") : "Eloquia"}</div>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone de saisie */}
        <div className="w-full max-w-3xl mx-auto px-4 pb-6 z-50">
          <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-3 shadow-2xl">
            <textarea
              className="bg-transparent text-white placeholder-white/40 resize-none w-full rounded-xl border-none outline-none px-4 py-3 min-h-[60px]"
              placeholder={t("inputPlaceholder")}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            />
            <div className="flex gap-3 justify-between items-center flex-wrap">
              <div className="flex gap-2">
                <button
                  onClick={handleSend}
                  className="bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:brightness-110 text-white px-6 py-2 rounded-xl shadow-md flex items-center gap-2"
                >
                  <Send className="w-5 h-5" /> {t("send")}
                </button>

                <button
                  onClick={handleMicClick}
                  disabled={micState === "processing"}
                  className={`px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border ${micState === "recording"
                    ? "border-yellow-400 text-yellow-300 bg-yellow-700/30 animate-pulse"
                    : micState === "processing"
                      ? "border-blue-400 text-blue-300 bg-blue-800/30 animate-pulse"
                      : "border-green-400 text-green-300 hover:bg-green-700/30"
                    }`}
                >
                  {micState === "idle" && t("talkToEloquia")}
                  {micState === "recording" && t("stopTalking")}
                  {micState === "processing" && t("processing")}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={stopAudioPlayback}
                  disabled={!audioRef}
                  className="text-red-300 hover:text-red-400 border border-red-400 px-4 py-2 rounded-xl flex items-center gap-2 text-sm"
                >
                  <Square className="w-4 h-4" />
                  {t("stopAudio") || "Stop"}
                </button>

                <button
                  onClick={() => setIsMuted((m) => !m)}
                  className={`border px-4 py-2 rounded-xl flex items-center gap-2 text-sm ${isMuted
                    ? "text-gray-400 border-gray-400 hover:text-gray-300"
                    : "text-white border-white hover:text-gray-200"
                    }`}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  {isMuted ? t("unmute") || "Unmute" : t("mute") || "Mute"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 🗑️ Bouton de nouvelle conversation */}
        <div className="w-full flex justify-center pb-10 z-50">
          <button
            onClick={() => setMessages([])}
            className="flex items-center justify-center gap-2 text-white/70 hover:text-white transition px-4 py-2 rounded-full border border-white/20 backdrop-blur bg-white/5 hover:bg-white/20 shadow-md"
            title={t("newConversation")}
          >
            🗑️
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );

}
