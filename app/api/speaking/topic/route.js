import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
    const { language, level } = await req.json();

    if (!language || !level) {
        return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const prompt = `
You are a CEFR speaking examiner.
Generate a realistic speaking prompt in ${language} for level ${level}.
Make sure it's appropriate and natural for this level.
Return ONLY valid JSON:

{ "topic": "..." }
`;

    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: prompt }] }],
                }),
            }
        );

        const raw = await res.json();
        const content = raw?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const clean = content.replace(/```json|```/g, "").replace(/[“”]/g, '"').trim();
        const start = clean.indexOf("{");
        const parsed = JSON.parse(clean.slice(start));

        return NextResponse.json({ topic: parsed.topic || "Describe a personal experience that changed you." });
    } catch (err) {
        return NextResponse.json({ error: "Failed to generate topic", details: err.message }, { status: 500 });
    }
}
