'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ErrorAlert } from '@/components/ui/Alert';
import type { User as UserType, CreateUserDto, UpdateUserDto, Role, UserStatus } from '@/shared/types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserDto | UpdateUserDto) => Promise<boolean>;
  user?: UserType | null;
  isLoading?: boolean;
  error?: string | null;
  availableRoles?: Role[];
}

const statusOptions = [
  { value: 'ACTIVE', label: 'Active', color: 'text-green-600' },
  { value: 'INACTIVE', label: 'Inactive', color: 'text-gray-600' },
  { value: 'SUSPENDED', label: 'Suspended', color: 'text-red-600' },
] as const;

export function UserModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  user, 
  isLoading = false,
  error,
  availableRoles = []
}: UserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    status: 'ACTIVE' as UserStatus,
    roleIds: [] as string[]
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const isEditing = !!user;

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          password: '', // Never pre-fill password for editing
          status: user.status,
          roleIds: user.roles?.map(role => role.id) || []
        });
      } else {
        setFormData({
          name: '',
          email: '',
          password: '',
          status: 'ACTIVE',
          roleIds: []
        });
      }
      setFormErrors({});
      setShowPassword(false);
    }
  }, [isOpen, user]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation (only for new users)
    if (!isEditing) {
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: CreateUserDto | UpdateUserDto = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      status: formData.status,
      ...(formData.roleIds.length > 0 && { roleIds: formData.roleIds })
    };

    // Only include password for new users
    if (!isEditing && formData.password) {
      (submitData as CreateUserDto).password = formData.password;
    }

    const success = await onSubmit(submitData);

    if (success) {
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRoleToggle = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter(id => id !== roleId)
        : [...prev.roleIds, roleId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {isEditing ? 'Edit User' : 'Create New User'}
              </h2>
              <p className="text-sm text-slate-600">
                {isEditing ? 'Update user details and permissions' : 'Add a new team member'}
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

          {/* Name */}
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={formErrors.name}
            disabled={isLoading}
            icon={<User className="h-5 w-5 text-slate-400" />}
            required
          />

          {/* Email */}
          <Input
            label="Email Address"
            type="email"
            placeholder="john@company.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={formErrors.email}
            disabled={isLoading}
            icon={<Mail className="h-5 w-5 text-slate-400" />}
            required
          />

          {/* Password (only for new users) */}
          {!isEditing && (
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter secure password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={formErrors.password}
              disabled={isLoading}
              icon={<Lock className="h-5 w-5 text-slate-400" />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              }
              required
            />
          )}

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Roles */}
          {availableRoles.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Roles <span className="text-slate-500">(optional)</span>
              </label>
              <div className="border border-slate-200 rounded-xl p-3 space-y-2 max-h-32 overflow-y-auto">
                {availableRoles.map((role) => (
                  <label
                    key={role.id}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={formData.roleIds.includes(role.id)}
                      onChange={() => handleRoleToggle(role.id)}
                      disabled={isLoading}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-slate-700">{role.name}</span>
                      {role.description && (
                        <span className="text-xs text-slate-500">- {role.description}</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Select one or more roles for this user
              </p>
            </div>
          )}

          {/* Preview */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Preview
            </label>
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {formData.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {formData.name || 'User Name'}
                  </p>
                  <p className="text-xs text-slate-600">
                    {formData.email || 'user@email.com'}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs ${statusOptions.find(s => s.value === formData.status)?.color}`}>
                      {statusOptions.find(s => s.value === formData.status)?.label}
                    </span>
                    {formData.roleIds.length > 0 && (
                      <span className="text-xs text-slate-500">
                        • {formData.roleIds.length} role{formData.roleIds.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
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
                isEditing ? 'Update User' : 'Create User'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}