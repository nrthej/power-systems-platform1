// components/projects/modal/ProjectTeamAssignment.tsx
'use client';

import React, { useState } from 'react';
import { Users, Crown, Briefcase, Code, Search, UserCheck, UserX, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '@/shared/types';
import type { ProjectFormData } from '@/hooks/useProjectModal';

interface ProjectTeamAssignmentProps {
  formData: ProjectFormData;
  availableUsers: User[];
  onUserToggle: (userId: string, role: 'adminUserIds' | 'projectManagerIds' | 'developerIds') => void;
  isLoading: boolean;
}

const ROLE_CONFIG = {
  adminUserIds: {
    label: 'Project Administrators',
    description: 'Full project control and management permissions',
    icon: Crown,
    color: 'red',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    iconColor: 'text-red-600'
  },
  projectManagerIds: {
    label: 'Project Managers',
    description: 'Oversee project execution and team coordination',
    icon: Briefcase,
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    iconColor: 'text-blue-600'
  },
  developerIds: {
    label: 'Developers & Engineers',
    description: 'Technical implementation and development work',
    icon: Code,
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    iconColor: 'text-green-600'
  }
};

export function ProjectTeamAssignment({
  formData,
  availableUsers,
  onUserToggle,
  isLoading
}: ProjectTeamAssignmentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'adminUserIds' | 'projectManagerIds' | 'developerIds' | 'all'>('all');

  const isUserAssigned = (userId: string, role: 'adminUserIds' | 'projectManagerIds' | 'developerIds') => {
    return formData[role]?.includes(userId) || false;
  };

  const getUserRole = (userId: string): string | null => {
    if (formData.adminUserIds?.includes(userId)) return 'adminUserIds';
    if (formData.projectManagerIds?.includes(userId)) return 'projectManagerIds';
    if (formData.developerIds?.includes(userId)) return 'developerIds';
    return null;
  };

  const filteredUsers = availableUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const userRole = getUserRole(user.id);
    const matchesRole = selectedRole === 'all' || userRole === selectedRole || !userRole;
    return matchesSearch && matchesRole;
  });

  const getTotalAssigned = () => {
    return (formData.adminUserIds?.length || 0) +
           (formData.projectManagerIds?.length || 0) +
           (formData.developerIds?.length || 0);
  };

  const getRoleCount = (role: 'adminUserIds' | 'projectManagerIds' | 'developerIds') => {
    return formData[role]?.length || 0;
  };

  return (
    <div className="space-y-8">
      {/* Team Overview */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 flex items-center">
              <Users className="w-5 h-5 mr-3 text-blue-600" />
              Team Overview
            </h3>
            <p className="text-slate-600 mt-1">
              {getTotalAssigned()} team member{getTotalAssigned() !== 1 ? 's' : ''} assigned across all roles
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {getTotalAssigned() > 0 ? (
              <div className="flex items-center text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-1" />
                Team Assigned
              </div>
            ) : (
              <div className="flex items-center text-orange-700 bg-orange-100 px-3 py-1 rounded-full text-sm font-medium">
                <AlertCircle className="w-4 h-4 mr-1" />
                No Team Members
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {Object.entries(ROLE_CONFIG).map(([role, config]) => {
            const count = getRoleCount(role as 'adminUserIds' | 'projectManagerIds' | 'developerIds');
            return (
              <div key={role} className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <config.icon className={`w-5 h-5 ${config.iconColor}`} />
                  <span className={`text-sm font-bold ${config.textColor}`}>{count}</span>
                </div>
                <div className={`text-sm font-medium ${config.textColor}`}>
                  {config.label}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {config.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search team members by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-slate-700">Filter by role:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as 'adminUserIds' | 'projectManagerIds' | 'developerIds' | 'all')}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Users</option>
              <option value="adminUserIds">Administrators</option>
              <option value="projectManagerIds">Project Managers</option>
              <option value="developerIds">Developers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Role Assignment Sections */}
      <div className="space-y-6">
        {Object.entries(ROLE_CONFIG).map(([role, config]) => {
          const assignedUsers = availableUsers.filter(user => 
            isUserAssigned(user.id, role as 'adminUserIds' | 'projectManagerIds' | 'developerIds')
          );
          const availableForRole = filteredUsers.filter(user => 
            !isUserAssigned(user.id, role as 'adminUserIds' | 'projectManagerIds' | 'developerIds')
          );

          return (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${config.bgColor} rounded-xl flex items-center justify-center`}>
                    <config.icon className={`w-5 h-5 ${config.iconColor}`} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">
                      {config.label}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {config.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className={`px-2 py-1 ${config.bgColor} ${config.textColor} rounded-full font-medium`}>
                    {assignedUsers.length} assigned
                  </span>
                </div>
              </div>

              {/* Assigned Users */}
              {assignedUsers.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-slate-700 mb-3">Currently Assigned:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {assignedUsers.map((user) => (
                      <motion.div
                        key={user.id}
                        layout
                        className={`flex items-center justify-between p-3 ${config.bgColor} ${config.borderColor} border rounded-lg`}
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className={`w-8 h-8 ${config.bgColor} rounded-full flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0`}>
                            <span className={`text-xs font-semibold ${config.textColor}`}>
                              {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className={`font-medium ${config.textColor} truncate`}>
                              {user.name}
                            </div>
                            <div className="text-xs text-slate-600 truncate">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onUserToggle(user.id, role as 'adminUserIds' | 'projectManagerIds' | 'developerIds')}
                          disabled={isLoading}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Users */}
              {availableForRole.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-3">Available Team Members:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    {availableForRole.map((user) => (
                      <motion.div
                        key={user.id}
                        layout
                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-slate-600">
                              {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-slate-900 truncate">
                              {user.name}
                            </div>
                            <div className="text-xs text-slate-600 truncate">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onUserToggle(user.id, role as 'adminUserIds' | 'projectManagerIds' | 'developerIds')}
                          disabled={isLoading}
                          className={`p-1 ${config.textColor} hover:opacity-75 transition-colors flex-shrink-0`}
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {availableForRole.length === 0 && assignedUsers.length === 0 && (
                <div className="text-center py-6 text-slate-500">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm">No team members available for this role</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Validation Summary */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getTotalAssigned() > 0 ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-600" />
            )}
            <span className="text-sm font-medium text-slate-700">
              Team Assignment Status
            </span>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span className={`px-2 py-1 rounded-full ${
              getTotalAssigned() > 0 
                ? 'bg-green-100 text-green-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              Total: {getTotalAssigned()} member{getTotalAssigned() !== 1 ? 's' : ''}
            </span>
            {Object.entries(ROLE_CONFIG).map(([role, config]) => {
              const count = getRoleCount(role as 'adminUserIds' | 'projectManagerIds' | 'developerIds');
              return (
                <span key={role} className={`px-2 py-1 rounded-full ${
                  count > 0 ? `${config.bgColor} ${config.textColor}` : 'bg-slate-100 text-slate-600'
                }`}>
                  {config.label.split(' ')[0]}: {count}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}