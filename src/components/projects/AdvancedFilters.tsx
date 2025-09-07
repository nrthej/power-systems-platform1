// components/projects/AdvancedFilters.tsx
'use client';

import React from 'react';
import { Calendar, Users, X } from 'lucide-react';
import type { Project } from './projectsData';

interface FilterState {
  status: string[];
  dateRange: { start: Date | null; end: Date | null };
  teamSize: { min: number | null; max: number | null };
  createdBy: string[];
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  projects: Project[];
}

export function AdvancedFilters({ filters, onFiltersChange, projects }: AdvancedFiltersProps) {
  const statusOptions = ['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'];
  
  const uniqueCreators = Array.from(
    new Set(projects.map(p => p.createdBy.id))
  ).map(id => projects.find(p => p.createdBy.id === id)?.createdBy).filter(Boolean);

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatus = checked
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status);
    onFiltersChange({ ...filters, status: newStatus });
  };

  const handleCreatorChange = (creatorId: string, checked: boolean) => {
    const newCreatedBy = checked
      ? [...filters.createdBy, creatorId]
      : filters.createdBy.filter(id => id !== creatorId);
    onFiltersChange({ ...filters, createdBy: newCreatedBy });
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Status Filter */}
      <div>
        <label className="text-sm font-medium text-slate-700 mb-3 block">
          Project Status
        </label>
        <div className="space-y-2">
          {statusOptions.map((status) => (
            <label key={status} className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={filters.status.includes(status)}
                onChange={(e) => handleStatusChange(status, e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 mr-2"
              />
              <span className="text-slate-700">{status.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Date Range Filter */}
      <div>
        <label className="text-sm font-medium text-slate-700 mb-3 block">
          <Calendar className="inline w-4 h-4 mr-1" />
          Date Range
        </label>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-slate-600 block mb-1">Start Date</label>
            <input
              type="date"
              value={filters.dateRange.start ? formatDate(filters.dateRange.start) : ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                dateRange: {
                  ...filters.dateRange,
                  start: e.target.value ? new Date(e.target.value) : null
                }
              })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="text-xs text-slate-600 block mb-1">End Date</label>
            <input
              type="date"
              value={filters.dateRange.end ? formatDate(filters.dateRange.end) : ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                dateRange: {
                  ...filters.dateRange,
                  end: e.target.value ? new Date(e.target.value) : null
                }
              })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Team Size Filter */}
      <div>
        <label className="text-sm font-medium text-slate-700 mb-3 block">
          <Users className="inline w-4 h-4 mr-1" />
          Team Size
        </label>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-slate-600 block mb-1">Minimum</label>
            <input
              type="number"
              min="0"
              value={filters.teamSize.min || ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                teamSize: {
                  ...filters.teamSize,
                  min: e.target.value ? parseInt(e.target.value) : null
                }
              })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs text-slate-600 block mb-1">Maximum</label>
            <input
              type="number"
              min="0"
              value={filters.teamSize.max || ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                teamSize: {
                  ...filters.teamSize,
                  max: e.target.value ? parseInt(e.target.value) : null
                }
              })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any"
            />
          </div>
        </div>
      </div>

      {/* Created By Filter */}
      <div>
        <label className="text-sm font-medium text-slate-700 mb-3 block">
          Created By
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {uniqueCreators.map((creator) => creator && (
            <label key={creator.id} className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={filters.createdBy.includes(creator.id)}
                onChange={(e) => handleCreatorChange(creator.id, e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 mr-2"
              />
              <div className="flex items-center min-w-0">
                {creator.avatar && (
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-4 h-4 rounded-full mr-2 flex-shrink-0"
                  />
                )}
                <span className="text-slate-700 truncate">{creator.name}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}