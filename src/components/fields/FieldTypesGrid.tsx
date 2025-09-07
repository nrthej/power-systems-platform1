'use client';

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { ListChecks, Edit, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import { ErrorAlert, SuccessAlert } from '@/components/ui/Alert';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { useFieldTypes } from '@/hooks/useFieldTypes';
import type { FieldType } from '@/shared/types';

interface FieldTypesGridProps {
  searchTerm?: string;
}

export interface FieldTypesGridRef {
  openAddModal: () => void;
  refreshTypes: () => void;
}

export const FieldTypesGrid = forwardRef<FieldTypesGridRef, FieldTypesGridProps>(
  ({ searchTerm = '' }, ref) => {
    const {
      types,
      isLoading,
      error,
      createType,
      updateType,
      deleteType,
      fetchTypes,
      clearError
    } = useFieldTypes();

    // Modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<FieldType | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      openAddModal: () => {
        console.log('Open Add Type Modal (to be implemented)');
      },
      refreshTypes: fetchTypes
    }));

    useEffect(() => {
      fetchTypes();
    }, [fetchTypes]);

    useEffect(() => {
      if (successMessage) {
        const timer = setTimeout(() => setSuccessMessage(null), 3000);
        return () => clearTimeout(timer);
      }
    }, [successMessage]);

    const filteredTypes = types.filter(
      (t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDeleteType = (type: FieldType) => {
      setSelectedType(type);
      setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
      if (!selectedType) return;
      const success = await deleteType(selectedType.id);
      if (success) {
        setSuccessMessage('Field type deleted successfully!');
        setIsDeleteModalOpen(false);
        setSelectedType(null);
      }
    };

    const handleCloseDeleteModal = () => {
      setIsDeleteModalOpen(false);
      setSelectedType(null);
      clearError();
    };

    const clearSuccessMessage = () => setSuccessMessage(null);

    // Loading state
    if (isLoading && types.length === 0) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-600">Loading field types...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Alerts */}
        {successMessage && (
          <SuccessAlert message={successMessage} closable onClose={clearSuccessMessage} />
        )}
        {error && <ErrorAlert message={error} closable onClose={clearError} />}

        {/* Empty State */}
        {filteredTypes.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ListChecks className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {searchTerm ? 'No field types match your search' : 'No field types found'}
            </h3>
            <p className="text-slate-600">
              {searchTerm
                ? 'Try adjusting your search criteria.'
                : 'Default field types are available, or add custom ones.'}
            </p>
          </div>
        )}

        {/* Grid */}
        {filteredTypes.length > 0 && (
          <Grid cols={3} gap={4}>
            {filteredTypes.map((type) => (
              <Card
                key={type.id}
                className="p-6 hover:shadow-lg transition-shadow relative"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                      <ListChecks className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{type.name}</h3>
                      <p className="text-xs text-slate-600">Field type</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      className="p-1 text-slate-400 hover:text-blue-600 transition-colors rounded"
                      title="Edit type"
                      onClick={() => console.log('Open Edit Type Modal')}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded"
                      title="Delete type"
                      onClick={() => handleDeleteType(type)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-slate-600 text-xs mb-3">
                  {type.description || 'No description provided'}
                </p>
              </Card>
            ))}
          </Grid>
        )}

        {/* Delete Confirmation */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteConfirm}
          title="Delete Field Type"
          message={`Are you sure you want to delete the "${selectedType?.name}" type? This action cannot be undone.`}
          confirmLabel="Delete Type"
          cancelLabel="Cancel"
          isLoading={isLoading}
          error={error}
          variant="danger"
        />
      </div>
    );
  }
);
