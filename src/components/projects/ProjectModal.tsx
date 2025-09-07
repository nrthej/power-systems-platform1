// components/projects/ProjectModal.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { X, FolderOpen, CheckCircle, ArrowRight, ArrowLeft, Sparkles, Users, Database, FileText, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { ErrorAlert, SuccessAlert } from '@/components/ui/Alert';
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

const STEPS = [
  {
    number: 1,
    title: 'Project Details',
    subtitle: 'Basic information and timeline',
    icon: FileText,
    color: 'blue'
  },
  {
    number: 2,
    title: 'Team Assignment',
    subtitle: 'Add team members and roles',
    icon: Users,
    color: 'green'
  },
  {
    number: 3,
    title: 'Field Configuration',
    subtitle: 'Configure project fields',
    icon: Database,
    color: 'purple'
  }
];

export function ProjectModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  project, 
  isLoading = false,
  error
}: ProjectModalProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    try {
      // For steps 1 and 2, just move to next step
      if (step < 3) {
        // Validate current step
        if (step === 1 && !formData.name.trim()) {
          return;
        }
        if (step === 2) {
          const totalUsers = (formData.adminUserIds?.length || 0) + 
                            (formData.projectManagerIds?.length || 0) + 
                            (formData.developerIds?.length || 0);
          if (totalUsers === 0) {
            return;
          }
        }
        
        setStep(step + 1);
        return;
      }

      // Step 3: Final validation and submission
      if (!validateForm()) {
        return;
      }

      const submitData: CreateProjectDto | UpdateProjectDto = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        ...(formData.fieldNames && formData.fieldNames.length > 0 && {
          fieldNames: formData.fieldNames
        })
      };

      const success = await onSubmit(submitData);
      
      if (success) {
        setSuccessMessage(isEditing ? 'Project updated successfully!' : 'Project created successfully!');
        setTimeout(() => {
          resetForm();
          setSuccessMessage(null);
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  const handleClose = () => {
    resetForm();
    setSuccessMessage(null);
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
      case 2: {
        const totalUsers = (formData.adminUserIds?.length || 0) + 
                          (formData.projectManagerIds?.length || 0) + 
                          (formData.developerIds?.length || 0);
        return totalUsers > 0;
      }
      case 3:
        return true;
      default:
        return false;
    }
  };

  const getStepProgress = () => {
    return (step / 3) * 100;
  };

  const getCurrentStep = () => STEPS.find(s => s.number === step);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col"
        >
          {/* Enhanced Header */}
          <div className="relative px-8 py-6 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FolderOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                    {isEditing ? 'Edit Project' : 'Create New Project'}
                    <Sparkles className="w-5 h-5 ml-2 text-yellow-500" />
                  </h2>
                  <p className="text-slate-600 mt-1">
                    {isEditing ? 'Update project details and assignments' : 'Build your next power generation project'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white/80 transition-all"
                disabled={isLoading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700">
                  Step {step} of {STEPS.length}
                </span>
                <span className="text-sm text-slate-500">
                  {Math.round(getStepProgress())}% complete
                </span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getStepProgress()}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Enhanced Step Indicator */}
          <div className="px-8 py-6 bg-white border-b border-slate-100">
            <div className="flex items-center justify-between">
              {STEPS.map((stepInfo, index) => (
                <div key={stepInfo.number} className="flex items-center">
                  <motion.div
                    className="flex flex-col items-center"
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ 
                      scale: step === stepInfo.number ? 1 : 0.9,
                      opacity: step >= stepInfo.number ? 1 : 0.5 
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      step === stepInfo.number 
                        ? `bg-${stepInfo.color}-600 text-white shadow-lg shadow-${stepInfo.color}-600/30` 
                        : step > stepInfo.number
                        ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {step > stepInfo.number ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <stepInfo.icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div className={`text-sm font-semibold ${
                        step === stepInfo.number ? `text-${stepInfo.color}-600` : 'text-slate-600'
                      }`}>
                        {stepInfo.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {stepInfo.subtitle}
                      </div>
                    </div>
                  </motion.div>
                  {index < STEPS.length - 1 && (
                    <div className="flex-1 h-px bg-slate-200 mx-6 mt-6">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                        initial={{ width: '0%' }}
                        animate={{ width: step > stepInfo.number ? '100%' : '0%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          {(error || successMessage) && (
            <div className="px-8 pt-6">
              {error && <ErrorAlert message={error} closable={false} />}
              {successMessage && (
                <SuccessAlert 
                  message={successMessage} 
                  closable={false}
                  icon={<CheckCircle className="w-5 h-5" />}
                />
              )}
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                {step === 1 && (
                  <div>
                    <div className="mb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900">Project Information</h3>
                      </div>
                      <p className="text-slate-600">
                        Let's start with the essential details for your power generation project.
                      </p>
                    </div>
                    <ProjectBasicInfo
                      formData={formData}
                      formErrors={formErrors}
                      onInputChange={handleInputChange}
                      isLoading={isLoading}
                    />
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <div className="mb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900">Team Assembly</h3>
                      </div>
                      <p className="text-slate-600">
                        Assign team members to different roles for optimal project management.
                      </p>
                    </div>
                    <ProjectTeamAssignment
                      formData={formData}
                      availableUsers={availableUsers}
                      onUserToggle={handleUserToggle}
                      isLoading={isLoading}
                    />
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <div className="mb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Database className="w-4 h-4 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900">Field Configuration</h3>
                      </div>
                      <p className="text-slate-600">
                        Configure the data fields that will be tracked for this project.
                      </p>
                    </div>
                    <ProjectFieldAssignment
                      assignedFields={assignedFields}
                      unassignedFields={unassignedFields}
                      onMoveField={moveField}
                      onMoveAllFields={moveAllFields}
                      onMoveBulkFields={moveBulkFields}
                      isLoading={isLoading}
                      mode={isEditing ? 'edit' : 'add'}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Enhanced Navigation */}
            <div className="flex justify-between items-center px-8 py-6 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex items-center space-x-3">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handlePrevious}
                    disabled={isLoading}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Button>
                )}
                <span className="text-sm text-slate-500">
                  {getCurrentStep()?.title}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={isLoading || !canProceed()}
                    className="flex items-center space-x-2"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={isLoading}
                    className="flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>{isEditing ? 'Update Project' : 'Create Project'}</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}