'use client';

import { useState, useCallback } from 'react';
import { fieldsData } from '@/components/fields/fieldsData';
import type { Field, CreateFieldDto, UpdateFieldDto } from '@/shared/types';

export function useFields() {
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFields = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fieldsData.getFields({ limit: 100 });
      setFields(res.fields);
    } catch (err: any) {
      console.error('Error fetching fields:', err);
      setError('Failed to fetch fields');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createField = useCallback(async (data: CreateFieldDto) => {
    try {
      setIsLoading(true);
      setError(null);
      const newField: Field = {
        id: crypto.randomUUID(),
        status: 'Active',
        rules: [],
        ...data,
      };
      setFields((prev) => [...prev, newField]);
      return true;
    } catch (err: any) {
      console.error('Error creating field:', err);
      setError('Failed to create field');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateField = useCallback(async (id: string, data: UpdateFieldDto) => {
    try {
      setIsLoading(true);
      setError(null);
      setFields((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...data } : f))
      );
      return true;
    } catch (err: any) {
      console.error('Error updating field:', err);
      setError('Failed to update field');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteField = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setFields((prev) => prev.filter((f) => f.id !== id));
      return true;
    } catch (err: any) {
      console.error('Error deleting field:', err);
      setError('Failed to delete field');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    fields,
    isLoading,
    error,
    fetchFields,
    createField,
    updateField,
    deleteField,
    clearError,
  };
}
