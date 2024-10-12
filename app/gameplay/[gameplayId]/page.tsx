import { InviteGameplay } from "@/components/game-invite";

interface InviteGameplayProps {
    params: {
      gameplayId: string
    }
  }

export default function Gameplay({ params }: InviteGameplayProps) {
    return <InviteGameplay gameplayId={params.gameplayId} />
  }