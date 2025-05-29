'use client'

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { AppFrameComponent } from '@/components/app-frame';
import { useToast } from './toast';
import { OneTimePricingTableComponent } from './pricing-table-onetime-products';

export function withTierAccess<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function TierAccessComponent(props: P) {
    const { user } = useUser();
    const { addToast } = useToast();
    const router = useRouter();
    const [userTier, setUserTier] = useState<string | null>(null);
    const [userCredits, setUserCredits] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
      let isMounted = true;
      let timeoutId: NodeJS.Timeout;

      async function fetchUserTier() {
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
              const userData = await response.json();
              setUserTier(userData.tier);
              setUserCredits(userData.credits);
            } else if (isMounted) {
              handleError('Sorry we lost you... 😓', 'Please go back to the home page and sign in again.');
            }
          } catch (error) {
            console.error('Error fetching user tier:', error);
            if (isMounted) {
              handleError('Sorry we lost you... 😓', 'Please go back to the home page and sign in again.');
            }
          } finally {
            if (isMounted) {
              setIsLoading(false);
            }
          }
        } else if (isMounted) {
          router.push('/signin');
        }
      }

      function handleError(title: string, message: string) {
        addToast({
          type: 'error',
          title,
          message
        });
        timeoutId = setTimeout(() => {
          if (isMounted) {
            router.push('/signin');
          }
        }, 2000);
      }

      fetchUserTier();

      return () => {
        isMounted = false;
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }, [user, router, addToast]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (
      userCredits < 100 &&
      pathname !== '/dashboard/menu' &&
      !pathname.startsWith('/gameplay/') &&
      pathname !== '/' &&
      pathname !== '/signin' &&
      pathname !== '/signup') {
      return (
        <AppFrameComponent>
          <OneTimePricingTableComponent />
        </AppFrameComponent>
      );
    }

    if (userCredits > 0 || userTier === 'ADMIN' || userTier === 'BASE' || userTier == 'PLUS' || userTier === 'PREMIUM' || pathname === '/dashboard/menu') {
      return <WrappedComponent {...props} />;
    }

    return <h1 className="text-center text-red-500">
      Error
    </h1>;
  };
}
