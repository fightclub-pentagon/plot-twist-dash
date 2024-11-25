'use client'

import { useEffect } from 'react'
import { useToast } from '@/components/toast'

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { addToast } = useToast()

  useEffect(() => {
    addToast({
      type: 'error',
      title: 'Error',
      message: error.message || 'Something went wrong',
    })
  }, [error, addToast])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-xl font-semibold mb-4">Something went wrong!</h2>
      <button
        onClick={reset}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
      >
        Try again
      </button>
    </div>
  )
} 