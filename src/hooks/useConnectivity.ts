// hooks/useConnectivity.ts
// Detects real-time online/offline status using browser APIs

import { useEffect, useState } from 'react'

export interface ConnectivityInfo {
  isOnline: boolean
  connectionType: string | null  // wifi, cellular, etc.
  effectiveType: string | null   // 4g, 3g, 2g, slow-2g
}

export function useConnectivity(): ConnectivityInfo {
  const [info, setInfo] = useState<ConnectivityInfo>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    connectionType: null,
    effectiveType: null,
  })

  useEffect(() => {
    // Get Network Information API if available (Chrome/Android)
    const connection = (navigator as any).connection ||
                       (navigator as any).mozConnection ||
                       (navigator as any).webkitConnection

    const update = () => {
      setInfo({
        isOnline: navigator.onLine,
        connectionType:  connection?.type         ?? null,
        effectiveType:   connection?.effectiveType ?? null,
      })
    }

    // Listen to online/offline events
    window.addEventListener('online',  update)
    window.addEventListener('offline', update)

    // Listen to network quality changes
    connection?.addEventListener('change', update)

    // Initial read
    update()

    return () => {
      window.removeEventListener('online',  update)
      window.removeEventListener('offline', update)
      connection?.removeEventListener('change', update)
    }
  }, [])

  return info
}
