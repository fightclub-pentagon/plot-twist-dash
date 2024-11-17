'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface GameConfirmationComponentProps {
  onStartGame: () => void;
  onGoBack: () => void;
}


export function GameConfirmationComponent({ onStartGame, onGoBack }: GameConfirmationComponentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-6 p-6 bg-gray-200 border-gray-400">
        <h1 className="text-2xl font-bold text-center">Ready to Start?</h1>
        <p className="text-center text-muted-foreground">
          You&apos;re about to start the game. Once you confirm, you can&apos;t go back. Make sure all players are ready!
        </p>

        <div className="space-y-4">
          <Button 
            onClick={onStartGame} 
            className="w-full bg-purple-700 hover:bg-purple-900 text-white"
          >
            I want to start the game
          </Button>
          <Button 
            onClick={onGoBack} 
            variant="outline" 
            className="w-full bg-gray-100 hover:bg-gray-200"
          >
            Go back to waiting room
          </Button>
        </div>
      </Card>
    </div>
  )
}
