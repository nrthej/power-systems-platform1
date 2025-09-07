'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Upload, Download, Edit, Trash2 } from 'lucide-react';
import { TabNavigation } from '@/components/ui/TabNavigation';
import { ActionButtonGroup } from '@/components/ui/ActionButtonGroup';
import { SearchFilterBar } from '@/components/ui/SearchFilterBar';
import { UserStats } from './UserStats';
import { UsersTable, type UsersTableRef } from './Userstable'; // Use Userstable.tsx (with built-in UserModal)
import { RolesGrid, type RolesGridRef } from './RolesGrid';
import { usersData, rolesData, type User, type Role } from './userData';

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // State for real data
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs for both components so we can trigger Add modals
  const rolesGridRef = useRef<RolesGridRef>(null);
  const usersTableRef = useRef<UsersTableRef>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersResponse, rolesResponse] = await Promise.all([
        usersData.getUsers({ limit: 100 }),
        rolesData.getRoles({ limit: 100 })
      ]);
      setUsers(usersResponse.users);
      setRoles(rolesResponse.roles);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'users', label: 'Users', count: users.length },
    { id: 'roles', label: 'Roles', count: roles.length }
  ];

  const actionButtons = [
    {
      id: 'refresh',
      label: 'Refresh',
      icon: <Download className="w-4 h-4" />,
      variant: 'secondary' as const,
      onClick: () => {
        if (activeTab === 'users') {
          usersTableRef.current?.refreshUsers();
        } else {
          rolesGridRef.current?.refreshRoles();
        }
        loadData(); // Also refresh local data
      }
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
      onClick: () => {
        if (activeTab === 'roles') {
          rolesGridRef.current?.openAddModal();
        } else {
          usersTableRef.current?.openAddModal();
        }
      }
    }
  ];

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedUsers(selected ? users.map(user => user.id) : []);
  };

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'ACTIVE').length,
    totalRoles: roles.length,
    roleAssignments: users.reduce((sum, user) => sum + user.roles.length, 0)
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-600">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-100 border border-red-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-700">{error}</p>
            <button
              onClick={loadData}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          ref={usersTableRef}
          searchTerm={searchTerm}
        />
      ) : (
        <RolesGrid 
          ref={rolesGridRef} 
          searchTerm={searchTerm} 
        />
      )}
    </div>
  );
}