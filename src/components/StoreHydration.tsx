'use client'

import { useEffect, useState, useRef } from 'react'
import { useAppStore } from '@/store'

export function StoreHydration({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const hasHydrated = useRef(false)

  useEffect(() => {
    setIsClient(true)

    // Only hydrate once on client-side
    if (!hasHydrated.current) {
      hasHydrated.current = true

      // Use a flag to prevent multiple rehydrations
      const unsubscribe = useAppStore.persist.onFinishHydration(() => {
        setIsHydrated(true)
      })

      // Rehydrate the store
      useAppStore.persist.rehydrate()

      return unsubscribe
    }
  }, []) // Remove isHydrated from dependencies

  // Always render children on server-side to prevent hydration mismatch
  // Only show loading state on client-side after initial render
  if (!isClient) {
    return <>{children}</>
  }

  // Show loading state while hydrating on client-side
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
