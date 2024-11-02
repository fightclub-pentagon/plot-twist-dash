'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { useGameplay } from '@/contexts/GameplayContext'
import { PublicCharacterResponse } from '@/app/gameplay/[gameplayId]/page'
import { getImageUrl } from '@/lib/utils'

export function Voting({ progress }: { progress: number }) {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null)
  const [accused, setAccused] = useState<PublicCharacterResponse | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { gameplayData } = useGameplay()
  const isEnded = progress >= 100
  console.log(`progress: ${progress}`)
  console.log(`isEnded: ${isEnded}`)


  const handleAccuse = async () => {
    if (selectedCharacter !== null) {
      const user_token = localStorage.getItem('userToken');
      if (!user_token) {
        console.error('No user token found');
        return;
      }

      if (!gameplayData?.uuid) {
        console.error('No gameplay UUID found');
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) {
        console.error('API URL not found');
        return;
      }

      const url = `${API_URL}/gameplay/${gameplayData.uuid}/vote`;
      console.log('Sending vote to:', url);

      try {
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({ character_id: selectedCharacter }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user_token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Vote response:', data);

        setAccused(gameplayData?.characters.find(char => char.id === selectedCharacter) || null);
        setIsEditing(false);
      } catch (error) {
        console.error('Error voting:', error);
      }
    }
  };

  const handleEditAccusation = () => {
    setIsEditing(true)
  }

  const maxVotes = Math.max(...Object.values(gameplayData?.votes || {}), 1)

  return (
    <div className="max-w-md mt-6 mx-auto p-4 bg-gray-800 rounded-lg">
      
      {isEditing ? (
        <>
          <p className="text-center text-gray-300 mb-6">
            {isEnded 
              ? "This is the final chance to accuse the killer. Choose wisely."
              : "Accuse your suspect. You can always revise your choice."}
          </p>
          <ul className="space-y-4 mb-6 text-white">
            {gameplayData?.characters.map(character => (
              <li 
                key={character.id}
                className={`flex items-center space-x-4 p-2 rounded-lg transition-all duration-200 ${
                  selectedCharacter === character.id 
                    ? 'bg-purple-600 scale-105' 
                    : 'bg-gray-700 hover:bg-gray-50 hover:text-purple-600'
                }`}
              >
                <input
                  type="radio"
                  id={`character-${character.id}`}
                  name="character"
                  value={character.id}
                  checked={selectedCharacter === character.id}
                  onChange={() => setSelectedCharacter(character.id)}
                  className="sr-only"
                />
                <label 
                  htmlFor={`character-${character.id}`}
                  className="flex items-center space-x-4 cursor-pointer w-full"
                >
                  <Image
                    src={getImageUrl(character.image)}
                    alt={character.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <span className="font-medium">{character.name}</span>
                </label>
              </li>
            ))}
          </ul>
          <Button
            onClick={handleAccuse}
            disabled={selectedCharacter === null}
            className="w-full"
            variant="destructive"
          >
            {isEnded ? 'Accuse 🫵 (Final)' : 'Accuse 🫵'}
          </Button>
        </>
      ) : (
        
        <>
          <p className="text-center text-gray-300 mb-4">
            {accused ? `You accused ${accused.name}` : isEnded ? "All clues have been revealed. All players must vote on the killer." : "You haven't accused a suspect yet."}
          </p>
          {accused && (
          <div className="flex justify-center mb-6">
            <Image
              src={getImageUrl(accused.image)}
              alt={accused.name}
              width={100}
              height={100}
              className="rounded-full"
              />
            </div>
          )}
          {(!isEnded || !accused) && (
          <Button
            onClick={handleEditAccusation}
            className="w-full mb-6"
            variant="outline"
          >
              {!accused ? "Accuse" : "Change Accusation"}
            </Button>
          )}
          {isEnded && accused && (
            <>
            <p className="text-center text-gray-300 mb-4">
              Are you sure?
            </p>
            <Button
              onClick={() => {}}
              className="w-full mb-6"
              variant="outline"
            >
              Yes! Confirm accusation
            </Button>
            <Button
              onClick={handleEditAccusation}
              className="w-full mb-6"
              variant="destructive"
            >
              Change Accusation
            </Button>
            </>
          )}
          <h2 className="text-lg text-gray-300 font-semibold mb-4">Real-time Voting Results</h2>
          <ul className="space-y-4">
            {gameplayData?.characters.map(character => (
              <li key={character.id} className="flex items-center space-x-4">
                <Image
                  src={getImageUrl(character.image)}
                  alt={character.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 transition-all duration-500 ease-out"
                      style={{ width: `${((gameplayData?.votes[character.id] || 0) / maxVotes) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="font-medium text-gray-300">{gameplayData?.votes[character.id] || 0}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
