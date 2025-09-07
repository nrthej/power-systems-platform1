// components/projects/modal/ProjectTeamAssignment.tsx
'use client';

import React from 'react';
import type { User } from '@/shared/types';
import type { ProjectFormData } from '@/hooks/useProjectModal';

interface ProjectTeamAssignmentProps {
  formData: ProjectFormData;
  availableUsers: User[];
  onUserToggle: (userId: string, role: 'adminUserIds' | 'projectManagerIds' | 'developerIds') => void;
  isLoading: boolean;
}

export function ProjectTeamAssignment({
  formData,
  availableUsers,
  onUserToggle,
  isLoading
}: ProjectTeamAssignmentProps) {
  const renderUserSection = (
    title: string,
    role: 'adminUserIds' | 'projectManagerIds' | 'developerIds',
    colorClasses: { bg: string; text: string }
  ) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-3">
        {title}
      </label>
      <div className="border border-slate-200 rounded-xl p-3 space-y-2 max-h-48 overflow-y-auto">
        {availableUsers.length === 0 ? (
          <div className="text-center py-4 text-slate-500">
            <div className="text-sm">No users available</div>
            <div className="text-xs mt-1">Check if users are loaded properly</div>
          </div>
        ) : (
          availableUsers.map((user) => (
            <label
              key={user.id}
              className="flex items-center space-x-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg"
            >
              <input
                type="checkbox"
                checked={formData[role].includes(user.id)}
                onChange={() => onUserToggle(user.id, role)}
                disabled={isLoading}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 ${colorClasses.bg} rounded-full flex items-center justify-center`}>
                  <span className={`text-xs font-semibold ${colorClasses.text}`}>
                    {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-slate-700">{user.name || 'Unknown User'}</span>
                  <p className="text-xs text-slate-500">{user.email || 'No email'}</p>
                </div>
              </div>
            </label>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Debug info */}
      <div className="text-xs text-gray-500">
        Available users: {availableUsers.length} | Loading: {isLoading ? 'Yes' : 'No'}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admin Users */}
        {renderUserSection('Admin Users', 'adminUserIds', {
          bg: 'bg-red-100',
          text: 'text-red-600'
        })}

        {/* Project Managers */}
        {renderUserSection('Project Managers', 'projectManagerIds', {
          bg: 'bg-blue-100', 
          text: 'text-blue-600'
        })}

        {/* Developers */}
        {renderUserSection('Developers', 'developerIds', {
          bg: 'bg-green-100',
          text: 'text-green-600'
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Users can have multiple roles on a project. Admin users have full control, 
          Project Managers oversee execution, and Developers handle technical implementation.
        </p>
      </div>
    </div>
  );
}