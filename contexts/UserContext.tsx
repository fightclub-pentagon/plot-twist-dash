'use client'

import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '@/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser(firebaseUser);
        // Set up a listener for token refresh
        firebaseUser.getIdToken(true).then((token) => {
          // You can store the token in localStorage if needed
          localStorage.setItem('userToken', token);
        });
      } else {
        // User is signed out
        setUser(null);
        localStorage.removeItem('userToken');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
