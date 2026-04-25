'use client'
// components/Dashboard.tsx
// Main dashboard showing all devices

import { useEffect, useRef, useState } from 'react'
import { User } from 'firebase/auth'
import { useDevices } from '@/hooks/useDevices'
import { useConnectivity } from '@/hooks/useConnectivity'
import DeviceCard from './DeviceCard'
import toast from 'react-hot-toast'
import { FiPlus, FiLogOut, FiMonitor, FiRefreshCw } from 'react-icons/fi'

interface Props {
  user: User
  onLogout: () => void
}

export default function Dashboard({ user, onLogout }: Props) {
  const { devices, loading, addDevice, updateStatus, renameDevice, removeDevice, setPrimary } = useDevices(user.uid)
  const connectivity = useConnectivity()

  const [newName, setNewName]       = useState('')
  const [adding, setAdding]         = useState(false)
  const [filter, setFilter]         = useState<'all' | 'online' | 'offline'>('all')
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null)

  // Track previous device statuses to detect changes for alerts
  const prevStatuses = useRef<Record<string, boolean>>({})

  // Register or identify "this" device in Firestore
  useEffect(() => {
    const storedId = localStorage.getItem('dw_device_id')
    if (storedId) {
      setCurrentDeviceId(storedId)
    }
  }, [])

  // When connectivity changes, update this device's status in Firestore
  useEffect(() => {
    if (!currentDeviceId) return
    updateStatus(currentDeviceId, connectivity.isOnline, connectivity.connectionType)
      .catch(console.error)
  }, [connectivity.isOnline, currentDeviceId])

  // Watch for OTHER devices going offline → alert if we're primary
  useEffect(() => {
    const isPrimary = devices.find(d => d.id === currentDeviceId)?.isPrimary
    if (!isPrimary) return

    devices.forEach(device => {
      if (device.id === currentDeviceId) return
      const wasOnline = prevStatuses.current[device.id]
      if (wasOnline === true && !device.isOnline) {
        toast.error(`📵 ${device.name} went offline!`, { duration: 5000 })
      }
      if (wasOnline === false && device.isOnline) {
        toast.success(`✅ ${device.name} is back online!`, { duration: 4000 })
      }
    })

    // Update ref
    const newMap: Record<string, boolean> = {}
    devices.forEach(d => { newMap[d.id] = d.isOnline })
    prevStatuses.current = newMap
  }, [devices])

  const handleAddDevice = async () => {
    const name = newName.trim() || 'New Device'
    setAdding(true)
    try {
      await addDevice(name)
      // Save device ID to localStorage so this browser = this device
      // Note: addDevice doesn't return ID directly so we find it after
      toast.success(`Added "${name}"`)
      setNewName('')
    } catch (e) {
      toast.error('Failed to add device')
    } finally {
      setAdding(false)
    }
  }

  const handleRegisterThis = async () => {
    // Register current browser as a device
    const name = `My ${/Mobi|Android/i.test(navigator.userAgent) ? 'Phone' : 'PC'}`
    try {
      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')
      const ref = await addDoc(collection(db, 'users', user.uid, 'devices'), {
        name,
        isOnline:  navigator.onLine,
        lastSeen:  serverTimestamp(),
        isPrimary: devices.length === 0,
        connectionType: null,
      })
      localStorage.setItem('dw_device_id', ref.id)
      setCurrentDeviceId(ref.id)
      toast.success(`Registered as "${name}"`)
    } catch {
      toast.error('Failed to register device')
    }
  }

  const filtered = devices.filter(d => {
    if (filter === 'online')  return d.isOnline
    if (filter === 'offline') return !d.isOnline
    return true
  })

  const onlineCount  = devices.filter(d => d.isOnline).length
  const offlineCount = devices.length - onlineCount

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black font-bold text-sm">
              DW
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-none">DeviceWatch</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {user.isAnonymous ? 'Anonymous' : user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Current connection status */}
            <span className={`text-xs px-2 py-1 rounded-full border ${
              connectivity.isOnline
                ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40'
                : 'text-red-400 border-red-500/30 bg-red-950/40'
            }`}>
              {connectivity.isOnline ? '● Online' : '● Offline'}
            </span>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-all"
            >
              <FiLogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', value: devices.length, color: 'text-slate-300' },
            { label: 'Online',  value: onlineCount,  color: 'text-emerald-400' },
            { label: 'Offline', value: offlineCount, color: 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Add device row */}
        <div className="flex gap-3 mb-6">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddDevice()}
            placeholder="Device name (e.g. My Laptop)..."
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 transition-colors"
          />
          <button
            onClick={handleAddDevice}
            disabled={adding}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
          >
            <FiPlus size={16} /> Add
          </button>
          {!currentDeviceId && (
            <button
              onClick={handleRegisterThis}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              title="Register this browser as a device"
            >
              <FiMonitor size={16} /> This Device
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'online', 'offline'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`capitalize text-sm px-4 py-1.5 rounded-full border transition-all ${
                filter === f
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Device grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-500">
            <FiRefreshCw className="animate-spin mr-2" /> Loading devices...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-600">
            <FiMonitor className="mx-auto mb-3 text-4xl opacity-30" />
            <p className="text-sm">No devices found. Add one above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(device => (
              <DeviceCard
                key={device.id}
                device={device}
                onRename={renameDevice}
                onRemove={removeDevice}
                onSetPrimary={setPrimary}
              />
            ))}
          </div>
        )}

        {/* Current device indicator */}
        {currentDeviceId && (
          <p className="text-center text-xs text-slate-600 mt-8">
            📍 This browser is registered as device ID: <code className="text-slate-500">{currentDeviceId.slice(0, 8)}…</code>
          </p>
        )}
      </main>
    </div>
  )
}
