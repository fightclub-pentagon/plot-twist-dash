'use client'

import { AppFrameComponent } from '@/components/app-frame'
import { SignOutButton } from '@/components/signout-btn'
import { Button } from '@/components/ui/button'
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';

export default function MenuPage() {
  const { user } = useUser();
  const router = useRouter();
  return (
    <AppFrameComponent>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Menu</h1>
        <p className="text-gray-300">Access settings and other options.</p>
        {false && <a href={`https://billing.stripe.com/p/login/test_00g02rdWF6tmfa87ss?prefilled_email=${user?.email}`}>
          <Button className="w-full bg-purple-700 mt-4 hover:bg-purple-600 text-bold text-white">
            Manage Subscription
          </Button>
        </a>}
        {(user?.email === 'goncalo.bbull@gmail.com' || user?.email === 'paulinaantoniahase@gmail.com') &&
        <Button
          variant="outline"
          className="w-full border-purple-700 bg-transparent mt-4 hover:bg-purple-600 text-bold text-white"
          onClick={() => router.push('/admin/game-review')}
        >
          Admin Panel
        </Button>
        }
        <Button 
          variant="outline" 
          className="w-full border-purple-700 bg-transparent mt-4 hover:bg-purple-600 text-bold text-white"
          onClick={() => router.push('/feedback')}
        >
          Feedback
        </Button>
        <div className="mt-4">
          <SignOutButton />
        </div>
      </div>
    </AppFrameComponent>
  )
}
