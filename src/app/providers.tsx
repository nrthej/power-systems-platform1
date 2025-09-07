'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { SessionMonitor } from '@/components/auth/SessionMonitor';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SessionMonitor>
        {children}
      </SessionMonitor>
    </SessionProvider>
  );
}