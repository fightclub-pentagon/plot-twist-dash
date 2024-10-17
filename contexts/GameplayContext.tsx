'use client'

import React, { createContext, useContext, useState } from 'react'
import { GameplayData } from '@/app/gameplay/[gameplayId]/page'

interface GameplayContextType {
  gameplayData: GameplayData | null
  setGameplayData: React.Dispatch<React.SetStateAction<GameplayData | null>>
}

const GameplayContext = createContext<GameplayContextType | undefined>(undefined)

export function GameplayProvider({ children }: { children: React.ReactNode }) {
  const [gameplayData, setGameplayData] = useState<GameplayData | null>(null)

  return (
    <GameplayContext.Provider value={{ gameplayData, setGameplayData }}>
      {children}
    </GameplayContext.Provider>
  )
}

export function useGameplay() {
  const context = useContext(GameplayContext)
  if (context === undefined) {
    throw new Error('useGameplay must be used within a GameplayProvider')
  }
  return context
}