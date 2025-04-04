"use client"

import Link from "next/link"
import { ShieldCheck, Server, FileCheck2, LockKeyhole, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProPage() {
    return (
        <div className="min-h-screen px-6 py-24 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
            <div className="max-w-5xl mx-auto space-y-20">
                {/* Titre */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
                        🛡️ Eloquia Pro – L’IA confidentielle pour les pros
                    </h1>
                    <p className="text-white/70 text-lg max-w-3xl mx-auto">
                        Vous travaillez avec des données sensibles ? Eloquia Pro vous offre une solution de transcription et d’intelligence artificielle <strong>100% locale</strong>, <strong>sécurisée</strong> et <strong>sans aucun compromis sur la confidentialité</strong>.
                    </p>
                </div>

                {/* Avantages clés */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <Feature icon={<ShieldCheck className="text-yellow-300 w-7 h-7" />} title="Confidentialité absolue">
                        Aucune donnée n’est envoyée sur des serveurs distants. Vos vidéos, audios et transcriptions restent exclusivement dans votre environnement.
                    </Feature>
                    <Feature icon={<Server className="text-pink-300 w-7 h-7" />} title="Installation sur vos machines">
                        Déploiement flexible : fichier exécutable, installation serveur ou Docker. Utilisable même sans connexion Internet.
                    </Feature>
                    <Feature icon={<FileCheck2 className="text-purple-300 w-7 h-7" />} title="Performance professionnelle">
                        Transcription rapide, IA réactive, résumés détaillés, chat contextuel… optimisé pour vos charges de travail exigeantes.
                    </Feature>
                    <Feature icon={<LockKeyhole className="text-green-300 w-7 h-7" />} title="Sécurité et conformité">
                        Idéal pour les secteurs juridiques, éducation, médical, RH, média… Vous respectez vos engagements sans exposer vos données.
                    </Feature>
                </div>

                {/* Cas d’usage par secteur */}
                <section className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-10 space-y-10">
                    <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300 text-transparent bg-clip-text">
                        🧠 Qui peut bénéficier d’Eloquia Pro ?
                    </h2>
                    <p className="text-white/70 text-center max-w-3xl mx-auto text-lg">
                        Eloquia Pro est pensé pour celles et ceux qui traitent du contenu confidentiel, stratégique ou réglementé.
                        Voici quelques profils qui nous font déjà confiance :
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 text-white/80 text-sm">
                        <UseCase
                            title="⚖️ Cabinets juridiques & avocats"
                            content="Transcrire des audiences, réunions clients ou mémos confidentiels sans aucun transfert de fichier vers le cloud."
                        />
                        <UseCase
                            title="🏫 Universités & centres de formation"
                            content="Proposer aux enseignants une transcription locale des cours filmés ou enregistrés, avec IA intégrée pour générer des synthèses."
                        />
                        <UseCase
                            title="🎙️ Médias & journalistes"
                            content="Convertir des interviews, podcasts ou vidéos sensibles en texte exploitable, sans dépendance à une plateforme externe."
                        />
                        <UseCase
                            title="🏥 Professionnels de santé"
                            content="Transcrire des notes audio médicales ou vidéos de formation tout en respectant les impératifs de confidentialité patient."
                        />
                    </div>
                </section>


                {/* Bloc devis */}
                <section className="text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 text-transparent bg-clip-text">
                        💼 Une offre sur mesure pour chaque organisation
                    </h2>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto">
                        Que vous soyez une école, une entreprise, un cabinet juridique ou une structure média : nous adaptons Eloquia Pro à vos besoins spécifiques.
                    </p>
                    <Link href="/contact">
                        <Button className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 hover:scale-105 text-black font-semibold shadow-lg">
                            Demander un devis confidentiel →
                        </Button>
                    </Link>
                    <p className="text-white/40 text-sm italic">Réponse garantie sous 48h</p>
                </section>

                {/* Contact direct */}
                <div className="text-center pt-10 text-white/60 text-sm flex flex-col items-center gap-2">
                    <Mail className="w-5 h-5 text-pink-400" />
                    Vous préférez le contact direct ? Écrivez-nous à{" "}
                    <a href="mailto:pro@eloquia.app" className="underline text-white hover:text-pink-300">Eloquia Team</a>
                </div>
            </div>
        </div>
    )
}

function Feature({ icon, title, children }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4 hover:scale-[1.015] transition">
            {icon}
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-white/70 text-sm">{children}</p>
        </div>
    )
}

function UseCase({ title, content }) {
    return (
        <div className="bg-black/30 border border-white/10 rounded-xl p-5 hover:scale-[1.015] transition duration-300">
            <h3 className="font-semibold text-white mb-2">{title}</h3>
            <p className="text-white/70">{content}</p>
        </div>
    )
}
