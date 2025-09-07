// components/projects/modal/ProjectFieldAssignment.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  
  // Create simple field objects from the field names
  const allFields = useMemo(() => {
    const assigned = Array.isArray(assignedFields) ? assignedFields : [];
    const unassigned = Array.isArray(unassignedFields) ? unassignedFields : [];
    
    return [...assigned, ...unassigned].map(fieldName => ({
      id: fieldName.replace(/\s+/g, '_').toLowerCase(),
      name: fieldName,
      description: `Field for ${fieldName}`,
      type: getFieldType(fieldName),
      status: 'ACTIVE' as const,
      isRequired: isRequiredField(fieldName),
      isSelected: assigned.includes(fieldName)
    }));
  }, [assignedFields, unassignedFields]);

  // Helper function to determine field type based on name
  function getFieldType(fieldName: string): string {
    const name = fieldName.toLowerCase();
    if (name.includes('date') || name.includes('cod')) return 'Date';
    if (name.includes('capacity') || name.includes('cost') || name.includes('mw') || name.includes('$')) return 'Number';
    if (name.includes('status') || name.includes('type') || name.includes('state')) return 'Select';
    if (name.includes('email')) return 'Email';
    return 'Text';
  }

  // Helper function to determine if field is required
  function isRequiredField(fieldName: string): boolean {
    const requiredFields = ['Project Name', 'Project Code', 'Technology Type'];
    return requiredFields.includes(fieldName);
  }

  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SELECTED' | 'UNSELECTED'>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());

  // Sync with props
  useEffect(() => {
    try {
      const assigned = Array.isArray(assignedFields) ? assignedFields : [];
      setSelectedFields(new Set(assigned));
    } catch (error) {
      console.error('Error syncing selected fields:', error);
      setSelectedFields(new Set());
    }
  }, [assignedFields]);

  // Get all available field types
  const fieldTypes = useMemo(() => {
    const types = new Set<string>();
    allFields.forEach(field => types.add(field.type));
    return Array.from(types).sort();
  }, [allFields]);

  // Filter and search logic
  const filteredFields = useMemo(() => {
    let filtered = [...allFields];
    
    try {
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(field => 
          field.name.toLowerCase().includes(searchLower) ||
          field.description.toLowerCase().includes(searchLower) ||
          field.type.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply status filter
      if (statusFilter === 'SELECTED') {
        filtered = filtered.filter(field => selectedFields.has(field.name));
      } else if (statusFilter === 'UNSELECTED') {
        filtered = filtered.filter(field => !selectedFields.has(field.name));
      }
      
      // Apply type filter
      if (typeFilter !== 'ALL') {
        filtered = filtered.filter(field => field.type === typeFilter);
      }
      
      return filtered;
    } catch (error) {
      console.error('Error filtering fields:', error);
      return allFields;
    }
  }, [allFields, searchTerm, statusFilter, typeFilter, selectedFields]);

  // Handle checkbox selection
  const handleFieldSelection = (fieldName: string, isChecked: boolean) => {
    try {
      const newSelection = new Set(selectedFields);
      
      if (isChecked) {
        newSelection.add(fieldName);
        if (!assignedFields.includes(fieldName)) {
          onMoveField(fieldName, 'assign');
        }
      } else {
        newSelection.delete(fieldName);
        if (assignedFields.includes(fieldName)) {
          onMoveField(fieldName, 'unassign');
        }
      }
      
      setSelectedFields(newSelection);
    } catch (error) {
      console.error('Error handling field selection:', error);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    try {
      const allFieldNames = filteredFields.map(f => f.name);
      const allSelected = allFieldNames.every(name => selectedFields.has(name));
      
      if (allSelected) {
        // Deselect all filtered fields
        const fieldsToUnassign = allFieldNames.filter(name => assignedFields.includes(name));
        if (fieldsToUnassign.length > 0) {
          onMoveBulkFields(fieldsToUnassign, 'unassign');
        }
      } else {
        // Select all filtered fields
        const fieldsToAssign = allFieldNames.filter(name => !assignedFields.includes(name));
        if (fieldsToAssign.length > 0) {
          onMoveBulkFields(fieldsToAssign, 'assign');
        }
      }
    } catch (error) {
      console.error('Error handling select all:', error);
    }
  };

  const getStatusBadge = (isSelected: boolean) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
        isSelected 
          ? 'bg-green-100 text-green-800 border-green-200' 
          : 'bg-gray-100 text-gray-800 border-gray-200'
      }`}>
        {isSelected ? 'Selected' : 'Available'}
      </span>
    );
  };

  const selectedCount = selectedFields.size;
  const totalCount = allFields.length;

  // Safety check - if no fields, show message
  if (!allFields || allFields.length === 0) {
    return (
      <div className="p-6 text-center">
        <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">No fields available</h3>
        <p className="text-slate-600">Please ensure fields are properly loaded.</p>
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

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search fields by name, description, or type..."
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

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Selection Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">All Fields</option>
                  <option value="SELECTED">Selected Only</option>
                  <option value="UNSELECTED">Unselected Only</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Field Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">All Types</option>
                  {fieldTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Clear Filters */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('ALL');
                  setTypeFilter('ALL');
                  setSearchTerm('');
                }}
                className="text-sm text-slate-600 hover:text-slate-800 underline"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        {/* Table Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
          <div className="grid grid-cols-12 gap-4 items-center text-xs font-medium text-slate-600 uppercase tracking-wider">
            <div className="col-span-1 flex items-center">
              <input
                type="checkbox"
                checked={selectedCount === totalCount && totalCount > 0}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = selectedCount > 0 && selectedCount < totalCount;
                  }
                }}
                onChange={handleSelectAll}
                disabled={isLoading}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
              />
            </div>
            <div className="col-span-4">Field Name</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-4">Description</div>
            <div className="col-span-1">Status</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="max-h-96 overflow-y-auto">
          {filteredFields.length === 0 ? (
            <div className="text-center py-12">
              <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No fields found</h3>
              <p className="text-slate-600">
                {searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No fields are available for assignment.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredFields.map((field) => {
                const isSelected = selectedFields.has(field.name);
                
                return (
                  <div
                    key={field.id}
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
                          onChange={(e) => handleFieldSelection(field.name, e.target.checked)}
                          disabled={isLoading}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </div>

                      {/* Field Name */}
                      <div className="col-span-4 flex items-center">
                        <span className={`text-sm ${
                          isSelected 
                            ? 'font-medium text-blue-900' 
                            : 'text-slate-900'
                        }`}>
                          {field.name}
                          {field.isRequired && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </span>
                      </div>

                      {/* Type */}
                      <div className="col-span-2">
                        <span className="text-sm text-slate-600 font-mono">
                          {field.type}
                        </span>
                      </div>

                      {/* Description */}
                      <div className="col-span-4">
                        <span className="text-sm text-slate-600">
                          {field.description}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="col-span-1">
                        {getStatusBadge(isSelected)}
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