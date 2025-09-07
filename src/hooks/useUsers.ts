// hooks/useUsers.ts
'use client';

import { useState, useCallback } from 'react';
import type { User, CreateUserDto, UpdateUserDto, ApiResponse, PaginatedUsers } from '@/shared/types';

interface UseUsersResult {
  users: User[];
  isLoading: boolean;
  error: string | null;
  createUser: (data: CreateUserDto) => Promise<boolean>;
  updateUser: (id: string, data: UpdateUserDto) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  fetchUsers: () => Promise<void>;
  clearError: () => void;
}

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/users');
      const result: ApiResponse<PaginatedUsers> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch users');
      }
      
      setUsers(result.data?.items || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      console.error('Fetch users error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = useCallback(async (data: CreateUserDto): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result: ApiResponse<User> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create user');
      }
      
      // Add new user to the list
      if (result.data) {
        setUsers(prev => [...prev, result.data!]);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      console.error('Create user error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, data: UpdateUserDto): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result: ApiResponse<User> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update user');
      }
      
      // Update user in the list
      if (result.data) {
        setUsers(prev => prev.map(user => 
          user.id === id ? result.data! : user
        ));
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
      console.error('Update user error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      
      const result: ApiResponse<{ message: string }> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete user');
      }
      
      // Remove user from the list
      setUsers(prev => prev.filter(user => user.id !== id));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
      console.error('Delete user error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    fetchUsers,
    clearError,
  };
}