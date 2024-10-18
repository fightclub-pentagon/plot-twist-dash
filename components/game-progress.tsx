"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useGameplay } from "@/contexts/GameplayContext"
import Image from "next/image"
import { getImageUrl } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Link from "next/link"

interface DiscoveryCard {
  id: number
  title: string
  clicked: boolean
}

export function GameProgress() {
  const [progress, setProgress] = useState(30)
  const { gameplayData } = useGameplay()
  const [discoveryCards, setDiscoveryCards] = useState<DiscoveryCard[]>([
    { id: 5, title: "Ancient Relic", clicked: false },
    { id: 4, title: "Hidden Cave", clicked: false },
    { id: 3, title: "Mysterious Artifact", clicked: false },
    { id: 2, title: "Secret Passage", clicked: false },
    { id: 1, title: "Treasure Map", clicked: false },
  ])

  const handleCharacterClick = () => {

  }

  const handleCardClick = (id: number) => {
    setDiscoveryCards(cards =>
      cards.map(card =>
        card.id === id ? { ...card, clicked: true } : card
      )
    )
    setProgress(prev => Math.min(prev + 14, 100))
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <h1 className="text-2xl font-bold text-white text-center mb-4">Adventure Quest</h1>
      <Progress value={progress} className="mb-6 bg-gray-700" />
      
      <section> 
        <h2 className="text-lg text-gray-300 font-semibold">Revisit Your Character</h2>
        <ul className="space-y-2 mb-6">
          {[gameplayData?.character].map((character, index) => (
            <Link href={`/character/${character?.id}`} key={index}>
              <li className="bg-gray-800 p-2 mt-2 rounded-md flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={getImageUrl(character?.image || '')} alt={character?.name} />
                <AvatarFallback>{character?.name[0]}</AvatarFallback>
              </Avatar>
                {character?.name}
              </li>
            </Link>
          ))}
        </ul>
      </section>
      
      <section> 
        <h2 className="text-lg text-gray-300 font-semibold">Discovery Cards</h2>
        <ul className="space-y-2">
          {discoveryCards.map((card) => (
            <li key={card.id}>
              <button
                onClick={() => handleCardClick(card.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                  card.clicked
                    ? "bg-gray-400"
                    : "bg-purple-800 text-white shadow-lg"
                }`}
              >
                <span className={`font-bold mr-2 ${card.clicked ? "" : "animate-pulse"}`}>{card.id}.</span>
                <span className={card.clicked ? "" : "animate-pulse"}>{card.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}