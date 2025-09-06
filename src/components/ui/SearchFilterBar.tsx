import React from 'react';
import { Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function SearchFilterBar({ 
  searchValue, 
  onSearchChange, 
  placeholder = 'Search...', 
  onFilterClick,
  children,
  className 
}: SearchFilterBarProps) {
  return (
    <div className={cn('bg-white rounded-lg border border-slate-200 p-4 shadow-sm', className)}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onFilterClick && (
            <button 
              onClick={onFilterClick}
              className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}