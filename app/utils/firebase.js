// app/utils/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAntK1b4FMdQ86foc1nea2Q0Plmb6NZJ44",
  authDomain: "sincustom.firebaseapp.com",
  projectId: "sincustom",
  storageBucket: "sincustom.firebasestorage.app",
  messagingSenderId: "766379321345",
  appId: "1:766379321345:web:34d3c902cc921d160ef800",
  measurementId: "G-MGZ0Q6SXST"
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
export const db = getFirestore(app)
export const storage = getStorage(app)

export const auth = getAuth(app)