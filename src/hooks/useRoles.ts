// hooks/useRoles.ts
'use client';

import { useState, useCallback } from 'react';
import type { Role, CreateRoleDto, UpdateRoleDto, ApiResponse, PaginatedRoles } from '@/shared/types';

interface UseRolesResult {
  roles: Role[];
  isLoading: boolean;
  error: string | null;
  createRole: (data: CreateRoleDto) => Promise<boolean>;
  updateRole: (id: string, data: UpdateRoleDto) => Promise<boolean>;
  deleteRole: (id: string) => Promise<boolean>;
  fetchRoles: () => Promise<void>;
  clearError: () => void;
}

export function useRoles(): UseRolesResult {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/roles');
      const result: ApiResponse<PaginatedRoles> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch roles');
      }
      
      setRoles(result.data?.items || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch roles';
      setError(errorMessage);
      console.error('Fetch roles error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRole = useCallback(async (data: CreateRoleDto): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result: ApiResponse<Role> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create role');
      }
      
      // Add new role to the list
      if (result.data) {
        setRoles(prev => [...prev, result.data!]);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create role';
      setError(errorMessage);
      console.error('Create role error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRole = useCallback(async (id: string, data: UpdateRoleDto): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/roles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result: ApiResponse<Role> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update role');
      }
      
      // Update role in the list
      if (result.data) {
        setRoles(prev => prev.map(role => 
          role.id === id ? result.data! : role
        ));
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update role';
      setError(errorMessage);
      console.error('Update role error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteRole = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/roles/${id}`, {
        method: 'DELETE',
      });
      
      const result: ApiResponse<{ message: string }> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete role');
      }
      
      // Remove role from the list
      setRoles(prev => prev.filter(role => role.id !== id));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete role';
      setError(errorMessage);
      console.error('Delete role error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    roles,
    isLoading,
    error,
    createRole,
    updateRole,
    deleteRole,
    fetchRoles,
    clearError,
  };
}