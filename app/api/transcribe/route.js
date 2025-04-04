// /api/transcribe/route.js
import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import os from "os"
import path from "path"

export const runtime = "nodejs"
const execPromise = promisify(exec)
const SEGMENT_DURATION = 900

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get("file")
    const videoUrl = formData.get("videoUrl")

    let videoPath = null

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer())
      videoPath = path.join(os.tmpdir(), file.name)
      fs.writeFileSync(videoPath, buffer)
    }

    if (videoUrl && !file) {
      console.log("🌐 Téléchargement via yt-dlp-service :", videoUrl)
      const tempFileName = `video-${Date.now()}.mp4`

      const res = await fetch("https://yt-dlp-service-api-production.up.railway.app/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: videoUrl }),
      })

      const result = await res.json()

      if (!res.ok || !result.base64) {
        throw new Error(result.error || "yt-dlp-service failed")
      }

      const buffer = Buffer.from(result.base64, "base64")
      videoPath = path.join(os.tmpdir(), result.filename || tempFileName)
      fs.writeFileSync(videoPath, buffer)
    }

    if (!videoPath || !fs.existsSync(videoPath)) {
      return NextResponse.json({ error: "Vidéo introuvable" }, { status: 400 })
    }

    const extractedAudioPath = path.join(os.tmpdir(), `converted-${Date.now()}.mp3`)
    const extractCmd = `ffmpeg -i "${videoPath}" -vn -acodec libmp3lame -q:a 2 "${extractedAudioPath}"`
    await execPromise(extractCmd)

    const segmentPattern = path.join(os.tmpdir(), `segment-%03d.mp3`)
    const splitCmd = `ffmpeg -i "${extractedAudioPath}" -f segment -segment_time ${SEGMENT_DURATION} -c copy "${segmentPattern}"`
    await execPromise(splitCmd)

    const segments = fs.readdirSync(os.tmpdir()).filter(f => f.startsWith("segment-") && f.endsWith(".mp3")).sort()
    let fullTranscription = ""

    for (const fileName of segments) {
      const segmentPath = path.join(os.tmpdir(), fileName)
      const blob = new Blob([fs.readFileSync(segmentPath)], { type: "audio/mpeg" })

      const form = new FormData()
      form.append("file", blob, "audio.mp3")
      form.append("model", "whisper-1")

      const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: form,
      })

      const result = await res.json()
      if (!res.ok) {
        return NextResponse.json({ error: result.error }, { status: res.status })
      }

      fullTranscription += result.text + "\n"
      fs.unlinkSync(segmentPath)
    }

    const ffprobeCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${extractedAudioPath}"`
    const { stdout: durationOut } = await execPromise(ffprobeCmd)
    const durationSec = parseFloat(durationOut.trim()) || 0
    const estimatedTime = Math.ceil(durationSec * 1.2)

    fs.unlinkSync(videoPath)
    fs.unlinkSync(extractedAudioPath)

    return NextResponse.json({
      text: fullTranscription.trim(),
      duration: durationSec,
      estimatedTime,
    })

  } catch (error) {
    console.error("🔥 Erreur serveur :", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
