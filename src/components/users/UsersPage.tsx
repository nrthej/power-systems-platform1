'use client';

import React, { useState } from 'react';
import { Plus, Upload, Download, Edit, Trash2 } from 'lucide-react';
import { TabNavigation } from '@/components/ui/TabNavigation';
import { ActionButtonGroup } from '@/components/ui/ActionButtonGroup';
import { SearchFilterBar } from '@/components/ui/SearchFilterBar';
import { UserStats } from './UserStats';
import { UsersTable } from './UsersTable';
import { RolesGrid } from './RolesGrid';
import { mockUsers, mockRoles } from './userData';

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const tabs = [
    { id: 'users', label: 'Users', count: mockUsers.length },
    { id: 'roles', label: 'Roles', count: mockRoles.length }
  ];

  const actionButtons = [
    {
      id: 'import',
      label: 'Import',
      icon: <Upload className="w-4 h-4" />,
      variant: 'secondary' as const,
      onClick: () => console.log('Import clicked')
    },
    {
      id: 'export', 
      label: 'Export',
      icon: <Download className="w-4 h-4" />,
      variant: 'secondary' as const,
      onClick: () => console.log('Export clicked')
    },
    {
      id: 'add',
      label: activeTab === 'users' ? 'Add User' : 'Add Role',
      icon: <Plus className="w-4 h-4" />,
      variant: 'primary' as const,
      onClick: () => console.log('Add clicked')
    }
  ];

  const handleUserSelect = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedUsers(selected ? mockUsers.map(user => user.id) : []);
  };

  const stats = {
    totalUsers: mockUsers.length,
    activeUsers: mockUsers.filter(u => u.status === 'Active').length,
    totalRoles: mockRoles.length,
    roleAssignments: mockUsers.reduce((sum, user) => sum + user.roles.length, 0)
  };

  return (
    <div className="space-y-6">
      <UserStats {...stats} />

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as 'users' | 'roles')}
        />
        <ActionButtonGroup buttons={actionButtons} />
      </div>

      <SearchFilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder={`Search ${activeTab}...`}
        onFilterClick={() => console.log('Filter clicked')}
      >
        {selectedUsers.length > 0 && activeTab === 'users' && (
          <div className="flex items-center space-x-2 pl-4 border-l border-slate-200">
            <span className="text-sm text-slate-600 font-medium">
              {selectedUsers.length} selected
            </span>
            <button className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors">
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </button>
            <button className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors">
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </button>
          </div>
        )}
      </SearchFilterBar>

      {activeTab === 'users' ? (
        <UsersTable
          users={mockUsers}
          selectedUsers={selectedUsers}
          onUserSelect={handleUserSelect}
          onSelectAll={handleSelectAll}
        />
      ) : (
        <RolesGrid roles={mockRoles} />
      )}
    </div>
  );
}