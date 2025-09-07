'use client';

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Edit, Trash2, Users, MoreHorizontal } from 'lucide-react';
import { ErrorAlert, SuccessAlert } from '@/components/ui/Alert';
import { UserModal } from './UserModal';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { useUsers } from '@/hooks/useUsers';
import { useRoles } from '@/hooks/useRoles';
import type { User, Role } from '@/shared/types';

interface UsersTableProps {
  searchTerm?: string; // Passed from parent search
}

export interface UsersTableRef {
  openAddModal: () => void;
  refreshUsers: () => void;
}

export const UsersTable = forwardRef<UsersTableRef, UsersTableProps>(({ searchTerm = '' }, ref) => {
  const { 
    users, 
    isLoading, 
    error, 
    createUser, 
    updateUser, 
    deleteUser, 
    fetchUsers, 
    clearError 
  } = useUsers();

  const { 
    roles, 
    fetchRoles 
  } = useRoles();

  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    openAddModal: () => {
      setSelectedUser(null);
      setIsUserModalOpen(true);
    },
    refreshUsers: fetchUsers
  }));

  // Fetch data on component mount
  useEffect(() => {
    fetchUsers();
    fetchRoles(); // Fetch roles for the user modal
  }, [fetchUsers, fetchRoles]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Filter users based on search term from parent
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.roles.some(role => role.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleUserSubmit = async (data: any) => {
    const isEditing = !!selectedUser;
    
    const success = isEditing 
      ? await updateUser(selectedUser!.id, data)
      : await createUser(data);
    
    if (success) {
      setSuccessMessage(
        isEditing 
          ? 'User updated successfully!' 
          : 'User created successfully!'
      );
      setIsUserModalOpen(false);
      setSelectedUser(null);
    }
    
    return success;
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    
    const success = await deleteUser(selectedUser.id);
    
    if (success) {
      setSuccessMessage('User deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUser(null);
    clearError();
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
    clearError();
  };

  const clearSuccessMessage = () => {
    setSuccessMessage(null);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      SUSPENDED: 'bg-red-100 text-red-800'
    };
    return statusColors[status as keyof typeof statusColors] || statusColors.INACTIVE;
  };

  const formatLastLogin = (lastLogin: Date | null) => {
    if (!lastLogin) return 'Never';
    return new Date(lastLogin).toLocaleDateString();
  };

  // Loading State
  if (isLoading && users.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-600">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <SuccessAlert 
          message={successMessage}
          closable={true}
          onClose={clearSuccessMessage}
        />
      )}

      {/* Error Message */}
      {error && (
        <ErrorAlert 
          message={error}
          closable={true}
          onClose={clearError}
        />
      )}

      {/* Empty State */}
      {filteredUsers.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {searchTerm ? 'No users match your search' : 'No users found'}
          </h3>
          <p className="text-slate-600">
            {searchTerm 
              ? 'Try adjusting your search criteria.'
              : 'Get started by creating your first user.'
            }
          </p>
        </div>
      )}

      {/* Users Table */}
      {filteredUsers.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      // Add bulk selection logic if needed
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Roles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        // Add individual selection logic if needed
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-slate-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <span
                            key={role.id}
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${role.color}`}
                          >
                            {role.name}
                          </span>
                        ))}
                        {user.roles.length === 0 && (
                          <span className="text-xs text-slate-500">No roles assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {formatLastLogin(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-1 text-slate-400 hover:text-blue-600 transition-colors rounded"
                          title="Edit user"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors rounded">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={handleCloseUserModal}
        onSubmit={handleUserSubmit}
        user={selectedUser}
        isLoading={isLoading}
        error={error}
        availableRoles={roles}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete "${selectedUser?.name}"? This action cannot be undone and will remove all associated data.`}
        confirmLabel="Delete User"
        cancelLabel="Cancel"
        isLoading={isLoading}
        error={error}
        variant="danger"
      />
    </div>
  );
});