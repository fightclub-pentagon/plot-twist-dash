import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import { useToast } from '@/components/toast'

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function AuthComponent(props: P) {
    const { user } = useUser()
    const router = useRouter()
    const pathname = usePathname()
    const { addToast } = useToast()
    const hasRedirected = useRef(false)

    useEffect(() => {
      if (!user && !hasRedirected.current) {
        hasRedirected.current = true
        addToast({
          type: 'warning',
          title: 'Authentication Required',
          message: 'Please sign in to access this page'
        })
        // Encode the current path to handle special characters
        const encodedRedirect = encodeURIComponent(pathname)
        router.push(`/signin?redirect=${encodedRedirect}`)
      }
    }, [user, router, pathname, addToast])

    // Show nothing while redirecting
    if (!user) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}