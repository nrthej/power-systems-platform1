'use client';

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Edit, Trash2, MoreHorizontal, Database, ChevronRight, Tag, GitBranch, Eye, Search, Filter, Grid3X3, List } from 'lucide-react';
import { ErrorAlert, SuccessAlert } from '@/components/ui/Alert';
import { FieldModal } from './FieldModal';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { useFields } from '@/hooks/useFields';
import type { Field } from '@/shared/types';
import { motion, AnimatePresence } from 'framer-motion';

interface FieldsListProps {
  searchTerm?: string;
}

export interface FieldsListRef {
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
    case 'Text': return '📝';
    case 'Number': return '🔢';
    case 'Date': return '📅';
    case 'Boolean': return '✅';
    case 'Select': return '📋';
    case 'Multi-Select': return '🏷️';
    default: return '📄';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Text': return 'bg-blue-100 text-blue-800';
    case 'Number': return 'bg-green-100 text-green-800';
    case 'Date': return 'bg-purple-100 text-purple-800';
    case 'Boolean': return 'bg-orange-100 text-orange-800';
    case 'Select': return 'bg-indigo-100 text-indigo-800';
    case 'Multi-Select': return 'bg-pink-100 text-pink-800';
    default: return 'bg-slate-100 text-slate-800';
  }
};

export const FieldsList = forwardRef<FieldsListRef, FieldsListProps>(
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
    const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');
    const [sortBy, setSortBy] = useState<'name' | 'type' | 'status'>('name');
    const [filterBy, setFilterBy] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [groupBy, setGroupBy] = useState<'none' | 'type' | 'status'>('none');

    const itemsPerPage = 50;

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

    // Filter and sort fields
    const filteredFields = fields.filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           f.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (f.description && f.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'active' && f.status === 'Active') ||
                           (filterBy === 'inactive' && f.status === 'Inactive') ||
                           (filterBy === 'hasRules' && f.rules && f.rules.length > 0) ||
                           (filterBy === 'hasValues' && f.values && f.values.length > 0) ||
                           f.type === filterBy;
      
      return matchesSearch && matchesFilter;
    });

    // Sort fields
    const sortedFields = [...filteredFields].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    // Group fields
    const groupedFields = groupBy === 'none' ? 
      { 'All Fields': sortedFields } :
      sortedFields.reduce((groups, field) => {
        const key = groupBy === 'type' ? field.type : field.status;
        if (!groups[key]) groups[key] = [];
        groups[key].push(field);
        return groups;
      }, {} as Record<string, Field[]>);

    // Pagination
    const totalItems = sortedFields.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

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
        setSelectedField(null);
        if (detailField?.id === selectedField.id) setDetailField(null);
      }
    };

    const getChildren = (parentName: string) =>
      fields.filter((f) => f.parent === parentName);

    const clearSuccessMessage = () => setSuccessMessage(null);

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
      <div className="space-y-6">
        {successMessage && (
          <SuccessAlert message={successMessage} closable onClose={clearSuccessMessage} />
        )}
        {error && <ErrorAlert message={error} closable onClose={clearError} />}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-700">View:</span>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'compact' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="Compact view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'detailed' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="Detailed view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50"
            >
              <option value="name">Sort by Name</option>
              <option value="type">Sort by Type</option>
              <option value="status">Sort by Status</option>
            </select>

            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as any)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50"
            >
              <option value="none">No Grouping</option>
              <option value="type">Group by Type</option>
              <option value="status">Group by Status</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50"
            >
              <option value="all">All Fields</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="hasRules">With Rules</option>
              <option value="hasValues">With Values</option>
              <option value="Text">Text Fields</option>
              <option value="Number">Number Fields</option>
              <option value="Date">Date Fields</option>
              <option value="Boolean">Boolean Fields</option>
              <option value="Select">Select Fields</option>
              <option value="Multi-Select">Multi-Select Fields</option>
            </select>
            
            <span className="text-sm text-slate-600">
              {totalItems} field{totalItems !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Fields List */}
        {totalItems === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Database className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              {searchTerm || filterBy !== 'all' ? 'No fields match your criteria' : 'No fields found'}
            </h3>
            <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
              {searchTerm || filterBy !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Create your first field to start organizing project data.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedFields).map(([groupName, groupFields]) => (
              <div key={groupName} className="space-y-4">
                {groupBy !== 'none' && (
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-slate-900">{groupName}</h3>
                    <span className="text-sm text-slate-500">({groupFields.length})</span>
                  </div>
                )}

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  {viewMode === 'compact' ? (
                    // Compact List View
                    <div className="divide-y divide-slate-100">
                      {(groupBy === 'none' ? groupFields.slice(startIndex, endIndex) : groupFields).map((field, index) => (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.02 }}
                          className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group cursor-pointer"
                          onClick={() => setDetailField(field)}
                        >
                          <div className="flex items-center space-x-4 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              <span className="text-lg">{getTypeIcon(field.type)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3">
                                <h4 className="font-medium text-slate-900 truncate">{field.name}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(field.type)}`}>
                                  {field.type}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusColor(field.status)}`}>
                                  {field.status}
                                </span>
                              </div>
                              <p className="text-sm text-slate-500 truncate mt-1">
                                {field.description || 'No description'}
                              </p>
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-slate-500">
                              {field.parent && (
                                <div className="flex items-center space-x-1">
                                  <ChevronRight className="w-3 h-3" />
                                  <span>{field.parent}</span>
                                </div>
                              )}
                              {field.values && (
                                <div className="flex items-center space-x-1">
                                  <Tag className="w-3 h-3" />
                                  <span>{field.values.length}</span>
                                </div>
                              )}
                              {field.rules && field.rules.length > 0 && (
                                <div className="flex items-center space-x-1">
                                  <GitBranch className="w-3 h-3" />
                                  <span>{field.rules.length}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditField(field);
                              }}
                              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                              title="Edit field"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteField(field);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                              title="Delete field"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    // Detailed Grid View
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                      {(groupBy === 'none' ? groupFields.slice(startIndex, endIndex) : groupFields).map((field, index) => (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all group cursor-pointer"
                          onClick={() => setDetailField(field)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${getTypeColor(field.type)}`}>
                                {getTypeIcon(field.type)}
                              </div>
                              <div>
                                <h4 className="font-medium text-slate-900">{field.name}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(field.type)}`}>
                                  {field.type}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditField(field);
                                }}
                                className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteField(field);
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                            {field.description || 'No description provided'}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusColor(field.status)}`}>
                              {field.status}
                            </span>
                            <div className="flex items-center space-x-2 text-xs text-slate-500">
                              {field.values && (
                                <div className="flex items-center space-x-1">
                                  <Tag className="w-3 h-3" />
                                  <span>{field.values.length}</span>
                                </div>
                              )}
                              {field.rules && field.rules.length > 0 && (
                                <div className="flex items-center space-x-1">
                                  <GitBranch className="w-3 h-3" />
                                  <span>{field.rules.length}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {groupBy === 'none' && totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4">
            <span className="text-sm text-slate-600">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} fields
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Previous
              </button>
              <span className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Detail Panel (same as before) */}
        <AnimatePresence>
          {detailField && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black z-40"
                onClick={() => setDetailField(null)}
              />

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
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content - same as previous detail panel */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6 space-y-8">
                    {detailField.description && (
                      <div className="bg-slate-50 rounded-xl p-4">
                        <h3 className="text-sm font-medium text-slate-700 mb-2">Description</h3>
                        <p className="text-slate-600 leading-relaxed">{detailField.description}</p>
                      </div>
                    )}

                    {detailField.parent && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-700 mb-3">Parent Field</h3>
                        <div className="flex items-center space-x-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <ChevronRight className="w-4 h-4 text-amber-600" />
                          <span className="font-medium text-amber-800">{detailField.parent}</span>
                        </div>
                      </div>
                    )}

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

        {/* Modals */}
        <FieldModal
          isOpen={isFieldModalOpen}
          onClose={() => {
            setIsFieldModalOpen(false);
            setSelectedField(null);
            clearError();
          }}
          onSubmit={handleFieldSubmit}
          field={selectedField}
          isLoading={isLoading}
          error={error}
          availableFields={fields}
        />

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedField(null);
            clearError();
          }}
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
    );
  }
);

FieldsList.displayName = 'FieldsList';