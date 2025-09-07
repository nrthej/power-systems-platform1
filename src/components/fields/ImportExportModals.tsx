'use client';

import React, { useState, useRef, useCallback } from 'react';
import { X, Upload, Download, FileText, AlertCircle, CheckCircle, ArrowRight, Settings, Eye, FileSpreadsheet, Database, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ErrorAlert, SuccessAlert } from '@/components/ui/Alert';
import { motion, AnimatePresence } from 'framer-motion';

// Import Modal Component
interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => Promise<boolean>;
  isLoading?: boolean;
}

export function ImportModal({ isOpen, onClose, onImport, isLoading = false }: ImportModalProps) {
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'importing'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [rawData, setRawData] = useState<any[]>([]);
  const [mappedData, setMappedData] = useState<any[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [validationResults, setValidationResults] = useState<{ valid: number; invalid: number; errors: any[] }>({ valid: 0, invalid: 0, errors: [] });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requiredFields = ['name', 'type', 'description'];
  const fieldTypes = ['Text', 'Number', 'Date', 'Boolean', 'Select', 'Multi-Select'];

  const resetModal = () => {
    setStep('upload');
    setFile(null);
    setRawData([]);
    setMappedData([]);
    setColumnMapping({});
    setErrors([]);
    setValidationResults({ valid: 0, invalid: 0, errors: [] });
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setErrors([]);

    // Mock file parsing - in real app, use Papa Parse or SheetJS
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        const data = lines.slice(1).map((line, index) => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const row: any = { _rowIndex: index + 2 }; // +2 for header and 0-based index
          headers.forEach((header, i) => {
            row[header] = values[i] || '';
          });
          return row;
        });

        setRawData(data);
        setStep('mapping');
      } catch (error) {
        setErrors(['Failed to parse file. Please check the format.']);
      }
    };
    reader.readAsText(selectedFile);
  }, []);

  const validateData = useCallback(() => {
    const validated = rawData.map(row => {
      const errors: string[] = [];
      const mappedRow: any = { _rowIndex: row._rowIndex };

      // Map columns based on user selection
      Object.entries(columnMapping).forEach(([csvColumn, fieldColumn]) => {
        if (fieldColumn && fieldColumn !== 'ignore') {
          mappedRow[fieldColumn] = row[csvColumn];
        }
      });

      // Validate required fields
      requiredFields.forEach(field => {
        if (!mappedRow[field] || mappedRow[field].trim() === '') {
          errors.push(`${field} is required`);
        }
      });

      // Validate field type
      if (mappedRow.type && !fieldTypes.includes(mappedRow.type)) {
        errors.push(`Invalid field type: ${mappedRow.type}. Must be one of: ${fieldTypes.join(', ')}`);
      }

      // Validate values format for Select/Multi-Select
      if ((mappedRow.type === 'Select' || mappedRow.type === 'Multi-Select') && mappedRow.values) {
        try {
          // Expect comma-separated values or JSON array
          if (typeof mappedRow.values === 'string') {
            mappedRow.values = mappedRow.values.split(',').map((v: string) => v.trim()).filter(Boolean);
          }
        } catch {
          errors.push('Values must be comma-separated for Select/Multi-Select fields');
        }
      }

      return {
        ...mappedRow,
        _errors: errors,
        _isValid: errors.length === 0
      };
    });

    const validCount = validated.filter(row => row._isValid).length;
    const invalidCount = validated.length - validCount;
    const allErrors = validated.flatMap(row => 
      row._errors.map((error: string) => ({ row: row._rowIndex, error }))
    );

    setMappedData(validated);
    setValidationResults({ valid: validCount, invalid: invalidCount, errors: allErrors });
    setStep('preview');
  }, [rawData, columnMapping]);

  const handleImport = async () => {
    setStep('importing');
    const validData = mappedData.filter(row => row._isValid);
    const success = await onImport(validData);
    if (success) {
      onClose();
      resetModal();
    } else {
      setStep('preview');
    }
  };

  const getFileHeaders = () => {
    if (rawData.length === 0) return [];
    return Object.keys(rawData[0]).filter(key => !key.startsWith('_'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Import Fields</h2>
              <p className="text-sm text-slate-600">
                Upload CSV, Excel, or JSON files to bulk create fields
              </p>
            </div>
          </div>
          <button onClick={onClose} disabled={step === 'importing'}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            {['upload', 'mapping', 'preview', 'importing'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === stepName ? 'bg-blue-600 text-white' :
                  index < ['upload', 'mapping', 'preview', 'importing'].indexOf(step) ? 'bg-green-600 text-white' :
                  'bg-slate-200 text-slate-500'
                }`}>
                  {index < ['upload', 'mapping', 'preview', 'importing'].indexOf(step) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 3 && <ArrowRight className="w-4 h-4 text-slate-400 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <div className="text-center py-12">
                  <div 
                    className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-blue-400 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileSpreadsheet className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Upload your file</h3>
                    <p className="text-slate-600 mb-4">
                      Drag and drop your CSV, Excel, or JSON file here, or click to browse
                    </p>
                    <div className="flex justify-center space-x-4 text-sm text-slate-500">
                      <span>✓ CSV (.csv)</span>
                      <span>✓ Excel (.xlsx, .xls)</span>
                      <span>✓ JSON (.json)</span>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {file && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-900">{file.name}</span>
                        <span className="text-sm text-blue-600">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {rawData.length > 0 && (
                  <div className="border-t border-slate-200 pt-6">
                    <h4 className="font-medium text-slate-900 mb-3">Preview ({rawData.length} rows)</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-slate-200 rounded-lg">
                        <thead className="bg-slate-50">
                          <tr>
                            {getFileHeaders().slice(0, 5).map(header => (
                              <th key={header} className="px-4 py-2 text-left text-sm font-medium text-slate-700 border-b">
                                {header}
                              </th>
                            ))}
                            {getFileHeaders().length > 5 && (
                              <th className="px-4 py-2 text-left text-sm font-medium text-slate-700 border-b">
                                +{getFileHeaders().length - 5} more...
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {rawData.slice(0, 3).map((row, idx) => (
                            <tr key={idx} className="border-b border-slate-100">
                              {getFileHeaders().slice(0, 5).map(header => (
                                <td key={header} className="px-4 py-2 text-sm text-slate-600">
                                  {String(row[header]).substring(0, 30)}
                                  {String(row[header]).length > 30 && '...'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {errors.length > 0 && (
                  <div className="mt-4">
                    <ErrorAlert message={errors.join(', ')} closable={false} />
                  </div>
                )}
              </motion.div>
            )}

            {step === 'mapping' && (
              <motion.div
                key="mapping"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Map Your Columns</h3>
                  <p className="text-slate-600">
                    Match your CSV columns to field properties. Required fields are marked with *
                  </p>
                </div>

                <div className="space-y-4">
                  {getFileHeaders().map(header => (
                    <div key={header} className="flex items-center space-x-4 p-4 border border-slate-200 rounded-lg">
                      <div className="flex-1">
                        <label className="font-medium text-slate-900">{header}</label>
                        <div className="text-sm text-slate-500 mt-1">
                          Sample: {String(rawData[0]?.[header] || '').substring(0, 50)}
                          {String(rawData[0]?.[header] || '').length > 50 && '...'}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <div className="flex-1">
                        <select
                          value={columnMapping[header] || ''}
                          onChange={(e) => setColumnMapping(prev => ({ ...prev, [header]: e.target.value }))}
                          className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                        >
                          <option value="">Select field property</option>
                          <option value="ignore">Ignore this column</option>
                          <option value="name">Field Name *</option>
                          <option value="description">Description *</option>
                          <option value="type">Field Type *</option>
                          <option value="parent">Parent Field</option>
                          <option value="values">Values (comma-separated)</option>
                          <option value="status">Status</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800">Field Type Values</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        Valid field types: {fieldTypes.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Import Preview</h3>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-700">{validationResults.valid} valid records</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="text-sm text-red-700">{validationResults.invalid} invalid records</span>
                    </div>
                  </div>
                </div>

                {validationResults.errors.length > 0 && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Validation Errors</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {validationResults.errors.slice(0, 10).map((error, idx) => (
                        <div key={idx} className="text-sm text-red-700">
                          Row {error.row}: {error.error}
                        </div>
                      ))}
                      {validationResults.errors.length > 10 && (
                        <div className="text-sm text-red-600 font-medium">
                          +{validationResults.errors.length - 10} more errors...
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-slate-200 rounded-lg">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Status</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Type</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Description</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Issues</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mappedData.slice(0, 10).map((row, idx) => (
                        <tr key={idx} className={`border-b border-slate-100 ${row._isValid ? 'bg-green-50' : 'bg-red-50'}`}>
                          <td className="px-4 py-2">
                            {row._isValid ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm font-medium text-slate-900">{row.name || '-'}</td>
                          <td className="px-4 py-2 text-sm text-slate-600">{row.type || '-'}</td>
                          <td className="px-4 py-2 text-sm text-slate-600">
                            {row.description ? String(row.description).substring(0, 40) + '...' : '-'}
                          </td>
                          <td className="px-4 py-2 text-sm text-red-600">
                            {row._errors.length > 0 ? row._errors.slice(0, 2).join(', ') : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {mappedData.length > 10 && (
                    <div className="p-4 text-center text-sm text-slate-500 border-t">
                      Showing 10 of {mappedData.length} records
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 'importing' && (
              <motion.div
                key="importing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 text-center py-16"
              >
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Importing Fields...</h3>
                <p className="text-slate-600">
                  Please wait while we create {validationResults.valid} fields
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center p-6 border-t border-slate-200 bg-slate-50">
          <div>
            {step === 'preview' && validationResults.invalid > 0 && (
              <p className="text-sm text-amber-700">
                Only valid records will be imported. Fix errors and re-upload to import all records.
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose}
              disabled={step === 'importing'}
            >
              Cancel
            </Button>
            {step === 'upload' && rawData.length > 0 && (
              <Button onClick={() => setStep('mapping')}>
                Next: Map Columns
              </Button>
            )}
            {step === 'mapping' && (
              <Button 
                onClick={validateData}
                disabled={!requiredFields.every(field => Object.values(columnMapping).includes(field))}
              >
                Next: Preview
              </Button>
            )}
            {step === 'preview' && (
              <Button 
                onClick={handleImport}
                disabled={validationResults.valid === 0 || isLoading}
              >
                Import {validationResults.valid} Fields
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export Modal Component
interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  fields: any[];
  onExport: (config: ExportConfig) => Promise<boolean>;
  isLoading?: boolean;
}

interface ExportConfig {
  format: 'csv' | 'excel' | 'json';
  fields: string[];
  includeRules: boolean;
  includeValues: boolean;
  groupBy?: string;
}

export function ExportModal({ isOpen, onClose, fields, onExport, isLoading = false }: ExportModalProps) {
  const [config, setConfig] = useState<ExportConfig>({
    format: 'csv',
    fields: ['name', 'type', 'description', 'status'],
    includeRules: true,
    includeValues: true
  });
  const [previewData, setPreviewData] = useState<any[]>([]);

  const availableFields = [
    { key: 'name', label: 'Field Name', required: true },
    { key: 'type', label: 'Field Type', required: true },
    { key: 'description', label: 'Description', required: false },
    { key: 'status', label: 'Status', required: false },
    { key: 'parent', label: 'Parent Field', required: false },
    { key: 'createdAt', label: 'Created Date', required: false },
    { key: 'updatedAt', label: 'Updated Date', required: false }
  ];

  const generatePreview = () => {
    const preview = fields.slice(0, 5).map(field => {
      const row: any = {};
      config.fields.forEach(fieldKey => {
        switch (fieldKey) {
          case 'values':
            row[fieldKey] = field.values ? field.values.join(', ') : '';
            break;
          case 'rules':
            row[fieldKey] = field.rules ? `${field.rules.length} rules` : '0 rules';
            break;
          default:
            row[fieldKey] = field[fieldKey] || '';
        }
      });
      if (config.includeValues && field.values) {
        row.values = field.values.join(', ');
      }
      if (config.includeRules && field.rules) {
        row.rulesCount = field.rules.length;
      }
      return row;
    });
    setPreviewData(preview);
  };

  React.useEffect(() => {
    if (isOpen) {
      generatePreview();
    }
  }, [isOpen, config, fields]);

  const handleExport = async () => {
    const success = await onExport(config);
    if (success) {
      onClose();
    }
  };

  const toggleField = (fieldKey: string) => {
    const field = availableFields.find(f => f.key === fieldKey);
    if (field?.required) return; // Can't remove required fields
    
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.includes(fieldKey)
        ? prev.fields.filter(f => f !== fieldKey)
        : [...prev.fields, fieldKey]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Export Fields</h2>
              <p className="text-sm text-slate-600">
                Download your fields data in various formats
              </p>
            </div>
          </div>
          <button onClick={onClose} disabled={isLoading}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Export Format */}
          <div>
            <h3 className="font-medium text-slate-900 mb-3">Export Format</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'csv', label: 'CSV', icon: FileText, desc: 'Comma-separated values' },
                { value: 'excel', label: 'Excel', icon: FileSpreadsheet, desc: 'Microsoft Excel format' },
                { value: 'json', label: 'JSON', icon: Database, desc: 'JavaScript Object Notation' }
              ].map(format => (
                <button
                  key={format.value}
                  onClick={() => setConfig(prev => ({ ...prev, format: format.value as any }))}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    config.format === format.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <format.icon className={`w-6 h-6 mb-2 ${
                    config.format === format.value ? 'text-blue-600' : 'text-slate-400'
                  }`} />
                  <div className="font-medium text-slate-900">{format.label}</div>
                  <div className="text-xs text-slate-500">{format.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Field Selection */}
          <div>
            <h3 className="font-medium text-slate-900 mb-3">Fields to Export</h3>
            <div className="grid grid-cols-2 gap-3">
              {availableFields.map(field => (
                <label
                  key={field.key}
                  className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    config.fields.includes(field.key)
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  } ${field.required ? 'opacity-75' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={config.fields.includes(field.key)}
                    onChange={() => toggleField(field.key)}
                    disabled={field.required}
                    className="rounded border-slate-300"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">{field.label}</div>
                    {field.required && (
                      <div className="text-xs text-slate-500">Required</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div>
            <h3 className="font-medium text-slate-900 mb-3">Additional Data</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={config.includeValues}
                  onChange={(e) => setConfig(prev => ({ ...prev, includeValues: e.target.checked }))}
                  className="rounded border-slate-300"
                />
                <div>
                  <div className="font-medium text-slate-900">Include Permissible Values</div>
                  <div className="text-sm text-slate-500">Export dropdown/select values as comma-separated list</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={config.includeRules}
                  onChange={(e) => setConfig(prev => ({ ...prev, includeRules: e.target.checked }))}
                  className="rounded border-slate-300"
                />
                <div>
                  <div className="font-medium text-slate-900">Include Business Rules</div>
                  <div className="text-sm text-slate-500">Export rule count and logic (JSON format only)</div>
                </div>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="font-medium text-slate-900 mb-3 flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Preview ({fields.length} total fields)
            </h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      {Object.keys(previewData[0] || {}).map(key => (
                        <th key={key} className="px-4 py-2 text-left text-sm font-medium text-slate-700 border-b">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        {Object.values(row).map((value, cellIdx) => (
                          <td key={cellIdx} className="px-4 py-2 text-sm text-slate-600">
                            {String(value).substring(0, 30)}
                            {String(value).length > 30 && '...'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {fields.length > 5 && (
                <div className="p-3 text-center text-sm text-slate-500 border-t bg-slate-50">
                  Showing 5 of {fields.length} fields
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center p-6 border-t border-slate-200 bg-slate-50">
          <div className="text-sm text-slate-600">
            Ready to export {fields.length} fields in {config.format.toUpperCase()} format
          </div>
          <div className="flex space-x-3">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isLoading || config.fields.length === 0}>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Exporting...
                </div>
              ) : (
                `Export ${config.format.toUpperCase()}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}