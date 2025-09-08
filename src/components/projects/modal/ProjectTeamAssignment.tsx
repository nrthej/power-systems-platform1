'use client';

import React from 'react';
import { Users, Shield, Briefcase, Code, Crown, UserCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const roleConfigs = [
    {
      key: 'adminUserIds' as const,
      title: 'Project Administrators',
      description: 'Full project control, budget approval, strategic decisions',
      icon: <Crown className="w-6 h-6" />,
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      key: 'projectManagerIds' as const,
      title: 'Project Managers',
      description: 'Day-to-day operations, timeline management, team coordination',
      icon: <Briefcase className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      key: 'developerIds' as const,
      title: 'Technical Team',
      description: 'Engineering, implementation, technical documentation',
      icon: <Code className="w-6 h-6" />,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    }
  ];

  const getTotalAssignedUsers = () => {
    return (formData.adminUserIds?.length || 0) + 
           (formData.projectManagerIds?.length || 0) + 
           (formData.developerIds?.length || 0);
  };

  const isUserAssigned = (userId: string) => {
    return formData.adminUserIds?.includes(userId) ||
           formData.projectManagerIds?.includes(userId) ||
           formData.developerIds?.includes(userId);
  };

  const getUserRole = (userId: string) => {
    if (formData.adminUserIds?.includes(userId)) return 'Administrator';
    if (formData.projectManagerIds?.includes(userId)) return 'Project Manager';
    if (formData.developerIds?.includes(userId)) return 'Technical Team';
    return null;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Build Your Team</h3>
        <p className="text-slate-600">Assign team members to different roles based on their responsibilities</p>
      </div>

      {/* Team Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserCheck className="w-6 h-6 text-blue-600" />
            <div>
              <h4 className="font-semibold text-slate-900">Team Overview</h4>
              <p className="text-sm text-slate-600">
                {getTotalAssignedUsers()} of {availableUsers.length} team members assigned
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{getTotalAssignedUsers()}</div>
            <div className="text-xs text-slate-500">Total Members</div>
          </div>
        </div>
      </div>

      {availableUsers.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Users Available</h3>
          <p className="text-slate-600">Please ensure users are loaded properly or contact your administrator.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Role Sections */}
          {roleConfigs.map((roleConfig, roleIndex) => (
            <motion.div
              key={roleConfig.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: roleIndex * 0.1 }}
              className={`${roleConfig.bgColor} border ${roleConfig.borderColor} rounded-2xl p-6`}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-12 h-12 ${roleConfig.iconBg} rounded-xl flex items-center justify-center`}>
                  <div className={roleConfig.iconColor}>
                    {roleConfig.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className={`text-lg font-bold ${roleConfig.textColor}`}>
                    {roleConfig.title}
                  </h4>
                  <p className="text-sm text-slate-600 mt-1">
                    {roleConfig.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${roleConfig.textColor}`}>
                    {formData[roleConfig.key]?.length || 0}
                  </div>
                  <div className="text-xs text-slate-500">Assigned</div>
                </div>
              </div>

              {/* User Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableUsers.map((user) => {
                  const isSelected = formData[roleConfig.key]?.includes(user.id) || false;
                  const userCurrentRole = getUserRole(user.id);
                  const isAssignedElsewhere = isUserAssigned(user.id) && !isSelected;

                  return (
                    <motion.label
                      key={user.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? `${roleConfig.borderColor} bg-white shadow-md`
                          : isAssignedElsewhere
                          ? 'border-slate-200 bg-slate-50 opacity-60'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onUserToggle(user.id, roleConfig.key)}
                        disabled={isLoading || (isAssignedElsewhere && !isSelected)}
                        className={`w-5 h-5 rounded border-2 transition-all ${
                          isSelected ? 'text-blue-600 border-blue-600' : 'border-slate-300'
                        }`}
                      />
                      
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm bg-gradient-to-r ${roleConfig.color}`}>
                          {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 truncate">
                            {user.name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-slate-500 truncate">
                            {user.email || 'No email'}
                          </div>
                          {userCurrentRole && (
                            <div className="text-xs text-blue-600 font-medium mt-1">
                              Currently: {userCurrentRole}
                            </div>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`w-6 h-6 ${roleConfig.iconBg} rounded-full flex items-center justify-center`}
                        >
                          <UserCheck className={`w-4 h-4 ${roleConfig.iconColor}`} />
                        </motion.div>
                      )}
                    </motion.label>
                  );
                })}
              </div>

              {formData[roleConfig.key]?.length === 0 && (
                <div className="text-center py-6 text-slate-500">
                  <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm">No {roleConfig.title.toLowerCase()} assigned yet</p>
                </div>
              )}
            </motion.div>
          ))}

          {/* Team Guidelines */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-slate-600 mr-2" />
              Team Assignment Guidelines
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
              <div className="space-y-2">
                <p><strong>Administrators:</strong> Handle budget, contracts, and strategic decisions</p>
                <p><strong>Project Managers:</strong> Oversee daily operations and coordinate teams</p>
              </div>
              <div className="space-y-2">
                <p><strong>Technical Team:</strong> Focus on engineering and implementation</p>
                <p><strong>Multi-role:</strong> Users can have multiple roles on the same project</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}