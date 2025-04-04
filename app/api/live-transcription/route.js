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
      console.error("❌ Variables d’environnement manquantes")
      return NextResponse.json(
        { error: "Clés manquantes dans les variables d'environnement" },
        { status: 500 }
      )
    }

    // ✅ Décode la variable base64
    let creds
    try {
      const decoded = Buffer.from(credsBase64, "base64").toString("utf-8")
      creds = JSON.parse(decoded)
    } catch (e) {
      console.error("❌ Erreur lors du décodage ou parsing des credentials :", e.message)
      return NextResponse.json({ error: "Credentials invalides" }, { status: 500 })
    }

    const sttClient = new SpeechClient({ credentials: creds })
    const storage = new Storage({ credentials: creds })

    const body = await req.json()

    if (body.audioContent) {
      console.log("🎧 Fichier audio reçu, transcription en cours...")
      const fileName = `temp-${uuidv4()}.webm`
      const filePath = path.join(tmpDir, fileName)
      const audioBuffer = Buffer.from(body.audioContent, "base64")
      fs.writeFileSync(filePath, audioBuffer)

      console.log("📤 Upload dans le bucket :", bucketName)
      await storage.bucket(bucketName).upload(filePath, { destination: fileName })

      console.log("🧠 Lancement de la reconnaissance vocale avec Google...")
      const [operation] = await sttClient.longRunningRecognize({
        audio: { uri: `gs://${bucketName}/${fileName}` },
        config: {
          encoding: "WEBM_OPUS",
          sampleRateHertz: 48000,
          languageCode: "fr-FR",
        },
      })

      const [response] = await operation.promise()
      console.log("✅ Résultat reçu")

      const transcription = response.results
        .map(r => r.alternatives[0]?.transcript)
        .filter(Boolean)
        .join("\n")
        .trim()

      fs.unlinkSync(filePath)
      await storage.bucket(bucketName).file(fileName).delete()
      console.log("🧹 Fichiers temporaires supprimés")

      return NextResponse.json({ text: transcription || "" })
    }

    if (body.sendToGemini && body.transcription) {
      console.log("🧠 Gemini : reformulation demandée...")
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

      console.log("✅ Reformulation terminée")
      return NextResponse.json({ reply })
    }

    if (body.chat && Array.isArray(body.history)) {
      console.log("💬 Gemini : discussion avec historique...")
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

      console.log("✅ Réponse obtenue depuis Gemini")
      return NextResponse.json({ reply })
    }

    console.warn("❓ Requête invalide ou incomplète")
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 })

  } catch (error) {
    console.error("🔥 Erreur serveur :", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
