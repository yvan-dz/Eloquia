// app/api/writing/route.js

import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getInstructionLength(level) {
  switch (level) {
    case "A1": return 60;
    case "A2": return 80;
    case "B1": return 120;
    case "B2": return 160;
    case "C1": return 200;
    case "C2": return 250;
    default: return 100;
  }
}

const langLabelMap = {
  English: "English",
  French: "Français",
  German: "Deutsch",
  Spanish: "Español"
};

export async function POST(req) {
  const { language, level } = await req.json();

  if (!language || !level) {
    return NextResponse.json({ error: "Missing language or level" }, { status: 400 });
  }

  const langLabel = langLabelMap[language] || language;
  const minLength = getInstructionLength(level);

  const prompt = `
You are a CEFR writing examiner.

1. Create a written expression task in "${language}" for level "${level}".
2. The prompt must be written in ${langLabel}.
3. For A1 or A2 levels, include 2–3 simple guiding questions or keywords.
4. The task must require at least ${minLength} words.
5. Return only this JSON format:
{
  "prompt": "...",
  "questions": ["...", "..."]
}
`;

  const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    }),
  });

  const raw = await geminiRes.json();
  const text = raw?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  try {
    const cleaned = text.replace(/```json|```/g, "").replace(/[“”]/g, '"').trim();
    const start = cleaned.indexOf("{");
    const parsed = JSON.parse(cleaned.slice(start));
    return NextResponse.json(parsed);
  } catch (e) {
    return NextResponse.json({ error: "JSON parsing failed", raw: text }, { status: 500 });
  }
}
