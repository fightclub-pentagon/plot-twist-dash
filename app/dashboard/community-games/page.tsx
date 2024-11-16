// Remove 'use client' if you're fetching data on the server side
'use client'

import { AppFrameComponent } from '@/components/app-frame'
import { MobileCarouselComponent, DisplayGameThumbnail } from '@/components/mobile-carousel'
import { auth } from '@/firebase';
import { useEffect, useState } from 'react';

interface GameResponse {
  games: {
    free_games: {
      game_id: number;
      image: string;
      title: string;
      number_of_players: number;
    }[];
  };
}

async function getFreeGames(): Promise<DisplayGameThumbnail[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = await auth.currentUser?.getIdToken()
  const response = await fetch(`${API_URL}/game/community`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error('Failed to fetch games');
    return [];
  }

  const data: GameResponse = await response.json();
  console.log("Free games", data)
  return data.games.free_games.map(game => ({
    id: game.game_id,
    imageUrl: game.image,
    title: game.title,
    playerCount: game.number_of_players,
  }));
}

export default function CommunityGamesPage() {
  const [freeGames, setFreeGames] = useState<DisplayGameThumbnail[]>([]);

  useEffect(() => {
    const fetchFreeGames = async () => {
      const freeGames = await getFreeGames();
      setFreeGames(freeGames);
    };
    fetchFreeGames();
  }, []);
  
  return (
    <AppFrameComponent>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Community Games</h1>
        <p className="text-gray-300">Explore games created by the community.</p>
      </div>
      <div className='mx-4 my-6'>
        <MobileCarouselComponent title='Free Games' items={freeGames} />
      </div>
      {/* ... rest of the components ... */}
    </AppFrameComponent>
  );
}
