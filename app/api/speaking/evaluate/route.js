import { NextResponse } from "next/server"
import { SpeechClient } from "@google-cloud/speech"
import { Storage } from "@google-cloud/storage"
import os from "os"
import fs from "fs"
import path from "path"

export const runtime = "nodejs"

const TMP_FILE = path.join(os.tmpdir(), "google-stt.json")

// 🔐 Décode Base64 et écrit le fichier si nécessaire
function writeServiceKeyIfNeeded() {
  if (!fs.existsSync(TMP_FILE)) {
    const base64 = process.env.GOOGLE_SERVICE_KEY_JSON
    if (!base64) throw new Error("Missing GOOGLE_SERVICE_KEY_JSON")

    const decoded = Buffer.from(base64, "base64").toString("utf8")
    fs.writeFileSync(TMP_FILE, decoded)
  }
}

writeServiceKeyIfNeeded()

const client = new SpeechClient({ keyFilename: TMP_FILE })
const storage = new Storage({ keyFilename: TMP_FILE })

const bucketName = "live01"

const langCodeMap = {
  English: "en-US",
  French: "fr-FR",
  Spanish: "es-ES",
  German: "de-DE",
}

export async function POST(req) {
  const { audioBase64, language, level, theme } = await req.json()

  if (!audioBase64 || !language || !level || !theme) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const languageCode = langCodeMap[language] || "en-US"
  const audioBytes = Buffer.from(audioBase64, "base64")
  let transcript = ""

  console.log("🎙️ Lang:", languageCode, "Level:", level, "Theme:", theme)

  // 1️⃣ Fast STT
  try {
    const [quickRes] = await client.recognize({
      audio: { content: audioBytes.toString("base64") },
      config: {
        encoding: "WEBM_OPUS",
        sampleRateHertz: 48000,
        languageCode,
        enableAutomaticPunctuation: true,
      },
    })

    transcript = quickRes.results.map(r => r.alternatives?.[0]?.transcript).filter(Boolean).join(" ").trim()

    if (transcript) {
      console.log("✅ Fast STT success. Words:", transcript.split(" ").length)
    }
  } catch (fastErr) {
    console.warn("⚠️ Fast STT failed:", fastErr.message)
  }

  // 2️⃣ Long fallback STT
  if (!transcript || transcript.length < 5) {
    try {
      const fileName = `audio-${Date.now()}.webm`
      const file = storage.bucket(bucketName).file(fileName)

      await file.save(audioBytes, {
        metadata: { contentType: "audio/webm" },
        resumable: false,
      })

      const gcsUri = `gs://${bucketName}/${fileName}`
      console.log("📡 GCS URI:", gcsUri)

      const [operation] = await client.longRunningRecognize({
        audio: { uri: gcsUri },
        config: {
          encoding: "WEBM_OPUS",
          sampleRateHertz: 48000,
          languageCode,
          enableAutomaticPunctuation: true,
          model: "default",
        },
      })

      const [response] = await operation.promise()

      transcript = response.results.map(r => r.alternatives?.[0]?.transcript).filter(Boolean).join(" ").trim()

      await file.delete()
      console.log("✅ Long STT complete.")
    } catch (err) {
      console.error("❌ Long STT error:", err.message)
      return NextResponse.json({ error: "Google STT via GCS failed." }, { status: 500 })
    }
  }

  if (!transcript || transcript.length < 5) {
    return NextResponse.json({ error: "No clear speech detected." }, { status: 400 })
  }

  // 🧠 Feedback Instruction
  const feedbackInstructionMap = {
    English: "The feedback must be written in English.",
    French: "Le feedback doit être rédigé en français.",
    Spanish: "El feedback debe estar écrit en español.",
    German: "Das Feedback muss auf Deutsch verfasst sein.",
  }

  const feedbackInstruction = feedbackInstructionMap[language] || "The feedback must be written in English."

  // 3️⃣ Gemini Evaluation
  const prompt = `
You are a CEFR speaking examiner.
You will evaluate a speaking test response based on:

- Language: ${language}
- Level: ${level}
- Topic: ${theme}
- Transcript: """${transcript}"""

Assess fluency, pronunciation, vocabulary, structure, and relevance.
Give a score between 1 and 20. Be more strict for levels C1 and C2.

${feedbackInstruction}

Respond only in JSON:
{
  "score": 14,
  "feedback": "Your ideas are well structured but some hesitation is present.",
  "transcript": "${transcript}"
}
`.trim()

  try {
    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    )

    const aiData = await aiRes.json()
    const raw = aiData?.candidates?.[0]?.content?.parts?.[0]?.text || ""
    const clean = raw.replace(/```json|```/g, "").replace(/[“”]/g, '"').trim()
    const parsed = JSON.parse(clean.slice(clean.indexOf("{")))

    return NextResponse.json(parsed)
  } catch (err) {
    console.error("❌ AI evaluation failed:", err.message)
    return NextResponse.json({ error: "AI evaluation failed." }, { status: 500 })
  }
}
