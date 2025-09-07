'use client';

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Edit, Trash2, MoreHorizontal, Database, X, ChevronRight, Tag, GitBranch, Eye } from 'lucide-react';
import { ErrorAlert, SuccessAlert } from '@/components/ui/Alert';
import { FieldModal } from './FieldModal';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { useFields } from '@/hooks/useFields';
import type { Field } from '@/shared/types';
import { motion, AnimatePresence } from 'framer-motion';

interface FieldsTableProps {
  searchTerm?: string;
}

export interface FieldsTableRef {
  openAddModal: () => void;
  refreshFields: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Inactive':
      return 'bg-slate-50 text-slate-700 border-slate-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Text':
      return '📝';
    case 'Number':
      return '🔢';
    case 'Date':
      return '📅';
    case 'Boolean':
      return '✅';
    case 'Select':
      return '📋';
    case 'Multi-Select':
      return '🏷️';
    default:
      return '📄';
  }
};

export const FieldsTable = forwardRef<FieldsTableRef, FieldsTableProps>(
  ({ searchTerm = '' }, ref) => {
    const {
      fields,
      isLoading,
      error,
      createField,
      updateField,
      deleteField,
      fetchFields,
      clearError,
    } = useFields();

    const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedField, setSelectedField] = useState<Field | null>(null);
    const [detailField, setDetailField] = useState<Field | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      openAddModal: () => {
        setSelectedField(null);
        setIsFieldModalOpen(true);
      },
      refreshFields: fetchFields,
    }));

    useEffect(() => {
      fetchFields();
    }, [fetchFields]);

    useEffect(() => {
      if (successMessage) {
        const timer = setTimeout(() => setSuccessMessage(null), 3000);
        return () => clearTimeout(timer);
      }
    }, [successMessage]);

    const filteredFields = fields.filter(
      (f) =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditField = (field: Field) => {
      setSelectedField(field);
      setIsFieldModalOpen(true);
    };

    const handleDeleteField = (field: Field) => {
      setSelectedField(field);
      setIsDeleteModalOpen(true);
    };

    const handleFieldSubmit = async (data: any) => {
      const isEditing = !!selectedField;
      const success = isEditing
        ? await updateField(selectedField!.id, data)
        : await createField(data);

      if (success) {
        setSuccessMessage(
          isEditing ? 'Field updated successfully!' : 'Field created successfully!'
        );
        setIsFieldModalOpen(false);
        setSelectedField(null);
      }

      return success;
    };

    const handleDeleteConfirm = async () => {
      if (!selectedField) return;
      const success = await deleteField(selectedField.id);
      if (success) {
        setSuccessMessage('Field deleted successfully!');
        setIsDeleteModalOpen(false);
        if (detailField?.id === selectedField.id) setDetailField(null);
        setSelectedField(null);
      }
    };

    const handleCloseFieldModal = () => {
      setIsFieldModalOpen(false);
      setSelectedField(null);
      clearError();
    };

    const handleCloseDeleteModal = () => {
      setIsDeleteModalOpen(false);
      setSelectedField(null);
      clearError();
    };

    const clearSuccessMessage = () => setSuccessMessage(null);

    const getChildren = (parentName: string) =>
      fields.filter((f) => f.parent === parentName);

    // Loading
    if (isLoading && fields.length === 0) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-600 font-medium">Loading fields...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex space-x-6">
        {/* Table Section */}
        <div className="flex-1 space-y-6">
          {successMessage && (
            <SuccessAlert message={successMessage} closable onClose={clearSuccessMessage} />
          )}
          {error && <ErrorAlert message={error} closable onClose={clearError} />}

          {filteredFields.length === 0 && !error && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Database className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {searchTerm ? 'No fields match your search' : 'No fields found'}
              </h3>
              <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                {searchTerm
                  ? 'Try adjusting your search criteria or explore all available fields.'
                  : 'Create your first field to start organizing project data with structured information.'}
              </p>
            </div>
          )}

          {filteredFields.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Field Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Parent
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredFields.map((field, index) => (
                      <motion.tr
                        key={field.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-slate-50 cursor-pointer transition-colors group"
                        onClick={() => setDetailField(field)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm">
                              {getTypeIcon(field.type)}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{field.name}</div>
                              {field.description && (
                                <div className="text-sm text-slate-500 truncate max-w-xs">
                                  {field.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {field.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {field.parent ? (
                            <div className="flex items-center text-sm text-slate-600">
                              <ChevronRight className="w-4 h-4 mr-1 text-slate-400" />
                              {field.parent}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(field.status)}`}>
                            {field.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDetailField(field);
                              }}
                              className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditField(field);
                              }}
                              className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100"
                              title="Edit field"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteField(field);
                              }}
                              className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                              title="Delete field"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Field Modal */}
          <FieldModal
            isOpen={isFieldModalOpen}
            onClose={handleCloseFieldModal}
            onSubmit={handleFieldSubmit}
            field={selectedField}
            isLoading={isLoading}
            error={error}
            availableFields={fields}
          />

          {/* Delete Confirmation */}
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleDeleteConfirm}
            title="Delete Field"
            message={`Are you sure you want to delete "${selectedField?.name}"?`}
            confirmLabel="Delete Field"
            cancelLabel="Cancel"
            isLoading={isLoading}
            error={error}
            variant="danger"
          />
        </div>

        {/* Enhanced Detail Drawer */}
        <AnimatePresence>
          {detailField && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black z-40"
                onClick={() => setDetailField(null)}
              />

              {/* Drawer */}
              <motion.aside
                key="drawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="fixed top-0 right-0 h-screen w-[32rem] bg-white shadow-2xl z-50 flex flex-col"
                role="dialog"
                aria-modal="true"
                aria-label={`${detailField.name} details`}
                tabIndex={-1}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setDetailField(null);
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white text-lg">
                      {getTypeIcon(detailField.type)}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {detailField.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                          {detailField.type}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getStatusColor(detailField.status)}`}
                        >
                          {detailField.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditField(detailField)}
                      className="p-2.5 text-slate-500 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all"
                      title="Edit field"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteField(detailField)}
                      className="p-2.5 text-slate-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all"
                      title="Delete field"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setDetailField(null)}
                      className="p-2.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all"
                      title="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6 space-y-8">
                    {/* Description */}
                    {detailField.description && (
                      <div className="bg-slate-50 rounded-xl p-4">
                        <h3 className="text-sm font-medium text-slate-700 mb-2">Description</h3>
                        <p className="text-slate-600 leading-relaxed">{detailField.description}</p>
                      </div>
                    )}

                    {/* Parent */}
                    {detailField.parent && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-700 mb-3">Parent Field</h3>
                        <div className="flex items-center space-x-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <ChevronRight className="w-4 h-4 text-amber-600" />
                          <span className="font-medium text-amber-800">{detailField.parent}</span>
                        </div>
                      </div>
                    )}

                    {/* Children */}
                    {getChildren(detailField.name).length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-700 mb-3">Child Fields</h3>
                        <div className="space-y-2">
                          {getChildren(detailField.name).map((child) => (
                            <div
                              key={child.id}
                              className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center text-xs">
                                  {getTypeIcon(child.type)}
                                </div>
                                <span className="font-medium text-green-800">{child.name}</span>
                              </div>
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                {child.type}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Values */}
                    {detailField.values && detailField.values.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
                          <Tag className="w-4 h-4 mr-2" />
                          Permissible Values
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {detailField.values.map((value, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg border border-blue-200"
                            >
                              {value}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rules */}
                    {detailField.rules && detailField.rules.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
                          <GitBranch className="w-4 h-4 mr-2" />
                          Business Rules
                        </h3>
                        <div className="space-y-3">
                          {detailField.rules.map((rule) => (
                            <div
                              key={rule.id}
                              className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg"
                            >
                              <div className="text-sm text-slate-700">
                                <span className="font-medium">IF</span>{' '}
                                <span className="px-2 py-1 bg-white rounded border text-purple-700 font-medium">
                                  {rule.conditionField}
                                </span>{' '}
                                <span className="font-medium">{rule.operator}</span>{' '}
                                <span className="px-2 py-1 bg-white rounded border text-purple-700 font-medium">
                                  {rule.value}
                                </span>
                              </div>
                              <div className="mt-2 text-sm text-slate-700">
                                <span className="font-medium">THEN</span>{' '}
                                <span className="px-2 py-1 bg-white rounded border text-indigo-700 font-medium">
                                  {rule.action}
                                </span>{' '}
                                <span className="px-2 py-1 bg-white rounded border text-indigo-700 font-medium">
                                  {rule.targetField}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FieldsTable.displayName = 'FieldsTable';