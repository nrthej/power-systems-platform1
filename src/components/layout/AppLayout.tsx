'use client';

import React, { useState } from 'react';
import Header from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [activeNavItem, setActiveNavItem] = useState('dashboard');

  const handleNavItemClick = (itemId: string) => {
    setActiveNavItem(itemId);
    console.log('Navigation clicked:', itemId);
    // In a real app, this would handle routing
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
          {children}
        </div>
      </main>
    </div>
  );
}