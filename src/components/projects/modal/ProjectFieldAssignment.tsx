// components/projects/modal/ProjectFieldAssignment.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Search,
  X,
  Database,
  Check,
  Minus
} from 'lucide-react';

interface ProjectFieldAssignmentProps {
  assignedFields: string[];
  unassignedFields: string[];
  onMoveField: (fieldName: string, direction: 'assign' | 'unassign') => void;
  onMoveAllFields: (direction: 'assign' | 'unassign') => void;
  onMoveBulkFields: (fieldNames: string[], direction: 'assign' | 'unassign') => void;
  isLoading: boolean;
  mode?: 'add' | 'edit'; // Add mode prop
}

export function ProjectFieldAssignment({
  assignedFields,
  unassignedFields,
  onMoveField,
  onMoveAllFields,
  onMoveBulkFields,
  isLoading,
  mode = 'add'
}: ProjectFieldAssignmentProps) {
  
  // Search states
  const [availableSearch, setAvailableSearch] = useState('');
  const [assignedSearch, setAssignedSearch] = useState('');
  
  // Selection states
  const [selectedAvailable, setSelectedAvailable] = useState<string[]>([]);
  const [selectedAssigned, setSelectedAssigned] = useState<string[]>([]);

  // Filter fields based on search
  const filteredAvailable = useMemo(() => {
    return unassignedFields.filter(field => 
      field.toLowerCase().includes(availableSearch.toLowerCase())
    );
  }, [unassignedFields, availableSearch]);

  const filteredAssigned = useMemo(() => {
    return assignedFields.filter(field => 
      field.toLowerCase().includes(assignedSearch.toLowerCase())
    );
  }, [assignedFields, assignedSearch]);

  // Handle individual field moves
  const handleMoveField = (fieldName: string, direction: 'assign' | 'unassign') => {
    console.log('Moving field:', fieldName, direction);
    onMoveField(fieldName, direction);
    
    // Clear selections after move
    if (direction === 'assign') {
      setSelectedAvailable(prev => prev.filter(f => f !== fieldName));
    } else {
      setSelectedAssigned(prev => prev.filter(f => f !== fieldName));
    }
  };

  // Handle bulk operations
  const handleBulkMove = (direction: 'assign' | 'unassign') => {
    const fieldsToMove = direction === 'assign' ? selectedAvailable : selectedAssigned;
    
    if (fieldsToMove.length === 0) return;
    
    console.log('Moving bulk fields:', fieldsToMove, direction);
    
    if (onMoveBulkFields) {
      onMoveBulkFields(fieldsToMove, direction);
    } else {
      // Fallback to individual moves if bulk function not provided
      fieldsToMove.forEach(fieldName => {
        onMoveField(fieldName, direction);
      });
    }
    
    // Clear selections after move
    if (direction === 'assign') {
      setSelectedAvailable([]);
    } else {
      setSelectedAssigned([]);
    }
  };

  // Handle move all
  const handleMoveAllFields = (direction: 'assign' | 'unassign') => {
    console.log('Moving all fields:', direction);
    onMoveAllFields(direction);
    
    // Clear all selections
    setSelectedAvailable([]);
    setSelectedAssigned([]);
  };

  // Selection handlers
  const handleSelectAvailable = (fieldName: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedAvailable(prev => [...prev, fieldName]);
    } else {
      setSelectedAvailable(prev => prev.filter(f => f !== fieldName));
    }
  };

  const handleSelectAssigned = (fieldName: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedAssigned(prev => [...prev, fieldName]);
    } else {
      setSelectedAssigned(prev => prev.filter(f => f !== fieldName));
    }
  };

  // Select all handlers
  const handleSelectAllAvailable = () => {
    setSelectedAvailable(
      selectedAvailable.length === filteredAvailable.length ? [] : filteredAvailable
    );
  };

  const handleSelectAllAssigned = () => {
    setSelectedAssigned(
      selectedAssigned.length === filteredAssigned.length ? [] : filteredAssigned
    );
  };

  // Clear search handlers
  const clearAvailableSearch = () => {
    setAvailableSearch('');
    setSelectedAvailable([]);
  };

  const clearAssignedSearch = () => {
    setAssignedSearch('');
    setSelectedAssigned([]);
  };

  // Field list component
  const FieldList = ({ 
    fields, 
    selectedFields, 
    onSelect, 
    onMove, 
    direction, 
    panelType 
  }: {
    fields: string[];
    selectedFields: string[];
    onSelect: (field: string, selected: boolean) => void;
    onMove: (field: string) => void;
    direction: 'assign' | 'unassign';
    panelType: 'available' | 'assigned';
  }) => (
    <div className="space-y-1">
      {fields.map((fieldName) => {
        const isSelected = selectedFields.includes(fieldName);
        return (
          <div
            key={fieldName}
            className={`
              group flex items-center space-x-3 p-2 rounded-lg border transition-all
              ${isSelected ? 'bg-blue-50 border-blue-300 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'}
            `}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(fieldName, e.target.checked)}
              disabled={isLoading}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
            />
            
            <div 
              className="flex items-center justify-between flex-1 min-w-0 cursor-pointer"
              onClick={() => onSelect(fieldName, !isSelected)}
            >
              <span className="text-sm text-slate-700 truncate" title={fieldName}>
                {fieldName}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(fieldName);
                }}
                disabled={isLoading}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 transition-all"
                title={`Click to ${direction} this field`}
              >
                {panelType === 'available' ? (
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                ) : (
                  <ArrowLeft className="w-4 h-4 text-red-500" />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="p-6">
      {/* Debug Info */}
      <div className="text-xs text-gray-500 mb-4 flex justify-between">
        <span>Mode: {mode} | Available: {unassignedFields.length} | Assigned: {assignedFields.length}</span>
        <span>Loading: {isLoading ? 'Yes' : 'No'}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Available Fields Panel */}
        <div className="lg:col-span-5">
          <div className="border border-slate-200 rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-medium text-blue-700">
                  Available Fields ({filteredAvailable.length}/{unassignedFields.length})
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSelectAllAvailable}
                  disabled={filteredAvailable.length === 0 || isLoading}
                  className="text-xs font-medium text-slate-600 hover:text-slate-800 disabled:opacity-50"
                >
                  {selectedAvailable.length === filteredAvailable.length && filteredAvailable.length > 0 ? (
                    <><Minus className="w-3 h-3 inline mr-1" />Deselect All</>
                  ) : (
                    <><Check className="w-3 h-3 inline mr-1" />Select All</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveAllFields('assign')}
                  disabled={unassignedFields.length === 0 || isLoading}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  Assign All
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search available fields..."
                  value={availableSearch}
                  onChange={(e) => setAvailableSearch(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-8 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {availableSearch && (
                  <button
                    type="button"
                    onClick={clearAvailableSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-200 rounded"
                  >
                    <X className="w-3 h-3 text-slate-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Field List */}
            <div className="h-80 overflow-y-auto p-3">
              {filteredAvailable.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <Database className="w-12 h-12 text-slate-300 mb-3" />
                  <div className="text-center">
                    <div className="text-sm font-medium">
                      {availableSearch ? `No fields found for "${availableSearch}"` : 'All fields are assigned'}
                    </div>
                    <div className="text-xs mt-1">
                      {availableSearch ? 'Try different search terms' : 'Great job assigning all fields!'}
                    </div>
                  </div>
                </div>
              ) : (
                <FieldList
                  fields={filteredAvailable}
                  selectedFields={selectedAvailable}
                  onSelect={handleSelectAvailable}
                  onMove={(field) => handleMoveField(field, 'assign')}
                  direction="assign"
                  panelType="available"
                />
              )}
            </div>

            {/* Bulk Actions */}
            {selectedAvailable.length > 0 && (
              <div className="border-t border-slate-200 p-3 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">
                    <span className="font-medium">{selectedAvailable.length}</span> selected
                  </span>
                  <button
                    type="button"
                    onClick={() => handleBulkMove('assign')}
                    disabled={isLoading}
                    className="flex items-center space-x-1 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <ArrowRight className="w-3 h-3" />
                    <span>Assign Selected</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="lg:col-span-2 flex lg:flex-col flex-row justify-center items-center space-x-4 lg:space-x-0 lg:space-y-4">
          <div className="flex lg:flex-col flex-row gap-3">
            <button
              type="button"
              onClick={() => handleBulkMove('assign')}
              disabled={selectedAvailable.length === 0 || isLoading}
              className="p-3 rounded-lg border-2 border-blue-300 text-blue-600 hover:bg-blue-50 disabled:opacity-50 transition-all"
              title="Assign selected fields"
            >
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => handleMoveAllFields('assign')}
              disabled={unassignedFields.length === 0 || isLoading}
              className="p-3 rounded-lg border-2 border-blue-300 text-blue-600 hover:bg-blue-50 disabled:opacity-50 transition-all"
              title="Assign all fields"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => handleMoveAllFields('unassign')}
              disabled={assignedFields.length === 0 || isLoading}
              className="p-3 rounded-lg border-2 border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-all"
              title="Unassign all fields"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => handleBulkMove('unassign')}
              disabled={selectedAssigned.length === 0 || isLoading}
              className="p-3 rounded-lg border-2 border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-all"
              title="Unassign selected fields"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Assigned Fields Panel */}
        <div className="lg:col-span-5">
          <div className="border border-slate-200 rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-green-600" />
                <h3 className="text-sm font-medium text-green-700">
                  Assigned Fields ({filteredAssigned.length}/{assignedFields.length})
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSelectAllAssigned}
                  disabled={filteredAssigned.length === 0 || isLoading}
                  className="text-xs font-medium text-slate-600 hover:text-slate-800 disabled:opacity-50"
                >
                  {selectedAssigned.length === filteredAssigned.length && filteredAssigned.length > 0 ? (
                    <><Minus className="w-3 h-3 inline mr-1" />Deselect All</>
                  ) : (
                    <><Check className="w-3 h-3 inline mr-1" />Select All</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveAllFields('unassign')}
                  disabled={assignedFields.length === 0 || isLoading}
                  className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  Remove All
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search assigned fields..."
                  value={assignedSearch}
                  onChange={(e) => setAssignedSearch(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-8 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {assignedSearch && (
                  <button
                    type="button"
                    onClick={clearAssignedSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-200 rounded"
                  >
                    <X className="w-3 h-3 text-slate-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Field List */}
            <div className="h-80 overflow-y-auto p-3">
              {filteredAssigned.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <Database className="w-12 h-12 text-slate-300 mb-3" />
                  <div className="text-center">
                    <div className="text-sm font-medium">
                      {assignedSearch ? `No fields found for "${assignedSearch}"` : 'No fields assigned yet'}
                    </div>
                    <div className="text-xs mt-1">
                      {assignedSearch ? 'Try different search terms' : 'Assign fields from the left panel'}
                    </div>
                  </div>
                </div>
              ) : (
                <FieldList
                  fields={filteredAssigned}
                  selectedFields={selectedAssigned}
                  onSelect={handleSelectAssigned}
                  onMove={(field) => handleMoveField(field, 'unassign')}
                  direction="unassign"
                  panelType="assigned"
                />
              )}
            </div>

            {/* Bulk Actions */}
            {selectedAssigned.length > 0 && (
              <div className="border-t border-slate-200 p-3 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">
                    <span className="font-medium">{selectedAssigned.length}</span> selected
                  </span>
                  <button
                    type="button"
                    onClick={() => handleBulkMove('unassign')}
                    disabled={isLoading}
                    className="flex items-center space-x-1 text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Remove Selected</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-medium text-blue-900">Available Fields</div>
            <div className="text-2xl font-bold text-blue-600">{unassignedFields.length}</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-green-900">Assigned Fields</div>
            <div className="text-2xl font-bold text-green-600">{assignedFields.length}</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-slate-900">Total Fields</div>
            <div className="text-2xl font-bold text-slate-600">{unassignedFields.length + assignedFields.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}