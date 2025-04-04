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

    // 🎬 Cas 1 : Fichier vidéo local
    if (file) {
      console.log("📁 Vidéo locale détectée")
      const buffer = Buffer.from(await file.arrayBuffer())
      videoPath = path.join(os.tmpdir(), file.name)
      fs.writeFileSync(videoPath, buffer)
    }

    // 🌐 Cas 2 : URL vidéo en ligne (traité via yt-dlp-service)
    if (videoUrl && !file) {
      console.log("🌐 Téléchargement de la vidéo via yt-dlp-service :", videoUrl)
      const tempFileName = `video-${Date.now()}.mp4`
      videoPath = path.join(os.tmpdir(), tempFileName)

      try {
        const res = await fetch("https://yt-dlp-service-api-production.up.railway.app/api/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: videoUrl }),
        })

        const json = await res.json()

        if (!res.ok) {
          throw new Error(json.error || "Erreur lors du téléchargement distant")
        }

        const { base64, filename } = json
        const buffer = Buffer.from(base64, "base64")
        videoPath = path.join(os.tmpdir(), filename || tempFileName)
        fs.writeFileSync(videoPath, buffer)
        console.log("✅ Téléchargement réussi :", videoPath)

      } catch (err) {
        console.error("❌ Échec via yt-dlp-service :", err)
        return NextResponse.json({ error: "Impossible de télécharger la vidéo via l’API." }, { status: 500 })
      }
    }

    // ❌ Vidéo introuvable
    if (!videoPath || !fs.existsSync(videoPath)) {
      console.error("🚫 Aucune vidéo trouvée")
      return NextResponse.json({ error: "Vidéo introuvable" }, { status: 400 })
    }

    // 🎧 Extraction de l’audio
    const extractedAudioPath = path.join(os.tmpdir(), `converted-${Date.now()}.mp3`)
    const extractCmd = `ffmpeg -i "${videoPath}" -vn -acodec libmp3lame -q:a 2 "${extractedAudioPath}"`
    console.log("🎙️ Extraction audio via ffmpeg...")
    await execPromise(extractCmd)

    // ✂️ Découpage audio
    const segmentPattern = path.join(os.tmpdir(), `segment-%03d.mp3`)
    const splitCmd = `ffmpeg -i "${extractedAudioPath}" -f segment -segment_time ${SEGMENT_DURATION} -c copy "${segmentPattern}"`
    console.log("✂️ Découpage audio en segments...")
    await execPromise(splitCmd)

    // 📜 Transcription avec OpenAI
    const segments = fs.readdirSync(os.tmpdir())
      .filter(f => f.startsWith("segment-") && f.endsWith(".mp3"))
      .sort()

    console.log(`🔍 ${segments.length} segments détectés.`)

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

    // ⏱ Calcul de la durée
    const ffprobeCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${extractedAudioPath}"`
    const { stdout: durationOut } = await execPromise(ffprobeCmd)
    const durationSec = parseFloat(durationOut.trim()) || 0
    const estimatedTime = Math.ceil(durationSec * 1.2)

    console.log("✅ Transcription terminée")
    console.log("🧹 Nettoyage des fichiers temporaires...")

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
