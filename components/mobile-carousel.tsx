'use client'

import { useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Users } from 'lucide-react'
import Image from 'next/image'

interface CarouselItem {
  id: number
  imageUrl: string
  title: string
  playerCount: number
}

const carouselItems: CarouselItem[] = [
  { id: 1, imageUrl: '/placeholder.png?height=200&width=200', title: 'Adventure Quest', playerCount: 4 },
  { id: 2, imageUrl: '/placeholder.png?height=200&width=200', title: 'Space Explorers', playerCount: 2 },
  { id: 3, imageUrl: '/placeholder.png?height=200&width=200', title: 'Mystic Realms', playerCount: 6 },
  { id: 4, imageUrl: '/placeholder.png?height=200&width=200', title: "Pirate's Treasure", playerCount: 3 },
  { id: 5, imageUrl: '/placeholder.png?height=200&width=200', title: 'Dragon Riders', playerCount: 5 },
]

interface MobileCarouselProps {
  title?: string;
}

export function MobileCarouselComponent({ title }: MobileCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      carousel.scrollLeft += e.deltaY
    }

    carousel.addEventListener('wheel', handleWheel)
    return () => carousel.removeEventListener('wheel', handleWheel)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const carousel = carouselRef.current
    if (carousel) {
      const scrollAmount = direction === 'left' ? -200 : 200
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-md mx-auto p-[3px] rounded-xl bg-gradient-to-br from-green-500 to-purple-500">
        <div className="relative overflow-hidden rounded-lg bg-black p-4">
      {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto space-x-4 scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {carouselItems.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-48 h-48 relative rounded-lg overflow-hidden"
                style={{ scrollSnapAlign: 'start' }}
              >
                <Image src={item.imageUrl} alt={item.title} width={200} height={200} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-3">
                  <h3 className="text-white font-bold">{item.title}</h3>
                  <div className="flex items-center justify-end text-white">
                    <Users size={16} />
                    <span className="ml-1">{item.playerCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity duration-300"
            aria-label="Scroll left"
          >
            <ChevronLeft className="text-white" size={24} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity duration-300"
            aria-label="Scroll right"
          >
            <ChevronRight className="text-white" size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}