'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth'
import { auth } from '@/firebase'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/')//('/dashboard')
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
      const result = await signInWithPopup(auth, provider)
      
      // Print the entire response
      console.log('Firebase Auth Response:', result)
      
      // Print specific user information
      console.log('User:', result.user)
      console.log('User ID:', result.user.uid)
      console.log('Display Name:', result.user.displayName)
      console.log('Email:', result.user.email)

      router.push('/')//('/dashboard')
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
      await signInWithPopup(auth, provider)
      router.push('/')//('/dashboard')
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
          <h1 className="text-2xl font-semibold tracking-tight">Sign in to your account</h1>
          <p className="text-sm text-muted-foreground">Enter your email below to sign in to your account</p>
        </div>
        <div className="grid gap-6">
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
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
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
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  )
}