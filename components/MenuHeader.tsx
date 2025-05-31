"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Coins } from "lucide-react"

interface AppMenuHeaderProps {
  avatarUrl?: string
  username: string
  credits: number
  onBuyCredits?: () => void
}

export default function AppMenuHeader({
  avatarUrl,
  username = "John Doe",
  credits = 150,
  onBuyCredits,
}: AppMenuHeaderProps) {
  return (
    <div className="w-full space-y-4">
      {/* Top section with avatar and username */}
      <div className="flex items-center space-x-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={username} />
          <AvatarFallback className="bg-blue-500 text-white font-semibold">
            {username
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white truncate">{username}</h2>
        </div>
      </div>

      {/* Credits display - centered */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-2 bg-purple-900 rounded-full px-4 py-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          <span className="text-lg font-bold text-gray-100">{credits.toLocaleString()}</span>
          <span className="text-sm text-gray-400">credits</span>
        </div>
      </div>

      {/* Buy credits button */}
      <div className="flex justify-center">
        <Button
          onClick={onBuyCredits}
          className="w-full border-amber-700 bg-amber-500 mt-4 hover:bg-amber-600 text-bold text-white"
        >
          Buy More Credits
        </Button>
      </div>
    </div>
  )
}
