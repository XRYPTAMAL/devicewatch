import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getMessaging, isSupported } from 'firebase/messaging'

const firebaseConfig = {
  apiKey:            "AIzaSyBfrxnVPMVamcdOBfnF5OtDoHBY__vMSu0",
  authDomain:        "devicewatch-d9cc4.firebaseapp.com",
  projectId:         "devicewatch-d9cc4",
  storageBucket:     "devicewatch-d9cc4.firebasestorage.app",
  messagingSenderId: "617598814341",
  appId:             "1:617598814341:web:9dd66c255a57864bf501ec",
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db   = getFirestore(app)

export const getFirebaseMessaging = async () => {
  const supported = await isSupported()
  if (!supported) return null
  return getMessaging(app)
}

export default app