'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Download, Upload, FileDown } from 'lucide-react';
import { TabNavigation } from '@/components/ui/TabNavigation';
import { ActionButtonGroup } from '@/components/ui/ActionButtonGroup';
import { SearchFilterBar } from '@/components/ui/SearchFilterBar';
import { FieldsList, type FieldsListRef } from './FieldsList';
import { FieldTypesGrid, type FieldTypesGridRef } from './FieldTypesGrid';
import { RulesTable, type RulesTableRef } from './RulesTable';
import { ImportModal, ExportModal } from './ImportExportModals';
import { fieldsData, type Field, type FieldType } from './fieldsData';
import { SuccessAlert } from '@/components/ui/Alert';

export default function FieldsPage() {
  const [activeTab, setActiveTab] = useState<'fields' | 'types' | 'rules'>('fields');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Data state (for now mock, later API)
  const [fields, setFields] = useState<Field[]>([]);
  const [fieldTypes, setFieldTypes] = useState<FieldType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs for modals
  const fieldsListRef = useRef<FieldsListRef>(null);
  const fieldTypesGridRef = useRef<FieldTypesGridRef>(null);
  const rulesTableRef = useRef<RulesTableRef>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [fieldsResponse, fieldTypesResponse] = await Promise.all([
        fieldsData.getFields({ limit: 100 }),
        fieldsData.getFieldTypes()
      ]);
      setFields(fieldsResponse.fields);
      setFieldTypes(fieldTypesResponse.types);
    } catch (err) {
      console.error('Error loading fields:', err);
      setError('Failed to load fields. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle import
  const handleImport = async (importedData: any[]) => {
    try {
      setImportLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would call your API
      // const response = await api.bulkCreateFields(importedData);
      
      // Mock successful import
      const newFields = importedData.map((data, index) => ({
        id: `imported-${Date.now()}-${index}`,
        name: data.name,
        description: data.description || '',
        type: data.type,
        parent: data.parent || null,
        values: data.values || [],
        rules: [],
        status: data.status || 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      // Update local state (in real app, this would be handled by your state management)
      setFields(prev => [...prev, ...newFields]);
      
      setSuccessMessage(`Successfully imported ${importedData.length} fields!`);
      
      // Refresh the list
      fieldsListRef.current?.refreshFields();
      
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    } finally {
      setImportLoading(false);
    }
  };

  // Handle export
  const handleExport = async (config: any) => {
    try {
      setExportLoading(true);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Prepare export data based on config
      const exportData = fields.map(field => {
        const row: any = {};
        
        config.fields.forEach((fieldKey: string) => {
          switch (fieldKey) {
            case 'name':
              row.name = field.name;
              break;
            case 'type':
              row.type = field.type;
              break;
            case 'description':
              row.description = field.description || '';
              break;
            case 'status':
              row.status = field.status;
              break;
            case 'parent':
              row.parent = field.parent || '';
              break;
            case 'createdAt':
              row.createdAt = new Date().toISOString().split('T')[0]; // Mock date
              break;
            case 'updatedAt':
              row.updatedAt = new Date().toISOString().split('T')[0]; // Mock date
              break;
          }
        });

        if (config.includeValues && field.values) {
          row.values = field.values.join(', ');
        }

        if (config.includeRules && field.rules) {
          if (config.format === 'json') {
            row.rules = field.rules;
          } else {
            row.rulesCount = field.rules.length;
          }
        }

        return row;
      });

      // Generate and download file
      const filename = `fields-export-${new Date().toISOString().split('T')[0]}`;
      
      if (config.format === 'csv') {
        downloadCSV(exportData, filename);
      } else if (config.format === 'excel') {
        // In real app, use libraries like xlsx
        downloadCSV(exportData, filename); // Fallback to CSV for demo
      } else if (config.format === 'json') {
        downloadJSON(exportData, filename);
      }

      setSuccessMessage(`Successfully exported ${exportData.length} fields as ${config.format.toUpperCase()}!`);
      
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      return false;
    } finally {
      setExportLoading(false);
    }
  };

  // Utility functions for file download
  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      ).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadJSON = (data: any[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Calculate total rules across all fields
  const totalRules = fields.reduce((total, field) => {
    return total + (field.rules?.length || 0);
  }, 0);

  const tabs = [
    { id: 'fields', label: 'Fields', count: fields.length },
    { id: 'types', label: 'Field Types', count: fieldTypes.length },
    { id: 'rules', label: 'Rules', count: totalRules }
  ];

  const actionButtons = [
    {
      id: 'import',
      label: 'Import',
      icon: <Upload className="w-4 h-4" />,
      variant: 'secondary' as const,
      onClick: () => {
        if (activeTab === 'fields') {
          setIsImportModalOpen(true);
        } else {
          // Handle import for other tabs if needed
          console.log(`Import ${activeTab} - to be implemented`);
        }
      }
    },
    {
      id: 'export',
      label: 'Export',
      icon: <FileDown className="w-4 h-4" />,
      variant: 'secondary' as const,
      onClick: () => {
        if (activeTab === 'fields') {
          setIsExportModalOpen(true);
        } else {
          // Handle export for other tabs if needed
          console.log(`Export ${activeTab} - to be implemented`);
        }
      }
    },
    {
      id: 'refresh',
      label: 'Refresh',
      icon: <Download className="w-4 h-4" />,
      variant: 'secondary' as const,
      onClick: () => {
        if (activeTab === 'fields') {
          fieldsListRef.current?.refreshFields();
        } else if (activeTab === 'types') {
          fieldTypesGridRef.current?.refreshTypes();
        } else if (activeTab === 'rules') {
          rulesTableRef.current?.refreshRules();
        }
        loadData();
      }
    },
    {
      id: 'add',
      label: activeTab === 'fields' ? 'Add Field' : activeTab === 'types' ? 'Add Type' : 'Add Rule',
      icon: <Plus className="w-4 h-4" />,
      variant: 'primary' as const,
      onClick: () => {
        if (activeTab === 'fields') {
          fieldsListRef.current?.openAddModal();
        } else if (activeTab === 'types') {
          fieldTypesGridRef.current?.openAddModal();
        } else if (activeTab === 'rules') {
          rulesTableRef.current?.openAddModal();
        }
      }
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-600">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-100 border border-red-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-700">{error}</p>
            <button
              onClick={loadData}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <SuccessAlert 
          message={successMessage} 
          closable 
          onClose={() => setSuccessMessage(null)} 
        />
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as 'fields' | 'types' | 'rules')}
        />
        <ActionButtonGroup buttons={actionButtons} />
      </div>

      <SearchFilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder={`Search ${activeTab}...`}
        onFilterClick={() => console.log('Filter clicked')}
      />

      {activeTab === 'fields' && (
        <FieldsList ref={fieldsListRef} searchTerm={searchTerm} />
      )}

      {activeTab === 'types' && (
        <FieldTypesGrid ref={fieldTypesGridRef} searchTerm={searchTerm} />
      )}

      {activeTab === 'rules' && (
        <RulesTable ref={rulesTableRef} searchTerm={searchTerm} />
      )}

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
        isLoading={importLoading}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        fields={fields}
        onExport={handleExport}
        isLoading={exportLoading}
      />
    </div>
  );
}