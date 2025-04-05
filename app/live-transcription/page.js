"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Mic, MicOff, Sparkles, Download, FileText, Send } from "lucide-react"
import jsPDF from "jspdf"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function LiveTranscriptionPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const [transcription, setTranscription] = useState("")
  const [partCount, setPartCount] = useState(0)
  const [aiReply, setAiReply] = useState("")
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState([])
  const [chatLoading, setChatLoading] = useState(false)

  const scrollRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const streamRef = useRef(null)
  const recordingTimeout = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [transcription, aiReply, chatMessages])

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false)
      clearTimeout(recordingTimeout.current)
      mediaRecorderRef.current?.stop()
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        setTranscribing(true)
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const arrayBuffer = await audioBlob.arrayBuffer()
        const base64Audio = btoa(
          new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
        )

        try {
          const res = await fetch("/api/live-transcription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audioContent: base64Audio }),
          })

          const data = await res.json()
          if (data?.text) {
            setPartCount((prev) => prev + 1)
            setTranscription((prev) =>
              prev + `\n\n🧩 Partie ${partCount + 1} :\n${data.text}`
            )
          }
        } catch (err) {
          console.error("Erreur de transcription :", err)
        } finally {
          setTranscribing(false)
          streamRef.current?.getTracks().forEach((track) => track.stop())
        }
      }

      setIsRecording(true)
      mediaRecorder.start()

      recordingTimeout.current = setTimeout(() => {
        setIsRecording(false)
        mediaRecorder.stop()
      }, 59000)
    }
  }

  const sendToGemini = async () => {
    if (!transcription.trim()) return
    setChatLoading(true)

    const res = await fetch("/api/live-transcription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcription, sendToGemini: true }),
    })

    const data = await res.json()
    const reply = data.reply || "Pas de réponse."

    setAiReply(reply)
    setChatMessages([{ role: "assistant", text: reply }]) // 🧼 Réinit chat
    setChatInput("")
    setChatLoading(false)
  }

  const askFollowUp = async () => {
    if (!chatInput.trim()) return
    setChatLoading(true)

    const updatedChat = [
      ...chatMessages,
      { role: "user", text: chatInput },
    ]

    const res = await fetch("/api/live-transcription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcription,
        chat: true,
        history: updatedChat,
      }),
    })

    const data = await res.json()
    const reply = data.reply || "Pas de réponse."
    setChatMessages([...updatedChat, { role: "assistant", text: reply }])
    setChatInput("")
    setChatLoading(false)
  }

  const exportTxt = (text, filename, isAI = false) => {
    const date = new Date().toLocaleString()
    let content = `📄 ${isAI ? "TEXTE CORRIGÉ PAR L'IA" : "TRANSCRIPTION AUDIO"} - ${date}\n\n`
    content += text.trim() + "\n\n🔚 Fin du document"
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportPdf = (text, filename, isAI = false) => {
    const doc = new jsPDF()
    const margin = 10
    const maxWidth = 180
    const date = new Date().toLocaleString()

    doc.setFont("Helvetica", "bold")
    doc.setFontSize(14)
    doc.text(isAI ? " TEXTE CORRIGÉ PAR L'IA" : " TRANSCRIPTION AUDIO", margin, 20)
    doc.setFontSize(10)
    doc.text(`Date : ${date}`, margin, 28)

    doc.setFont("Helvetica", "normal")
    let y = 36
    const lines = doc.splitTextToSize(text.trim(), maxWidth)
    lines.forEach((line) => {
      if (y > 280) {
        doc.addPage()
        y = 20
      }
      doc.text(line, margin, y)
      y += 6
    })

    doc.setFont("Helvetica", "italic")
    doc.text(" Fin du document", margin, y + 10)
    doc.save(filename)
  }

  const exportTxtChat = (messages) => {
    const date = new Date().toLocaleString()
    let content = `💬 Historique de conversation avec l’IA - ${date}\n\n`

    messages.forEach((msg, i) => {
      content += `${msg.role === "user" ? "👤 Vous" : "🤖 IA"} : ${msg.text.trim()}\n\n`
    })

    content += "────────────────────────────────────────────\n🔚 Fin du chat"

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "chat_ia.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportPdfChat = (messages) => {
    const doc = new jsPDF()
    const margin = 10
    const maxWidth = 180
    const date = new Date().toLocaleString()

    doc.setFont("Helvetica", "bold")
    doc.setFontSize(14)
    doc.text("🧠 Historique de conversation IA", margin, 20)
    doc.setFontSize(10)
    doc.text(`Date : ${date}`, margin, 28)

    doc.setFont("Helvetica", "normal")
    let y = 36
    messages.forEach((msg) => {
      const lines = doc.splitTextToSize(`${msg.role === "user" ? "👤 Vous" : "🤖 IA"} : ${msg.text}`, maxWidth)
      lines.forEach((line) => {
        if (y > 280) {
          doc.addPage()
          y = 20
        }
        doc.text(line, margin, y)
        y += 6
      })
      y += 6
    })

    y += 10
    doc.setFont("Helvetica", "italic")
    doc.text("Fin du chat", margin, y)

    doc.save("chat_ia.pdf")
  }


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl border border-white/10 p-10 space-y-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 bg-clip-text text-transparent tracking-tight">
            🎙️ Transcription en Direct
          </h1>

          <div className="text-center">
            <Button
              onClick={toggleRecording}
              className={`px-6 py-3 text-lg rounded-full shadow-lg ${isRecording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
            >
              {isRecording ? <><MicOff className="w-5 h-5 mr-2" />Stopper</> : <><Mic className="w-5 h-5 mr-2" />Lancer</>}
            </Button>
          </div>

          {transcribing && (
            <div className="flex justify-center items-center gap-3 text-white/80 animate-pulse">
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Transcription en cours...
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-white">📝 Transcription</h2>
            <Textarea readOnly value={transcription} className="mt-2 bg-slate-800/60 border border-white/10 text-white min-h-[200px] max-h-[400px] rounded-xl p-4" />
            <div className="flex flex-wrap justify-end gap-2 mt-4">
              <Button onClick={() => exportTxt(transcription, "transcription.txt")} className="bg-green-600 hover:bg-green-700"><Download className="w-4 h-4 mr-2" />Export TXT</Button>
              <Button onClick={() => exportPdf(transcription, "transcription.pdf")} className="bg-green-600 hover:bg-green-700"><FileText className="w-4 h-4 mr-2" />Export PDF</Button>
              <Button onClick={sendToGemini} className="bg-purple-600 hover:bg-purple-700"><Sparkles className="w-4 h-4 mr-2" />Envoyer à l'IA</Button>
            </div>
          </div>

          {aiReply && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">💡 Discussion avec l’IA</h2>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 h-[300px] overflow-y-auto shadow-inner space-y-4">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`w-full sm:max-w-[80%] px-4 py-3 rounded-xl text-sm shadow-sm ${msg.role === "user"
                        ? "bg-blue-500/20 text-blue-200 ml-auto text-right"
                        : "bg-purple-500/20 text-pink-200"
                      }`}
                  >
                    <p className="font-semibold mb-1">
                      {msg.role === "user" ? "👤 Vous" : "🤖 IA"}
                    </p>
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                  </div>
                ))}
                <div ref={scrollRef} />
              </div>

              {/* Zone de question utilisateur */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
                <div className="flex-1 relative">
                  <Textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onInput={(e) => {
                      const el = e.target
                      el.style.height = "auto"
                      el.style.height = `${Math.min(el.scrollHeight, 160)}px`
                    }}
                    placeholder="Posez une question à l'IA..."
                    className="w-full resize-none bg-slate-800/60 border border-white/10 text-white rounded-xl p-3 max-h-40 overflow-auto"
                    style={{ transition: "height 0.2s ease" }}
                  />
                </div>
                <Button
                  onClick={askFollowUp}
                  className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg flex items-center sm:w-auto w-full"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Envoyer
                </Button>
              </div>

              {/* Boutons d'export */}
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <Button
                  onClick={() => exportTxtChat(chatMessages)}
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Chat TXT
                </Button>
                <Button
                  onClick={() => exportPdfChat(chatMessages)}
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export Chat PDF
                </Button>
              </div>
            </div>
          )}


        </div>
      </div>
    </ProtectedRoute>
  )
}
