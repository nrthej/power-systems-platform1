// src/hooks/useSession.ts
'use client';

import { useSession as useNextAuthSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useSession(requireAuth: boolean = true) {
  const { data: session, status } = useNextAuthSession();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, requireAuth, router]);

  const logout = async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: '/' 
      });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if signOut fails
      router.push('/');
    }
  };

  return {
    session,
    status,
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    logout
  };
}