'use client';

import React, { useState, useEffect } from 'react';
import { X, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ErrorAlert } from '@/components/ui/Alert';
import type { Role, CreateRoleDto, UpdateRoleDto } from '@/shared/types';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRoleDto | UpdateRoleDto) => Promise<boolean>;
  role?: Role | null;
  isLoading?: boolean;
  error?: string | null;
}

const colorOptions = [
  { value: 'bg-blue-100 text-blue-800', label: 'Blue', preview: 'bg-blue-100 text-blue-800' },
  { value: 'bg-green-100 text-green-800', label: 'Green', preview: 'bg-green-100 text-green-800' },
  { value: 'bg-purple-100 text-purple-800', label: 'Purple', preview: 'bg-purple-100 text-purple-800' },
  { value: 'bg-orange-100 text-orange-800', label: 'Orange', preview: 'bg-orange-100 text-orange-800' },
  { value: 'bg-red-100 text-red-800', label: 'Red', preview: 'bg-red-100 text-red-800' },
  { value: 'bg-gray-100 text-gray-800', label: 'Gray', preview: 'bg-gray-100 text-gray-800' },
];

export function RoleModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  role, 
  isLoading = false,
  error 
}: RoleModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'bg-blue-100 text-blue-800'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const isEditing = !!role;

  // Reset form when modal opens/closes or role changes
  useEffect(() => {
    if (isOpen) {
      if (role) {
        setFormData({
          name: role.name,
          description: role.description || '',
          color: role.color
        });
      } else {
        setFormData({
          name: '',
          description: '',
          color: 'bg-blue-100 text-blue-800'
        });
      }
      setFormErrors({});
    }
  }, [isOpen, role]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Role name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Role name must be at least 2 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 5) {
      errors.description = 'Description must be at least 5 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      color: formData.color
    });

    if (success) {
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {isEditing ? 'Edit Role' : 'Create New Role'}
              </h2>
              <p className="text-sm text-slate-600">
                {isEditing ? 'Update role details' : 'Define a new role with permissions'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Alert */}
          {error && (
            <ErrorAlert 
              message={error}
              closable={false}
            />
          )}

          {/* Role Name */}
          <Input
            label="Role Name"
            placeholder="e.g., Manager, Engineer, Viewer"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={formErrors.name}
            disabled={isLoading}
            required
          />

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              placeholder="Describe what this role can do..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isLoading}
              rows={3}
              className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500 resize-none"
              required
            />
            {formErrors.description && (
              <p className="text-sm text-red-600">{formErrors.description}</p>
            )}
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Color Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('color', option.value)}
                  disabled={isLoading}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    formData.color === option.value
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`px-2 py-1 rounded text-xs font-medium ${option.preview}`}>
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Preview
            </label>
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${formData.color}`}>
                  {formData.name || 'Role Name'}
                </span>
                <span className="text-sm text-slate-600">
                  {formData.description || 'Role description...'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                isEditing ? 'Update Role' : 'Create Role'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}