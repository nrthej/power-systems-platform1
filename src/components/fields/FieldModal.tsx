'use client';

import React, { useState, useEffect } from 'react';
import { X, Database, Plus, Trash2, Info, Eye } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ErrorAlert } from '@/components/ui/Alert';
import RuleBuilder, { Rule } from './RuleBuilder';
import type { Field, CreateFieldDto, UpdateFieldDto } from '@/shared/types';

interface FieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFieldDto | UpdateFieldDto) => Promise<boolean>;
  field?: Field | null;
  isLoading?: boolean;
  error?: string | null;
  availableFields?: Field[];
}

const fieldTypes = [
  { id: 'Text', name: 'Text', icon: '📝', description: 'Free-form text input' },
  { id: 'Number', name: 'Number', icon: '🔢', description: 'Integer or decimal values' },
  { id: 'Date', name: 'Date', icon: '📅', description: 'Calendar date picker' },
  { id: 'Boolean', name: 'Boolean', icon: '✅', description: 'Yes/No toggle' },
  { id: 'Select', name: 'Select', icon: '📋', description: 'Dropdown with single choice' },
  { id: 'Multi-Select', name: 'Multi-Select', icon: '🏷️', description: 'Dropdown with multiple choices' }
];

export function FieldModal({
  isOpen,
  onClose,
  onSubmit,
  field,
  isLoading = false,
  error,
  availableFields = []
}: FieldModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Text',
    parent: '',
    values: [] as string[],
    rules: [] as Rule[]
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [chipInput, setChipInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const isEditing = !!field;

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      if (field) {
        setFormData({
          name: field.name,
          description: field.description || '',
          type: field.type,
          parent: field.parent || '',
          values: field.values || [],
          rules: (field.rules as Rule[]) || []
        });
      } else {
        setFormData({
          name: '',
          description: '',
          type: 'Text',
          parent: '',
          values: [],
          rules: []
        });
      }
      setChipInput('');
      setFormErrors({});
      setShowPreview(false);
    }
  }, [isOpen, field]);

  // When field name changes, update existing rules' conditionField
  useEffect(() => {
    if (formData.name && formData.rules.length > 0) {
      const updatedRules = formData.rules.map(rule => ({
        ...rule,
        conditionField: formData.name // Always set to current field name
      }));
      setFormData(prev => ({ ...prev, rules: updatedRules }));
    }
  }, [formData.name]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Field name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload: CreateFieldDto | UpdateFieldDto = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      type: formData.type,
      parent: formData.parent || null,
      values:
        formData.type === 'Select' || formData.type === 'Multi-Select'
          ? formData.values
          : undefined,
      rules: formData.rules
    };

    const success = await onSubmit(payload);
    if (success) onClose();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const addChip = () => {
    if (chipInput.trim() && !formData.values.includes(chipInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        values: [...prev.values, chipInput.trim()]
      }));
      setChipInput('');
    }
  };

  const removeChip = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== idx)
    }));
  };

  const handleRulesChange = (newRules: Rule[]) => {
    // Ensure all rules have the current field name as conditionField
    const rulesWithCorrectSource = newRules.map(rule => ({
      ...rule,
      conditionField: formData.name || rule.conditionField
    }));
    setFormData((prev) => ({ ...prev, rules: rulesWithCorrectSource }));
  };

  const selectedFieldType = fieldTypes.find(ft => ft.id === formData.type);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Main Form */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {isEditing ? 'Edit Field' : 'Create New Field'}
                </h2>
                <p className="text-sm text-slate-600">
                  {isEditing ? 'Update field configuration and rules' : 'Define a new project field with validation rules'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                title="Toggle preview"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {error && <ErrorAlert message={error} closable={false} />}

              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-slate-700">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Info className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Basic Information</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <Input
                      label="Field Name"
                      placeholder="e.g., Project Status, Customer Rating"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      error={formErrors.name}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe what this field is used for and any special requirements..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      disabled={isLoading}
                      rows={3}
                      className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-500 resize-none transition-all"
                    />
                    {formErrors.description && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Field Configuration */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-slate-700">
                  <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Database className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">Configuration</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Field Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {fieldTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => handleInputChange('type', type.id)}
                          className={`p-3 rounded-xl border-2 transition-all text-left ${
                            formData.type === type.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg">{type.icon}</span>
                            <span className="font-medium text-sm">{type.name}</span>
                          </div>
                          <p className="text-xs text-slate-500">{type.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Parent Field */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Parent Field (Optional)
                    </label>
                    <select
                      value={formData.parent}
                      onChange={(e) => {
                        const nextParent = e.target.value;
                        if (field && nextParent === field.name) return;
                        handleInputChange('parent', nextParent);
                      }}
                      disabled={isLoading}
                      className="w-full py-3 px-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="">No parent field</option>
                      {availableFields
                        .filter(f => f.name !== formData.name) // Don't allow self as parent
                        .map((f) => (
                          <option key={f.id} value={f.name}>
                            {f.name} ({f.type})
                          </option>
                        ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">
                      Link this field to another field for hierarchical organization
                    </p>
                  </div>
                </div>

                {/* Permissible Values */}
                {(formData.type === 'Select' || formData.type === 'Multi-Select') && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Permissible Values
                    </label>
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                      {formData.values.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {formData.values.map((val, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-200"
                            >
                              {val}
                              <button
                                type="button"
                                onClick={() => removeChip(idx)}
                                className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Add a new value..."
                          value={chipInput}
                          onChange={(e) => setChipInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addChip();
                            }
                          }}
                          className="flex-1 py-2 px-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                        />
                        <Button 
                          type="button" 
                          size="sm" 
                          onClick={addChip}
                          className="flex items-center space-x-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Rules Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-slate-700">
                  <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                    <Database className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Business Rules</h3>
                </div>
                <RuleBuilder
                  rules={formData.rules}
                  onChange={handleRulesChange}
                  availableFields={availableFields}
                  currentFieldName={formData.name} // Lock source field to current field
                  isInsideModal={true} // Show modal-specific UI
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
                <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </div>
                  ) : isEditing ? (
                    'Update Field'
                  ) : (
                    'Create Field'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="w-80 border-l border-slate-200 bg-slate-50 flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Live Preview
              </h3>
            </div>
            <div className="flex-1 p-4">
              <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    {selectedFieldType?.icon || '📄'}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">
                      {formData.name || 'Field Name'}
                    </h4>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {formData.type}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600">
                  {formData.description || 'Field description will appear here...'}
                </p>

                {formData.parent && (
                  <div className="text-xs text-slate-500">
                    Parent: <span className="font-medium">{formData.parent}</span>
                  </div>
                )}

                {formData.values.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-2">Values:</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.values.slice(0, 3).map((val, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {val}
                        </span>
                      ))}
                      {formData.values.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                          +{formData.values.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {formData.rules.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-2">Rules:</p>
                    <div className="text-xs text-slate-600">
                      {formData.rules.length} rule{formData.rules.length !== 1 ? 's' : ''} configured
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}