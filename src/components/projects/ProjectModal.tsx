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
    moveBulkFields, // Now available from the hook
    validateForm, // Now properly implemented
    resetForm,
    isEditing
  } = useProjectModal(isOpen, project);

  // 🔹 Debug render tracking
  useEffect(() => {
    console.log("🟢 ProjectModal mounted, isOpen:", isOpen, "step:", step);
    return () => console.log("🔴 ProjectModal unmounted, step:", step);
  }, [isOpen, step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the current step or entire form on final step
    if (step === 3) {
      // Final validation
      if (!validateForm()) {
        return;
      }
    } else {
      // Step-specific validation
      if (step === 1 && !formData.name.trim()) {
        return;
      }
    }

    // If not on final step, go to next step
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Final submission
    const submitData: CreateProjectDto | UpdateProjectDto = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      status: 'PLANNING',
      adminUserIds: formData.adminUserIds,
      projectManagerIds: formData.projectManagerIds,
      developerIds: formData.developerIds,
      fieldNames: formData.fieldNames // Use fieldNames to match your API
    };

    const success = await onSubmit(submitData);
    if (success) {
      resetForm();
      // onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim().length >= 3;
      case 2:
        const totalUsers = formData.adminUserIds.length + formData.projectManagerIds.length + formData.developerIds.length;
        return totalUsers > 0;
      case 3:
        return true; // Field assignment is optional
      default:
        return false;
    }
  };

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
          <button
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
            <>
              {console.log(
                'Rendering step 3, assignedFields:',
                assignedFields,
                'unassignedFields:',
                unassignedFields
              )}
              <ProjectFieldAssignment
                assignedFields={assignedFields}
                unassignedFields={unassignedFields}
                onMoveField={moveField}
                onMoveAllFields={moveAllFields}
                onMoveBulkFields={moveBulkFields} // Pass the bulk function
                isLoading={isLoading}
                mode={isEditing ? 'edit' : 'add'} // Pass the mode
              />
            </>
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
                  type="submit"
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
