// hooks/useProjectModal.ts
import { useState, useEffect, useCallback } from 'react';
import type { Project, User } from '@/shared/types';

export interface ProjectFormData {
  name: string;
  description: string;
  adminUserIds: string[];
  projectManagerIds: string[];
  developerIds: string[];
  fieldNames: string[];
}

export function useProjectModal(isOpen: boolean, project?: Project | null) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    adminUserIds: [],
    projectManagerIds: [],
    developerIds: [],
    fieldNames: []
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Mock data
  const availableUsers: User[] = [
    { id: 'user1', name: 'Lisa Davis', email: 'lisa.analyst@powertech.com', status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date(), roles: [] },
    { id: 'user2', name: 'Mike Wilson', email: 'mike.lead@powertech.com', status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date(), roles: [] },
    { id: 'user3', name: 'Sarah Johnson', email: 'sarah.engineer@powertech.com', status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date(), roles: [] },
  ];

  // Generate test fields
  const availableFields = [
    'Project Name', 'Project Code', 'Technology Type', 'Nameplate Capacity (MW)',
    'State/Province', 'County', 'Project Status', 'Planned COD', 'Developer',
    'Total Project Cost ($M)', 'PPA Status', 'Capacity Factor (%)',
    ...Array.from({ length: 50 }, (_, i) => `Field_${String(i + 1).padStart(3, '0')}`)
  ];

  // Computed values with safety checks
  const assignedFields = Array.isArray(formData.fieldNames) ? formData.fieldNames : [];
  const unassignedFields = availableFields.filter(field => !assignedFields.includes(field));
  const isEditing = !!project;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (project) {
        // Load project data
        setFormData({
          name: project.name || '',
          description: project.description || '',
          adminUserIds: project.projectUsers?.filter(pu => pu.role === 'ADMIN').map(pu => pu.userId) || [],
          projectManagerIds: project.projectUsers?.filter(pu => pu.role === 'PROJECT_MANAGER').map(pu => pu.userId) || [],
          developerIds: project.projectUsers?.filter(pu => pu.role === 'DEVELOPER').map(pu => pu.userId) || [],
          fieldNames: Array.isArray(project.assignedFields) ? project.assignedFields : []
        });
        setStep(1);
      } else if (step === 1) {
        // Only reset when first opening in create mode
        resetForm();
      }
    }
  }, [isOpen]);   // 🔑 remove "project" from deps
  
  

  // Input change handler
  const handleInputChange = useCallback((field: string, value: any) => {
    try {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
      
      // Clear error for this field
      if (formErrors[field]) {
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    } catch (error) {
      console.error('Error handling input change:', error);
    }
  }, [formErrors]);

  // User toggle handler
  const handleUserToggle = useCallback((userId: string, role: 'adminUserIds' | 'projectManagerIds' | 'developerIds') => {
    try {
      setFormData(prev => {
        const currentUsers = Array.isArray(prev[role]) ? prev[role] : [];
        const isAssigned = currentUsers.includes(userId);
        
        return {
          ...prev,
          [role]: isAssigned 
            ? currentUsers.filter(id => id !== userId)
            : [...currentUsers, userId]
        };
      });
    } catch (error) {
      console.error('Error toggling user:', error);
    }
  }, []);

  // Field movement handlers
  const moveField = useCallback((fieldName: string, direction: 'assign' | 'unassign') => {
    try {
      if (!fieldName || typeof fieldName !== 'string') {
        console.warn('Invalid field name:', fieldName);
        return;
      }

      setFormData(prev => {
        const currentFields = Array.isArray(prev.fieldNames) ? prev.fieldNames : [];
        
        if (direction === 'assign') {
          if (!currentFields.includes(fieldName)) {
            return {
              ...prev,
              fieldNames: [...currentFields, fieldName]
            };
          }
        } else {
          return {
            ...prev,
            fieldNames: currentFields.filter(f => f !== fieldName)
          };
        }
        return prev;
      });
    } catch (error) {
      console.error('Error moving field:', error);
    }
  }, []);

  const moveAllFields = useCallback((direction: 'assign' | 'unassign') => {
    try {
      setFormData(prev => {
        if (direction === 'assign') {
          const currentFields = Array.isArray(prev.fieldNames) ? prev.fieldNames : [];
          const fieldsToAdd = availableFields.filter(field => !currentFields.includes(field));
          return {
            ...prev,
            fieldNames: [...currentFields, ...fieldsToAdd]
          };
        } else {
          return {
            ...prev,
            fieldNames: []
          };
        }
      });
    } catch (error) {
      console.error('Error moving all fields:', error);
    }
  }, [availableFields]);

  // Validation function
  const validateForm = useCallback((): boolean => {
    try {
      const errors: Record<string, string> = {};

      if (!formData.name?.trim()) {
        errors.name = 'Project name is required';
      } else if (formData.name.trim().length < 3) {
        errors.name = 'Project name must be at least 3 characters';
      }

      const totalUsers = (formData.adminUserIds?.length || 0) + 
                        (formData.projectManagerIds?.length || 0) + 
                        (formData.developerIds?.length || 0);
      
      if (totalUsers === 0) {
        errors.team = 'At least one team member must be assigned';
      }

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    } catch (error) {
      console.error('Error validating form:', error);
      return false;
    }
  }, [formData]);

  // Reset form
  const resetForm = useCallback(() => {
    try {
      setFormData({
        name: '',
        description: '',
        adminUserIds: [],
        projectManagerIds: [],
        developerIds: [],
        fieldNames: []
      });
      setFormErrors({});
      setStep(1);
    } catch (error) {
      console.error('Error resetting form:', error);
    }
  }, []);

  return {
    // Form state
    step,
    formData,
    formErrors,
    
    // Data
    availableUsers,
    availableFields,
    assignedFields,
    unassignedFields,
    
    // Computed
    isEditing,
    
    // Actions
    setStep,
    handleInputChange,
    handleUserToggle,
    moveField,
    moveAllFields,
    validateForm,
    resetForm
  };
}