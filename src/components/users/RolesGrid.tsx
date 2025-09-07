'use client';

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Shield, Edit, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import { ErrorAlert, SuccessAlert } from '@/components/ui/Alert';
import { RoleModal } from './RoleModal';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { useRoles } from '@/hooks/useRoles';
import type { Role } from '@/shared/types';

interface RolesGridProps {
  searchTerm?: string; // Passed from parent search
}

export interface RolesGridRef {
  openAddModal: () => void;
  refreshRoles: () => void;
}

export const RolesGrid = forwardRef<RolesGridRef, RolesGridProps>(({ searchTerm = '' }, ref) => {
  const { 
    roles, 
    isLoading, 
    error, 
    createRole, 
    updateRole, 
    deleteRole, 
    fetchRoles, 
    clearError 
  } = useRoles();

  // Modal states
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    openAddModal: () => {
      setSelectedRole(null);
      setIsRoleModalOpen(true);
    },
    refreshRoles: fetchRoles
  }));

  // Fetch roles on component mount
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Filter roles based on search term from parent
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsRoleModalOpen(true);
  };

  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleRoleSubmit = async (data: any) => {
    const isEditing = !!selectedRole;
    
    const success = isEditing 
      ? await updateRole(selectedRole!.id, data)
      : await createRole(data);
    
    if (success) {
      setSuccessMessage(
        isEditing 
          ? 'Role updated successfully!' 
          : 'Role created successfully!'
      );
      setIsRoleModalOpen(false);
      setSelectedRole(null);
    }
    
    return success;
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRole) return;
    
    const success = await deleteRole(selectedRole.id);
    
    if (success) {
      setSuccessMessage('Role deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedRole(null);
    }
  };

  const handleCloseRoleModal = () => {
    setIsRoleModalOpen(false);
    setSelectedRole(null);
    clearError();
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedRole(null);
    clearError();
  };

  const clearSuccessMessage = () => {
    setSuccessMessage(null);
  };

  // Loading State
  if (isLoading && roles.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-600">Loading roles...</span>
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
      {filteredRoles.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {searchTerm ? 'No roles match your search' : 'No roles found'}
          </h3>
          <p className="text-slate-600">
            {searchTerm 
              ? 'Try adjusting your search criteria.'
              : 'Get started by creating your first role.'
            }
          </p>
        </div>
      )}

      {/* Roles Grid */}
      {filteredRoles.length > 0 && (
        <Grid cols={3} gap={4}>
          {filteredRoles.map((role) => (
            <Card key={role.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{role.name}</h3>
                    <p className="text-xs text-slate-600">System role</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => handleEditRole(role)}
                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors rounded"
                    title="Edit role"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteRole(role)}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded"
                    title="Delete role"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-slate-600 text-xs mb-3">
                {role.description || 'No description provided'}
              </p>
              
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-700 uppercase tracking-wide">
                  Color Theme
                </p>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${role.color}`}>
                    {role.name}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </Grid>
      )}

      {/* Role Modal */}
      <RoleModal
        isOpen={isRoleModalOpen}
        onClose={handleCloseRoleModal}
        onSubmit={handleRoleSubmit}
        role={selectedRole}
        isLoading={isLoading}
        error={error}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Delete Role"
        message={`Are you sure you want to delete the "${selectedRole?.name}" role? This action cannot be undone and will fail if users are assigned to this role.`}
        confirmLabel="Delete Role"
        cancelLabel="Cancel"
        isLoading={isLoading}
        error={error}
        variant="danger"
      />
    </div>
  );
});