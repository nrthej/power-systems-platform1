'use client';

import React, { useState } from 'react';
import Header from './Header';
import Dashboard from '@/components/dashboard/Dashboard';
import UsersPage from '@/components/users/UsersPage';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [activeNavItem, setActiveNavItem] = useState('dashboard');

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
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Fields Page</h2>
            <p className="text-slate-600">Custom fields management coming soon...</p>
          </div>
        );
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Header */}
      <Header 
        activeItem={activeNavItem} 
        onItemClick={handleNavItemClick}
      />
      
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
                {activeNavItem === 'dashboard' && 'Overview of your power systems projects'}
                {activeNavItem === 'projects' && 'Manage your power systems projects'}
                {activeNavItem === 'maps' && 'Geographic view of your projects and assets'}
                {activeNavItem === 'reports' && 'Analytics and reporting dashboard'}
                {activeNavItem === 'users' && 'Manage team members and permissions'}
                {activeNavItem === 'fields' && 'Configure custom fields and data structure'}
                {activeNavItem === 'preferences' && 'Application settings and preferences'}
              </p>
            </div>
            
            {/* Page Actions */}
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                + New {activeNavItem === 'dashboard' ? 'Project' : activeNavItem.slice(0, -1)}
              </button>
            </div>
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