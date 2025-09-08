'use client';

import React from 'react';
import { FileText, Calendar, Target, Upload, Image, File } from 'lucide-react';
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
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Project Foundation</h3>
        <p className="text-slate-600">Let's start with the essential details of your power generation project</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Project Name */}
        <div className="space-y-2">
          <Input
            label="Project Name"
            placeholder="e.g., Solar Farm Texas Phase 1, Wind Energy Oklahoma"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            error={formErrors.name}
            disabled={isLoading}
            required
            icon={<FileText className="h-5 w-5 text-slate-400" />}
          />
          <p className="text-xs text-slate-500 ml-1">
            Choose a descriptive name that clearly identifies your project
          </p>
        </div>

        {/* Project Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Project Description
          </label>
          <div className="relative">
            <textarea
              placeholder="Describe your project scope, objectives, technology type, capacity, location, and key milestones. Include any special requirements or constraints..."
              value={formData.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              disabled={isLoading}
              rows={5}
              className="w-full py-4 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-500 resize-none transition-all"
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-400">
              {formData.description.length}/500
            </div>
          </div>
          <p className="text-xs text-slate-500 ml-1">
            A detailed description helps team members understand project goals and scope
          </p>
        </div>

        {/* Project Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Planned Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => onInputChange('startDate', e.target.value)}
                disabled={isLoading}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Target Completion Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => onInputChange('endDate', e.target.value)}
                disabled={isLoading}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 transition-all"
              />
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Project Documents & Assets
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Upload Project Files</h4>
                <p className="text-slate-600 mb-4">
                  Add technical specifications, permits, environmental studies, or site photos
                </p>
                <div className="flex justify-center space-x-6 text-sm text-slate-500">
                  <div className="flex items-center space-x-2">
                    <File className="w-4 h-4" />
                    <span>Documents</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Image className="w-4 h-4" />
                    <span>Images</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Reports</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-6 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all shadow-sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </button>
              <p className="text-xs text-slate-500">
                Supports PDF, DOC, XLS, JPG, PNG up to 25MB each
              </p>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
            <Target className="w-5 h-5 text-blue-600 mr-2" />
            Pro Tips for Success
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-700">Use descriptive names that include technology type and location</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-700">Include capacity, timeline, and key stakeholders in description</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-700">Set realistic timelines with buffer for regulatory approvals</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-700">Upload key documents early for better team collaboration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}