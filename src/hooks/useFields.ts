// hooks/useFields.ts
'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type { 
  Field, 
  CreateFieldDto, 
  UpdateFieldDto, 
  FieldPaginationParams,
  PaginatedFields,
} from '@/shared/types';

export function useFields() {
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFields = useCallback(async (params: FieldPaginationParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.getFields(params);
      setFields(response.items);
      return response;
    } catch (err: any) {
      console.error('Error fetching fields:', err);
      const errorMessage = err.message || 'Failed to fetch fields';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFieldById = useCallback(async (id: string): Promise<Field> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.getField(id);
      return response;
    } catch (err: any) {
      console.error('Error fetching field:', err);
      const errorMessage = err.message || 'Failed to fetch field';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createField = useCallback(async (data: CreateFieldDto): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.createField(data);
      
      // Add the new field to the local state
      setFields(prev => [...prev, response]);
      return true;
    } catch (err: any) {
      console.error('Error creating field:', err);
      const errorMessage = err.message || 'Failed to create field';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateField = useCallback(async (id: string, data: UpdateFieldDto): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.updateField(id, data);

      // Update the field in local state
      setFields(prev => 
        prev.map(field => 
          field.id === id ? response : field
        )
      );
      return true;
    } catch (err: any) {
      console.error('Error updating field:', err);
      const errorMessage = err.message || 'Failed to update field';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteField = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      await apiClient.deleteField(id);

      // Remove the field from local state
      setFields(prev => prev.filter(field => field.id !== id));
      return true;
    } catch (err: any) {
      console.error('Error deleting field:', err);
      const errorMessage = err.message || 'Failed to delete field';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const bulkCreateFields = useCallback(async (fieldsData: CreateFieldDto[]): Promise<{ success: boolean; created: number; total: number; fields: Field[] }> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.bulkCreateFields({ fields: fieldsData });

      // Add the new fields to local state
      const newFields = response.fields;
      setFields(prev => [...prev, ...newFields]);
      
      return {
        success: true,
        created: response.created,
        total: response.total,
        fields: newFields
      };
    } catch (err: any) {
      console.error('Error bulk creating fields:', err);
      const errorMessage = err.message || 'Failed to create fields';
      setError(errorMessage);
      return { success: false, created: 0, total: fieldsData.length, fields: [] };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const refetch = useCallback(() => {
    return fetchFields();
  }, [fetchFields]);

  return {
    fields,
    isLoading,
    error,
    fetchFields,
    getFieldById,
    createField,
    updateField,
    deleteField,
    bulkCreateFields,
    clearError,
    refetch
  };
}