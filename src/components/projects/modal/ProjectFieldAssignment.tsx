'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search,
  X,
  Database,
  Check,
  Filter,
  CheckSquare,
  Minus,
  Zap,
  Target,
  ArrowRight,
  Grid3X3,
  List,
  Star
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Safety checks
  const safeAssigned = Array.isArray(assignedFields) ? assignedFields : [];
  const safeUnassigned = Array.isArray(unassignedFields) ? unassignedFields : [];
  const allFieldNames = [...safeAssigned, ...safeUnassigned];

  // Categorize fields for better organization
  const fieldCategories = {
    identification: ['Project Name', 'Project Code', 'Queue Number', 'FERC ID'],
    technical: ['Technology Type', 'Nameplate Capacity (MW)', 'Net Capacity (MW)', 'Voltage Level (kV)', 'Energy Storage Capacity (MWh)'],
    location: ['State/Province', 'County', 'Latitude', 'Longitude', 'Land Area (Acres)'],
    regulatory: ['Project Status', 'Environmental Review Status', 'Interconnection Status', 'Permit Status'],
    financial: ['Total Project Cost ($M)', 'Cost per MW ($M/MW)', 'Financing Status', 'PPA Status', 'PPA Price ($/MWh)'],
    schedule: ['Planned COD', 'Construction Start Date', 'Mechanical Completion Date', 'Interconnection Date'],
    stakeholders: ['Developer', 'Owner', 'EPC Contractor', 'Utility Company', 'ISO/RTO'],
    performance: ['Capacity Factor (%)', 'Annual Generation (GWh)', 'Heat Rate (Btu/kWh)', 'Emissions Rate (lbs CO2/MWh)']
  };

  const getFieldCategory = (fieldName: string) => {
    for (const [category, fields] of Object.entries(fieldCategories)) {
      if (fields.includes(fieldName)) return category;
    }
    return 'other';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'identification': return '🏷️';
      case 'technical': return '⚡';
      case 'location': return '📍';
      case 'regulatory': return '📋';
      case 'financial': return '💰';
      case 'schedule': return '📅';
      case 'stakeholders': return '👥';
      case 'performance': return '📊';
      default: return '📄';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'identification': return 'bg-blue-100 text-blue-800';
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'location': return 'bg-green-100 text-green-800';
      case 'regulatory': return 'bg-orange-100 text-orange-800';
      case 'financial': return 'bg-emerald-100 text-emerald-800';
      case 'schedule': return 'bg-pink-100 text-pink-800';
      case 'stakeholders': return 'bg-indigo-100 text-indigo-800';
      case 'performance': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  // Filter fields
  const filteredFields = useMemo(() => {
    let fields = allFieldNames;

    if (searchTerm) {
      fields = fields.filter(field => 
        field.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      fields = fields.filter(field => getFieldCategory(field) === filterCategory);
    }

    return fields;
  }, [allFieldNames, searchTerm, filterCategory]);

  const handleFieldToggle = (fieldName: string) => {
    const isAssigned = safeAssigned.includes(fieldName);
    onMoveField(fieldName, isAssigned ? 'unassign' : 'assign');
  };

  const handleFieldSelect = (fieldName: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedFields(prev => [...prev, fieldName]);
    } else {
      setSelectedFields(prev => prev.filter(f => f !== fieldName));
    }
  };

  const handleBulkAssign = () => {
    if (selectedFields.length === 0) return;
    
    const fieldsToAssign = selectedFields.filter(field => !safeAssigned.includes(field));
    const fieldsToUnassign = selectedFields.filter(field => safeAssigned.includes(field));
    
    if (fieldsToAssign.length > 0) {
      onMoveBulkFields(fieldsToAssign, 'assign');
    }
    if (fieldsToUnassign.length > 0) {
      onMoveBulkFields(fieldsToUnassign, 'unassign');
    }
    
    setSelectedFields([]);
  };

  const handleSelectAll = () => {
    const allSelected = filteredFields.every(field => selectedFields.includes(field));
    if (allSelected) {
      setSelectedFields([]);
    } else {
      setSelectedFields(filteredFields);
    }
  };

  const selectedCount = safeAssigned.length;
  const totalCount = allFieldNames.length;

  if (allFieldNames.length === 0) {
    return (
      <div className="p-8 text-center">
        <Database className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Fields Available</h3>
        <p className="text-slate-600">Fields will appear here when the system is properly configured.</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Database className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Configure Data Fields</h3>
        <p className="text-slate-600">Select the data fields that will be tracked for this project</p>
      </div>

      {/* Field Selection Summary */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Field Selection</h4>
              <p className="text-slate-600">
                {selectedCount} of {totalCount} fields selected for tracking
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-600">{selectedCount}</div>
            <div className="text-xs text-slate-500">Selected Fields</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Selection Progress</span>
            <span className="text-sm font-bold text-slate-900">
              {Math.round((selectedCount / totalCount) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(selectedCount / totalCount) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search fields by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-200 rounded"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="identification">🏷️ Identification</option>
            <option value="technical">⚡ Technical</option>
            <option value="location">📍 Location</option>
            <option value="regulatory">📋 Regulatory</option>
            <option value="financial">💰 Financial</option>
            <option value="schedule">📅 Schedule</option>
            <option value="stakeholders">👥 Stakeholders</option>
            <option value="performance">📊 Performance</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSelectAll}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all"
            >
              {selectedFields.length === filteredFields.length ? (
                <>
                  <Minus className="w-4 h-4 mr-2" />
                  Deselect All
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Select All
                </>
              )}
            </button>

            {selectedFields.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleBulkAssign}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Apply to {selectedFields.length} Fields
              </motion.button>
            )}
          </div>

          <div className="text-sm text-slate-600">
            {selectedFields.length > 0 && (
              <span className="font-medium text-blue-600">
                {selectedFields.length} field{selectedFields.length !== 1 ? 's' : ''} selected
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Fields Display */}
      {filteredFields.length === 0 ? (
        <div className="text-center py-16">
          <Database className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Fields Found</h3>
          <p className="text-slate-600">
            {searchTerm ? 'Try adjusting your search criteria.' : 'No fields available for selection.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Enhanced Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFields.map((fieldName, index) => {
            const isSelected = selectedFields.includes(fieldName);
            const isAssigned = safeAssigned.includes(fieldName);
            const category = getFieldCategory(fieldName);
            
            return (
              <motion.div
                key={fieldName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${
                  isAssigned
                    ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                    : isSelected
                    ? 'bg-blue-50 border-blue-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
                onClick={() => handleFieldSelect(fieldName, !isSelected)}
              >
                {/* Selection Checkbox */}
                <div className="absolute top-3 right-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleFieldSelect(fieldName, e.target.checked);
                    }}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                </div>

                {/* Field Content */}
                <div className="pr-8">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${getCategoryColor(category)}`}>
                      {getCategoryIcon(category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 text-sm truncate">
                        {fieldName}
                      </h4>
                      <p className="text-xs text-slate-500 capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                    </div>
                  </div>

                  {/* Assignment Status */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      isAssigned 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isAssigned ? (
                        <>
                          <CheckSquare className="w-3 h-3 mr-1" />
                          Assigned
                        </>
                      ) : (
                        'Available'
                      )}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFieldToggle(fieldName);
                      }}
                      className={`p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                        isAssigned
                          ? 'text-red-500 hover:bg-red-50'
                          : 'text-emerald-500 hover:bg-emerald-50'
                      }`}
                    >
                      {isAssigned ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Assigned Indicator */}
                {isAssigned && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 left-2 w-3 h-3 bg-emerald-500 rounded-full"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Enhanced List View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <div className="divide-y divide-slate-100">
              {filteredFields.map((fieldName, index) => {
                const isSelected = selectedFields.includes(fieldName);
                const isAssigned = safeAssigned.includes(fieldName);
                const category = getFieldCategory(fieldName);
                
                return (
                  <motion.div
                    key={fieldName}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`flex items-center space-x-4 p-4 hover:bg-slate-50 transition-all cursor-pointer group ${
                      isAssigned ? 'bg-emerald-50' : ''
                    }`}
                    onClick={() => handleFieldSelect(fieldName, !isSelected)}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleFieldSelect(fieldName, e.target.checked);
                      }}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />

                    {/* Field Info */}
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${getCategoryColor(category)}`}>
                        {getCategoryIcon(category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 truncate">{fieldName}</h4>
                        <p className="text-xs text-slate-500 capitalize">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        isAssigned 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isAssigned ? 'Assigned' : 'Available'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFieldToggle(fieldName);
                        }}
                        className={`p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                          isAssigned
                            ? 'text-red-500 hover:bg-red-50'
                            : 'text-emerald-500 hover:bg-emerald-50'
                        }`}
                      >
                        {isAssigned ? (
                          <Minus className="w-4 h-4" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Star className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-semibold text-blue-900">
                  {selectedCount} field{selectedCount !== 1 ? 's' : ''} ready for tracking
                </h4>
                <p className="text-sm text-blue-700">
                  These fields will be available for data entry in your project
                </p>
              </div>
            </div>
            <button
              onClick={() => onMoveAllFields('unassign')}
              disabled={isLoading || selectedCount === 0}
              className="text-sm text-blue-700 hover:text-blue-900 underline disabled:opacity-50 transition-colors"
            >
              Clear all selections
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}