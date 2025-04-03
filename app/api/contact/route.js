// app/api/contact/route.js

import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  try {
    const body = await req.json()
    const { name, email, message } = body

    // ⚠️ Sécurité minimale : vérifie que tout est présent
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Champs manquants." }, { status: 400 })
    }

    await resend.emails.send({
      from: "Eloquia <onboarding@resend.dev>",
      to: "yvandzefak1@gmail.com", // ✅ ton adresse personnelle ici
      subject: `📬 Nouveau message de ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>💌 Nouveau message depuis le site <strong>Eloquia</strong></h2>
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message :</strong></p>
          <blockquote style="color: #555; background: #f9f9f9; padding: 10px; border-left: 4px solid #ccc;">
            ${message.replace(/\n/g, "<br/>")}
          </blockquote>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("❌ Erreur Resend :", err)
    return NextResponse.json({ error: "Erreur d'envoi de mail." }, { status: 500 })
  }
}
