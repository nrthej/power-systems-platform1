// src/components/auth/LogoutButton.tsx
'use client';

import React, { useState } from 'react';
import { LogOut, User } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { SuccessAlert } from '@/components/ui/Alert';

interface LogoutButtonProps {
  variant?: 'button' | 'dropdown' | 'icon';
  className?: string;
  showUserInfo?: boolean;
}

export function LogoutButton({ 
  variant = 'button', 
  className = '',
  showUserInfo = true 
}: LogoutButtonProps) {
  const { user, logout, isLoading } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      setIsLoggingOut(true);
      setShowSuccess(true);
      
      // Small delay to show success message
      setTimeout(async () => {
        await logout();
      }, 1000);
    }
  };

  if (isLoading || !user) {
    return null;
  }

  // Success message overlay
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
          <SuccessAlert message="Signing out..." />
          <div className="mt-4 flex justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`p-2 text-slate-600 hover:text-red-600 transition-colors rounded-lg hover:bg-slate-100 ${className}`}
        title="Sign out"
      >
        <LogOut className="w-5 h-5" />
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`bg-white border border-slate-200 rounded-lg shadow-lg py-2 ${className}`}>
        {showUserInfo && (
          <div className="px-4 py-2 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
        </button>
      </div>
    );
  }

  // Default button variant
  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors ${className}`}
    >
      <LogOut className="w-4 h-4 mr-2" />
      {isLoggingOut ? 'Signing out...' : 'Sign out'}
    </button>
  );
}

// User info display component
export function UserInfo({ className = '' }: { className?: string }) {
  const { user, isLoading } = useSession();

  if (isLoading || !user) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
          <div>
            <div className="w-20 h-4 bg-slate-200 rounded mb-1"></div>
            <div className="w-32 h-3 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
        <span className="text-white text-sm font-semibold">
          {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-900">{user.name}</p>
        <div className="flex items-center space-x-2 mt-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-xs text-slate-500">Online</span>
        </div>
      </div>
    </div>
  );
}