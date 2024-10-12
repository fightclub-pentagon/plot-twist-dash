'use client'

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DOMPurify from 'dompurify';

// ... (in your component)
const sanitizeHtml = (html: string) => {
  return DOMPurify.sanitize(html);
};

export function GamePage({ gameId }: { gameId: string }) {
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const createGameplay = async (gameId: string): Promise<string | null> => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const gameplayResponse: Response = await fetch(`${API_URL}/game/${gameId}/play`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      if (!gameplayResponse.ok) {
        throw new Error('Failed to create gameplay');
      }

      const gameplayData = await gameplayResponse.json();
      return gameplayData.id;
    } catch (error) {
      console.error('Error creating gameplay:', error);
      return null;
    }
  };

  const handleCreateGameplay = async () => {
    const gameplayId: string | null = await createGameplay(gameId);
    router.push(`/gameplay/${gameplayId}`);
  };

  useEffect(() => {
    const fetchGame = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const cachedGame = localStorage.getItem(`game_${gameId}`);
        const cachedTimestamp = localStorage.getItem(`game_${gameId}_timestamp`);
        const now = new Date().getTime();

        if (cachedGame && cachedTimestamp && now - parseInt(cachedTimestamp) < 300000) {
          // Use cached data if it's less than 5 minutes old
          setGame(JSON.parse(cachedGame));
        } else {
          const token = localStorage.getItem('userToken');
          if (!token) {
            throw new Error('No authentication token found');
          }

          const response = await fetch(`${API_URL}/game/${gameId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch game');
          }

          const data: Game = await response.json();
          setGame(data);

          // Cache the new data
          localStorage.setItem(`game_${gameId}`, JSON.stringify(data));
          localStorage.setItem(`game_${gameId}_timestamp`, now.toString());
        }
      } catch (err) {
        setError('Failed to load game. Please try again later.');
        console.error('Error fetching game:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [gameId, API_URL]);

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!game) return <div className="text-white">Game not found</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-4 space-y-4">
      <header className="flex items-center space-x-4">
        <Link href="/dashboard/my-games" className="text-white hover:text-gray-300">
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Go back</span>
        </Link>
        <h1 className="text-xl font-bold text-white">{game.title}</h1>
      </header>

      <Image
        src={game.image || "/placeholder.png"}
        alt="Game Cover"
        width={400}
        height={300}
        className="w-full rounded-lg object-cover"
      />

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <p className="text-sm text-gray-300">
            {game.presentation_text}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Characters</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {game.characters.map((character: Character, index: number) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Image
                src={character.image || "/placeholder.png"}
                alt={character.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
              <h3 className="text-white">{character.name}</h3>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Game Rules</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-sm prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: sanitizeHtml(game.rules) }} />
        </CardContent>
      </Card>

      <Button 
        className="w-full bg-purple-700 hover:bg-purple-600 text-white"
        onClick={handleCreateGameplay}
      >
        Invite friends & PLAY
      </Button>
    </div>
  );
}