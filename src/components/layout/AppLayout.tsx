'use client';

import React, { useState } from 'react';
import Header from './Header';
import Dashboard from '@/components/dashboard/Dashboard';
import UsersPage from '@/components/users/UsersPage';
import { FieldsPage } from '@/components/fields';

// Auth components and hooks
import { LogoutButton, UserInfo } from '@/components/auth/LogoutButton';
import { useSession } from '@/hooks/useSession';


interface AppLayoutProps {
  children?: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  
  // Don't require auth here - let middleware handle it
  const { session, status, user, isLoading, isAuthenticated } = useSession(false);

  const handleNavItemClick = (itemId: string) => {
    setActiveNavItem(itemId);
  };

  const renderContent = () => {
    switch (activeNavItem) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UsersPage />;
      case 'projects':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Projects Page</h2>
            <p className="text-slate-600">Projects management coming soon...</p>
          </div>
        );
      case 'maps':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Maps Page</h2>
            <p className="text-slate-600">Geographic mapping coming soon...</p>
          </div>
        );
      case 'reports':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Reports Page</h2>
            <p className="text-slate-600">Analytics and reporting coming soon...</p>
          </div>
        );
      case 'fields':
        return <FieldsPage />; // Replace this line
      case 'preferences':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Preferences Page</h2>
            <p className="text-slate-600">Application settings coming soon...</p>
          </div>
        );
      default:
        return children || <Dashboard />;
    }
  };

  const getPageDescription = () => {
    const descriptions = {
      dashboard: 'Overview of your power systems projects',
      projects: 'Manage your power systems projects',
      maps: 'Geographic view of your projects and assets',
      reports: 'Analytics and reporting dashboard',
      users: 'Manage team members and permissions',
      fields: 'Configure custom fields and data structure',
      preferences: 'Application settings and preferences'
    };
    return descriptions[activeNavItem as keyof typeof descriptions] || '';
  };

  const getNewItemLabel = () => {
    if (activeNavItem === 'dashboard') return 'Project';
    if (activeNavItem === 'users') return 'User';
    if (activeNavItem === 'fields') return 'Field'; // Add this line
    return activeNavItem.slice(0, -1);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show nothing (middleware will handle redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Navigation and Auth */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Header 
              activeItem={activeNavItem} 
              onItemClick={handleNavItemClick}
            />
          </div>

          {/* Authentication Section */}
          <div className="flex items-center space-x-4">
            <UserInfo />
            <LogoutButton variant="icon" />
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1">
        {/* Page Title Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-800 capitalize">
                {activeNavItem}
              </h1>
              <p className="text-sm text-slate-600">
                {getPageDescription()}
              </p>
            </div>
            
            {/* Page Actions */}
            
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}