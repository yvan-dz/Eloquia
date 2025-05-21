import { NextResponse } from "next/server";

export const runtime = "nodejs";

function normalize(score, total) {
  return Math.round((score / (total || 1)) * 20);
}

export async function POST(req) {
  const {
    readingScore,
    readingTotal,
    listeningScore,
    listeningTotal,
    speakingScore, // sur 20
    writingScore,  // sur 20
    level,
    language
  } = await req.json();

  if (
    readingScore == null ||
    listeningScore == null ||
    speakingScore == null ||
    writingScore == null ||
    !level ||
    !language
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const normalizedReading = normalize(readingScore, readingTotal);
  const normalizedListening = normalize(listeningScore, listeningTotal);
  const normalizedSpeaking = speakingScore;
  const normalizedWriting = writingScore;
  const total = normalizedReading + normalizedListening + normalizedSpeaking + normalizedWriting;

  const langLabels = {
    English: "English",
    French: "français",
    German: "Deutsch",
    Spanish: "Español",
  };
  const langLabel = langLabels[language] || "target language";

  const prompt = `
You are a CEFR language examiner.

A student has just completed a language level test in ${language}.
Their estimated level was ${level}. They obtained the following normalized scores (each between 0 and 20):

- Reading: ${normalizedReading}/20
- Listening: ${normalizedListening}/20
- Speaking: ${normalizedSpeaking}/20
- Writing: ${normalizedWriting}/20
- Total: ${total}/80

Your task:

1. Determine their final CEFR level (A1 to C2).
2. Then write a structured and natural feedback **in ${langLabel}**, covering:

   - ✅ Their strengths
   - ⚠️ Their weakest areas
   - 📈 Suggestions for improvement (simple and practical)
   - 🎯 Encourage them at the end

Rules:
- Adapt your tone to the level (stricter for C1/C2, supportive for A1/A2).
- Keep the feedback human, natural and under 10 lines.
- Avoid repeating scores: focus on clear, meaningful analysis.
- Do not translate the prompt.

Respond only in this exact JSON format:
{
  "level": "B1",
  "feedback": "..."
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

    const raw = await aiRes.json();
    const text = raw?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const clean = text.replace(/```json|```/g, "").replace(/[“”]/g, '"').trim();
    const parsed = JSON.parse(clean.slice(clean.indexOf("{")));

    return NextResponse.json({
      ...parsed,
      total, // on renvoie aussi le total brut
      normalized: {
        reading: normalizedReading,
        listening: normalizedListening,
        speaking: normalizedSpeaking,
        writing: normalizedWriting,
      }
    });
  } catch (err) {
    console.error("❌ Final Score Error:", err);
    return NextResponse.json({ error: "Final evaluation failed." }, { status: 500 });
  }
}
