'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CharacterDetails } from '@/components/character-details'
import { useGameplay } from '@/contexts/GameplayContext'
import { GameConfirmationComponent } from '@/components/game-confirmation'
/*
interface ConfirmationPageProps {
  params: {
    gameplay_uuid: string
  }
}*/

export default function ConfirmationPage(/*{ params }: ConfirmationPageProps*/) {
  const router = useRouter()
  const { gameplayData } = useGameplay()

  useEffect(() => {
    console.log('duration', gameplayData?.duration)
  }, [gameplayData])
  const onStartGame = (duration: number) => {
    // make request to mark the gameplay as started
    if (!gameplayData) {
      console.log(gameplayData)
      return router.push('/')
    }
    router.push(`/gameplay/${gameplayData.uuid}`)
  }
  const onGoBack = () => {
    if (!gameplayData) {
      console.log(gameplayData)
      return router.push('/')
    }
    router.push(`/gameplay/${gameplayData.uuid}`)
  }
  return (
      <GameConfirmationComponent onStartGame={onStartGame} onGoBack={onGoBack} duration={gameplayData?.duration as number} />
  )
}
