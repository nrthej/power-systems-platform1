// components/projects/modal/ProjectBasicInfo.tsx
'use client';

import React from 'react';
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
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Input
            label="Project Name"
            placeholder="e.g., Solar Farm Texas Phase 1"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            error={formErrors.name}
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            placeholder="Describe the project scope, objectives, and key details..."
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            disabled={isLoading}
            rows={4}
            className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-500 resize-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Files & Attachments
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-slate-400 transition-colors">
            <div className="text-slate-500">
              <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
                >
                  Choose files
                </button>
                <span className="ml-2 text-sm text-slate-500">or drag and drop</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">PNG, JPG, PDF up to 10MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}