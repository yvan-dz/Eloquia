import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import os from "os";
import path from "path";

export const runtime = "nodejs";
const execPromise = promisify(exec);
const SEGMENT_DURATION = 900; // 15 min en secondes

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const videoUrl = formData.get("videoUrl");

    let videoPath = null;

    // 🎯 Cas 1 : vidéo locale
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      videoPath = path.join(os.tmpdir(), file.name);
      fs.writeFileSync(videoPath, buffer);
    }

    // 🎯 Cas 2 : lien vidéo en ligne
    if (videoUrl && !file) {
      const tempFileName = `video-${Date.now()}.mp4`;
      videoPath = path.join(os.tmpdir(), tempFileName);
      const command = `"C:\\yt-dlp\\yt-dlp.exe" -f mp4 -o "${videoPath}" "${videoUrl}"`;
      const { stderr } = await execPromise(command);
      if (stderr) console.warn("yt-dlp stderr :", stderr);
    }

    if (!videoPath || !fs.existsSync(videoPath)) {
      return NextResponse.json({ error: "Vidéo introuvable" }, { status: 400 });
    }

    // 🔊 Extraire audio proprement en MP3
    const extractedAudioPath = path.join(os.tmpdir(), `converted-${Date.now()}.mp3`);
    const extractCmd = `ffmpeg -i "${videoPath}" -vn -acodec libmp3lame -q:a 2 "${extractedAudioPath}"`;
    await execPromise(extractCmd);

    // ✂️ Découpage audio en segments de 15 min
    const segmentPattern = path.join(os.tmpdir(), `segment-%03d.mp3`);
    const splitCmd = `ffmpeg -i "${extractedAudioPath}" -f segment -segment_time ${SEGMENT_DURATION} -c copy "${segmentPattern}"`;
    await execPromise(splitCmd);

    const segments = fs.readdirSync(os.tmpdir())
      .filter(f => f.startsWith("segment-") && f.endsWith(".mp3"))
      .sort();

    let fullTranscription = "";

    for (const fileName of segments) {
      const segmentPath = path.join(os.tmpdir(), fileName);
      const audioBuffer = fs.readFileSync(segmentPath);
      const blob = new Blob([audioBuffer], { type: "audio/mpeg" });

      const form = new FormData();
      form.append("file", blob, "audio.mp3");
      form.append("model", "whisper-1");

      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: form,
      });

      const result = await response.json();
      if (!response.ok) {
        console.error("Erreur OpenAI :", result);
        return NextResponse.json({ error: result.error }, { status: response.status });
      }

      fullTranscription += result.text + "\n";
      fs.unlinkSync(segmentPath);
    }

    // ⏱ Obtenir la durée totale
    const ffprobeCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${extractedAudioPath}"`;
    const { stdout: durationOut } = await execPromise(ffprobeCmd);
    const durationSec = parseFloat(durationOut.trim()) || 0;
    const estimatedTime = Math.ceil(durationSec * 1.2);

    // Nettoyage global
    fs.unlinkSync(videoPath);
    fs.unlinkSync(extractedAudioPath);

    return NextResponse.json({
      text: fullTranscription,
      duration: durationSec,
      estimatedTime,
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur", details: error.message },
      { status: 500 }
    );
  }
}
