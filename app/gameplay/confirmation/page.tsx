'use client'

import { useRouter } from 'next/navigation'
import { useGameplay } from '@/contexts/GameplayContext'
import { GameConfirmationComponent } from '@/components/game-confirmation'
import { withAuth } from '@/components/withAuth'

function ConfirmationPage() {
  const router = useRouter()
  const { gameplayData } = useGameplay()

  const onStartGame = async () => {
    if (!gameplayData) {
      console.log(gameplayData)
      return router.push('/')
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem('userToken')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_URL}/gameplay/${gameplayData.uuid}/play`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })

      if (!response.ok) {
        throw new Error('Failed to start gameplay')
      }

      // If the request is successful, navigate to the gameplay page
      router.push(`/gameplay/${gameplayData.uuid}`)
    } catch (error) {
      console.error('Error starting gameplay:', error)
      // Handle error (e.g., show an error message to the user)
    }
  }

  const onGoBack = () => {
    if (!gameplayData) {
      console.log(gameplayData)
      return router.push('/')
    }
    router.push(`/gameplay/${gameplayData.uuid}`)
  }

  return (
    <GameConfirmationComponent 
      onStartGame={onStartGame} 
      onGoBack={onGoBack} 
    />
  )
}

// Export the wrapped component as the default export
export default withAuth(ConfirmationPage)