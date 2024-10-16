'use client'

import { useState, Suspense } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider, UserCredential } from 'firebase/auth'
import { auth } from '@/firebase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@/contexts/UserContext'

function SignInContent() {
  const { user, setUser } = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const isUserExistentInDatabase = async () => {
    try {
      const token = await auth.currentUser?.getIdToken()
      const response = await fetch(`http://localhost:5001/user/${user?.uid}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      return response.ok
    } catch (error) {
      console.error('Error checking user existence:', error)
      throw error
    }
  }

  const createUserInDatabase = async (email: string, username: string, signin_method: string) => {
    try {
      const token = await auth.currentUser?.getIdToken()
      const response = await fetch('http://localhost:5001/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ email, username, signin_method })
      })
      if (!response.ok) {
        throw new Error('Failed to create user in database')
      }
    } catch (error) {
      console.error('Error creating user in database:', error)
      throw error
    }
  }

  const makeSureUserIsInDatabase = async (result: UserCredential) => {
    if (!result.user.email) {
      throw new Error('User email is not available')
    }
    else if (!(await isUserExistentInDatabase())) {
      const signin_method = result.user.providerData[0]?.providerId ?? ''
      await createUserInDatabase(result.user.email, result.user.displayName ?? '', signin_method)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log('User credential:', userCredential)
      // Store the user information in the global context and localStorage
      setUser(userCredential.user)
      await makeSureUserIsInDatabase(userCredential)
      // Print the entire response
      console.log('Firebase Auth Response:', userCredential)
      
      // Print specific user information
      console.log('User:', userCredential.user)
      console.log('User ID:', userCredential.user.uid)
      console.log('Display Name:', userCredential.user.displayName)
      console.log('Email:', userCredential.user.email)

      router.push(redirect || '/dashboard')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError('')
    try {
      const provider = new GoogleAuthProvider()
      const result: UserCredential = await signInWithPopup(auth, provider)
      
      // Store the user information in the global context and localStorage
      setUser(result.user)
      await makeSureUserIsInDatabase(result)
      // Print the entire response
      console.log('Firebase Auth Response:', result)
      
      // Print specific user information
      console.log('User:', result.user)
      console.log('User ID:', result.user.uid)
      console.log('Display Name:', result.user.displayName)
      console.log('Email:', result.user.email)

      router.push(redirect || '/dashboard')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  const handleMicrosoftSignIn = async () => {
    setIsLoading(true)
    setError('')
    try {
      const provider = new OAuthProvider('microsoft.com')
      const result: UserCredential = await signInWithPopup(auth, provider)

      // Store the user information in the global context 
      setUser(result.user)
      await makeSureUserIsInDatabase(result)
      router.push(redirect || '/dashboard')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground">Quick signin with your favorite provider</p>
        </div>
        <div className="grid gap-6">
          <Button variant="outline" type="button" disabled={isLoading} onClick={handleGoogleSignIn}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}{" "}
            Google
          </Button>
          <Button variant="outline" type="button" disabled={isLoading} onClick={handleMicrosoftSignIn}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.microsoft className="mr-2 h-4 w-4" />
            )}{" "}
            Microsoft
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or sign in with your email</span>
            </div>
          </div>
          <form onSubmit={handleEmailSignIn}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Sign In with Email
              </Button>
            </div>
          </form>
          <p className="text-sm text-center">
            Would you like to sign in with email but you don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}
