'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface RevelationCardViewerProps {
  cardName: string
  cardImage: string
  cardText: string
  currentIndex: number
  totalCards: number
  onPrevious: () => void
  onNext: () => void
  onBack: () => void
}

export function RevelationCardViewer({
  cardName = "Example Card",
  cardImage = "/placeholder.svg?height=300&width=200",
  cardText = "This is an example revelation card text. It contains important information about the card and its meaning.",
  currentIndex = 3,
  totalCards = 7,
  onPrevious = () => {},
  onNext = () => {},
  onBack = () => {}
}: RevelationCardViewerProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const generateDots = (current: number, total: number, maxDots: number = 7) => {
    const dots = []
    const sideDotsCount = Math.floor((maxDots - 1) / 2)
    let start = Math.max(0, current - sideDotsCount)
    const end = Math.min(total - 1, start + maxDots - 1)

    if (end - start < maxDots - 1) {
      start = Math.max(0, end - maxDots + 1)
    }

    for (let i = start; i <= end; i++) {
      dots.push({
        isCurrent: i === current,
        index: i,
      })
    }

    return dots
  }

  const dots = generateDots(currentIndex, totalCards)

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-foreground">
      {/* Header */}
      <header className="flex items-center p-4 border-b text-white">
        <Link href="#" className="mr-4" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Go back</span>
        </Link>
        <h1 className="text-xl font-semibold">{cardName}</h1>
      </header>

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-between p-4 text-white">
        <div className="w-full max-w-md">
          <div className="relative aspect-[2/3] w-full mb-4">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                Loading...
              </div>
            )}
            {cardImage ? 
              <>
                <img
                  src={cardImage}
                  alt={cardName}
                className={`w-full h-full object-cover rounded-lg shadow-lg ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                />
              </>
              :
              <></>
            }
          </div>
          <p className="text-center text-gray-300">{cardText}</p>
        </div>
      </main>

      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 border-t text-white">
        <button 
          onClick={onPrevious} 
          className="p-2 text-gray-300 hover:text-gray-200" 
          aria-label="Previous card"
          disabled={currentIndex === 0}
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-2">
          {dots.map((dot, index) => (
            <div
              key={index}
              className={`rounded-full transition-all duration-300 ${
                dot.isCurrent
                  ? 'w-3 h-3 bg-purple-700'
                  : 'w-2 h-2 bg-gray-400'
              }`}
              aria-current={dot.isCurrent ? 'true' : 'false'}
            />
          ))}
        </div>
        <button 
          onClick={onNext} 
          className="p-2 text-gray-300 hover:text-gray-200" 
          aria-label="Next card"
          disabled={currentIndex === totalCards - 1}
        >
          <ArrowRight className="h-6 w-6" />
        </button>
      </nav>
    </div>
  )
}