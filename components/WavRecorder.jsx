// components/WavRecorder.jsx
import { useEffect, useRef, useState } from "react"

export function useWavRecorder() {
  const mediaStream = useRef(null)
  const mediaRecorder = useRef(null)
  const audioChunks = useRef([])
  const [recording, setRecording] = useState(false)

  const startRecording = async () => {
    try {
      mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true })

      mediaRecorder.current = new MediaRecorder(mediaStream.current, {
        mimeType: "audio/wav", // Ce sera ignoré par certains navigateurs, mais pas grave
        audioBitsPerSecond: 128000,
      })

      audioChunks.current = []
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data)
        }
      }

      mediaRecorder.current.onstop = () => {
        mediaStream.current?.getTracks().forEach((t) => t.stop())
      }

      mediaRecorder.current.start()
      setRecording(true)
    } catch (err) {
      console.error("Erreur lors de l'enregistrement audio :", err)
    }
  }

  const stopRecording = async () => {
    return new Promise((resolve) => {
      if (!mediaRecorder.current) return resolve(null)

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" })
        resolve(audioBlob)
        mediaStream.current?.getTracks().forEach((t) => t.stop())
        setRecording(false)
      }

      mediaRecorder.current.stop()
    })
  }

  return { recording, startRecording, stopRecording }
}
