'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NewGuaranteePage() {
  const router = useRouter()

  useEffect(() => {
    const tempId = `temp_${Date.now()}`
    router.replace(`/guarantee/new/${tempId}?step=0`)
  }, [router])

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        {/* <p className="text-gray-600">Redirecting to new guarantee form...</p> */}
      </div>
    </div>
  )
}
