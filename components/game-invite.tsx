'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, Copy, QrCode } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { GameplayData } from '@/app/gameplay/[gameplayId]/page'
import { getImageUrl } from '@/lib/utils'
import { useRouter } from 'next/navigation'


export function InviteGameplay({ gameplayData }: { gameplayData: GameplayData }) {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [, setIsCopied] = useState(false)
  const [copyButtonColor, setCopyButtonColor] = useState('bg-purple-700')
  const router = useRouter()
  const { users, number_of_players, character } = gameplayData
  const currentPageUrl = `localhost:3000/gameplay/${gameplayData.uuid}`

  const generateQRCode = (url: string): string => {
    const encodedUrl = encodeURIComponent(url)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedUrl}`
    return qrCodeUrl
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentPageUrl)
    setIsCopied(true)
    setCopyButtonColor(prev => prev === 'bg-purple-700' ? 'bg-green-500' : 'bg-purple-700')
    setTimeout(() => {
      setIsCopied(false)
      setCopyButtonColor('bg-purple-700')
    }, 2000)
  }

  const handleStartGameplay = () => {
    console.log('Starting game')
    router.push(`/gameplay/confirmation`)
  }

  const handleCancelGameplay = () => {
    console.log('Cancelling gameplay')
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
        src={getImageUrl(gameplayData.game.image)}
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
            value={currentPageUrl}
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
        <h2 className="text-lg font-semibold">Prepare your character</h2>
        <ul className="space-y-2 mb-6">
          {[character].map((character, index) => (
            <Link href={`/character/${character?.id}`} key={index}>
              <li className="bg-gray-800 p-2 mt-2 rounded-md flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={getImageUrl(character?.image || '')} alt={character?.name} />
                <AvatarFallback>{character?.name[0]}</AvatarFallback>
              </Avatar>
                {character?.name}
              </li>
            </Link>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Party room</h2>
          <span className="text-sm text-gray-300">{users.length}/{number_of_players}</span>
        </div>
        <ul className="space-y-2 mb-6">
          {users.map((user, index) => (
            <li key={index} className="bg-gray-800 p-2 rounded-md flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={user.avatar || ''} alt={user.username} />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              {user.username}
            </li>
          ))}
        </ul>
      </section>

      <Button 
        className="w-full bg-purple-700 hover:bg-purple-600"
        onClick={handleStartGameplay}
      >
        Start
      </Button>

      <Button 
        className="w-full bg-red-700 mt-4 hover:bg-red-600"
        onClick={handleCancelGameplay}
      >
        Cancel
      </Button>

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
              src={generateQRCode(currentPageUrl)}
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
