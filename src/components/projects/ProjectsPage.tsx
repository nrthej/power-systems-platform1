// components/projects/ProjectsPage.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Upload, Download, Edit, Trash2 } from 'lucide-react';
import { ActionButtonGroup } from '@/components/ui/ActionButtonGroup';
import { SearchFilterBar } from '@/components/ui/SearchFilterBar';
import { ProjectStats } from './ProjectStats';
import { ProjectsTable, type ProjectsTableRef } from './ProjectsTable';
import { projectsData, type Project } from './projectsData';
import { SuccessAlert } from '@/components/ui/Alert';

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  // State for real data
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Refs for components so we can trigger Add modals
  const projectsTableRef = useRef<ProjectsTableRef>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectsData.getProjects({ limit: 100 });
      setProjects(response.items);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle import (mock functionality)
  const handleImport = async () => {
    try {
      // Simulate import process
      setSuccessMessage('Import feature coming soon! This will allow bulk project import from CSV/Excel files.');
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  // Handle export (mock functionality)
  const handleExport = async () => {
    try {
      // Simulate export process
      const exportData = projects.map(project => ({
        name: project.name,
        description: project.description || '',
        status: project.status,
        startDate: project.startDate ? project.startDate.toISOString().split('T')[0] : '',
        endDate: project.endDate ? project.endDate.toISOString().split('T')[0] : '',
        createdBy: project.createdBy.name,
        createdAt: project.createdAt.toISOString().split('T')[0],
        teamMembers: project.projectUsers?.length || 0,
        assignedFields: project.assignedFields?.length || 0
      }));

      // Generate CSV content
      const headers = Object.keys(exportData[0] || {}).join(',');
      const rows = exportData.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        ).join(',')
      );
      
      const csvContent = [headers, ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `projects-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccessMessage(`Successfully exported ${exportData.length} projects!`);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const actionButtons = [
    {
      id: 'import',
      label: 'Import',
      icon: <Upload className="w-4 h-4" />,
      variant: 'secondary' as const,
      onClick: handleImport
    },
    {
      id: 'export',
      label: 'Export',
      icon: <Download className="w-4 h-4" />,
      variant: 'secondary' as const,
      onClick: handleExport
    },
    {
      id: 'refresh',
      label: 'Refresh',
      icon: <Download className="w-4 h-4" />,
      variant: 'secondary' as const,
      onClick: () => {
        projectsTableRef.current?.refreshProjects();
        loadData(); // Also refresh local data
      }
    },
    {
      id: 'add',
      label: 'Add Project',
      icon: <Plus className="w-4 h-4" />,
      variant: 'primary' as const,
      onClick: () => {
        projectsTableRef.current?.openAddModal();
      }
    }
  ];

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedProjects(selected ? projects.map(project => project.id) : []);
  };

  // Calculate stats
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'ACTIVE').length,
    completedProjects: projects.filter(p => p.status === 'COMPLETED').length,
    onHoldProjects: projects.filter(p => p.status === 'ON_HOLD').length
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-600">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-100 border border-red-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-700">{error}</p>
            <button type="button"
              onClick={loadData}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <SuccessAlert 
          message={successMessage} 
          closable 
          onClose={() => setSuccessMessage(null)} 
        />
      )}

      {/* Project Statistics */}
      <ProjectStats {...stats} />

      {/* Header with Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600">Manage power generation projects and their configurations</p>
        </div>
        <ActionButtonGroup buttons={actionButtons} />
      </div>

      {/* Search and Filter Bar */}
      <SearchFilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search projects..."
        onFilterClick={() => console.log('Filter clicked')}
      >
        {selectedProjects.length > 0 && (
          <div className="flex items-center space-x-2 pl-4 border-l border-slate-200">
            <span className="text-sm text-slate-600 font-medium">
              {selectedProjects.length} selected
            </span>
            <button type="button" className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors">
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </button>
            <button type="button" className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors">
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </button>
          </div>
        )}
      </SearchFilterBar>

      {/* Projects Table */}
      <ProjectsTable
        ref={projectsTableRef}
        searchTerm={searchTerm}
      />
    </div>
  );
}