// components/projects/ProjectsPage.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Upload, Download, Filter, Grid, List, Search, SortAsc, BarChart3, Calendar, Users, Building } from 'lucide-react';
import { ActionButtonGroup } from '@/components/ui/ActionButtonGroup';
import { SearchFilterBar } from '@/components/ui/SearchFilterBar';
import { ProjectStats } from './ProjectStats';
import { ProjectsTable, type ProjectsTableRef } from './ProjectsTable';
import { ProjectsGrid } from './ProjectsGrid';
import { ProjectsKanban } from './ProjectsKanban';
import { AdvancedFilters } from './AdvancedFilters';
import { ProjectAnalytics } from './ProjectAnalytics';
import { projectsData, type Project } from './projectsData';
import { SuccessAlert } from '@/components/ui/Alert';

type ViewMode = 'grid' | 'list' | 'kanban' | 'analytics';
type SortField = 'name' | 'status' | 'startDate' | 'createdAt' | 'team';
type SortDirection = 'asc' | 'desc';

interface FilterState {
  status: string[];
  dateRange: { start: Date | null; end: Date | null };
  teamSize: { min: number | null; max: number | null };
  createdBy: string[];
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    dateRange: { start: null, end: null },
    teamSize: { min: null, max: null },
    createdBy: []
  });

  // State for real data
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
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

  useEffect(() => {
    applyFiltersAndSort();
  }, [projects, searchTerm, filters, sortField, sortDirection]);

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

  const applyFiltersAndSort = () => {
    let filtered = [...projects];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(project => filters.status.includes(project.status));
    }

    // Apply date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(project => {
        const projectDate = project.startDate || project.createdAt;
        if (filters.dateRange.start && projectDate < filters.dateRange.start) return false;
        if (filters.dateRange.end && projectDate > filters.dateRange.end) return false;
        return true;
      });
    }

    // Apply team size filter
    if (filters.teamSize.min !== null || filters.teamSize.max !== null) {
      filtered = filtered.filter(project => {
        const teamSize = project.projectUsers?.length || 0;
        if (filters.teamSize.min !== null && teamSize < filters.teamSize.min) return false;
        if (filters.teamSize.max !== null && teamSize > filters.teamSize.max) return false;
        return true;
      });
    }

    // Apply created by filter
    if (filters.createdBy.length > 0) {
      filtered = filtered.filter(project => filters.createdBy.includes(project.createdBy.id));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'startDate':
          aValue = a.startDate || new Date(0);
          bValue = b.startDate || new Date(0);
          break;
        case 'team':
          aValue = a.projectUsers?.length || 0;
          bValue = b.projectUsers?.length || 0;
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredProjects(filtered);
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
      id: 'add',
      label: 'New Project',
      icon: <Plus className="w-4 h-4" />,
      variant: 'primary' as const,
      onClick: () => {
        projectsTableRef.current?.openAddModal();
      }
    }
  ];

  const viewModeButtons = [
    {
      id: 'grid',
      icon: <Grid className="w-4 h-4" />,
      label: 'Grid',
      active: viewMode === 'grid',
      onClick: () => setViewMode('grid')
    },
    {
      id: 'list',
      icon: <List className="w-4 h-4" />,
      label: 'List',
      active: viewMode === 'list',
      onClick: () => setViewMode('list')
    },
    {
      id: 'kanban',
      icon: <Building className="w-4 h-4" />,
      label: 'Kanban',
      active: viewMode === 'kanban',
      onClick: () => setViewMode('kanban')
    },
    {
      id: 'analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      label: 'Analytics',
      active: viewMode === 'analytics',
      onClick: () => setViewMode('analytics')
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
    setSelectedProjects(selected ? filteredProjects.map(project => project.id) : []);
  };

  // Calculate stats
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'ACTIVE').length,
    completedProjects: projects.filter(p => p.status === 'COMPLETED').length,
    onHoldProjects: projects.filter(p => p.status === 'ON_HOLD').length,
    planningProjects: projects.filter(p => p.status === 'PLANNING').length,
    cancelledProjects: projects.filter(p => p.status === 'CANCELLED').length
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      dateRange: { start: null, end: null },
      teamSize: { min: null, max: null },
      createdBy: []
    });
    setSearchTerm('');
  };

  const renderViewContent = () => {
    switch (viewMode) {
      case 'grid':
        return (
          <ProjectsGrid 
            projects={filteredProjects}
            selectedProjects={selectedProjects}
            onProjectSelect={handleProjectSelect}
            onSelectAll={handleSelectAll}
            loading={loading}
          />
        );
      case 'kanban':
        return (
          <ProjectsKanban 
            projects={filteredProjects}
            onProjectUpdate={(id, updates) => console.log('Update project:', id, updates)}
            loading={loading}
          />
        );
      case 'analytics':
        return (
          <ProjectAnalytics 
            projects={projects}
            loading={loading}
          />
        );
      default:
        return (
          <ProjectsTable
            ref={projectsTableRef}
            searchTerm={searchTerm}
          />
        );
    }
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
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600">Manage power generation projects and their configurations</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-slate-500">{filteredProjects.length} of {projects.length} projects</span>
            {(filters.status.length > 0 || filters.dateRange.start || filters.dateRange.end || filters.teamSize.min !== null || filters.teamSize.max !== null || filters.createdBy.length > 0) && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
        <ActionButtonGroup buttons={actionButtons} />
      </div>

      {/* Enhanced Search and Controls */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search and Filter */}
          <div className="flex flex-1 items-center space-x-4 min-w-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-blue-50 text-blue-700 border-blue-300' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
            {viewModeButtons.map((button) => (
              <button
                key={button.id}
                onClick={button.onClick}
                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  button.active
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={button.label}
              >
                {button.icon}
                <span className="ml-1.5 hidden sm:block">{button.label}</span>
              </button>
            ))}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-2">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt">Created Date</option>
              <option value="name">Name</option>
              <option value="status">Status</option>
              <option value="startDate">Start Date</option>
              <option value="team">Team Size</option>
            </select>
            <button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
              title={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
            >
              <SortAsc className={`w-4 h-4 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <AdvancedFilters
              filters={filters}
              onFiltersChange={setFilters}
              projects={projects}
            />
          </div>
        )}

        {/* Selected Items Actions */}
        {selectedProjects.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 font-medium">
                {selectedProjects.length} project{selectedProjects.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <button className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors">
                  <Users className="w-3 h-3 mr-1" />
                  Assign Team
                </button>
                <button className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors">
                  <Calendar className="w-3 h-3 mr-1" />
                  Update Status
                </button>
                <button className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors">
                  <Download className="w-3 h-3 mr-1" />
                  Export Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {renderViewContent()}
    </div>
  );
}