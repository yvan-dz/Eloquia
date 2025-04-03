"use client"

import { useState } from "react"
import { Loader2, Sparkles, Download, SendHorizonal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import ProtectedRoute from "@/components/ProtectedRoute"


export default function TranscriptionPage() {
    const [file, setFile] = useState(null)
    const [videoUrl, setVideoUrl] = useState("")
    const [transcription, setTranscription] = useState("")
    const [loading, setLoading] = useState(false)
    const [chat, setChat] = useState([])
    const [question, setQuestion] = useState("")
    const [chatLoading, setChatLoading] = useState(false)
    const [chatId] = useState(() => crypto.randomUUID())

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file && !videoUrl) return

        setTranscription("")
        setChat([])
        setLoading(true)

        const formData = new FormData()
        if (file) formData.append("file", file)
        else if (videoUrl) formData.append("videoUrl", videoUrl)

        const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
        })

        const data = await res.json()
        setTranscription(data.text || data.error?.message || "Erreur lors de la transcription")
        setLoading(false)
    }

    const handleAsk = async (q, isSummary = false) => {
        if (!transcription || !q.trim()) return

        const newChat = [...chat, { role: "user", content: q }]
        setChat(newChat)
        setQuestion("")
        setChatLoading(true)

        const payload = {
            chatId,
            role: "user",
            message: isSummary ? `Peux-tu résumer ce texte ?` : q,
            transcription: chat.length === 0 ? transcription : undefined,
        }

        const res = await fetch("/api/ask-ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })

        const data = await res.json()
        setChat([...newChat, { role: "assistant", content: data.reply }])
        setChatLoading(false)
    }

    const handleDownload = () => {
        const blob = new Blob([transcription], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "transcription.txt"
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white py-16 px-4">
            <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 p-8 space-y-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 bg-clip-text text-transparent tracking-tight">
                    🎥 Assistant Vidéo Intelligent
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        type="file"
                        accept="audio/*,video/*"
                        onChange={(e) => {
                            setFile(e.target.files[0])
                            setVideoUrl("")
                        }}
                        className="bg-white/10 border border-white/20 file:text-white"
                    />
                    <p className="text-center text-slate-400">— ou —</p>
                    <Input
                        type="url"
                        placeholder="Lien vers une vidéo (YouTube, etc.)"
                        value={videoUrl}
                        onChange={(e) => {
                            setVideoUrl(e.target.value)
                            setFile(null)
                        }}
                        className="bg-white/10 border border-white/20 text-white placeholder:text-slate-400"
                    />
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-fuchsia-500 to-pink-600 hover:brightness-110"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Transcription...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" /> Lancer la transcription
                            </>
                        )}
                    </Button>
                </form>

                {transcription && (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-semibold text-white">📝 Transcription</h2>
                            <div className="mt-2 max-h-[400px] overflow-y-auto bg-slate-800 border border-slate-700 text-white p-4 rounded whitespace-pre-wrap text-sm">
                                {transcription}
                            </div>

                            <div className="text-right mt-2">
                                <Button
                                    onClick={handleDownload}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Télécharger
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-white">💬 Assistant IA</h2>
                            <div className="space-y-3 max-h-64 overflow-y-auto bg-white/5 border border-white/10 rounded-lg p-4">
                                {chat.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={
                                            msg.role === "user"
                                                ? "text-right text-blue-300"
                                                : "text-left text-white"
                                        }
                                    >
                                        <p className="text-sm whitespace-pre-wrap">
                                            <strong>{msg.role === "user" ? "Vous :" : "IA :"}</strong> {msg.content}
                                        </p>
                                    </div>
                                ))}
                                {chatLoading && <p className="text-slate-400 italic">Réflexion en cours…</p>}
                            </div>

                            <div className="flex gap-2 mt-4">
                                <Textarea
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    onInput={(e) => {
                                        const target = e.target
                                        target.style.height = "auto" // reset height
                                        target.style.height = `${Math.min(target.scrollHeight, 160)}px` // max 160px (~5 lignes)
                                    }}
                                    rows={1}
                                    placeholder="Pose ta question ici..."
                                    className="flex-1 resize-none bg-white/10 border-white/20 text-white placeholder:text-slate-400 max-h-40 overflow-auto"
                                />

                                <Button
                                    onClick={() => handleAsk(question)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <SendHorizonal className="w-4 h-4" />
                                </Button>
                                <Button
                                    onClick={() => {
                                        const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
                                        const filename = `conversation-${timestamp}.txt`

                                        const chatContent = chat.map((msg, i) => {
                                            const prefix = msg.role === "user" ? "👤 Vous" : "🤖 IA"
                                            return `${prefix}:\n${msg.content}\n`
                                        }).join("\n-------------------------\n")

                                        const formatted = `🧠 Conversation IA – Assistant Vidéo\n\n${chatContent}\n\nExporté le ${new Date().toLocaleString()}`

                                        const blob = new Blob([formatted], { type: "text/plain" })
                                        const url = URL.createObjectURL(blob)
                                        const a = document.createElement("a")
                                        a.href = url
                                        a.download = filename
                                        a.click()
                                        URL.revokeObjectURL(url)
                                    }}
                                    className="bg-yellow-600 hover:bg-yellow-700"
                                >
                                    <Download className="w-4 h-4 mr-1" />
                                    Exporter le chat
                                </Button>

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </ProtectedRoute>
    )
}
