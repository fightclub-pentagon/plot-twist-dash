'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image'
import { useGameplay } from '@/contexts/GameplayContext';

export function GameOver() {
  const [revealKiller, setRevealKiller] = useState(false);
  const onRevealKiller = () => setRevealKiller(true);
  const { gameplayData } = useGameplay();
  
  // Find character with most votes
  const getMostVotedCharacter = () => {
    if (!gameplayData?.votes || !gameplayData?.characters) return null;
    const maxVotes = Math.max(...Object.values(gameplayData.votes));
    const condemnedId = Number(Object.entries(gameplayData.votes)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .find(([_, votes]) => votes === maxVotes)?.[0]);
    return gameplayData.characters.find(char => char.id === condemnedId);
  };
  
  const condemnedCharacter = getMostVotedCharacter();
  const isCorrectGuess = condemnedCharacter?.id === gameplayData?.killer?.id;
  const characterName = condemnedCharacter?.name || 'Unknown Character';

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-gray-800 text-white rounded-lg shadow-xl p-6 w-full max-w-md space-y-6">
        <h1 className={`text-3xl font-bold ${isCorrectGuess ? 'text-green-600' : 'text-red-500'}`}>
          {isCorrectGuess ? 'You Won!' : 'The Killer Won!'}
        </h1>
      {!revealKiller ?
        <div>
          <p className="text-lg ">
            All players voted and the majority decided to condemn {characterName}.
        </p>
        <div className="flex justify-center m-6">
            <Image
              src={getImageUrl(condemnedCharacter?.image || '')}
              alt={condemnedCharacter?.name || 'Unknown Character'}
              width={60}  // Request a larger image
              height={60} // Keep aspect ratio 1:1
              className="rounded-full w-[150px] h-[150px]"
              />
          </div>
        
        {isCorrectGuess ? (
          <p className="text-green-600 font-semibold">
            Your guess was right and {characterName} will pay for their crime. Thank you for your thorough investigation.
          </p>
        ) : (
          <p className="text-red-600 font-semibold">
            {characterName} was unjustly condemned and the real killer ran away untouched.
          </p>
        )}
        
        {!isCorrectGuess && (
          <p className="text-gray-400">
            Click the button below to learn who was the killer and know how and why.
          </p>
        )}
        
        <Button 
          onClick={onRevealKiller}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          {isCorrectGuess ? 'Learn more...' : 'Reveal the Killer'}
        </Button>
      </div>
      :
      <div>
        {isCorrectGuess ? (
          <p className="text-green-600 font-semibold">
            Your guess was right and {characterName} will pay for their crime. Thank you for your thorough investigation.
          </p>
        ) : (
          <>
          <p className="text-red-600 font-semibold">
            The real killer is {gameplayData?.killer?.name}.
          </p>
          <p className="text-gray-200 text-lg">
            {gameplayData?.killer?.name} won!
          </p>        
          </>
        )}
        <div className="flex justify-center m-6">
          <Image
              src={getImageUrl(gameplayData?.killer?.image || '')}
              alt={gameplayData?.killer?.name || 'Unknown Character'}
              width={60}  // Request a larger image
              height={60} // Keep aspect ratio 1:1
              className="rounded-full w-[150px] h-[150px]"
              />
        </div>
        <p className="text-gray-400">{gameplayData?.conclusion || 'No conclusion provided'}</p>
      </div>
      }
    </div>
    </div>
  )
}