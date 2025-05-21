import { NextResponse } from "next/server";
import { SpeechClient } from "@google-cloud/speech";
import { Storage } from "@google-cloud/storage";

export const runtime = "nodejs";

const GOOGLE_KEY_PATH = "/etc/secrets/google-stt.json";

const client = new SpeechClient({
  keyFilename: GOOGLE_KEY_PATH,
});

const storage = new Storage({
  keyFilename: GOOGLE_KEY_PATH,
});

const bucketName = "live01";

const langCodeMap = {
  English: "en-US",
  French: "fr-FR",
  Spanish: "es-ES",
  German: "de-DE",
};

export async function POST(req) {
  const { audioBase64, language, level, theme } = await req.json();

  if (!audioBase64 || !language || !level || !theme) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const languageCode = langCodeMap[language] || "en-US";
  const audioBytes = Buffer.from(audioBase64, "base64");

  let transcript = "";
  console.log("🎙️ Lang:", languageCode, "Level:", level, "Theme:", theme);

  // 1️⃣ Tentative rapide STT
  try {
    console.log("⚡ Attempting fast STT...");
    const [quickRes] = await client.recognize({
      audio: { content: audioBytes.toString("base64") },
      config: {
        encoding: "WEBM_OPUS",
        sampleRateHertz: 48000,
        languageCode,
        enableAutomaticPunctuation: true,
      },
    });

    transcript = quickRes.results
      .map((r) => r.alternatives?.[0]?.transcript)
      .filter(Boolean)
      .join(" ")
      .trim();

    if (transcript) {
      console.log("✅ Fast STT success. Words:", transcript.split(" ").length);
    }
  } catch (fastErr) {
    console.warn("⚠️ Fast STT failed:", fastErr.message);
  }

  // 2️⃣ Long STT fallback avec GCS
  if (!transcript || transcript.length < 5) {
    try {
      console.log("☁️ Upload audio to GCS...");
      const fileName = `audio-${Date.now()}.webm`;
      const file = storage.bucket(bucketName).file(fileName);

      await file.save(audioBytes, {
        metadata: { contentType: "audio/webm" },
        resumable: false,
      });

      const gcsUri = `gs://${bucketName}/${fileName}`;
      console.log("📡 GCS URI ready:", gcsUri);

      const [operation] = await client.longRunningRecognize({
        audio: { uri: gcsUri },
        config: {
          encoding: "WEBM_OPUS",
          sampleRateHertz: 48000,
          languageCode,
          enableAutomaticPunctuation: true,
          model: "default",
        },
      });

      const [response] = await operation.promise();

      transcript = response.results
        .map((r) => r.alternatives?.[0]?.transcript)
        .filter(Boolean)
        .join(" ")
        .trim();

      console.log("✅ Long STT success. Transcript:", transcript.slice(0, 200));

      await file.delete();
      console.log("🧹 GCS file deleted.");
    } catch (longErr) {
      console.error("❌ Long STT via GCS failed:", longErr.message);
      return NextResponse.json({ error: "Google STT via GCS failed." }, { status: 500 });
    }
  }

  if (!transcript || transcript.length < 5) {
    return NextResponse.json({ error: "No clear speech detected." }, { status: 400 });
  }

  const feedbackInstructionMap = {
    English: "The feedback must be written in English.",
    French: "Le feedback doit être rédigé en français.",
    Spanish: "El feedback debe estar escrito en español.",
    German: "Das Feedback muss auf Deutsch verfasst sein.",
  };

  const feedbackInstruction = feedbackInstructionMap[language] || feedbackInstructionMap["English"];

  const prompt = `
You are a CEFR speaking examiner.
Evaluate the test result based on:

- Language: ${language}
- Level: ${level}
- Topic: ${theme}
- Transcript: """${transcript}"""

Assess fluency, pronunciation, vocabulary, structure, and relevance.
Give a score from 1 to 20. Be strict at advanced levels (C1–C2).

${feedbackInstruction}

Respond only in JSON:
{
  "score": 14,
  "feedback": "Your ideas are well structured but some hesitation is present.",
  "transcript": "${transcript}"
}
`.trim();

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
    );

    const aiData = await aiRes.json();
    const raw = aiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = raw.replace(/```json|```/g, "").replace(/[“”]/g, '"').trim();
    const parsed = JSON.parse(clean.slice(clean.indexOf("{")));

    console.log("✅ AI evaluation OK:", parsed.score);
    return NextResponse.json(parsed);
  } catch (aiErr) {
    console.error("❌ AI evaluation failed:", aiErr.message);
    return NextResponse.json({ error: "AI evaluation failed." }, { status: 500 });
  }
}
