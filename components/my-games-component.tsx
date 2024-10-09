'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users } from "lucide-react"
import { useUser } from '@/contexts/UserContext'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'

interface Game {
  game_id: number
  title: string
  number_of_players: number
  image: string
  presentation_text: string
}

export function MyGamesComponent() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const [games, setGames] = useState<Game[]>([])
  const [featuredGame, setFeaturedGame] = useState<Game | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()

  useEffect(() => {
    const fetchGames = async () => {
      if (!user) return;
    
      setIsLoading(true);
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          throw new Error('No authentication token found');
        }
    
        const cachedData = localStorage.getItem('cachedGames');
        const cachedTimestamp = localStorage.getItem('cachedGamesTimestamp');
    
        const now = new Date().getTime();
        if (cachedData && cachedTimestamp && now - parseInt(cachedTimestamp) < 60000) {
          // Use cached data if it's less than 1 minute old
          const parsedData = JSON.parse(cachedData);
          setGames(parsedData.games || []);
          if (parsedData.games.length > 0) {
            setFeaturedGame(parsedData.games[0]);
          }
        } else {
          // Fetch new data if cache is expired or doesn't exist
          const response = await fetch(`${API_URL}/game/byUser/${user.uid}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
    
          if (!response.ok) {
            throw new Error('Failed to fetch games');
          }
          const data = await response.json();
          setGames(data.games || []);
          if (data.games.length > 0) {
            setFeaturedGame(data.games[0]);
          }
    
          // Cache the new data
          localStorage.setItem('cachedGames', JSON.stringify(data));
          localStorage.setItem('cachedGamesTimestamp', now.toString());
        }
      } catch (err) {
        setError('Failed to load games. Please try again later.');
        console.error('Error fetching games:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames()
  }, [user, API_URL])

  const handleGameClick = (game: Game) => {
    setFeaturedGame(game)
  }

  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Featured Game Section (1/3 of the screen) */}
      {featuredGame && (
        <div className="flex-none h-1/3 p-4 bg-purple-900 text-white">
          <h1 className="text-2xl font-bold mb-2 line-clamp-1">{featuredGame.title}</h1>
          <div className="flex h-[calc(100%-2rem-1.5rem)] overflow-hidden">
            {/* Image Section */}
            <div className="relative h-full aspect-square mr-4 flex-shrink-0">
              <Image
                src={featuredGame.image || '/placeholder.png'}
                alt={featuredGame.title}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md flex items-center text-sm">
                <Users className="w-4 h-4 mr-1" aria-hidden="true" />
                <span>{featuredGame.number_of_players}</span>
              </div>
            </div>
            {/* Text and Button Section */}
            <div className="flex flex-col flex-1">
              {/* Scrollable Text Area */}
              <div className="flex-1 overflow-y-auto">
                <p className="text-sm">{featuredGame.presentation_text}</p>
              </div>
              {/* Fixed Button */}
              <Button 
                className="mt-4" 
                variant="secondary" 
                onClick={() => featuredGame && router.push(`/game/${featuredGame.game_id}`)}
              >
                Play Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Game List Section (2/3 of the screen) */}
<div className="flex-grow h-2/3 bg-gray-900">
  <h2 className="text-xl font-semibold p-4 pb-2 text-white">Game List</h2>
  <ScrollArea className="h-[calc(100%-3rem)] rounded-md">
    <div className="p-4 pt-0">
      {games.map((game) => (
        <div 
          key={game.game_id} 
          className="mb-4 p-[3px] rounded-xl bg-gradient-to-br from-green-500 to-purple-500 cursor-pointer hover:from-green-400 hover:to-purple-400 transition-colors"
          onClick={() => handleGameClick(game)}
        >
          <div className="flex items-center space-x-4 p-2 bg-black rounded-lg h-24 overflow-hidden">
            <Image
              src={game.image || '/placeholder.png'}
              alt={game.title}
              width={50}
              height={50}
              className="rounded-md object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white truncate">{game.title}</h3>
              <div className="flex items-center text-sm text-gray-300">
                <Users className="w-4 h-4 mr-1 flex-shrink-0" aria-hidden="true" />
                <span>{game.number_of_players} players</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </ScrollArea>
</div>
    </div>
  )
}