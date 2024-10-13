'use client'

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { AppFrameComponent } from '@/components/app-frame';
import { UpgradeMessage } from '@/components/upgrade-message';

export function withTierAccess<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function TierAccessComponent(props: P) {
    const { user } = useUser();
    const router = useRouter();
    const [userTier, setUserTier] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
      async function fetchUserTier() {
        if (user) {
          try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const token = localStorage.getItem('userToken');
            const response = await fetch(`${API_URL}/user/${user.uid}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            if (response.ok) {
              const userData = await response.json();
              setUserTier(userData.tier);
            } else {
              console.error('Failed to fetch user tier');
            }
          } catch (error) {
            console.error('Error fetching user tier:', error);
          } finally {
            setIsLoading(false);
          }
        } else {
          router.push('/signin');
        }
      }

      fetchUserTier();
    }, [user, router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (userTier === 'FREE' && 
        pathname !== '/dashboard/menu' && 
        !pathname.startsWith('/gameplay/') &&
        pathname !== '/' &&
        pathname !== '/signin' &&
        pathname !== '/signup') {
      return (
        <AppFrameComponent>
          <UpgradeMessage />
        </AppFrameComponent>
      );
    }

    if (userTier === 'ADMIN' || userTier === 'PREMIUM' || pathname === '/dashboard/menu') {
      return <WrappedComponent {...props} />;
    }

    return null;
  };
}
