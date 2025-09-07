// components/projects/ProjectModal.tsx
'use client';

import React, { useEffect } from 'react';
import { X, FolderOpen } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ErrorAlert } from '@/components/ui/Alert';
import { ProjectBasicInfo } from './modal/ProjectBasicInfo';
import { ProjectTeamAssignment } from './modal/ProjectTeamAssignment';
import { ProjectFieldAssignment } from './modal/ProjectFieldAssignment';
import { useProjectModal } from '@/hooks/useProjectModal';
import type { Project, CreateProjectDto, UpdateProjectDto } from '@/shared/types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProjectDto | UpdateProjectDto) => Promise<boolean>;
  project?: Project | null;
  isLoading?: boolean;
  error?: string | null;
}

export function ProjectModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  project, 
  isLoading = false,
  error
}: ProjectModalProps) {
  const {
    step,
    formData,
    formErrors,
    availableUsers,
    availableFields,
    assignedFields,
    unassignedFields,
    setStep,
    handleInputChange,
    handleUserToggle,
    moveField,
    moveAllFields,
    moveBulkFields,
    validateForm,
    resetForm,
    isEditing
  } = useProjectModal(isOpen, project);

  const handleSubmit = async (e: React.FormEvent) => {
    // console.log('🚨 handleSubmit called! Event:', e);
    // console.log('🚨 Event type:', e.type);
    // console.log('🚨 Event target:', e.target);
    // console.log('🚨 Current step:', step);
    // e.preventDefault();

    // if (step === 3) {
    //   console.log('🚨 STEP 3 - WHY IS SUBMIT BEING CALLED?');
    //   console.log('🚨 Stack trace:', new Error().stack);
    //   // Temporarily return early to prevent submission
    //   return;
    // }
    
    try {
      console.log('🔄 Form submission started, step:', step);
      
      // For steps 1 and 2, just move to next step
      if (step < 3) {
        // Simple validation for current step
        if (step === 1 && !formData.name.trim()) {
          console.log('❌ Step 1 validation failed: name required');
          return;
        }
        if (step === 2) {
          const totalUsers = (formData.adminUserIds?.length || 0) + 
                            (formData.projectManagerIds?.length || 0) + 
                            (formData.developerIds?.length || 0);
          if (totalUsers === 0) {
            console.log('❌ Step 2 validation failed: no users assigned');
            return;
          }
        }
        
        console.log('✅ Moving to next step:', step + 1);
        setStep(step + 1);
        return;
      }

      // Step 3: Final validation and submission
      if (!validateForm()) {
        console.log('❌ Final validation failed');
        return;
      }

      // 🔧 FIXED: Create properly formatted submission data
      const submitData: CreateProjectDto | UpdateProjectDto = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        ...(formData.fieldNames && formData.fieldNames.length > 0 && {
          fieldNames: formData.fieldNames
        })
      };

      console.log('📤 Submitting project data:', submitData);
      
      const success = await onSubmit(submitData);
      
      if (success) {
        console.log('✅ Submission successful, closing modal');
        resetForm();
        onClose(); // 🔧 FIXED: Uncommented this line!
      } else {
        console.log('❌ Submission failed');
      }
    } catch (error) {
      console.error('💥 Error in handleSubmit:', error);
    }
  };

  const handleClose = () => {
    console.log('🚪 Modal closing, resetting form');
    resetForm();
    onClose();
  };

  const handlePrevious = () => {
    if (step > 1) {
      console.log('⬅️ Going to previous step:', step - 1);
      setStep(step - 1);
    }
  };

  // 🔧 FIXED: Complete canProceed function
  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim().length >= 3;
      case 2: {
        const totalUsers = (formData.adminUserIds?.length || 0) + 
                          (formData.projectManagerIds?.length || 0) + 
                          (formData.developerIds?.length || 0);
        return totalUsers > 0;
      }
      case 3:
        return true; // Field assignment is optional
      default:
        return false;
    }
  };

  // 🔧 FIXED: Add error boundary effect
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('🚨 Unhandled error in ProjectModal:', event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {isEditing ? 'Edit Project' : 'Create New Project'}
              </h2>
              <p className="text-sm text-slate-600">
                {isEditing ? 'Update project details and assignments' : 'Define a new power generation project'}
              </p>
            </div>
          </div>
          <button type="button"
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4 bg-white border-b border-slate-200">
          <div className="flex items-center space-x-4">
            {[
              { number: 1, title: 'Basic Info' },
              { number: 2, title: 'Team Members' },
              { number: 3, title: 'Field Assignment' }
            ].map((stepInfo) => (
              <div key={stepInfo.number} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === stepInfo.number 
                    ? 'bg-blue-600 text-white' 
                    : step > stepInfo.number
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {stepInfo.number}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step === stepInfo.number ? 'text-blue-600' : 'text-slate-600'
                }`}>
                  {stepInfo.title}
                </span>
                {stepInfo.number < 3 && (
                  <div className="w-8 h-0.5 bg-slate-200 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          {error && (
            <div className="p-6 pb-0">
              <ErrorAlert message={error} closable={false} />
            </div>
          )}

          {/* Step Content */}
          {step === 1 && (
            <ProjectBasicInfo
              formData={formData}
              formErrors={formErrors}
              onInputChange={handleInputChange}
              isLoading={isLoading}
            />
          )}

          {step === 2 && (
            <ProjectTeamAssignment
              formData={formData}
              availableUsers={availableUsers}
              onUserToggle={handleUserToggle}
              isLoading={isLoading}
            />
          )}

        {step === 3 && (
          <ProjectFieldAssignment
            assignedFields={assignedFields}
            unassignedFields={unassignedFields}
            onMoveField={moveField}
            onMoveAllFields={moveAllFields}
            onMoveBulkFields={moveBulkFields}
            isLoading={isLoading}
            mode={isEditing ? 'edit' : 'add'}
          />
          
        )}

          {/* Navigation and Actions */}
          <div className="flex justify-between items-center p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex space-x-3">
              {step > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handlePrevious}
                  disabled={isLoading}
                >
                  Previous
                </Button>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={isLoading || !canProceed()}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </div>
                  ) : (
                    isEditing ? 'Update Project' : 'Create Project'
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}