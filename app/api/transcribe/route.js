import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import os from "os"
import path from "path"

export const runtime = "nodejs"
const execPromise = promisify(exec)
const SEGMENT_DURATION = 900 // 15 minutes

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get("file")
    const videoUrl = formData.get("videoUrl")

    let videoPath = null

    // 🎬 Cas 1 : Vidéo locale
    if (file) {
      console.log("📁 Vidéo locale détectée")
      const buffer = Buffer.from(await file.arrayBuffer())
      videoPath = path.join(os.tmpdir(), file.name)
      fs.writeFileSync(videoPath, buffer)
    }

    // 🌐 Cas 2 : Vidéo en ligne (via yt-dlp-service avec base64)
    if (videoUrl && !file) {
      console.log("🌐 Téléchargement de la vidéo via yt-dlp-service :", videoUrl)
      const tempFileName = `video-${Date.now()}.mp4`
      videoPath = path.join(os.tmpdir(), tempFileName)

      const res = await fetch("https://yt-dlp-service-api-production.up.railway.app/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: videoUrl }),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Erreur API yt-dlp-service: ${errText}`)
      }

      const data = await res.json()

      if (!data.base64) {
        throw new Error("Réponse invalide de l'API : base64 manquant")
      }

      const buffer = Buffer.from(data.base64, "base64")
      fs.writeFileSync(videoPath, buffer)
      console.log("✅ Vidéo téléchargée avec succès :", videoPath)
    }

    // ✅ Vérification
    if (!videoPath || !fs.existsSync(videoPath)) {
      return NextResponse.json({ error: "Vidéo introuvable" }, { status: 400 })
    }

    // 🎧 Extraction de l’audio
    const extractedAudioPath = path.join(os.tmpdir(), `converted-${Date.now()}.mp3`)
    const extractCmd = `ffmpeg -i "${videoPath}" -vn -acodec libmp3lame -q:a 2 "${extractedAudioPath}"`
    await execPromise(extractCmd)

    // ✂️ Découpage audio
    const segmentPattern = path.join(os.tmpdir(), `segment-%03d.mp3`)
    const splitCmd = `ffmpeg -i "${extractedAudioPath}" -f segment -segment_time ${SEGMENT_DURATION} -c copy "${segmentPattern}"`
    await execPromise(splitCmd)

    // 📜 Transcription
    const segments = fs.readdirSync(os.tmpdir())
      .filter(f => f.startsWith("segment-") && f.endsWith(".mp3"))
      .sort()

    let fullTranscription = ""

    for (const fileName of segments) {
      const segmentPath = path.join(os.tmpdir(), fileName)
      const audioBuffer = fs.readFileSync(segmentPath)
      const blob = new Blob([audioBuffer], { type: "audio/mpeg" })

      const form = new FormData()
      form.append("file", blob, "audio.mp3")
      form.append("model", "whisper-1")

      console.log("🧠 Envoi du segment à OpenAI :", fileName)

      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: form,
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("❌ Erreur OpenAI :", result)
        return NextResponse.json({ error: result.error }, { status: response.status })
      }

      fullTranscription += result.text + "\n"
      fs.unlinkSync(segmentPath)
    }

    // ⏱ Durée estimée
    const ffprobeCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${extractedAudioPath}"`
    const { stdout: durationOut } = await execPromise(ffprobeCmd)
    const durationSec = parseFloat(durationOut.trim()) || 0
    const estimatedTime = Math.ceil(durationSec * 1.2)

    // 🧹 Nettoyage
    fs.unlinkSync(videoPath)
    fs.unlinkSync(extractedAudioPath)

    return NextResponse.json({
      text: fullTranscription.trim(),
      duration: durationSec,
      estimatedTime,
    })

  } catch (error) {
    console.error("🔥 Erreur serveur :", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur", details: error.message },
      { status: 500 }
    )
  }
}
