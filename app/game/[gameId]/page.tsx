import { GamePage } from '@/components/game-page'

interface GamePageProps {
  params: {
    gameId: string
  }
}

export default function Game({ params }: GamePageProps) {
  return <GamePage gameId={params.gameId} />
}