import React from 'react'
import type { Metadata } from 'next'
import '@/app/globals.css'
import { UserProvider } from '@/contexts/UserContext'
import { ToastProvider } from '@/components/toast'
import { GameplayProvider } from '@/contexts/GameplayContext'

export const metadata: Metadata = {
  title: 'PlotTwist',
  description: 'PlotTwist Game Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <UserProvider>
            <GameplayProvider>
              {children}
            </GameplayProvider>
          </UserProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
