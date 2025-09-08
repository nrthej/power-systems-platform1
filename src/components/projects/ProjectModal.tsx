'use client';

import React, { useEffect } from 'react';
import { X, Rocket, ArrowRight, CheckCircle, Users, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    e.preventDefault();
    
    try {
      if (step < 3) {
        // Validation for current step
        if (step === 1 && !formData.name.trim()) return;
        if (step === 2) {
          const totalUsers = (formData.adminUserIds?.length || 0) + 
                            (formData.projectManagerIds?.length || 0) + 
                            (formData.developerIds?.length || 0);
          if (totalUsers === 0) return;
        }
        
        setStep(step + 1);
        return;
      }

      // Final submission
      if (!validateForm()) return;

      const submitData: CreateProjectDto | UpdateProjectDto = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        ...(formData.fieldNames && formData.fieldNames.length > 0 && {
          fieldNames: formData.fieldNames
        })
      };

      const success = await onSubmit(submitData);
      
      if (success) {
        resetForm();
        onClose();
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
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

  const steps = [
    { 
      number: 1, 
      title: 'Project Details', 
      description: 'Basic information',
      icon: <Rocket className="w-5 h-5" />
    },
    { 
      number: 2, 
      title: 'Team Assignment', 
      description: 'Assign team members',
      icon: <Users className="w-5 h-5" />
    },
    { 
      number: 3, 
      title: 'Field Configuration', 
      description: 'Select data fields',
      icon: <Database className="w-5 h-5" />
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between p-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {isEditing ? 'Edit Project' : 'Create New Project'}
                </h2>
                <p className="text-blue-100 font-medium">
                  {isEditing ? 'Update project configuration' : 'Set up your power generation project'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-3 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all"
              disabled={isLoading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Enhanced Step Indicator */}
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {steps.map((stepInfo, index) => (
              <div key={stepInfo.number} className="flex items-center">
                <div className="flex items-center space-x-3">
                  <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    step === stepInfo.number 
                      ? 'bg-blue-600 text-white shadow-lg scale-110' 
                      : step > stepInfo.number
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {step > stepInfo.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      stepInfo.icon
                    )}
                    {step === stepInfo.number && (
                      <motion.div
                        className="absolute inset-0 bg-blue-600 rounded-xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.2, opacity: 0 }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <div className="hidden md:block">
                    <h3 className={`font-semibold text-sm ${
                      step === stepInfo.number ? 'text-blue-600' : 'text-slate-700'
                    }`}>
                      {stepInfo.title}
                    </h3>
                    <p className="text-xs text-slate-500">{stepInfo.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:flex items-center mx-6">
                    <div className={`w-16 h-0.5 transition-all duration-300 ${
                      step > stepInfo.number ? 'bg-emerald-500' : 'bg-slate-200'
                    }`} />
                    <ArrowRight className={`w-4 h-4 ml-2 transition-colors ${
                      step > stepInfo.number ? 'text-emerald-500' : 'text-slate-300'
                    }`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content with Animations */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full overflow-y-auto"
            >
              <form onSubmit={handleSubmit} className="h-full flex flex-col">
                {error && (
                  <div className="p-6 pb-0">
                    <ErrorAlert message={error} closable={false} />
                  </div>
                )}

                <div className="flex-1">
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
                </div>

                {/* Enhanced Navigation */}
                <div className="flex justify-between items-center p-8 border-t border-slate-200 bg-white">
                  <div className="flex items-center space-x-4">
                    {step > 1 && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handlePrevious}
                        disabled={isLoading}
                        className="flex items-center space-x-2"
                      >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        <span>Previous</span>
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
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
                        className="flex items-center space-x-2"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
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
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}