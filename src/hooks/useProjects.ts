// hooks/useProjects.ts
'use client';

import { useState, useCallback } from 'react';
import { projectsData } from '@/components/projects/projectsData';
import type { 
  Project, 
  CreateProjectDto, 
  UpdateProjectDto, 
  ProjectPaginationParams,
  PaginatedProjects,
} from '@/shared/types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async (params: ProjectPaginationParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await projectsData.getProjects(params);
      setProjects(response.items);
      return response;
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      const errorMessage = err.message || 'Failed to fetch projects';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProjectById = useCallback(async (id: string): Promise<Project> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await projectsData.getProject(id);
      if (!response) {
        throw new Error('Project not found');
      }
      return response;
    } catch (err: any) {
      console.error('Error fetching project:', err);
      const errorMessage = err.message || 'Failed to fetch project';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = useCallback(async (data: CreateProjectDto): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await projectsData.createProject(data);
      
      // Add the new project to the local state
      setProjects(prev => [response, ...prev]);
      return true;
    } catch (err: any) {
      console.error('Error creating project:', err);
      const errorMessage = err.message || 'Failed to create project';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProject = useCallback(async (id: string, data: UpdateProjectDto): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await projectsData.updateProject(id, data);
      if (!response) {
        throw new Error('Project not found');
      }

      // Update the project in local state
      setProjects(prev => 
        prev.map(project => 
          project.id === id ? response : project
        )
      );
      return true;
    } catch (err: any) {
      console.error('Error updating project:', err);
      const errorMessage = err.message || 'Failed to update project';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const success = await projectsData.deleteProject(id);
      if (!success) {
        throw new Error('Project not found');
      }

      // Remove the project from local state
      setProjects(prev => prev.filter(project => project.id !== id));
      return true;
    } catch (err: any) {
      console.error('Error deleting project:', err);
      const errorMessage = err.message || 'Failed to delete project';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProjectStats = useCallback(async () => {
    try {
      setError(null);
      return await projectsData.getProjectStats();
    } catch (err: any) {
      console.error('Error fetching project stats:', err);
      const errorMessage = err.message || 'Failed to fetch project statistics';
      setError(errorMessage);
      return { total: 0, active: 0, completed: 0, onHold: 0 };
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const refetch = useCallback(() => {
    return fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectStats,
    clearError,
    refetch
  };
}