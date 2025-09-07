// components/projects/modal/ProjectFieldAssignment.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, Database, Check, Filter, CheckSquare, Minus, ArrowRight, ArrowLeft,
  Settings, Tag, ToggleLeft, ToggleRight, Grid, List, ChevronDown, ChevronRight,
  Plus, Target, Layers, CheckCircle, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectFieldAssignmentProps {
  assignedFields: string[];
  unassignedFields: string[];
  onMoveField: (fieldName: string, direction: 'assign' | 'unassign') => void;
  onMoveAllFields: (direction: 'assign' | 'unassign') => void;
  onMoveBulkFields: (fieldNames: string[], direction: 'assign' | 'unassign') => void;
  isLoading: boolean;
  mode?: 'add' | 'edit';
}

const FIELD_CATEGORIES = {
  'Basic Info': ['Project Name', 'Project Code', 'Project Status', 'Developer'],
  'Technical': ['Technology Type', 'Nameplate Capacity (MW)', 'Capacity Factor (%)', 'Total Project Cost ($M)'],
  'Location': ['State/Province', 'County'],
  'Timeline': ['Planned COD', 'PPA Status'],
  'Custom Fields': [] // Will be populated with Field_xxx fields
};

export function ProjectFieldAssignment({
  assignedFields = [],
  unassignedFields = [],
  onMoveField,
  onMoveAllFields,
  onMoveBulkFields,
  isLoading = false,
  mode = 'add'
}: ProjectFieldAssignmentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'categorized' | 'list'>('categorized');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Basic Info', 'Technical']);
  const [showOnlyAssigned, setShowOnlyAssigned] = useState(false);

  const safeAssigned = Array.isArray(assignedFields) ? assignedFields : [];
  const safeUnassigned = Array.isArray(unassignedFields) ? unassignedFields : [];
  const allFieldNames = [...safeAssigned, ...safeUnassigned];

  // Categorize fields
  const categorizedFields = useMemo(() => {
    const categories = { ...FIELD_CATEGORIES };
    
    // Populate custom fields
    categories['Custom Fields'] = allFieldNames.filter(field => field.startsWith('Field_'));
    
    // Add any uncategorized fields to a misc category
    const categorizedFieldNames = Object.values(categories).flat();
    const uncategorizedFields = allFieldNames.filter(field => !categorizedFieldNames.includes(field));
    if (uncategorizedFields.length > 0) {
      categories['Other Fields'] = uncategorizedFields;
    }
    
    return categories;
  }, [allFieldNames]);

  // Filter fields based on search and assigned status
  const getFilteredFields = (fields: string[]) => {
    let filtered = fields;
    
    if (searchTerm) {
      filtered = filtered.filter(field =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (showOnlyAssigned) {
      filtered = filtered.filter(field => safeAssigned.includes(field));
    }
    
    return filtered;
  };

  const handleFieldToggle = (fieldName: string) => {
    const isAssigned = safeAssigned.includes(fieldName);
    onMoveField(fieldName, isAssigned ? 'unassign' : 'assign');
  };

  const handleBulkAssign = (direction: 'assign' | 'unassign') => {
    if (selectedFields.length === 0) return;
    onMoveBulkFields(selectedFields, direction);
    setSelectedFields([]);
  };

  const handleSelectField = (fieldName: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldName)
        ? prev.filter(f => f !== fieldName)
        : [...prev, fieldName]
    );
  };

  const handleSelectAllVisible = () => {
    const visibleFields = Object.values(categorizedFields)
      .flat()
      .filter(field => getFilteredFields([field]).length > 0);
    
    const allSelected = visibleFields.every(field => selectedFields.includes(field));
    
    if (allSelected) {
      setSelectedFields([]);
    } else {
      setSelectedFields(visibleFields);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getFieldIcon = (fieldName: string) => {
    if (fieldName.includes('Status')) return <Target className="w-4 h-4" />;
    if (fieldName.includes('Date') || fieldName.includes('COD')) return <CheckCircle className="w-4 h-4" />;
    if (fieldName.includes('Cost') || fieldName.includes('$')) return <Tag className="w-4 h-4" />;
    if (fieldName.includes('Capacity') || fieldName.includes('MW') || fieldName.includes('%')) return <Settings className="w-4 h-4" />;
    if (fieldName.includes('State') || fieldName.includes('County')) return <Layers className="w-4 h-4" />;
    return <Database className="w-4 h-4" />;
  };

  const FieldItem = ({ fieldName, category }: { fieldName: string; category: string }) => {
    const isAssigned = safeAssigned.includes(fieldName);
    const isSelected = selectedFields.includes(fieldName);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`group flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
          isAssigned 
            ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
            : 'bg-white border-slate-200 hover:bg-slate-50'
        } ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleSelectField(fieldName)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
          />
          
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isAssigned ? 'bg-blue-100' : 'bg-slate-100'
          }`}>
            {getFieldIcon(fieldName)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className={`font-medium truncate ${
              isAssigned ? 'text-blue-900' : 'text-slate-900'
            }`}>
              {fieldName}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {category} • {isAssigned ? 'Assigned' : 'Available'}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => handleFieldToggle(fieldName)}
            disabled={isLoading}
            className={`p-1.5 rounded-lg transition-colors ${
              isAssigned
                ? 'text-red-600 hover:bg-red-100'
                : 'text-green-600 hover:bg-green-100'
            }`}
            title={isAssigned ? 'Remove field' : 'Add field'}
          >
            {isAssigned ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 flex items-center">
              <Database className="w-5 h-5 mr-3 text-purple-600" />
              Field Configuration
            </h3>
            <p className="text-slate-600 mt-1">
              {safeAssigned.length} of {allFieldNames.length} fields assigned to this project
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-1" />
              {safeAssigned.length} Assigned
            </div>
            <div className="flex items-center text-slate-700 bg-slate-100 px-3 py-1 rounded-full text-sm font-medium">
              <AlertCircle className="w-4 h-4 mr-1" />
              {safeUnassigned.length} Available
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Configuration Progress</span>
            <span className="font-medium text-slate-900">
              {Math.round((safeAssigned.length / Math.max(allFieldNames.length, 1)) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(safeAssigned.length / Math.max(allFieldNames.length, 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
        {/* Search and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search fields by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('categorized')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'categorized' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid className="w-4 h-4 mr-1.5 inline" />
                Categories
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-4 h-4 mr-1.5 inline" />
                List
              </button>
            </div>

            <button
              onClick={() => setShowOnlyAssigned(!showOnlyAssigned)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                showOnlyAssigned
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {showOnlyAssigned ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              <span className="text-sm font-medium">Assigned Only</span>
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedFields.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl"
          >
            <div className="flex items-center space-x-3">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {selectedFields.length} field{selectedFields.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAssign('assign')}
                disabled={isLoading}
                className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Assign</span>
              </button>
              <button
                onClick={() => handleBulkAssign('unassign')}
                disabled={isLoading}
                className="flex items-center space-x-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Remove</span>
              </button>
              <button
                onClick={() => setSelectedFields([])}
                className="px-3 py-1.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}

        {/* Select All */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSelectAllVisible}
            className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Select All Visible</span>
          </button>
          <div className="text-xs text-slate-500">
            Showing {Object.values(categorizedFields).flat().filter(field => 
              getFilteredFields([field]).length > 0
            ).length} fields
          </div>
        </div>
      </div>

      {/* Field Lists */}
      <div className="space-y-4">
        {viewMode === 'categorized' ? (
          // Categorized View
          <div className="space-y-4">
            {Object.entries(categorizedFields).map(([category, fields]) => {
              const filteredCategoryFields = getFilteredFields(fields);
              if (filteredCategoryFields.length === 0) return null;

              const isExpanded = expandedCategories.includes(category);
              const assignedInCategory = filteredCategoryFields.filter(field => safeAssigned.includes(field)).length;

              return (
                <motion.div
                  key={category}
                  layout
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {isExpanded ? 
                        <ChevronDown className="w-4 h-4 text-slate-400" /> : 
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      }
                      <h4 className="text-lg font-semibold text-slate-900">{category}</h4>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                          {assignedInCategory} assigned
                        </span>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                          {filteredCategoryFields.length} total
                        </span>
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-100"
                      >
                        <div className="p-4 space-y-3">
                          {filteredCategoryFields.map((fieldName) => (
                            <FieldItem key={fieldName} fieldName={fieldName} category={category} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="space-y-3">
              {allFieldNames
                .filter(field => getFilteredFields([field]).length > 0)
                .map((fieldName) => {
                  const category = Object.entries(categorizedFields)
                    .find(([, fields]) => fields.includes(fieldName))?.[0] || 'Other';
                  return (
                    <FieldItem key={fieldName} fieldName={fieldName} category={category} />
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-slate-700">Field Assignment Summary</span>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
              Assigned: {safeAssigned.length}
            </span>
            <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
              Available: {safeUnassigned.length}
            </span>
            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
              Total: {allFieldNames.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}