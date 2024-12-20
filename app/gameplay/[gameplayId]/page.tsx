'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import { InviteGameplay } from "@/components/game-invite"
import io, { Socket } from 'socket.io-client'
import { useGameplay } from '@/contexts/GameplayContext'
import { Character } from '@/types'
import { useToast } from '@/components/toast'
import { GameProgress } from '@/components/game-progress'
import { GameOver } from '@/components/game-over'
import { withAuth } from '@/components/withAuth'

interface RevelationCardResponse {
  id: number
  order_number: number
  title: string
  text: string
  image: string
}

interface UserResponse {
  id: string
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

interface Votes {
  [key: number]: number
}

export interface PublicCharacterResponse {
  id: number
  name: string
  image: string
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
  number_of_cards: number
  users: UserResponse[]
  cards: RevelationCardResponse[]
  character: Character | null
  characters: PublicCharacterResponse[]
  accused: PublicCharacterResponse | null
  selected_character: number | null
  votes: Votes
  is_voting_tied: boolean | null
  is_final_vote: boolean | null
  killer: Character | null
  conclusion: string | null
}

// Create a custom hook for managing the socket connection
function useSocket(gameplayId: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5
  const reconnectDelay = 1000 // 1 second
  const { addToast } = useToast()

  
  const connectSocket = useCallback(() => {
    console.log('Attempting to connect socket...')
    if (socketRef.current?.connected) {
      console.log('Socket already connected')
      return
    }
    
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://127.0.0.1:5001'
    
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      upgrade: false,
      reconnection: false, // We'll handle reconnection manually
      timeout: 10000,
    })
    
    newSocket.on('connect', () => {
      console.log('Considering gameplayId:', gameplayId)
      console.log('Socket connected:', newSocket.id)
      setIsConnected(true)
      setConnectionError(null)
      reconnectAttemptsRef.current = 0
      newSocket.emit('join', { room: gameplayId })
    })
    
    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      setIsConnected(false)
      handleReconnect()
    })
    
    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error.message)
      setConnectionError(error.message)
      handleReconnect()
    })
    
    newSocket.on('error', (error) => {
      console.error('Socket error:', error)
      setConnectionError(error.message)
    })
    
    socketRef.current = newSocket
  }, [gameplayId])

  const handleReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current < maxReconnectAttempts) {
      reconnectAttemptsRef.current += 1
      console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`)
      /*addToast({
        type: 'info',
        title: 'Reconnecting',
        message: `Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`
      })*/
      setTimeout(connectSocket, reconnectDelay)
    } else {
      console.error('Max reconnection attempts reached')
      setConnectionError('Unable to connect after multiple attempts')
      addToast({
        type: 'error',
        title: 'Connection Failed',
        message: 'Unable to connect to the game server. Please try again later.'
      })
    }
  }, [connectSocket, addToast])
  
  
  useEffect(() => {
    connectSocket()
    
    return () => {
      console.log('Cleaning up socket connection')
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [connectSocket])

  return { socket: socketRef.current, isConnected, connectionError }
}

function Gameplay() {
  const { gameplayId } = useParams()
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const { socket, isConnected, connectionError } = useSocket(gameplayId as string)
  const { gameplayData, setGameplayData } = useGameplay()
 
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

        if (!joinResponse.ok) {
          const errorData = await joinResponse.json()
          if (joinResponse.status === 400 && errorData.error_code === 'ALREADY_JOINED') {
            console.log('User already joined, proceeding to fetch gameplay data')
            /*addToast({
              type: 'info',
              title: 'You are in! 👍',
              message: ''
            })*/
            
          } else {
            console.error('Failed to join gameplay')
            if (isMounted) {
              addToast({
                type: 'error',
                title: 'Sorry, we could not put you in the game!',
                message: ''
              })
            }
            throw new Error(`Failed to join gameplay: ${errorData.message || joinResponse.statusText}`)
          }
        }

        console.log('Fetching gameplay data')
        const dataResponse = await fetch(`${API_URL}/gameplay/${gameplayId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })
        if (!dataResponse.ok) {
          console.error('Failed to fetch gameplay data')

          if (isMounted) {
            addToast({
              type: 'error',
              title: 'Sorry, an error occured while loading your game 😵‍💫',
              message: 'Wait until it everybody joins to start'
            })
          }
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
        addToast({
          type: 'error',
          title: 'Failed to join the game',
          message: ''
        })
       // router.push('/dashboard')
        
      }
    }

    joinGameplay()
    console.log('Joined gameplay')

    return () => {
      isMounted = false
    }
  }, [gameplayId, API_URL, setGameplayData, addToast])

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

    const handleChangesInGameplay = (updatedGameplay: GameplayData) => {
      console.log('Update in gameplay data:', updatedGameplay)
      if (updatedGameplay.is_voting_tied) {
        setGameplayData((prevData) => {
          if (!prevData) return prevData
          return {
            ...prevData,
            is_voting_tied: true,
            is_final_vote: false
          }
        })
        addToast({
          type: 'info',
          title: 'We have a tie!',
          message: 'There must be a majority of votes to agree on who to condemn. Please reconsider your vote.'
        })
      }
      setGameplayData((prevData) => {
        if (!prevData) return prevData
        return {
          ...updatedGameplay,
          accused: prevData.accused,
          character: prevData.character,
          selected_character: prevData.selected_character,
          is_final_vote: prevData.is_final_vote,
        }
      })
    }

    socket.on('player_joined_gameplay', handlePlayerJoined)
    socket.on('changes_in_gameplay_data', handleChangesInGameplay)

    return () => {
      socket.off('player_joined_gameplay', handlePlayerJoined)
      socket.off('changes_in_gameplay_data', handleChangesInGameplay)
    }
  }, [socket, setGameplayData])

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  if (!gameplayData) {
    return <h1>Error loading gameplay data</h1>
  }

  if (connectionError) {
    return <h1>Error connecting to game server: {connectionError}</h1>
  }

  if (!isConnected) {
    return <h1>Connecting to game server...</h1>
  }

  if (gameplayData.status==='CREATED') {
    return <InviteGameplay gameplayData={gameplayData} />
  } else if (gameplayData.status==='IN_PROGRESS') {
    return <GameProgress />
  } else if (gameplayData.status==='FINISHED') {
    return <GameOver />
  }

}

export default withAuth(Gameplay)