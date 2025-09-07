// components/projects/modal/FieldAssignmentPanel.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Database, ArrowRight, ArrowLeft } from 'lucide-react';

interface FieldAssignmentPanelProps {
  title: string;
  fields: string[];
  onFieldClick: (fieldName: string) => void;
  onFieldDrop: (fieldName: string) => void;
  onClearAll: () => void;
  onActionClick: () => void;
  emptyMessage: string;
  actionLabel: string;
  panelType: 'available' | 'assigned';
  disabled?: boolean;
  searchTerm?: string; // Add searchTerm prop
}

export function FieldAssignmentPanel({
  title,
  fields,
  onFieldClick,
  onFieldDrop,
  onClearAll,
  onActionClick,
  emptyMessage,
  actionLabel,
  panelType,
  disabled = false,
  searchTerm = '' // Default to empty string
}: FieldAssignmentPanelProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  // Filter fields based on search term
  const filteredFields = useMemo(() => {
    if (!searchTerm) return fields;
    return fields.filter(field => 
      field.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [fields, searchTerm]);

  const handleDragStart = (e: React.DragEvent, fieldName: string) => {
    e.dataTransfer.setData('text/plain', fieldName);
    e.dataTransfer.setData('application/field-name', fieldName);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const fieldName = e.dataTransfer.getData('application/field-name');
    if (fieldName && !fields.includes(fieldName)) {
      onFieldDrop(fieldName);
    }
  };

  const handleFieldClick = (fieldName: string) => {
    if (disabled) return;
    onFieldClick(fieldName);
  };

  const handleFieldSelect = (fieldName: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedFields(prev => [...prev, fieldName]);
    } else {
      setSelectedFields(prev => prev.filter(f => f !== fieldName));
    }
  };

  const handleDoubleClick = (fieldName: string) => {
    if (disabled) return;
    onFieldClick(fieldName);
  };

  // Add missing functions
  const handleBulkMove = () => {
    if (disabled || selectedFields.length === 0) return;
    
    selectedFields.forEach(fieldName => {
      onFieldClick(fieldName);
    });
    
    setSelectedFields([]);
  };

  const handleClearSelection = () => {
    setSelectedFields([]);
  };

  const isAvailable = panelType === 'available';
  const borderColor = isAvailable ? 'border-blue-200' : 'border-green-200';
  const headerColor = isAvailable ? 'text-blue-700' : 'text-green-700';
  const actionColor = isAvailable ? 'text-blue-600 hover:text-blue-800' : 'text-red-600 hover:text-red-800';

  return (
    <div className={`border-2 ${dragOver ? 'border-blue-400 bg-blue-50' : borderColor} rounded-xl transition-all relative`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
        <h3 className={`text-sm font-medium ${headerColor} flex items-center`}>
          <Database className="w-4 h-4 mr-2" />
          {title}
        </h3>
        <button
          type="button"
          onClick={onActionClick}
          disabled={fields.length === 0 || disabled}
          className={`text-xs font-medium ${actionColor} disabled:opacity-50 disabled:cursor-not-allowed hover:underline transition-colors`}
        >
          {actionLabel}
        </button>
      </div>

      {/* Field List */}
      <div
        className="h-80 overflow-y-auto"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {filteredFields.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 p-4">
            <Database className="w-12 h-12 text-slate-300 mb-3" />
            <div className="text-center">
              <div className="text-sm font-medium">
                {searchTerm ? `No fields found for "${searchTerm}"` : emptyMessage}
              </div>
              <div className="text-xs mt-1">
                {searchTerm ? 'Try adjusting your search terms' : 
                 isAvailable ? 'All fields have been assigned' : 'Drag fields here to assign them'}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredFields.map((fieldName) => {
              const isSelected = selectedFields.includes(fieldName);
              return (
                <div
                  key={fieldName}
                  draggable={!disabled}
                  onDragStart={(e) => handleDragStart(e, fieldName)}
                  onDoubleClick={() => handleDoubleClick(fieldName)}
                  className={`
                    group flex items-center space-x-3 p-2 rounded-lg border transition-all cursor-pointer
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 hover:border-slate-300'}
                    ${isSelected ? 'bg-blue-50 border-blue-300 shadow-sm' : 'bg-white border-slate-200'}
                  `}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleFieldSelect(fieldName, e.target.checked);
                    }}
                    disabled={disabled}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                  />
                  
                  <div 
                    className="flex items-center justify-between flex-1 min-w-0"
                    onClick={() => handleFieldSelect(fieldName, !isSelected)}
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <span className="text-sm text-slate-700 truncate" title={fieldName}>
                        {fieldName}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFieldClick(fieldName);
                        }}
                        className="p-1 rounded hover:bg-slate-200 transition-colors"
                        title={`Click to ${isAvailable ? 'assign' : 'remove'} this field`}
                      >
                        {isAvailable ? (
                          <ArrowRight className="w-3 h-3 text-blue-500" />
                        ) : (
                          <ArrowLeft className="w-3 h-3 text-red-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions Footer */}
      {selectedFields.length > 0 && (
        <div className="border-t border-slate-200 p-3 bg-slate-50 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-600">
              <span className="font-medium">{selectedFields.length}</span> field{selectedFields.length !== 1 ? 's' : ''} selected
              {searchTerm && <span className="ml-2 text-slate-500">from search results</span>}
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleBulkMove}
                disabled={disabled}
                className="flex items-center space-x-1 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isAvailable ? (
                  <>
                    <ArrowRight className="w-3 h-3" />
                    <span>Assign Selected</span>
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-3 h-3" />
                    <span>Remove Selected</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleClearSelection}
                className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-200 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drag overlay */}
      {dragOver && (
        <div className="absolute inset-0 bg-blue-100 bg-opacity-50 border-2 border-blue-400 border-dashed rounded-xl flex items-center justify-center z-10">
          <div className="text-blue-700 font-medium text-center">
            <div className="text-lg mb-1">
              {isAvailable ? <ArrowRight className="w-6 h-6 mx-auto" /> : <ArrowLeft className="w-6 h-6 mx-auto" />}
            </div>
            Drop field here to {isAvailable ? 'assign' : 'unassign'}
          </div>
        </div>
      )}
    </div>
  );
}