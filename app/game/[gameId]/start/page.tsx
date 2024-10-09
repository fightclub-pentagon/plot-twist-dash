import { CreateGameplay } from "@/components/game-invite";

interface StartingGameProps {
    params: {
      gameId: string
    }
  }

export default function Start({ params }: StartingGameProps) {
    return <CreateGameplay gameId={params.gameId} />
  }