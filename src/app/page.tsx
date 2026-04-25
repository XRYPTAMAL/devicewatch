'use client'
// app/page.tsx
// Auth gate: shows Login or Dashboard based on auth state

import { useAuth } from '@/hooks/useAuth'
import LoginPage  from '@/components/LoginPage'
import Dashboard  from '@/components/Dashboard'
import { FiRefreshCw } from 'react-icons/fi'

export default function Home() {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">
        <FiRefreshCw className="animate-spin mr-2" /> Loading...
      </div>
    )
  }

  if (!user) return <LoginPage />

  return <Dashboard user={user} onLogout={logout} />
}
