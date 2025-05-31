'use client'

import { AppFrameComponent } from '@/components/app-frame'
import MenuHeader from '@/components/MenuHeader';
import { SignOutButton } from '@/components/signout-btn'
import { Button } from '@/components/ui/button'
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/toast';

export default function MenuPage() {
  const { user } = useUser();
  const router = useRouter();
  const { addToast } = useToast();
  const [userData, setUserData] = useState<{ credits: number; username: string | null }>({ credits: 0, username: null });

  useEffect(() => {
    let isMounted = true;

    async function fetchUserData() {
      if (user && isMounted) {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL;
          const token = localStorage.getItem('userToken');
          const response = await fetch(`${API_URL}/user/${user.uid}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok && isMounted) {
            const data = await response.json();
            setUserData({ credits: data.credits, username: user.displayName });
          } else {
            addToast({
              type: 'error',
              title: 'Error loading user data',
              message: 'Failed to load your user information.'
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          addToast({
            type: 'error',
            title: 'Error loading user data',
            message: 'Failed to load your user information.'
          });
        }
      }
    }

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [user, addToast]);

  return (
    <AppFrameComponent>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Menu</h1>
        <p className="text-gray-300">Access settings and other options.</p>
        <MenuHeader 
          avatarUrl={user?.photoURL || ''} 
          username={userData.username || ''} 
          credits={userData.credits} 
          onBuyCredits={() => router.push('/shop')} 
        />
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
