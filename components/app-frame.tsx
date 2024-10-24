'use client'

import { Users, Gamepad2, PenTool, Menu } from "lucide-react"
import Link from "next/link"
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useToast } from "./toast"

export function AppFrameComponent({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const router = useRouter()
  const { addToast } = useToast()

  useEffect(() => {
    const hasShownWarning = localStorage.getItem('mobileWarningShown')

    if (window.outerWidth > 1000 && !hasShownWarning) {
      addToast({
        type: "warning",
        title: "This app was designed for mobile devices",
        message: "Please consider using a mobile device to use this app. You may experience some visual defects.",
      })
      localStorage.setItem('mobileWarningShown', 'true')
    }
  }, [addToast])

  useEffect(() => {
    if (!user) {
      router.push('/signin')
    }
  }, [user, router,])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-purple-500 rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute top-1/3 right-1/4 w-1/3 h-1/3 bg-green-500 rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-green-500 to-transparent top-1/3 animate-pulse"></div>
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent top-2/3 animate-pulse delay-150"></div>
      </div>

      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Fixed bottom navigation bar */}
      <nav className="flex justify-around items-center h-16 bg-purple-700 text-white">
        <Link href="/dashboard/community-games" className="flex flex-col items-center">
          <Users size={24} />
          <span className="text-xs mt-1">Community</span>
        </Link>
        <Link href="/dashboard/my-games" className="flex flex-col items-center">
          <Gamepad2 size={24} />
          <span className="text-xs mt-1">My Games</span>
        </Link>
        <Link href="/dashboard/creation-studio" className="flex flex-col items-center">
          <PenTool size={24} />
          <span className="text-xs mt-1">Create</span>
        </Link>
        <Link href="/dashboard/menu" className="flex flex-col items-center">
          <Menu size={24} />
          <span className="text-xs mt-1">Menu</span>
        </Link>
      </nav>
    </div>
  )
}
