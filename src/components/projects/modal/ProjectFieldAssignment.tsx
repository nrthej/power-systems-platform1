// components/projects/modal/ProjectFieldAssignment.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search,
  X,
  Database,
  Check,
  Filter,
  CheckSquare,
  Minus
} from 'lucide-react';

interface ProjectFieldAssignmentProps {
  assignedFields: string[];
  unassignedFields: string[];
  onMoveField: (fieldName: string, direction: 'assign' | 'unassign') => void;
  onMoveAllFields: (direction: 'assign' | 'unassign') => void;
  onMoveBulkFields: (fieldNames: string[], direction: 'assign' | 'unassign') => void;
  isLoading: boolean;
  mode?: 'add' | 'edit';
}

export function ProjectFieldAssignment({
  assignedFields = [],
  unassignedFields = [],
  onMoveField,
  onMoveAllFields,
  onMoveBulkFields,
  isLoading = false,
  mode = 'add'
}: ProjectFieldAssignmentProps) {
  
  console.log('🟦 ProjectFieldAssignment rendered:', { assignedFields, unassignedFields });

  // Simple state - no complex logic
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Safety checks and simple field processing
  const safeAssigned = Array.isArray(assignedFields) ? assignedFields : [];
  const safeUnassigned = Array.isArray(unassignedFields) ? unassignedFields : [];
  const allFieldNames = [...safeAssigned, ...safeUnassigned];

  // Simple filtering
  const filteredFields = useMemo(() => {
    if (!searchTerm) return allFieldNames;
    return allFieldNames.filter(field => 
      field.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allFieldNames, searchTerm]);

  // Simple handlers
  const handleFieldToggle = (fieldName: string) => {
    try {
      console.log('🔄 Toggling field:', fieldName);
      const isAssigned = safeAssigned.includes(fieldName);
      onMoveField(fieldName, isAssigned ? 'unassign' : 'assign');
    } catch (error) {
      console.error('❌ Error toggling field:', error);
    }
  };

  const handleSelectAll = () => {
    try {
      console.log('🔄 Select all clicked');
      const allSelected = filteredFields.every(field => safeAssigned.includes(field));
      
      if (allSelected) {
        // Unassign all
        const fieldsToUnassign = filteredFields.filter(field => safeAssigned.includes(field));
        if (fieldsToUnassign.length > 0) {
          onMoveBulkFields(fieldsToUnassign, 'unassign');
        }
      } else {
        // Assign all
        const fieldsToAssign = filteredFields.filter(field => !safeAssigned.includes(field));
        if (fieldsToAssign.length > 0) {
          onMoveBulkFields(fieldsToAssign, 'assign');
        }
      }
    } catch (error) {
      console.error('❌ Error in select all:', error);
    }
  };

  const selectedCount = safeAssigned.length;
  const totalCount = allFieldNames.length;

  // Safety fallback
  if (allFieldNames.length === 0) {
    return (
      <div className="p-6 text-center">
        <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">No fields available</h3>
        <p className="text-slate-600">Fields will appear here when loaded.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Field Assignment</h3>
            <p className="text-sm text-slate-600">
              Select fields to include in this project ({selectedCount} of {totalCount} selected)
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-lg border font-medium text-sm transition-all ${
              showFilters 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-4 h-4 inline mr-2" />
            Filters
          </button>
          
          <button
            type="button"
            onClick={handleSelectAll}
            disabled={isLoading}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium text-sm transition-all disabled:opacity-50"
          >
            {selectedCount === totalCount ? (
              <>
                <Minus className="w-4 h-4 inline mr-2" />
                Deselect All
              </>
            ) : (
              <>
                <Check className="w-4 h-4 inline mr-2" />
                Select All
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search fields..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
          className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-200 rounded"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        )}
      </div>

      {/* Simple Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        {/* Table Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
          <div className="grid grid-cols-12 gap-4 items-center text-xs font-medium text-slate-600 uppercase tracking-wider">
            <div className="col-span-1 flex items-center">
              <input
                type="checkbox"
                checked={selectedCount === totalCount && totalCount > 0}
                onChange={handleSelectAll}
                disabled={isLoading}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
              />
            </div>
            <div className="col-span-6">Field Name</div>
            <div className="col-span-3">Type</div>
            <div className="col-span-2">Status</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="max-h-96 overflow-y-auto">
          {filteredFields.length === 0 ? (
            <div className="text-center py-12">
              <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No fields found</h3>
              <p className="text-slate-600">
                {searchTerm ? 'Try adjusting your search criteria.' : 'No fields available.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredFields.map((fieldName) => {
                const isSelected = safeAssigned.includes(fieldName);
                const fieldType = fieldName.toLowerCase().includes('date') ? 'Date' : 
                                 fieldName.toLowerCase().includes('capacity') ? 'Number' : 'Text';
                
                return (
                  <div
                    key={fieldName}
                    className={`px-6 py-3 hover:bg-slate-50 transition-colors ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Checkbox */}
                      <div className="col-span-1 flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleFieldToggle(fieldName)}
                          disabled={isLoading}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </div>

                      {/* Field Name */}
                      <div className="col-span-6">
                        <span className={`text-sm ${
                          isSelected ? 'font-medium text-blue-900' : 'text-slate-900'
                        }`}>
                          {fieldName}
                        </span>
                      </div>

                      {/* Type */}
                      <div className="col-span-3">
                        <span className="text-sm text-slate-600 font-mono">
                          {fieldType}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="col-span-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          isSelected 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                          {isSelected ? 'Selected' : 'Available'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {selectedCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {selectedCount} field{selectedCount !== 1 ? 's' : ''} selected for this project
              </span>
            </div>
            <button
              type="button"
              onClick={() => onMoveAllFields('unassign')}
              disabled={isLoading || selectedCount === 0}
              className="text-sm text-blue-700 hover:text-blue-900 underline disabled:opacity-50"
            >
              Clear all selections
            </button>
          </div>
        </div>
      )}
    </div>
  );
}