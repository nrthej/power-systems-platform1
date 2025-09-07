// components/projects/ProjectsGrid.tsx
'use client';

import React from 'react';
import { Calendar, Users, Database, MoreVertical, Building, Clock, CheckCircle, XCircle, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from './projectsData';

interface ProjectsGridProps {
  projects: Project[];
  selectedProjects: string[];
  onProjectSelect: (projectId: string) => void;
  onSelectAll: (selected: boolean) => void;
  loading?: boolean;
}

export function ProjectsGrid({ 
  projects, 
  selectedProjects, 
  onProjectSelect, 
  onSelectAll, 
  loading = false 
}: ProjectsGridProps) {

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-purple-600" />;
      case 'ON_HOLD':
        return <Pause className="w-4 h-4 text-orange-600" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'PLANNING':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Building className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ACTIVE':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'ON_HOLD':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'COMPLETED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'No date set';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProjectProgress = (project: Project) => {
    // Simple progress calculation based on status
    switch (project.status) {
      case 'PLANNING':
        return 10;
      case 'ACTIVE':
        return 60;
      case 'ON_HOLD':
        return 45;
      case 'COMPLETED':
        return 100;
      case 'CANCELLED':
        return 0;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
            <div className="h-4 bg-slate-200 rounded mb-3"></div>
            <div className="h-3 bg-slate-200 rounded mb-4 w-3/4"></div>
            <div className="space-y-3">
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-slate-200 rounded w-16"></div>
                <div className="h-3 bg-slate-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">No projects found</h3>
        <p className="text-slate-600 mb-6">No projects match your current search and filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bulk Actions */}
      {selectedProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedProjects.length === projects.length}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-blue-900">
                {selectedProjects.length} of {projects.length} projects selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Bulk Edit
              </button>
              <button className="px-3 py-1 text-sm bg-white text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors">
                Export Selected
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Projects Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {projects.map((project, index) => {
            const isSelected = selectedProjects.includes(project.id);
            const progress = getProjectProgress(project);
            
            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`group relative bg-white rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
                  isSelected 
                    ? 'border-blue-300 shadow-md ring-2 ring-blue-100' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => onProjectSelect(project.id)}
              >
                {/* Selection Checkbox */}
                <div className="absolute top-4 left-4 z-10">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      onProjectSelect(project.id);
                    }}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                {/* Actions Menu */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate-900 mb-2 pr-8 leading-tight">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      <span className="ml-1.5">{project.status.replace('_', ' ')}</span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-600">Progress</span>
                      <span className="text-xs text-slate-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <motion.div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          progress === 100 ? 'bg-green-500' : progress > 75 ? 'bg-blue-500' : progress > 50 ? 'bg-yellow-500' : 'bg-slate-400'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs text-slate-600">
                      <Calendar className="w-3 h-3 mr-1.5" />
                      <span className="font-medium">Start:</span>
                      <span className="ml-1">{formatDate(project.startDate)}</span>
                    </div>
                    {project.endDate && (
                      <div className="flex items-center text-xs text-slate-600">
                        <Calendar className="w-3 h-3 mr-1.5" />
                        <span className="font-medium">End:</span>
                        <span className="ml-1">{formatDate(project.endDate)}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Stats */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-xs text-slate-600">
                        <Users className="w-3 h-3 mr-1" />
                        <span>{project.projectUsers?.length || 0}</span>
                      </div>
                      <div className="flex items-center text-xs text-slate-600">
                        <Database className="w-3 h-3 mr-1" />
                        <span>{project.assignedFields?.length || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {project.createdBy.avatar && (
                        <img
                          src={project.createdBy.avatar}
                          alt={project.createdBy.name}
                          className="w-5 h-5 rounded-full border border-slate-200"
                        />
                      )}
                      <span className="text-xs text-slate-600 font-medium">
                        {project.createdBy.name.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}