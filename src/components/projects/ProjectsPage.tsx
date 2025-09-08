'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Calendar,
  TrendingUp,
  Clock,
  Users,
  MoreVertical,
  Star,
  ArrowUpRight,
  Zap,
  Target,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectsTable, type ProjectsTableRef } from './ProjectsTable';
import { projectsData, type Project } from './projectsData';
import { SuccessAlert } from '@/components/ui/Alert';

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'date'>('date');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // State for real data
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  // Calculate statistics
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'ACTIVE').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    planning: projects.filter(p => p.status === 'PLANNING').length,
    onHold: projects.filter(p => p.status === 'ON_HOLD').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ON_HOLD':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'COMPLETED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return <Target className="w-4 h-4" />;
      case 'ACTIVE':
        return <Zap className="w-4 h-4" />;
      case 'ON_HOLD':
        return <Clock className="w-4 h-4" />;
      case 'COMPLETED':
        return <Star className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProjectProgress = (project: Project) => {
    // Mock progress calculation based on status
    switch (project.status) {
      case 'PLANNING': return 15;
      case 'ACTIVE': return 65;
      case 'ON_HOLD': return 40;
      case 'COMPLETED': return 100;
      case 'CANCELLED': return 25;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 font-medium">Loading your projects...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Power Projects
                  </h1>
                  <p className="text-slate-600 font-medium">
                    Manage and track your energy infrastructure projects
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => projectsTableRef.current?.openAddModal()}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Project
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SuccessAlert 
              message={successMessage} 
              closable 
              onClose={() => setSuccessMessage(null)} 
            />
          </motion.div>
        )}

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Projects</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-emerald-600 text-sm font-medium mt-1">+12% this month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active</p>
                <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
                <p className="text-emerald-600 text-sm font-medium mt-1">Running smoothly</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Planning</p>
                <p className="text-2xl font-bold text-slate-900">{stats.planning}</p>
                <p className="text-blue-600 text-sm font-medium mt-1">In development</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
                <p className="text-purple-600 text-sm font-medium mt-1">Successfully delivered</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">On Hold</p>
                <p className="text-2xl font-bold text-slate-900">{stats.onHold}</p>
                <p className="text-amber-600 text-sm font-medium mt-1">Awaiting approval</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Advanced Controls */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search projects by name, description, or technology..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-500 transition-all"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-3">
                {/* Filter */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`inline-flex items-center px-4 py-3 rounded-xl border font-medium text-sm transition-all ${
                      showFilters || filterStatus !== 'all'
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                    {filterStatus !== 'all' && (
                      <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </button>

                  {/* Filter Dropdown */}
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-10"
                      >
                        <div className="p-4 space-y-3">
                          <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">Status</label>
                            <select
                              value={filterStatus}
                              onChange={(e) => setFilterStatus(e.target.value)}
                              className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                            >
                              <option value="all">All Statuses</option>
                              <option value="PLANNING">Planning</option>
                              <option value="ACTIVE">Active</option>
                              <option value="ON_HOLD">On Hold</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">Sort By</label>
                            <select
                              value={sortBy}
                              onChange={(e) => setSortBy(e.target.value as any)}
                              className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                            >
                              <option value="date">Date Created</option>
                              <option value="name">Project Name</option>
                              <option value="status">Status</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Display */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Target className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {searchTerm || filterStatus !== 'all' ? 'No projects match your criteria' : 'Ready to start your first project?'}
            </h3>
            <p className="text-slate-600 max-w-md mx-auto leading-relaxed mb-8">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                : 'Create your first power generation project and start managing your energy infrastructure portfolio.'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => projectsTableRef.current?.openAddModal()}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Project
              </button>
            )}
          </motion.div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Project Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {project.name}
                      </h3>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        <span className="ml-2">{project.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {project.description || 'No description provided for this project.'}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-600">Progress</span>
                      <span className="text-xs font-bold text-slate-900">{getProjectProgress(project)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getProjectProgress(project)}%` }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Project Meta */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-slate-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(project.createdAt)}</span>
                      </div>
                      <div className="flex items-center text-slate-500">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{project.projectUsers?.length || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {project.projectUsers?.slice(0, 3).map((pu, idx) => (
                        <div
                          key={pu.id}
                          className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                          style={{ marginLeft: idx > 0 ? '-8px' : '0' }}
                        >
                          {pu.user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                      {(project.projectUsers?.length || 0) > 3 && (
                        <div className="w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center text-slate-600 text-xs font-semibold ml-[-8px]">
                          +{(project.projectUsers?.length || 0) - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Project Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      Created by {project.createdBy.name}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                        View Details
                      </button>
                      <button className="text-xs text-slate-500 hover:text-slate-700 font-medium hover:underline transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Enhanced List View */
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-slate-50 transition-all duration-200 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      {/* Project Icon */}
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        {getStatusIcon(project.status)}
                      </div>

                      {/* Project Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {project.name}
                          </h3>
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                            {project.status.replace('_', ' ')}
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                          {project.description || 'No description provided for this project.'}
                        </p>
                        
                        {/* Progress and Meta */}
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-slate-200 rounded-full h-1.5">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${getProjectProgress(project)}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-slate-600">{getProjectProgress(project)}%</span>
                          </div>
                          <div className="flex items-center text-xs text-slate-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(project.createdAt)}
                          </div>
                          <div className="flex items-center text-xs text-slate-500">
                            <Users className="w-3 h-3 mr-1" />
                            {project.projectUsers?.length || 0} members
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Hidden Table Component for Modal Functionality */}
        <div className="hidden">
          <ProjectsTable
            ref={projectsTableRef}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </div>
  );
}