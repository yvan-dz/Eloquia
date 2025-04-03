import { NextResponse } from "next/server"
import { SpeechClient } from "@google-cloud/speech"
import { Storage } from "@google-cloud/storage"
import { v4 as uuidv4 } from "uuid"
import { Buffer } from "buffer"
import fs from "fs"
import path from "path"

export const runtime = "nodejs"

// 📁 Crée le dossier temporaire s’il n'existe pas
const tmpDir = path.join(process.cwd(), "tmp")
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir)
}

// ✅ Fonction pour créer le fichier de credentials si besoin
function ensureGoogleCredentials() {
  const credentialsPath = "/app/google-stt.json"
  if (
    process.env.GOOGLE_CREDENTIALS_BASE64 &&
    !fs.existsSync(credentialsPath)
  ) {
    const decoded = Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, "base64").toString("utf-8")
    fs.writeFileSync(credentialsPath, decoded)
    console.log("🔐 Fichier google-stt.json créé à partir de GOOGLE_CREDENTIALS_BASE64")
  }
}

export async function POST(req) {
  try {
    ensureGoogleCredentials()

    if (!process.env.GOOGLE_CREDENTIALS_BASE64 || !process.env.GOOGLE_BUCKET_NAME) {
      console.error("❌ Variables d’environnement manquantes")
      return NextResponse.json({ error: "Clés manquantes dans les variables d'environnement" }, { status: 500 })
    }

    const creds = JSON.parse(
      Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, "base64").toString("utf-8")
    )

    const sttClient = new SpeechClient({ credentials: creds })
    const storage = new Storage({ credentials: creds })
    const bucketName = process.env.GOOGLE_BUCKET_NAME

    const body = await req.json()

    // 🎙️ Transcription audio simple
    if (body.audioContent) {
      console.log("🎧 Fichier audio reçu, transcription en cours...")
      const fileName = `temp-${uuidv4()}.webm`
      const filePath = path.join(tmpDir, fileName)
      const audioBuffer = Buffer.from(body.audioContent, "base64")
      fs.writeFileSync(filePath, audioBuffer)

      // 📤 Upload vers Google Cloud Storage
      console.log("📤 Upload dans le bucket :", bucketName)
      await storage.bucket(bucketName).upload(filePath, {
        destination: fileName,
      })

      // 🧠 Envoi à Google STT
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
        .map((r) => r.alternatives[0]?.transcript)
        .filter(Boolean)
        .join("\n")
        .trim()

      // 🧹 Nettoyage
      fs.unlinkSync(filePath)
      await storage.bucket(bucketName).file(fileName).delete()
      console.log("🧹 Fichier local et distant supprimé")

      return NextResponse.json({ text: transcription || "" })
    }

    // ✨ Gemini : reformulation
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

    // 💬 Gemini : chat avec historique
    if (body.chat && Array.isArray(body.history)) {
      console.log("💬 Gemini : discussion avec historique...")
      const contents = body.history.map((msg) => ({
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
