'use client';

import { useState, useCallback } from 'react';
import { fieldsData } from '@/components/fields/fieldsData';
import type { FieldType, CreateFieldTypeDto, UpdateFieldTypeDto } from '@/shared/types';

export function useFieldTypes() {
  const [types, setTypes] = useState<FieldType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTypes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fieldsData.getFieldTypes();
      setTypes(res.types);
    } catch (err: any) {
      console.error('Error fetching field types:', err);
      setError('Failed to fetch field types');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createType = useCallback(async (data: CreateFieldTypeDto) => {
    try {
      setIsLoading(true);
      setError(null);
      const newType: FieldType = {
        id: crypto.randomUUID(),
        ...data,
      };
      setTypes((prev) => [...prev, newType]);
      return true;
    } catch (err: any) {
      console.error('Error creating field type:', err);
      setError('Failed to create field type');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateType = useCallback(async (id: string, data: UpdateFieldTypeDto) => {
    try {
      setIsLoading(true);
      setError(null);
      setTypes((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data } : t))
      );
      return true;
    } catch (err: any) {
      console.error('Error updating field type:', err);
      setError('Failed to update field type');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteType = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setTypes((prev) => prev.filter((t) => t.id !== id));
      return true;
    } catch (err: any) {
      console.error('Error deleting field type:', err);
      setError('Failed to delete field type');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    types,
    isLoading,
    error,
    fetchTypes,
    createType,
    updateType,
    deleteType,
    clearError,
  };
}
