// src/components/fields/FieldModal.tsx
import { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Plus, 
  Trash2,
  Type, 
  Hash, 
  Calendar, 
  List, 
  ToggleLeft, 
  Mail, 
  MapPin, 
  DollarSign,
  AlertCircle
} from 'lucide-react';

import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { Field, FieldType, EntityType, FieldStatus, FieldValidation, fieldTypeInfo } from './fieldsData';

interface FieldModalProps {
  field?: Field | null;
  onSave: (fieldData: Partial<Field>) => void;
  onClose: () => void;
}

interface FieldFormData {
  name: string;
  label: string;
  description: string;
  type: FieldType;
  category: string;
  entityType: EntityType;
  isRequired: boolean;
  status: FieldStatus;
  displayOrder: number;
  validation: FieldValidation;
  permissibleValues: string[];
  parentFieldId?: string;
}

const initialFormData: FieldFormData = {
  name: '',
  label: '',
  description: '',
  type: FieldType.TEXT,
  category: 'technical',
  entityType: EntityType.PROJECT,
  isRequired: false,
  status: FieldStatus.ACTIVE,
  displayOrder: 0,
  validation: {},
  permissibleValues: [],
  parentFieldId: undefined
};

export function FieldModal({ field, onSave, onClose }: FieldModalProps) {
  const [formData, setFormData] = useState<FieldFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newPermissibleValue, setNewPermissibleValue] = useState('');

  const isEditing = !!field;

  // Initialize form data
  useEffect(() => {
    if (field) {
      setFormData({
        name: field.name,
        label: field.label,
        description: field.description || '',
        type: field.type,
        category: field.category,
        entityType: field.entityType,
        isRequired: field.isRequired,
        status: field.status,
        displayOrder: field.displayOrder,
        validation: field.validation || {},
        permissibleValues: field.permissibleValues || [],
        parentFieldId: field.parentFieldId
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [field]);

  // Get current field type info
  const currentFieldTypeInfo = fieldTypeInfo.find(ft => ft.type === formData.type);

  // Icon mapping
  const getFieldTypeIcon = (type: FieldType) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case FieldType.TEXT: return <Type className={iconClass} />;
      case FieldType.NUMBER: return <Hash className={iconClass} />;
      case FieldType.DATE: return <Calendar className={iconClass} />;
      case FieldType.SELECT:
      case FieldType.MULTI_SELECT: return <List className={iconClass} />;
      case FieldType.BOOLEAN: return <ToggleLeft className={iconClass} />;
      case FieldType.EMAIL: return <Mail className={iconClass} />;
      case FieldType.LOCATION: return <MapPin className={iconClass} />;
      case FieldType.CURRENCY: return <DollarSign className={iconClass} />;
      default: return <Type className={iconClass} />;
    }
  };

  // Generate field name from label
  const generateFieldName = (label: string): string => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .trim();
  };

  // Handle label change and auto-generate name if not editing
  const handleLabelChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      label: value,
      ...((!isEditing && !prev.name) ? { name: generateFieldName(value) } : {})
    }));
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.label.trim()) {
      newErrors.label = 'Field label is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Field name is required';
    } else if (!/^[a-z][a-z0-9_]*$/.test(formData.name)) {
      newErrors.name = 'Field name must start with a letter and contain only lowercase letters, numbers, and underscores';
    }

    if (currentFieldTypeInfo?.supportsPermissibleValues && formData.permissibleValues.length === 0) {
      newErrors.permissibleValues = 'At least one option is required for select fields';
    }

    if (formData.type === FieldType.NUMBER || formData.type === FieldType.CURRENCY) {
      if (formData.validation.min !== undefined && formData.validation.max !== undefined) {
        if (formData.validation.min >= formData.validation.max) {
          newErrors.validation = 'Minimum value must be less than maximum value';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = () => {
    if (!validateForm()) return;

    const fieldData: Partial<Field> = {
      ...formData,
      updatedAt: new Date().toISOString(),
      ...((!isEditing) ? { 
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        createdBy: 'current-user@company.com'
      } : {})
    };

    onSave(fieldData);
  };

  // Handle permissible values
  const addPermissibleValue = () => {
    if (newPermissibleValue.trim() && !formData.permissibleValues.includes(newPermissibleValue.trim())) {
      setFormData(prev => ({
        ...prev,
        permissibleValues: [...prev.permissibleValues, newPermissibleValue.trim()]
      }));
      setNewPermissibleValue('');
    }
  };

  const removePermissibleValue = (index: number) => {
    setFormData(prev => ({
      ...prev,
      permissibleValues: prev.permissibleValues.filter((_, i) => i !== index)
    }));
  };

  // Handle validation changes
  const updateValidation = (key: keyof FieldValidation, value: any) => {
    setFormData(prev => ({
      ...prev,
      validation: {
        ...prev.validation,
        [key]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Field' : 'Create New Field'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto space-y-6">
          
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field Label <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.label}
                  onChange={(e) => handleLabelChange(e.target.value)}
                  placeholder="e.g., Voltage Level (kV)"
                  className={errors.label ? 'border-red-300' : ''}
                />
                {errors.label && (
                  <p className="mt-1 text-sm text-red-600">{errors.label}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., voltage_level"
                  disabled={isEditing}
                  className={errors.name ? 'border-red-300' : ''}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
                {isEditing && (
                  <p className="mt-1 text-xs text-gray-500">Field name cannot be changed after creation</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this field is used for..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Field Type Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Field Type</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {fieldTypeInfo.map((typeInfo) => (
                <button
                  key={typeInfo.type}
                  type="button"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    type: typeInfo.type,
                    permissibleValues: typeInfo.supportsPermissibleValues ? prev.permissibleValues : []
                  }))}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    formData.type === typeInfo.type
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getFieldTypeIcon(typeInfo.type)}
                    <span className="font-medium text-sm">{typeInfo.label}</span>
                  </div>
                  <p className="text-xs text-gray-600">{typeInfo.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="technical">Technical</option>
                  <option value="financial">Financial</option>
                  <option value="administrative">Administrative</option>
                  <option value="regulatory">Regulatory</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entity Type
                </label>
                <select
                  value={formData.entityType}
                  onChange={(e) => setFormData(prev => ({ ...prev, entityType: e.target.value as EntityType }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={EntityType.PROJECT}>Project</option>
                  <option value={EntityType.USER}>User</option>
                  <option value={EntityType.ASSET}>Asset</option>
                  <option value={EntityType.GLOBAL}>Global</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as FieldStatus }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={FieldStatus.ACTIVE}>Active</option>
                  <option value={FieldStatus.INACTIVE}>Inactive</option>
                  <option value={FieldStatus.DEPRECATED}>Deprecated</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isRequired}
                  onChange={(e) => setFormData(prev => ({ ...prev, isRequired: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Required field</span>
              </label>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Display Order:</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Permissible Values for SELECT fields */}
          {currentFieldTypeInfo?.supportsPermissibleValues && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Options</h3>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newPermissibleValue}
                    onChange={(e) => setNewPermissibleValue(e.target.value)}
                    placeholder="Enter option value"
                    onKeyPress={(e) => e.key === 'Enter' && addPermissibleValue()}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addPermissibleValue}
                    disabled={!newPermissibleValue.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {formData.permissibleValues.length > 0 && (
                  <div className="space-y-2">
                    {formData.permissibleValues.map((value, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <span className="text-sm">{value}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePermissibleValue(index)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {errors.permissibleValues && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.permissibleValues}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Validation Rules */}
          {currentFieldTypeInfo?.validationOptions && currentFieldTypeInfo.validationOptions.length > 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Validation Rules</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentFieldTypeInfo.validationOptions.includes('minLength') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Length
                    </label>
                    <Input
                      type="number"
                      value={formData.validation.minLength || ''}
                      onChange={(e) => updateValidation('minLength', parseInt(e.target.value) || undefined)}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                )}

                {currentFieldTypeInfo.validationOptions.includes('maxLength') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Length
                    </label>
                    <Input
                      type="number"
                      value={formData.validation.maxLength || ''}
                      onChange={(e) => updateValidation('maxLength', parseInt(e.target.value) || undefined)}
                      placeholder="255"
                      min="1"
                    />
                  </div>
                )}

                {currentFieldTypeInfo.validationOptions.includes('min') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Value
                    </label>
                    <Input
                      type="number"
                      value={formData.validation.min || ''}
                      onChange={(e) => updateValidation('min', parseFloat(e.target.value) || undefined)}
                      placeholder="0"
                    />
                  </div>
                )}

                {currentFieldTypeInfo.validationOptions.includes('max') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Value
                    </label>
                    <Input
                      type="number"
                      value={formData.validation.max || ''}
                      onChange={(e) => updateValidation('max', parseFloat(e.target.value) || undefined)}
                      placeholder="1000"
                    />
                  </div>
                )}

                {currentFieldTypeInfo.validationOptions.includes('pattern') && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pattern (Regex)
                    </label>
                    <Input
                      value={formData.validation.pattern || ''}
                      onChange={(e) => updateValidation('pattern', e.target.value || undefined)}
                      placeholder="^[A-Z]{2,3}$"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      JavaScript regular expression pattern for validation
                    </p>
                  </div>
                )}
              </div>

              {errors.validation && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.validation}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Update Field' : 'Create Field'}
          </Button>
        </div>
      </Card>
    </div>
  );
}