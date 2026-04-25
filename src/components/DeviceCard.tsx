'use client'
// components/DeviceCard.tsx
// Displays a single device with status, rename, delete, primary toggle

import { useState } from 'react'
import { Device } from '@/hooks/useDevices'
import { formatDistanceToNow } from 'date-fns'
import { FiWifi, FiWifiOff, FiStar, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi'

interface Props {
  device: Device
  onRename:     (id: string, name: string) => void
  onRemove:     (id: string) => void
  onSetPrimary: (id: string) => void
}

export default function DeviceCard({ device, onRename, onRemove, onSetPrimary }: Props) {
  const [editing, setEditing] = useState(false)
  const [nameVal, setNameVal] = useState(device.name)

  const commitRename = () => {
    if (nameVal.trim()) onRename(device.id, nameVal.trim())
    setEditing(false)
  }

  const lastSeenText = device.lastSeen
    ? formatDistanceToNow(device.lastSeen, { addSuffix: true })
    : 'Never'

  return (
    <div className={`
      relative rounded-2xl border p-5 transition-all duration-300 animate-slide-up
      ${device.isOnline
        ? 'bg-gradient-to-br from-emerald-950/60 to-slate-900 border-emerald-500/30 shadow-lg shadow-emerald-900/20'
        : 'bg-gradient-to-br from-slate-900 to-slate-900/80 border-slate-700/50 shadow-md'}
    `}>

      {/* Primary badge */}
      {device.isPrimary && (
        <span className="absolute top-3 right-3 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
          ★ Primary
        </span>
      )}

      {/* Status dot + name */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-shrink-0">
          <div className={`w-3 h-3 rounded-full ${device.isOnline ? 'bg-emerald-400' : 'bg-slate-500'}`} />
          {device.isOnline && (
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-60" />
          )}
        </div>

        {editing ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              autoFocus
              value={nameVal}
              onChange={e => setNameVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && commitRename()}
              className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-1 text-sm text-white outline-none focus:border-emerald-500"
            />
            <button onClick={commitRename} className="text-emerald-400 hover:text-emerald-300"><FiCheck /></button>
            <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-red-400"><FiX /></button>
          </div>
        ) : (
          <span className="font-semibold text-white text-base truncate">{device.name}</span>
        )}
      </div>

      {/* Status label */}
      <div className={`text-sm font-medium mb-1 ${device.isOnline ? 'text-emerald-400' : 'text-slate-400'}`}>
        {device.isOnline ? '🟢 Online' : '🔴 Offline'}
      </div>

      {/* Last seen */}
      <div className="text-xs text-slate-500 mb-1">
        Last seen: <span className="text-slate-400">{lastSeenText}</span>
      </div>

      {/* Connection type */}
      {device.connectionType && (
        <div className="text-xs text-slate-500 mb-3">
          Network: <span className="text-slate-400">{device.connectionType}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700/50">
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-all"
        >
          <FiEdit2 size={11} /> Rename
        </button>

        <button
          onClick={() => onSetPrimary(device.id)}
          disabled={device.isPrimary}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all
            ${device.isPrimary
              ? 'text-amber-400 bg-amber-900/20 cursor-default'
              : 'text-slate-400 hover:text-amber-400 bg-slate-800 hover:bg-amber-900/20'}`}
        >
          <FiStar size={11} /> {device.isPrimary ? 'Primary' : 'Set Primary'}
        </button>

        <button
          onClick={() => onRemove(device.id)}
          className="ml-auto flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 bg-slate-800 hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-all"
        >
          <FiTrash2 size={11} /> Remove
        </button>
      </div>
    </div>
  )
}
