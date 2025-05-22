import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getQuestionCount(level) {
    switch (level) {
        case "A1": return 4;
        case "A2": return 7;
        case "B1": return 10;
        case "B2": return 13;
        case "C1": return 16;
        case "C2": return 20;
        default: return 5;
    }
}

export async function POST(req) {
    const { language, level } = await req.json();

    if (!language || !level) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const nbQuestions = getQuestionCount(level);

    const prompt = `
You are a CEFR language exam generator.

1. Create a reading comprehension exercise in "${language}" at level "${level}".
2. Write a short text adapted to this level:
   - A1–B2: at least 300 words
   - C1/C2: at least 500 words

3. Then generate exactly ${nbQuestions} multiple-choice questions based on the text.
   - Each question must have exactly 3 answer choices: ["A", "B", "C"]
   - The "correct" answer must be one of the 3 options
   - Verify that "correct" === one of the "options" before returning
   - Do NOT return duplicates or blank values

4. Return ONLY valid JSON in this exact format (no markdown, no explanation, no formatting):

{
  "text": "string",
  "questions": [
    { "q": "string", "options": ["string", "string", "string"], "correct": "string" }
  ]
}

Do not include any comments or explanation outside the JSON.
Ensure JSON is directly parsable and correct.
`;



    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        }),
    });

    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    try {
        let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // 🧹 1. Enlever tout ce qui est markdown type ```json ou ```
        rawText = rawText.replace(/```json|```/g, "").trim();

        // 🧹 2. Corriger les guillemets typographiques
        rawText = rawText.replace(/[“”]/g, '"');

        // 🧹 3. Supprimer les éventuelles lignes avant le 1er vrai JSON
        const startIndex = rawText.indexOf("{");
        const jsonString = rawText.slice(startIndex);

        // ✅ 4. Tenter le parse
        const parsed = JSON.parse(jsonString);
        return NextResponse.json(parsed);
    } catch (e) {
        console.error("❌ Failed to parse Gemini output:", e);
        return NextResponse.json({
            error: "Unable to parse Gemini output",
            raw: data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
        }, { status: 500 });
    }


}
