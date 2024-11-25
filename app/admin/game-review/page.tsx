'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function GameReviewPage() {
  const [gameId, setGameId] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (gameId.trim()) {
      router.push(`/admin/game-review/${gameId}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Game Review</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter Game ID"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="bg-gray-700 text-white border-gray-600"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-purple-700 hover:bg-purple-600 text-white"
              disabled={!gameId.trim()}
            >
              Review Game
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
