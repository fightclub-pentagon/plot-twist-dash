'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/firebase';
import { useUser } from '@/contexts/UserContext';
import { Button } from './ui/button';

export function SignOutButton() {
    const router = useRouter();
    const { setUser } = useUser();

    async function signOut(): Promise<void> {
        try {
            await auth.signOut();
            // Remove user from context and localStorage
            setUser(null);
            // Redirect to home page
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    return (
        <Button onClick={signOut}>
            Sign out
        </Button>
    );
}
