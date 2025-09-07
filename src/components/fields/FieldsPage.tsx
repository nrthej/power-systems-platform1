// src/components/fields/FieldsPage.tsx
'use client';

import { useState } from 'react';
import { Plus, Upload, Download, Settings } from 'lucide-react';

// UI Components
import { Grid } from '../ui/Grid';
import { TabNavigation } from '../ui/TabNavigation';
import { ActionButtonGroup } from '../ui/ActionButtonGroup';
import { SearchFilterBar } from '../ui/SearchFilterBar';

// Fields Components
import { FieldStats } from './FieldStats';
import { FieldsTable } from './FieldsTable';
import { FieldTypesGrid } from './FieldTypesGrid';
import { FieldModal } from './FieldModal';

// Data and Types
import { mockFields, fieldTypeInfo, getFieldStats, Field, FieldType } from './fieldsData';

type ActiveTab = 'fields' | 'types';

interface FieldsPageProps {
  className?: string;
}

export function FieldsPage({ className }: FieldsPageProps) {
  // 1. State management
  const [activeTab, setActiveTab] = useState<ActiveTab>('fields');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterEntityType, setFilterEntityType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // 2. Data filtering
  const filteredFields = mockFields.filter(field => {
    const matchesSearch = !searchTerm || 
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || field.category === filterCategory;
    const matchesEntityType = filterEntityType === 'all' || field.entityType === filterEntityType;
    const matchesStatus = filterStatus === 'all' || field.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesEntityType && matchesStatus;
  });

  // 3. Calculated stats
  const stats = getFieldStats();

  // 4. Config objects
  const tabs = [
    { id: 'fields' as const, label: 'Fields', count: filteredFields.length },
    { id: 'types' as const, label: 'Field Types', count: fieldTypeInfo.length }
  ];

  const actionButtons = [
    { 
      id: 'import', 
      label: 'Import', 
      icon: <Upload className="w-4 h-4" />, 
      variant: 'secondary' as const, 
      onClick: () => console.log('Import fields') 
    },
    { 
      id: 'export', 
      label: 'Export', 
      icon: <Download className="w-4 h-4" />, 
      variant: 'secondary' as const, 
      onClick: () => console.log('Export fields') 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <Settings className="w-4 h-4" />, 
      variant: 'secondary' as const, 
      onClick: () => console.log('Field settings') 
    },
    { 
      id: 'add', 
      label: 'Add Field', 
      icon: <Plus className="w-4 h-4" />, 
      variant: 'primary' as const, 
      onClick: () => {
        setEditingField(null);
        setIsModalOpen(true);
      }
    }
  ];

  // 5. Event handlers
  const handleFieldEdit = (field: Field) => {
    setEditingField(field);
    setIsModalOpen(true);
  };

  const handleFieldDelete = (fieldId: string) => {
    console.log('Delete field:', fieldId);
    // Remove from selectedFields if it was selected
    setSelectedFields(prev => prev.filter(id => id !== fieldId));
  };

  const handleBulkDelete = () => {
    if (selectedFields.length > 0) {
      console.log('Bulk delete fields:', selectedFields);
      setSelectedFields([]);
    }
  };

  const handleBulkStatusChange = (status: string) => {
    if (selectedFields.length > 0) {
      console.log('Bulk status change:', selectedFields, 'to', status);
      setSelectedFields([]);
    }
  };

  const handleModalSave = (fieldData: Partial<Field>) => {
    if (editingField) {
      console.log('Update field:', editingField.id, fieldData);
    } else {
      console.log('Create field:', fieldData);
    }
    setIsModalOpen(false);
    setEditingField(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingField(null);
  };

  // 6. Additional filters for search bar
  const additionalFilters = [
    {
      key: 'category',
      label: 'Category',
      value: filterCategory,
      onChange: setFilterCategory,
      options: [
        { value: 'all', label: 'All Categories' },
        { value: 'technical', label: 'Technical' },
        { value: 'financial', label: 'Financial' },
        { value: 'administrative', label: 'Administrative' },
        { value: 'regulatory', label: 'Regulatory' }
      ]
    },
    {
      key: 'entityType',
      label: 'Entity Type',
      value: filterEntityType,
      onChange: setFilterEntityType,
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'PROJECT', label: 'Project' },
        { value: 'USER', label: 'User' },
        { value: 'ASSET', label: 'Asset' },
        { value: 'GLOBAL', label: 'Global' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      value: filterStatus,
      onChange: setFilterStatus,
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
        { value: 'DEPRECATED', label: 'Deprecated' }
      ]
    }
  ];

  // 7. Render structure (EXACT PATTERN)
  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Stats Section */}
      <FieldStats 
        totalFields={stats.totalFields}
        activeFields={stats.activeFields}
        fieldTypes={stats.fieldTypes}
        fieldCategories={stats.fieldCategories}
      />
      
      {/* Navigation and Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        <ActionButtonGroup buttons={actionButtons} />
      </div>

      {/* Search and Filters */}
      <SearchFilterBar 
        searchValue={searchTerm} 
        onSearchChange={setSearchTerm}
        placeholder={activeTab === 'fields' ? 'Search fields by name, label, or description...' : 'Search field types...'}
        additionalFilters={activeTab === 'fields' ? additionalFilters : undefined}
      />

      {/* Bulk Actions */}
      {selectedFields.length > 0 && activeTab === 'fields' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedFields.length} field{selectedFields.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkStatusChange('ACTIVE')}
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkStatusChange('INACTIVE')}
                className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
              >
                Deactivate
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'fields' ? (
        <FieldsTable 
          fields={filteredFields}
          selectedFields={selectedFields}
          onSelectionChange={setSelectedFields}
          onFieldEdit={handleFieldEdit}
          onFieldDelete={handleFieldDelete}
        />
      ) : (
        <FieldTypesGrid 
          fieldTypes={fieldTypeInfo}
          searchTerm={searchTerm}
        />
      )}

      {/* Field Modal */}
      {isModalOpen && (
        <FieldModal
          field={editingField}
          onSave={handleModalSave}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}