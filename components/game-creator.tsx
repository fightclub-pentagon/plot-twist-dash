"use client"

import { useState } from "react"
import { useUser } from '@/contexts/UserContext'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface GameData {
  isGuidedMode: boolean;
  where: string;
  when: string;
  who: string;
  freePrompt: string;
  players: string;
  rounds: string;
}

interface CreateGameResponse {
  game_id: number;
}

const LoadingOverlay = () => (
  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
  </div>
)

export function GameCreatorComponent() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const { user } = useUser()
  const [gameData, setGameData] = useState<GameData>({
    isGuidedMode: true,
    where: "",
    when: "",
    who: "",
    freePrompt: "",
    players: "",
    rounds: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof GameData, value: string | boolean) => {
    setGameData(prev => ({ ...prev, [field]: value }))
  }

  const handleCreate = async () => {
    if (!user) {
      console.error('User not authenticated')
      return
    }

    setIsLoading(true)
    try {
      const token = localStorage.getItem('userToken')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_URL}/game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(gameData),
      })

      if (!response.ok) {
        throw new Error('Failed to create game')
      }

      const result: CreateGameResponse = await response.json()
      console.log('Game created:', result)
      // Handle successful game creation (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error('Error creating game:', error)
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-6 relative">
      {isLoading && <LoadingOverlay />}
      <h1 className="text-2xl font-bold text-center text-white">Create your own game</h1>
      
      <div className="flex items-center justify-center space-x-2">
        <Label htmlFor="guided-mode" className="text-sm text-white">Guided Mode</Label>
        <Switch
          id="game-mode"
          checked={!gameData.isGuidedMode}
          onCheckedChange={(checked) => handleInputChange("isGuidedMode", !checked)}
        />
        <Label htmlFor="guided-mode" className="text-sm text-white">Creative Mode</Label>
      </div>
      
      {gameData.isGuidedMode ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="where" className="text-white">Where</Label>
            <Textarea 
              id="where" 
              placeholder="e.g., In a haunted mansion" 
              className="min-h-[80px]"
              value={gameData.where}
              onChange={(e) => handleInputChange("where", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="when" className="text-white">When</Label>
            <Textarea 
              id="when" 
              placeholder="e.g., During a full moon" 
              className="min-h-[80px]"
              value={gameData.when}
              onChange={(e) => handleInputChange("when", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="who" className="text-white">Who</Label>
            <Textarea 
              id="who" 
              placeholder="e.g., A group of paranormal investigators" 
              className="min-h-[80px]"
              value={gameData.who}
              onChange={(e) => handleInputChange("who", e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="free-prompt" className="text-white">Your prompt...</Label>
          <Textarea
            id="free-prompt"
            placeholder="e.g., Create a mystery game set in a futuristic space station where players must solve puzzles to uncover a sinister plot."
            className="h-32"
            value={gameData.freePrompt}
            onChange={(e) => handleInputChange("freePrompt", e.target.value)}
          />
        </div>
      )}

      <div className="flex space-x-4">
        <div className="w-1/2 space-y-2">
          <Label htmlFor="players" className="text-white">Players</Label>
          <Select onValueChange={(value) => handleInputChange("players", value)}>
            <SelectTrigger id="players">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(17)].map((_, i) => (
                <SelectItem key={i} value={(i + 3).toString()}>
                  {i + 3}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-1/2 space-y-2">
          <Label htmlFor="rounds" className="text-white">Rounds</Label>
          <Select onValueChange={(value) => handleInputChange("rounds", value)}>
            <SelectTrigger id="rounds">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(17)].map((_, i) => (
                <SelectItem key={i} value={(i + 5).toString()}>
                  {i + 5}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex space-x-2 justify-center">
        <div className="w-1/2 space-y-2">
          <Label>&nbsp;</Label>
          <Button className="w-full" onClick={handleCreate} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </div>
    </div>
  )
}