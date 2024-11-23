'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from './toast'
import { withAuth } from './withAuth'

function FeedbackComponent() {
  const [feedback, setFeedback] = useState('')
  const [isSent, setIsSent] = useState(false)
  const { addToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (isSent) {
      const timer = setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isSent, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('userToken')
      const API_URL = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${API_URL}/submit_feedback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "message": feedback })
      })
      if (response.ok) {
        setIsSent(true)
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to submit feedback'
        })
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex flex-col">
      {isSent && (
        <div className="fixed inset-0 bg-gray-600/80 backdrop-blur-sm z-50 flex items-center justify-center flex-col">
          <div className="animate-fly-plane mb-4">
            <Send className="h-12 w-12 text-white" />
          </div>
          <p className="text-xl font-semibold text-white">Thank you for your feedback</p>
        </div>
      )}
      <h1 className="text-2xl font-bold text-white mb-2">Send Feedback...</h1>
      <p className="text-gray-300 mb-6">
        We are eager to know your thoughts about your experience with Plot Twist.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <Textarea
          placeholder="Type your feedback here..."
          className="flex-grow mb-4 resize-none"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <p className="text-sm text-gray-500 mb-4">
          If you want to report an issue, this is the right place. Consider keeping relevant screenshots on your device, as they might be useful when our customer support reaches you via email.
        </p>
        <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800">
          <Send className="mr-2 h-4 w-4" /> Send
        </Button>
      </form>
    </div>
  )
}

export default withAuth(FeedbackComponent)