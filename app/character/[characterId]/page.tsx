'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CharacterDetails } from '@/components/character-details'
import { useGameplay } from '@/contexts/GameplayContext'

interface CharacterPageProps {
  params: {
    characterId: string
  }
}

export default function CharacterPage({ params }: CharacterPageProps) {
  const router = useRouter()
  const { gameplayData } = useGameplay()

  useEffect(() => {
    if (!gameplayData || gameplayData.character?.id !== parseInt(params.characterId)) {
      router.push('/')
    }
  }, [gameplayData, router, params.characterId])

  if (!gameplayData) {
    return null // Return null to avoid any flash of content before redirect
  }

  return (
    <CharacterDetails {...gameplayData} />
  )
}
