// app/api/writing/grade/route.js

import { NextResponse } from "next/server";

export const runtime = "nodejs";

const langLabelMap = {
  English: "English",
  French: "Français",
  German: "Deutsch",
  Spanish: "Español",
};

export async function POST(req) {
  const { language, level, answer } = await req.json();

  if (!language || !level || !answer) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const langLabel = langLabelMap[language] || language;

  const scoringPrompt = `
You are a strict CEFR language examiner grading a writing task in ${langLabel}.

Evaluate the following learner's written answer for level ${level}:
- Give a final score out of 20.
- Provide a short and objective justification (max 6 lines) considering grammar, vocabulary, structure, fluency, and relevance.
- Be more strict for advanced levels (B2, C1, C2).
- Respond fully in ${langLabel}.

Learner's answer:
${answer}

Return only JSON like this:
{
  "score": 17,
  "comment": "Votre texte est structuré et riche en vocabulaire, mais comporte quelques fautes de conjugaison."
}
`;

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: scoringPrompt }] }],
      }),
    }
  );

  const raw = await geminiRes.json();
  const responseText = raw?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  try {
    const cleaned = responseText.replace(/```json|```/g, "").replace(/[“”]/g, '"').trim();
    const start = cleaned.indexOf("{");
    const parsed = JSON.parse(cleaned.slice(start));
    return NextResponse.json(parsed);
  } catch (e) {
    return NextResponse.json({ error: "Parsing failed", raw: responseText }, { status: 500 });
  }
}
