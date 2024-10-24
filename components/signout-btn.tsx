'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/firebase';
import { useUser } from '@/contexts/UserContext';
import { Button } from './ui/button';
import { useToast } from './toast';

export function SignOutButton() {
    const router = useRouter();
    const { setUser } = useUser();
    const { addToast } = useToast();
    async function signOut(): Promise<void> {
        try {
            await auth.signOut();
            // Remove user from context and localStorage
            setUser(null);
            addToast({
                type: 'success',
                title: 'Sign out successful',
                message: 'See you soon 👋'
            })
            // Redirect to home page
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    return (
        <Button 
            className="w-full bg-red-500 hover:bg-red-700 text-bold text-white"
            onClick={signOut}
        >
            Sign out
        </Button>
    );
}
