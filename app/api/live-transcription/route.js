import { NextResponse } from "next/server"
import { SpeechClient } from "@google-cloud/speech"
import { Storage } from "@google-cloud/storage"
import { v4 as uuidv4 } from "uuid"
import { Buffer } from "buffer"
import fs from "fs"
import path from "path"

export const runtime = "nodejs"

const tmpDir = path.join(process.cwd(), "tmp")
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir)
}

export async function POST(req) {
  try {
    const credsBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
    const bucketName = process.env.GOOGLE_BUCKET_NAME

    if (!credsBase64 || !bucketName) {
      return NextResponse.json(
        { error: "Clés manquantes dans les variables d'environnement" },
        { status: 500 }
      )
    }

    const decoded = Buffer.from(credsBase64, "base64").toString("utf-8")
    const creds = JSON.parse(decoded)

    const sttClient = new SpeechClient({ credentials: creds })
    const storage = new Storage({ credentials: creds })

    const body = await req.json()

    if (body.audioContent) {
      const mimeType = body.mimeType || "audio/webm"
      const fileExt = mimeType.split("/")[1] || "webm"
      const encodingMap = {
        webm: "WEBM_OPUS",
        wav: "LINEAR16",
        mp3: "MP3",
        flac: "FLAC",
        ogg: "OGG_OPUS",
        m4a: "MP4"
      }

      const encoding = encodingMap[fileExt]
      if (!encoding) {
        return NextResponse.json({ error: `Format audio non supporté : ${fileExt}` }, { status: 400 })
      }

      const fileName = `temp-${uuidv4()}.${fileExt}`
      const filePath = path.join(tmpDir, fileName)
      const audioBuffer = Buffer.from(body.audioContent, "base64")
      fs.writeFileSync(filePath, audioBuffer)

      await storage.bucket(bucketName).upload(filePath, { destination: fileName })

      const [operation] = await sttClient.longRunningRecognize({
        audio: { uri: `gs://${bucketName}/${fileName}` },
        config: {
          encoding,
          sampleRateHertz: 48000,
          languageCode: "fr-FR",
        },
      })

      const [response] = await operation.promise()

      const transcription = response.results
        .map(r => r.alternatives[0]?.transcript)
        .filter(Boolean)
        .join("\n")
        .trim()

      fs.unlinkSync(filePath)
      await storage.bucket(bucketName).file(fileName).delete()

      return NextResponse.json({ text: transcription || "" })
    }

    if (body.sendToGemini && body.transcription) {
      const prompt = `Corrige et reformule proprement ce discours en français sans changer le fond du message :\n\n${body.transcription}`

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          }),
        }
      )

      const data = await geminiRes.json()
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Pas de réponse."

      return NextResponse.json({ reply })
    }

    if (body.chat && Array.isArray(body.history)) {
      const contents = body.history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }))

      const geminiChat = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents }),
        }
      )

      const data = await geminiChat.json()
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Pas de réponse."

      return NextResponse.json({ reply })
    }

    return NextResponse.json({ error: "Requête invalide" }, { status: 400 })

  } catch (error) {
    console.error("🔥 Erreur serveur :", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
