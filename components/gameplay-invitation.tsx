import Link from 'next/link'
import { Button } from "@/components/ui/button"

interface GameplayInviteProps {
  gameplayId: string
}

export function GameplayInvitation({ gameplayId }: GameplayInviteProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-2xl font-bold mb-4 text-white">You`&apos;`re invited to play a game!</h1>
      <p className="text-gray-300 mb-6">Sign in or create an account to join the game.</p>
      <div className="space-x-4">
        <Link href={`/signin?redirect=/gameplay/${gameplayId}`}>
          <Button>Sign In</Button>
        </Link>
        <Link href={`/signup?redirect=/gameplay/${gameplayId}`}>
          <Button variant="outline">Create Account</Button>
        </Link>
      </div>
    </div>
  )
}