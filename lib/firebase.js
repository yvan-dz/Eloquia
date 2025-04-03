// lib/firebase.js
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// Pas besoin d'analytics côté client avec Next.js

const firebaseConfig = {
  apiKey: "AIzaSyD_m7tTsJ9gf1irP-43wT85yGGzVBWNACA",
  authDomain: "eloquia-78220.firebaseapp.com",
  projectId: "eloquia-78220",
  storageBucket: "eloquia-78220.firebasestorage.app",
  messagingSenderId: "963469802060",
  appId: "1:963469802060:web:02e599bf314c212b29d2e9",
  measurementId: "G-KGSXW1RPZN"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)