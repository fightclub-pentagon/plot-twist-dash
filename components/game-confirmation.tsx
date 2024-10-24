'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface GameConfirmationComponentProps {
  onStartGame: (duration: number) => void;
  onGoBack: () => void;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
}

const generateDurationOptions = () => {
  const options = []
  for (let i = 5; i <= 500; i += 15) {
    options.push(i)
  }
  return options
}

const durationOptions = generateDurationOptions()

export function GameConfirmationComponent({ onStartGame, onGoBack, duration, setDuration }: GameConfirmationComponentProps) {
  const [useRecommendedDuration, setUseRecommendedDuration] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-6 p-6 bg-gray-200 border-gray-400">
        <h1 className="text-2xl font-bold text-center">Ready to Start?</h1>
        <p className="text-center text-muted-foreground">
          You're about to start the game. Once you confirm, you can't go back. Make sure all players are ready!
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="duration-toggle" className="text-sm font-medium">
              Use recommended duration
            </Label>
            <Switch
              id="duration-toggle"
              checked={useRecommendedDuration}
              onCheckedChange={setUseRecommendedDuration}
            />
          </div>
          
          {useRecommendedDuration ? (
            <p className="text-center">
              Game duration: <span className="font-bold text-2xl">{duration}</span> minutes
            </p>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="custom-duration" className="text-sm text-muted-foreground">
                Select game duration (minutes):
              </Label>
              <Select
                value={duration.toString()}
                onValueChange={(value) => setDuration(parseInt(value))}
              >
                <SelectTrigger id="custom-duration" className="w-full text-gray-900">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="text-gray-600">
                  {durationOptions.map((duration) => (
                    <SelectItem key={duration} value={duration.toString()}>
                      {duration} minutes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => onStartGame(duration)} 
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
