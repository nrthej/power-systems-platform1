// components/projects/ProjectsTable.tsx
'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Edit, Trash2, Calendar, Users, Database, MoreVertical } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { ProjectModal } from './ProjectModal';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { useProjects } from '@/hooks/useProjects';
import type { Project, CreateProjectDto, UpdateProjectDto } from '@/shared/types';

interface ProjectsTableProps {
  searchTerm: string;
}

export interface ProjectsTableRef {
  refreshProjects: () => void;
  openAddModal: () => void;
}

export const ProjectsTable = forwardRef<ProjectsTableRef, ProjectsTableProps>(
  ({ searchTerm }, ref) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingProject, setDeletingProject] = useState<Project | null>(null);

    const {
      fetchProjects,
      createProject,
      updateProject,
      deleteProject,
      isLoading: apiLoading,
      error: apiError
    } = useProjects();

    useImperativeHandle(ref, () => ({
      refreshProjects: loadProjects,
      openAddModal: () => {
        setEditingProject(null);
        setIsModalOpen(true);
      }
    }));

    useEffect(() => {
      loadProjects();
    }, []);

    useEffect(() => {
      // Filter projects based on search term
      if (!searchTerm) {
        setFilteredProjects(projects);
      } else {
        const filtered = projects.filter(project =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProjects(filtered);
      }
    }, [projects, searchTerm]);

    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchProjects({ limit: 100 });
        setProjects(response.items);
      } catch (err: any) {
        setError(err.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    const handleCreateProject = async (data: CreateProjectDto): Promise<boolean> => {
      const success = await createProject(data);
      if (success) {
        await loadProjects(); // Refresh the list
      }
      return success;
    };

    const handleUpdateProject = async (data: UpdateProjectDto): Promise<boolean> => {
      if (!editingProject) return false;
      
      const success = await updateProject(editingProject.id, data);
      if (success) {
        await loadProjects(); // Refresh the list
      }
      return success;
    };

    const handleDeleteProject = async (): Promise<void> => {
      if (!deletingProject) return;

      const success = await deleteProject(deletingProject.id);
      if (success) {
        setIsDeleteModalOpen(false);
        setDeletingProject(null);
        await loadProjects(); // Refresh the list
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'PLANNING':
          return 'bg-blue-100 text-blue-800';
        case 'ACTIVE':
          return 'bg-green-100 text-green-800';
        case 'ON_HOLD':
          return 'bg-orange-100 text-orange-800';
        case 'COMPLETED':
          return 'bg-purple-100 text-purple-800';
        case 'CANCELLED':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    const formatDate = (date: Date | null) => {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    const getProjectUserCount = (project: Project) => {
      return project.projectUsers?.length || 0;
    };

    const getAssignedFieldsCount = (project: Project) => {
      return project.assignedFields?.length || 0;
    };

    const columns = [
      { key: 'name', label: 'Project Name' },
      { key: 'status', label: 'Status' },
      { key: 'dates', label: 'Timeline' },
      { key: 'team', label: 'Team' },
      { key: 'fields', label: 'Fields' },
      { key: 'created', label: 'Created' },
      { key: 'actions', label: 'Actions', className: 'text-right' }
    ];

    const renderRow = (project: Project, index: number) => (
      <tr key={project.id} className="hover:bg-slate-50 transition-colors">
        <td className="p-4">
          <div>
            <div className="font-medium text-slate-900">{project.name}</div>
            {project.description && (
              <div className="text-sm text-slate-500 mt-1 max-w-xs truncate">
                {project.description}
              </div>
            )}
          </div>
        </td>
        <td className="p-4">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status.replace('_', ' ')}
          </span>
        </td>
        <td className="p-4">
          <div className="text-sm">
            <div className="flex items-center text-slate-600">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Start: {formatDate(project.startDate)}</span>
            </div>
            {project.endDate && (
              <div className="flex items-center text-slate-500 mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                <span>End: {formatDate(project.endDate)}</span>
              </div>
            )}
          </div>
        </td>
        <td className="p-4">
          <div className="flex items-center text-sm text-slate-600">
            <Users className="w-4 h-4 mr-1" />
            <span>{getProjectUserCount(project)} member{getProjectUserCount(project) !== 1 ? 's' : ''}</span>
          </div>
        </td>
        <td className="p-4">
          <div className="flex items-center text-sm text-slate-600">
            <Database className="w-4 h-4 mr-1" />
            <span>{getAssignedFieldsCount(project)} field{getAssignedFieldsCount(project) !== 1 ? 's' : ''}</span>
          </div>
        </td>
        <td className="p-4">
          <div className="text-sm">
            <div className="text-slate-900">{formatDate(project.createdAt)}</div>
            <div className="text-slate-500">by {project.createdBy.name}</div>
          </div>
        </td>
        <td className="p-4 text-right">
          <div className="flex items-center justify-end space-x-2">
            <button type="button"
              onClick={() => {
                setEditingProject(project);
                setIsModalOpen(true);
              }}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Edit project"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button type="button"
              onClick={() => {
                setDeletingProject(project);
                setIsDeleteModalOpen(true);
              }}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );

    if (loading) {
      return (
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-600">Loading projects...</span>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <div className="text-center">
            <div className="text-red-600 mb-2">Error loading projects</div>
            <p className="text-slate-600 mb-4">{error}</p>
            <button type="button"
              onClick={loadProjects}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No projects found</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm 
                  ? `No projects match your search for "${searchTerm}"`
                  : "Get started by creating your first project"
                }
              </p>
              {!searchTerm && (
                <button type="button"
                  onClick={() => {
                    setEditingProject(null);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Project
                </button>
              )}
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredProjects}
            renderRow={renderRow}
          />
        )}

        {/* Project Modal */}
        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProject(null);
          }}
          onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
          project={editingProject}
          isLoading={apiLoading}
          error={apiError}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingProject(null);
          }}
          onConfirm={handleDeleteProject}
          title="Delete Project"
          message={
            deletingProject
              ? `Are you sure you want to delete "${deletingProject.name}"? This action cannot be undone.`
              : ''
          }
          confirmText="Delete"
          isLoading={apiLoading}
          type="danger"
        />
      </>
    );
  }
);

ProjectsTable.displayName = 'ProjectsTable';