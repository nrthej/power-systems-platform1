// components/projects/ProjectsKanban.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Database, Plus, MoreVertical } from 'lucide-react';
import type { Project } from './projectsData';

interface ProjectsKanbanProps {
  projects: Project[];
  onProjectUpdate: (projectId: string, updates: Partial<Project>) => void;
  loading?: boolean;
}

const COLUMN_ORDER = ['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'];
const COLUMN_LABELS = {
  PLANNING: 'Planning',
  ACTIVE: 'Active',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

const COLUMN_COLORS = {
  PLANNING: 'bg-blue-50 border-blue-200',
  ACTIVE: 'bg-green-50 border-green-200',
  ON_HOLD: 'bg-orange-50 border-orange-200',
  COMPLETED: 'bg-purple-50 border-purple-200',
  CANCELLED: 'bg-red-50 border-red-200'
};

export function ProjectsKanban({ projects, onProjectUpdate, loading = false }: ProjectsKanbanProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getProjectsByStatus = (status: string) => {
    return projects.filter(project => project.status === status);
  };

  if (loading) {
    return (
      <div className="flex space-x-6 overflow-x-auto pb-6">
        {COLUMN_ORDER.map((status) => (
          <div key={status} className="flex-shrink-0 w-80">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="h-6 bg-slate-200 rounded mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-32 bg-slate-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex space-x-6 overflow-x-auto pb-6">
      {COLUMN_ORDER.map((status) => {
        const statusProjects = getProjectsByStatus(status);
        
        return (
          <div key={status} className="flex-shrink-0 w-80">
            <div className={`rounded-lg border-2 border-dashed p-1 ${COLUMN_COLORS[status as keyof typeof COLUMN_COLORS]}`}>
              <div className="bg-white rounded-md p-4">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-slate-900">
                      {COLUMN_LABELS[status as keyof typeof COLUMN_LABELS]}
                    </h3>
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-slate-600 bg-slate-100 rounded-full">
                      {statusProjects.length}
                    </span>
                  </div>
                  <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Column Content */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {statusProjects.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <div className="text-sm">No projects in {COLUMN_LABELS[status as keyof typeof COLUMN_LABELS].toLowerCase()}</div>
                    </div>
                  ) : (
                    statusProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                      >
                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-slate-900 line-clamp-2 leading-tight pr-2">
                            {project.name}
                          </h4>
                          <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 transition-all">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Description */}
                        {project.description && (
                          <p className="text-sm text-slate-600 line-clamp-3 mb-3 leading-relaxed">
                            {project.description}
                          </p>
                        )}

                        {/* Timeline */}
                        {(project.startDate || project.endDate) && (
                          <div className="flex items-center space-x-4 mb-3 text-xs text-slate-600">
                            {project.startDate && (
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>Start: {formatDate(project.startDate)}</span>
                              </div>
                            )}
                            {project.endDate && (
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>End: {formatDate(project.endDate)}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-slate-600">Progress</span>
                            <span className="text-xs text-slate-600">
                              {status === 'COMPLETED' ? '100%' : status === 'ACTIVE' ? '65%' : status === 'PLANNING' ? '15%' : '0%'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1">
                            <div 
                              className={`h-1 rounded-full transition-all duration-300 ${
                                status === 'COMPLETED' ? 'bg-green-500 w-full' : 
                                status === 'ACTIVE' ? 'bg-blue-500 w-2/3' : 
                                status === 'PLANNING' ? 'bg-yellow-500 w-1/6' : 'w-0'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div className="flex items-center space-x-3 text-xs text-slate-600">
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              <span>{project.projectUsers?.length || 0}</span>
                            </div>
                            <div className="flex items-center">
                              <Database className="w-3 h-3 mr-1" />
                              <span>{project.assignedFields?.length || 0}</span>
                            </div>
                          </div>
                          
                          {/* Creator Avatar */}
                          <div className="flex items-center space-x-1">
                            {project.createdBy.avatar && (
                              <img
                                src={project.createdBy.avatar}
                                alt={project.createdBy.name}
                                className="w-5 h-5 rounded-full border border-slate-200"
                              />
                            )}
                          </div>
                        </div>

                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}