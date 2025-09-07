// hooks/useFieldTypes.ts
'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type { 
  FieldType, 
  CreateFieldTypeDto, 
  UpdateFieldTypeDto,
} from '@/shared/types';

export function useFieldTypes() {
  const [types, setTypes] = useState<FieldType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTypes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.getFieldTypes();
      setTypes(response);
      return response;
    } catch (err: any) {
      console.error('Error fetching field types:', err);
      const errorMessage = err.message || 'Failed to fetch field types';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createType = useCallback(async (data: CreateFieldTypeDto): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.createFieldType(data);

      // Add the new field type to the local state
      setTypes(prev => [...prev, response]);
      return true;
    } catch (err: any) {
      console.error('Error creating field type:', err);
      const errorMessage = err.message || 'Failed to create field type';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateType = useCallback(async (id: string, data: UpdateFieldTypeDto): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.updateFieldType(id, data);

      // Update the field type in local state
      setTypes(prev => 
        prev.map(type => 
          type.id === id ? response : type
        )
      );
      return true;
    } catch (err: any) {
      console.error('Error updating field type:', err);
      const errorMessage = err.message || 'Failed to update field type';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteType = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      await apiClient.deleteFieldType(id);

      // Remove the field type from local state
      setTypes(prev => prev.filter(type => type.id !== id));
      return true;
    } catch (err: any) {
      console.error('Error deleting field type:', err);
      const errorMessage = err.message || 'Failed to delete field type';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const refetch = useCallback(() => {
    return fetchTypes();
  }, [fetchTypes]);

  return {
    types,
    isLoading,
    error,
    fetchTypes,
    createType,
    updateType,
    deleteType,
    clearError,
    refetch
  };
}