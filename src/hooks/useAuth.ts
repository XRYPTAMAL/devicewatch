// hooks/useAuth.ts
// Handles Firebase Authentication state

import { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

export function useAuth() {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const loginAnon = () => signInAnonymously(auth)

  const loginEmail = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password)

  const registerEmail = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password)

  const logout = () => signOut(auth)

  return { user, loading, loginAnon, loginEmail, registerEmail, logout }
}
