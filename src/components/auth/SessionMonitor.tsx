// src/components/auth/SessionMonitor.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { WarningAlert, ErrorAlert } from '@/components/ui/Alert';
import { Clock, AlertTriangle } from 'lucide-react';

interface SessionMonitorProps {
  children: React.ReactNode;
  warningMinutes?: number; // Show warning X minutes before expiry
  redirectOnExpiry?: boolean;
}

export function SessionMonitor({ 
  children, 
  warningMinutes = 5,
  redirectOnExpiry = true 
}: SessionMonitorProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [showExpired, setShowExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  
  // Track if we ever had an authenticated session
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    // Track if we become authenticated
    if (status === 'authenticated') {
      wasAuthenticated.current = true;
    }

    // Only show expired if we were previously authenticated and now are not
    if (status === 'unauthenticated' && wasAuthenticated.current) {
      setShowExpired(true);
      if (redirectOnExpiry) {
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
      return;
    }

    // Don't process session timing if not authenticated or no session
    if (status !== 'authenticated' || !session?.expires) {
      setShowWarning(false);
      setShowExpired(false);
      return;
    }

    const checkSession = () => {
      const now = new Date().getTime();
      const expiry = new Date(session.expires!).getTime();
      const timeUntilExpiry = expiry - now;
      const minutesLeft = Math.floor(timeUntilExpiry / (1000 * 60));

      setTimeLeft(minutesLeft);

      if (timeUntilExpiry <= 0) {
        // Session expired naturally
        setShowExpired(true);
        setShowWarning(false);
        if (redirectOnExpiry) {
          setTimeout(() => {
            router.push('/');
          }, 3000);
        }
      } else if (minutesLeft <= warningMinutes && minutesLeft > 0) {
        setShowWarning(true);
        setShowExpired(false);
      } else {
        setShowWarning(false);
        setShowExpired(false);
      }
    };

    // Check immediately
    checkSession();

    // Check every minute
    const interval = setInterval(checkSession, 60000);

    return () => clearInterval(interval);
  }, [session, status, warningMinutes, redirectOnExpiry, router]);

  const extendSession = async () => {
    // Trigger a session refresh by making an API call
    try {
      await fetch('/api/auth/session', { 
        method: 'GET',
        credentials: 'include' 
      });
      
      // Refresh the page to get new session data
      window.location.reload();
    } catch (error) {
      console.error('Failed to extend session:', error);
    }
  };

  return (
    <>
      {/* Session Warning */}
      {showWarning && timeLeft !== null && (
        <div className="fixed top-4 right-4 max-w-sm z-50">
          <WarningAlert
            title="Session Expiring Soon"
            message={`Your session will expire in ${timeLeft} minute${timeLeft === 1 ? '' : 's'}. Click to extend your session.`}
            closable={true}
            onClose={() => setShowWarning(false)}
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={extendSession}
              className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
            >
              <Clock className="w-3 h-3 mr-1" />
              Extend Session
            </button>
          </div>
        </div>
      )}

      {/* Session Expired - Only show if we were previously authenticated */}
      {showExpired && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <ErrorAlert
              title="Session Expired"
              message="Your session has expired for security reasons. You will be redirected to the login page."
            />
            <div className="mt-4 flex justify-center space-x-3">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </button>
              <button
                onClick={extendSession}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Try to Reconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {children}
    </>
  );
}

// Session status indicator component
export function SessionStatus() {
  const { status, data: session } = useSession();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <span>Checking session...</span>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
        <span>Not authenticated</span>
      </div>
    );
  }

  const sessionExpiry = session?.expires ? new Date(session.expires) : null;
  const timeLeft = sessionExpiry ? sessionExpiry.getTime() - currentTime.getTime() : 0;
  const minutesLeft = Math.floor(timeLeft / (1000 * 60));

  return (
    <div className="flex items-center space-x-2 text-xs text-slate-500">
      <div className={`w-2 h-2 rounded-full ${
        minutesLeft > 10 ? 'bg-green-400' : 
        minutesLeft > 5 ? 'bg-yellow-400' : 'bg-red-400'
      }`}></div>
      <span>
        Session: {minutesLeft > 0 ? `${minutesLeft}m left` : 'Expired'}
      </span>
    </div>
  );
}