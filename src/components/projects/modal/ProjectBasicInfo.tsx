// components/projects/modal/ProjectBasicInfo.tsx
'use client';

import React from 'react';
import { Calendar, Clock, FileText, AlertCircle, CheckCircle, Building2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import type { ProjectFormData } from '@/hooks/useProjectModal';

interface ProjectBasicInfoProps {
  formData: ProjectFormData;
  formErrors: Record<string, string>;
  onInputChange: (field: string, value: any) => void;
  isLoading: boolean;
}

export function ProjectBasicInfo({
  formData,
  formErrors,
  onInputChange,
  isLoading
}: ProjectBasicInfoProps) {
  return (
    <div className="space-y-8">
      {/* Project Identity Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
              <Building2 className="w-4 h-4 mr-2 text-blue-600" />
              Project Name *
            </label>
            <Input
              placeholder="e.g., Solar Farm Texas Phase 1"
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              error={formErrors.name}
              disabled={isLoading}
              className="text-lg font-medium"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Choose a clear, descriptive name for your project
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
              <MapPin className="w-4 h-4 mr-2 text-green-600" />
              Project Type
            </label>
            <select
              value={formData.projectType || ''}
              onChange={(e) => onInputChange('projectType', e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 transition-all"
            >
              <option value="">Select project type...</option>
              <option value="solar">Solar Power</option>
              <option value="wind">Wind Power</option>
              <option value="hydro">Hydroelectric</option>
              <option value="thermal">Thermal Power</option>
              <option value="nuclear">Nuclear Power</option>
              <option value="geothermal">Geothermal</option>
              <option value="biomass">Biomass</option>
              <option value="hybrid">Hybrid System</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">
              Specify the type of power generation
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
            <FileText className="w-4 h-4 mr-2 text-purple-600" />
            Project Description
          </label>
          <div className="relative">
            <textarea
              placeholder="Describe the project scope, objectives, key milestones, and expected outcomes. Include location details, capacity, and any special considerations..."
              value={formData.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              disabled={isLoading}
              rows={4}
              className="w-full py-4 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-500 resize-none transition-all leading-relaxed"
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-400">
              {formData.description.length}/500
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Provide a comprehensive overview to help team members understand the project
          </p>
        </div>
      </motion.div>

      {/* Timeline Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200"
      >
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Project Timeline</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-700">
              <Clock className="w-3 h-3 mr-2 text-green-600" />
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''}
              onChange={(e) => onInputChange('startDate', e.target.value ? new Date(e.target.value) : null)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-700">
              <Clock className="w-3 h-3 mr-2 text-red-600" />
              Target End Date
            </label>
            <input
              type="date"
              value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ''}
              onChange={(e) => onInputChange('endDate', e.target.value ? new Date(e.target.value) : null)}
              disabled={isLoading}
              min={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : undefined}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 transition-all"
            />
          </div>
        </div>

        {formData.startDate && formData.endDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-blue-100 rounded-xl"
          >
            <div className="flex items-center text-sm text-blue-800">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="font-medium">
                Project Duration: {Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Project Specifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="space-y-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
          <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <Building2 className="w-3 h-3 text-purple-600" />
          </div>
          Project Specifications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Expected Capacity (MW)
            </label>
            <input
              type="number"
              placeholder="e.g., 100"
              value={formData.capacity || ''}
              onChange={(e) => onInputChange('capacity', e.target.value ? parseFloat(e.target.value) : null)}
              disabled={isLoading}
              min="0"
              step="0.1"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Estimated Budget (M$)
            </label>
            <input
              type="number"
              placeholder="e.g., 150"
              value={formData.budget || ''}
              onChange={(e) => onInputChange('budget', e.target.value ? parseFloat(e.target.value) : null)}
              disabled={isLoading}
              min="0"
              step="0.1"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Priority Level
            </label>
            <select
              value={formData.priority || 'medium'}
              onChange={(e) => onInputChange('priority', e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 transition-all"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Validation Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-slate-50 rounded-xl p-4 border border-slate-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {formData.name.trim().length >= 3 ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-600" />
            )}
            <span className="text-sm font-medium text-slate-700">
              Form Validation
            </span>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span className={`px-2 py-1 rounded-full ${
              formData.name.trim().length >= 3 
                ? 'bg-green-100 text-green-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              Name: {formData.name.trim().length >= 3 ? 'Valid' : 'Required (min 3 chars)'}
            </span>
            <span className={`px-2 py-1 rounded-full ${
              formData.description.trim().length > 0
                ? 'bg-green-100 text-green-700' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              Description: {formData.description.trim().length > 0 ? 'Provided' : 'Optional'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}