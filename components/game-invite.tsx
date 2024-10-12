'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, Copy, QrCode } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'

export function InviteGameplay({ gameplayId }: { gameplayId: string }) {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [, setIsCopied] = useState(false)
  const [copyButtonColor, setCopyButtonColor] = useState('bg-purple-700')

  const gameUrl = `https://game.com/${gameplayId}`
  const players = [
    { name: 'Alice', avatar: '/placeholder.png' },
    { name: 'Bob', avatar: '/placeholder.png' }
  ]
  const totalPlayers = 5

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameUrl)
    setIsCopied(true)
    setCopyButtonColor(prev => prev === 'bg-purple-700' ? 'bg-green-500' : 'bg-purple-700')
    setTimeout(() => {
      setIsCopied(false)
      setCopyButtonColor('bg-purple-700')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 max-w-md mx-auto text-white">
      <header className="flex items-center mb-4">
        <Link href="/dashboard/my-games" className="text-white hover:text-gray-300">
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Go back</span>
        </Link>
        <h1 className="text-xl font-semibold">Play with friends</h1>
      </header>

      <Image
        src="/placeholder.png"
        width={400}
        height={400}
        alt="Game Cover"
        className="w-full aspect-square object-cover rounded-lg mb-4"
      />

      <section className="mb-6">
        <p className="text-sm text-gray-300 mb-2">
          Share this URL or QR code with your friends to join the game:
        </p>
        <div className="flex items-center">
          <Input
            value={gameUrl}
            readOnly
            className="flex-grow mr-2 bg-gray-800 border-gray-700 text-white"
          />
          <Button onClick={copyToClipboard} size="icon" className={`w-10 h-10 p-0 mr-2 ${copyButtonColor} hover:bg-purple-600 transition-colors duration-300`}>
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy URL</span>
          </Button>
          <Button onClick={() => setIsQRModalOpen(true)} size="icon" className="w-10 h-10 p-0 bg-purple-700 hover:bg-purple-600">
            <QrCode className="h-4 w-4" />
            <span className="sr-only">Show QR Code</span>
          </Button>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Party room</h2>
          <span className="text-sm text-gray-300">{players.length}/{totalPlayers}</span>
        </div>
        <ul className="space-y-2 mb-6">
          {players.map((player, index) => (
            <li key={index} className="bg-gray-800 p-2 rounded-md flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={player.avatar} alt={player.name} />
                <AvatarFallback>{player.name[0]}</AvatarFallback>
              </Avatar>
              {player.name}
            </li>
          ))}
        </ul>
      </section>

      <Button className="w-full bg-purple-700 hover:bg-purple-600">Start</Button>

      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="sm:max-w-md bg-gray-800 text-white">
          <DialogTitle className="sr-only">
            QR Code for Game Invitation
          </DialogTitle>
          <DialogDescription className="sr-only">
            Scan this QR code to join the game
          </DialogDescription>
          <div className="relative w-full aspect-square">
            <Image
              src="/placeholder.png"
              alt="QR Code"
              fill
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}