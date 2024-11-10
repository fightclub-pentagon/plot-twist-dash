"use client"

import { useEffect, useState, useMemo } from "react"
import { Progress } from "@/components/ui/progress"
import { useGameplay } from "@/contexts/GameplayContext"
import { getImageUrl } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Link from "next/link"
import { RevelationCardViewer } from "./revelation-card-viewer"
import { Voting } from "./voting"
import { PublicCharacterResponse } from "@/app/gameplay/[gameplayId]/page"
import Image from 'next/image'


interface DiscoveryCard {
  id: number
  index: number
  title: string
  image: string
  text: string
  clicked: boolean
}

export function GameProgress() {
  const [progress, setProgress] = useState(0)
  const { gameplayData } = useGameplay()
  const [discoveryCards, setDiscoveryCards] = useState<DiscoveryCard[]>([])
  const [ selectedCard, setSelectedCard ] = useState<DiscoveryCard | null>(null)

  const characterName = useMemo(() => {
    if (!gameplayData?.selected_character || !gameplayData?.characters) return null;
    const character = gameplayData.characters.find(
      char => char.id === gameplayData.selected_character
    );
    return character?.name || null;
  }, [gameplayData?.selected_character, gameplayData?.characters]);

  const getAccused = () : PublicCharacterResponse | null => {
    if (!gameplayData?.selected_character|| !gameplayData?.characters) return null;
    const accused = gameplayData.characters.find(
      char => char.id === gameplayData.selected_character
    );
    return accused || null;
  }
  const orderCards = (cards: DiscoveryCard[]) => {
    return cards.sort((a, b) => a.index - b.index)
  }

  useEffect(() => {
    const percentage = Math.round((discoveryCards.length / (gameplayData?.number_of_cards || 1)) * 100)
    console.log('discoveryCards.length', discoveryCards.length)
    console.log('gameplayData?.number_of_cards', gameplayData?.number_of_cards)
    console.log('percentage', percentage)
    setProgress(percentage)
  }, [discoveryCards])

  useEffect(() => {
    if (gameplayData?.uuid) {
      const storedCards = localStorage.getItem(`discoveryCards_${gameplayData.uuid}`)
      
      if (storedCards) {
        // If we have stored cards, use them
        setDiscoveryCards(JSON.parse(storedCards))
      }
      
      if (gameplayData?.cards) {
        const curr_cards_ids = storedCards ? 
                                JSON.parse(storedCards).map((c: DiscoveryCard) => c.id) : 
                                discoveryCards.map((c: DiscoveryCard) => c.id)
        console.log('curr_cards_ids', curr_cards_ids)
        const newCards: DiscoveryCard[] = gameplayData.cards
          .filter((card) => !curr_cards_ids.includes(card.id))
          .map((card) => ({ 
            id: card.id, 
            index: card.order_number, 
            title: card.title, 
            image: card.image,
            text: card.text,
            clicked: false 
          } as DiscoveryCard))
        console.log('newCards', newCards)
        const existingCards = storedCards ? JSON.parse(storedCards) : discoveryCards;
        const orderedCards = orderCards([...existingCards, ...newCards]).reverse();
        console.log('orderedCards', orderedCards);
        setDiscoveryCards(orderedCards);
        localStorage.setItem(`discoveryCards_${gameplayData.uuid}`, JSON.stringify(orderedCards))
      }
    }
  }, [gameplayData?.uuid, gameplayData?.cards]) // Only run this effect when the UUID changes

  const handleCardClickOrOpened = (id: number | null) => {
    if (!id) return
    setDiscoveryCards(cards => {
      const updatedCards = cards.map(card =>
        card.id === id ? { ...card, clicked: true } : card
      )
      if (gameplayData?.uuid) {
        localStorage.setItem(`discoveryCards_${gameplayData.uuid}`, JSON.stringify(updatedCards))
      }
      return updatedCards
    })
    setSelectedCard(discoveryCards.find(card => card.id === id) || null)
    // setProgress(prev => Math.min(prev + 14, 100))
  }

  return (
      <div className="min-h-screen bg-gray-900 p-4">
      {gameplayData?.is_final_vote ?
        <>
          <h1 className="text-2xl font-bold text-white text-center mt-10 mb-4">
            Your final vote has been cast!
          </h1>

          <p className="text-white text-center mt-16">You accused {characterName || 'Unknown Character'}.</p>
          <div className="flex justify-center m-6">
            <Image
              src={getImageUrl(getAccused()?.image || '')}
              alt={getAccused()?.name || 'Unknown Character'}
              width={60}  // Request a larger image
              height={60} // Keep aspect ratio 1:1
              className="rounded-full w-[150px] h-[150px]"
              />
          </div>
          
          <p className="text-white text-center">Waiting for the remaining votes...</p>
        </>
      :
      !selectedCard ? 
        <>
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
              <span className="text-gray-300">{character?.name}</span>
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
                onClick={() => handleCardClickOrOpened(card.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                  card.clicked
                  ? "bg-gray-800 text-gray-300"
                  : "bg-purple-800 text-white shadow-lg"
                }`}
                >
                <span className={`font-bold mr-2 ${card.clicked ? "" : "animate-pulse"}`}>{card.index}.</span>
                <span className={card.clicked ? "" : "animate-pulse"}>{card.title}</span>
              </button>
            </li>
          ))}
          </ul>
          </section>
          {progress <= 100 ?
            <>
              <section>
              <h2 className="text-lg text-gray-300 font-semibold">Voting Poll</h2>
                <Voting progress={progress} />
              </section>
            </>
          :
          <>
          </>
        }
        
        </>
        
        :
        <>
        <RevelationCardViewer
        cardName={selectedCard?.title || ''}
        cardImage={getImageUrl(selectedCard?.image || '')}
        cardText={selectedCard?.text || ''}
        currentIndex={selectedCard?.index - 1 || 0}
        totalCards={discoveryCards.length}
        onPrevious={() => {
          handleCardClickOrOpened(discoveryCards.find((card) => card.index === selectedCard?.index - 1)?.id || null)
        }}
        onNext={() => {
          handleCardClickOrOpened(discoveryCards.find((card) => card.index === selectedCard?.index + 1)?.id || null)
        }}
        onBack={() => setSelectedCard(null)}
        />
        </>
      }
      </div>
  )
}
  