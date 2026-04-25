// hooks/useDevices.ts
// Manages devices in Firestore with real-time updates

import { useEffect, useState, useCallback } from 'react'
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  onSnapshot, serverTimestamp, query, orderBy, Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface Device {
  id: string
  name: string
  isOnline: boolean
  lastSeen: Date | null
  isPrimary: boolean
  connectionType?: string | null
}

export function useDevices(userId: string | null) {
  const [devices, setDevices]   = useState<Device[]>([])
  const [loading, setLoading]   = useState(true)

  // Real-time listener: fires every time Firestore data changes
  useEffect(() => {
    if (!userId) { setLoading(false); return }

    const devicesRef = collection(db, 'users', userId, 'devices')
    const q = query(devicesRef, orderBy('name'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Device[] = snapshot.docs.map((d) => {
        const data = d.data()
        return {
          id:             d.id,
          name:           data.name ?? 'Unknown Device',
          isOnline:       data.isOnline ?? false,
          lastSeen:       data.lastSeen instanceof Timestamp
                            ? data.lastSeen.toDate()
                            : null,
          isPrimary:      data.isPrimary ?? false,
          connectionType: data.connectionType ?? null,
        }
      })
      setDevices(list)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

  // Add a new device
  const addDevice = useCallback(async (name: string) => {
    if (!userId) return
    const devicesRef = collection(db, 'users', userId, 'devices')
    await addDoc(devicesRef, {
      name,
      isOnline:  false,
      lastSeen:  serverTimestamp(),
      isPrimary: false,
    })
  }, [userId])

  // Update device status (called when connectivity changes)
  const updateStatus = useCallback(async (
    deviceId: string,
    isOnline: boolean,
    connectionType?: string | null
  ) => {
    if (!userId) return
    const ref = doc(db, 'users', userId, 'devices', deviceId)
    await updateDoc(ref, {
      isOnline,
      lastSeen: serverTimestamp(),
      ...(connectionType !== undefined ? { connectionType } : {}),
    })
  }, [userId])

  // Rename a device
  const renameDevice = useCallback(async (deviceId: string, name: string) => {
    if (!userId) return
    const ref = doc(db, 'users', userId, 'devices', deviceId)
    await updateDoc(ref, { name })
  }, [userId])

  // Delete a device
  const removeDevice = useCallback(async (deviceId: string) => {
    if (!userId) return
    const ref = doc(db, 'users', userId, 'devices', deviceId)
    await deleteDoc(ref)
  }, [userId])

  // Set one device as Primary (clear others first)
  const setPrimary = useCallback(async (deviceId: string) => {
    if (!userId) return
    // Clear all primaries
    for (const d of devices) {
      const ref = doc(db, 'users', userId, 'devices', d.id)
      await updateDoc(ref, { isPrimary: d.id === deviceId })
    }
  }, [userId, devices])

  return { devices, loading, addDevice, updateStatus, renameDevice, removeDevice, setPrimary }
}
