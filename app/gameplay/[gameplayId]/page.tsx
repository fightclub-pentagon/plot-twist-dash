'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import { InviteGameplay } from "@/components/game-invite"
import io, { Socket } from 'socket.io-client'
import { useUser } from '@/contexts/UserContext'
import { GameplayInvitation } from '@/components/gameplay-invitation'
import { useGameplay } from '@/contexts/GameplayContext'
import { Character } from '@/types'

interface RevelationCardResponse {
  id: number
  order_number: number
  title: string
  text: string
  image: string
}

interface UserResponse {
  id: number
  username: string
  avatar: string | null
  tier: string
  rank: string
}

interface RulesContent {
  content: string 
}

interface GameResponse {
  id: number
  title: string
  presentation_text: string
  image: string
  context: string
  rules: RulesContent
  n_players: number
  n_rounds: number
}

export interface GameplayData {
  id: number
  uuid: string
  duration: number
  status: string
  game: GameResponse
  current_user: UserResponse
  owner: string
  number_of_players: number
  users: UserResponse[]
  cards: RevelationCardResponse[]
  character: Character
}

// Create a custom hook for managing the socket connection
function useSocket(gameplayId: string) {
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  const connectSocket = useCallback(() => {
    console.log('Attempting to connect socket...')
    if (socketRef.current?.connected) {
      console.log('Socket already connected')
      return
    }

    const newSocket = io('http://127.0.0.1:5001', {
      transports: ['websocket'],
      upgrade: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    })

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id)
      setIsConnected(true)
      newSocket.emit('join', { room: gameplayId })
    })

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      setIsConnected(false)
    })

    newSocket.on('joined_room', (data) => {
      console.log('Joined room:', data.room)
    })

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error.message)
    })
    
    newSocket.on('error', (error) => {
      console.error('Socket error:', error)
    })

    socketRef.current = newSocket
  }, [gameplayId])

  useEffect(() => {
    connectSocket()

    return () => {
      console.log('Cleaning up socket connection')
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [connectSocket])

  return { socket: socketRef.current, isConnected }
}

export default function Gameplay() {
  const { user } = useUser()
  const { gameplayId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  //const [gameplayData, setGameplayData] = useState<GameplayData | null>(null)
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const { socket, isConnected } = useSocket(gameplayId as string)
  const { gameplayData, setGameplayData} = useGameplay()
  useEffect(() => {
    let isMounted = true
    const joinGameplay = async () => {
      console.log('Joining gameplay...')
      try {
        const token = localStorage.getItem('userToken')
        if (!token) {
          throw new Error('No authentication token found')
        }

        const joinResponse = await fetch(`${API_URL}/gameplay/${gameplayId}/join`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        })

        if (joinResponse.status === 400) {
          const errorData = await joinResponse.json()
          if (errorData.error_code === 'ALREADY_JOINED') {
            console.log('User already joined, proceeding to fetch gameplay data')
          } else {
            console.error('Failed to join gameplay')
            throw new Error('Failed to join gameplay')
          }
        } else if (!joinResponse.ok) {
          console.error('Failed to join gameplay')
          throw new Error('Failed to join gameplay')
        }

        console.log('Fetching gameplay data')
        const dataResponse = await fetch(`${API_URL}/gameplay/${gameplayId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        })
        if (!dataResponse.ok) {
          console.error('Failed to fetch gameplay data')
          throw new Error('Failed to fetch gameplay data')
        }
        const data: GameplayData = await dataResponse.json()
        console.log('Gameplay data fetched:', data)
        if (isMounted) {
          setGameplayData(data)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error:', error)
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    joinGameplay()
    console.log('Joined gameplay')

    return () => {
      isMounted = false
    }
  }, [gameplayId, API_URL, setGameplayData])

  useEffect(() => {
    if (!socket) return

    const handlePlayerJoined = (updatedUsers: UserResponse[]) => {
      console.log('Player joined gameplay:', updatedUsers)
      setGameplayData((prevData) => {
        if (!prevData) return prevData
        return {
          ...prevData,
          users: updatedUsers,
        }
      })
    }

    socket.on('player_joined_gameplay', handlePlayerJoined)

    return () => {
      socket.off('player_joined_gameplay', handlePlayerJoined)
    }
  }, [socket, setGameplayData])

  if (!user) {
    return <GameplayInvitation gameplayId={gameplayId as string} />
  }

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  if (!gameplayData) {
    return <h1>Error loading gameplay data</h1>
  }

  if (!isConnected) {
    return <h1>Connecting to game server...</h1>
  }

  return <InviteGameplay gameplayData={gameplayData} />
}
