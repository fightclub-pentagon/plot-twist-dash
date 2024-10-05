'use server'

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export async function signIn(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User signed in:", user);
    return { success: true };
  } catch (error: unknown) {
    console.error("Error signing in:", error);
    return {
      message: error instanceof Error ? error.message : 'An error occurred during sign in.'
    };
  }
}