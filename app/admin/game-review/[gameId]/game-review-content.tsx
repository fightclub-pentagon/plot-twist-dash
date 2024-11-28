'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GameReviewData } from './types'
import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { withAuth } from '@/components/withAuth'
import { getImageUrl } from '@/lib/utils'
import DOMPurify from 'dompurify'

const sanitizeHtml = (html: string) => {
  return DOMPurify.sanitize(html);
};

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
    <div className='bg-gray-900 text-white'>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl text-center font-bold mb-6">{gameData?.game.title}</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4">
          <div className="w-full md:w-1/3">
            <Image
              src={getImageUrl(gameData?.game.image || '')}
              alt={gameData?.game.title || ''}
              width={200}
              height={200}
              className="rounded-lg shadow-md w-full h-auto object-cover"
            />
          </div>

          <Card className="w-full md:w-2/3 bg-gray-800 text-gray-200 border-none p-4 rounded-lg">
            <CardHeader>
              <CardTitle>Game Presentation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{gameData?.game.presentation_text || ''}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-6 mb-8 p-4">
          <h2 className="text-2xl font-semibold mb-4">Characters</h2>
          {gameData?.characters.map((character) => (
            <Card key={character.id} className="bg-gray-800 text-gray-200 border-none p-4 rounded-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{character.name}</CardTitle>
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
                    {character.is_killer ? <h3 className="text-lg text-bold text-red-500">Killer</h3> : <h3 className="text-lg text-bold text-green-500">Innocent</h3>}
                    <div className="text-md prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: sanitizeHtml(character.overview) }} />
                    <h3 className="font-semibold mb-2">Backstory</h3>
                    <div className="text-md prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: sanitizeHtml(character.backstory) }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-semibold m-4">Cards</h2>
        <div className="grid grid-cols-1 gap-4 m-4">
          {gameData?.cards.map((card) => (
            <Card key={card.id} className="bg-gray-800 text-gray-200 border-none p-4 rounded-lg">
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
                  <p className="text-md text-center">{card.text}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="m-4">
          <Card className="bg-gray-800 text-gray-200 border-none p-4 rounded-lg">
            <CardHeader>
              <CardTitle>Conclusion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="text-md prose prose-invert max-w-none text-gray-100" dangerouslySetInnerHTML={{ __html: sanitizeHtml(gameData?.game.conclusion || '') }} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default withAuth(GameReviewContent)