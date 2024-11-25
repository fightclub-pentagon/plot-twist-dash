'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GameReviewData } from './types'
import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { withAuth } from '@/components/withAuth'
import { getImageUrl } from '@/lib/utils'

export function GameReviewContent({ gameId }: { gameId: string }) {
    const [gameData, setGameData] = useState<GameReviewData | null>(null)
    useEffect(() => {
        const getGameData = async (gameId: string): Promise<void> => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL
            const token = localStorage.getItem('userToken')
            const res = await fetch(`${API_URL}/admin/full-game/${gameId}`, {
                next: { revalidate: 60 },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
      
            if (!res.ok) {
                if (res.status === 404) notFound()
                throw new Error('Failed to fetch game data')
            }
            const response = await res.json()
            setGameData(response)
        }
        getGameData(gameId)
    }, [gameId, setGameData])


    return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6">{gameData?.game.title}</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="w-full md:w-1/3">
          <Image 
            src={getImageUrl(gameData?.game.image || '')} 
            alt={gameData?.game.title || ''} 
            width={200} 
            height={200} 
            className="rounded-lg shadow-md w-full h-auto object-cover"
          />
        </div>
      
        <Card className="w-full md:w-2/3">
          <CardHeader>
            <CardTitle>Game Presentation</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{gameData?.game.presentation_text || ''}</p>
        </CardContent>
      </Card>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Characters</h2>
      <div className="flex flex-wrap gap-6 mb-8">
        {gameData?.characters.map((character) => (
          <Card key={character.id}>
            <CardHeader>
              <CardTitle>{character.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-col gap-4">
                <Image 
                  src={getImageUrl(character.image || '')} 
                  alt={character.name} 
                  width={200} 
                  height={200} 
                  className="rounded-md shadow"
                />
                <div>
                  <h3 className="font-semibold mb-2">Overview</h3>
                  <p className="mb-4">{character.overview}</p>
                  <h3 className="font-semibold mb-2">Backstory</h3>
                  <p>{character.backstory}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Cards</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gameData?.cards.map((card) => (
          <Card key={card.id}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-2">
                <Image 
                  src={getImageUrl(card.image || '')} 
                  alt={card.title} 
                  width={100} 
                  height={150} 
                  className="rounded shadow"
                />
                <p className="text-sm text-center">{card.text}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 

export default withAuth(GameReviewContent)