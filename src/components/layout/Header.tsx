'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  BarChart3, 
  Users, 
  Settings, 
  FileText,
  Map
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: '/dashboard'
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: <FolderKanban className="w-5 h-5" />,
    href: '/projects'
  },
  {
    id: 'maps',
    label: 'Maps',
    icon: <Map className="w-5 h-5" />,
    href: '/maps'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/reports'
  },
  {
    id: 'users',
    label: 'Users',
    icon: <Users className="w-5 h-5" />,
    href: '/users'
  },
  {
    id: 'fields',
    label: 'Fields',
    icon: <FileText className="w-5 h-5" />,
    href: '/fields'
  },
  {
    id: 'preferences',
    label: 'Preferences',
    icon: <Settings className="w-5 h-5" />,
    href: '/preferences'
  }
];

interface HeaderProps {
  activeItem: string;
  onItemClick: (itemId: string) => void;
}

export default function Header({ activeItem, onItemClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo size="sm" showText={true} className="flex-row space-x-3 mb-0" />

          {/* Navigation Items */}
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className={cn(
                  "flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium",
                  activeItem === item.id
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <span className="mr-2">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5V7a1 1 0 011-1h4" />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">JD</span>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-slate-900">John Doe</p>
                <p className="text-xs text-slate-500">john@company.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}