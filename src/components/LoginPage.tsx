'use client'
// components/LoginPage.tsx

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiUser } from 'react-icons/fi'

export default function LoginPage() {
  const { loginAnon, loginEmail, registerEmail } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode]         = useState<'login' | 'register'>('login')
  const [loading, setLoading]   = useState(false)

  const handleEmail = async () => {
    if (!email || !password) { toast.error('Fill in all fields'); return }
    setLoading(true)
    try {
      if (mode === 'login') await loginEmail(email, password)
      else                  await registerEmail(email, password)
      toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!')
    } catch (e: any) {
      toast.error(e.message ?? 'Auth failed')
    } finally {
      setLoading(false)
    }
  }

  const handleAnon = async () => {
    setLoading(true)
    try {
      await loginAnon()
      toast.success('Signed in anonymously')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-black font-black text-xl mx-auto mb-4">
            DW
          </div>
          <h1 className="text-2xl font-bold text-white">DeviceWatch</h1>
          <p className="text-slate-500 text-sm mt-1">Monitor all your devices in real-time</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          {/* Mode toggle */}
          <div className="flex bg-slate-800 rounded-xl p-1 mb-5">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 capitalize text-sm py-1.5 rounded-lg transition-all ${
                  mode === m ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Email input */}
          <div className="relative mb-3">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 transition-colors"
            />
          </div>

          {/* Password input */}
          <div className="relative mb-4">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEmail()}
              className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 transition-colors"
            />
          </div>

          <button
            onClick={handleEmail}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 mb-3"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-600">or</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <button
            onClick={handleAnon}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
          >
            <FiUser size={14} /> Continue Anonymously
          </button>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          Your data is private and secured by Firebase Auth.
        </p>
      </div>
    </div>
  )
}
