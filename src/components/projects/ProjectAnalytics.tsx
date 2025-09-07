// components/projects/ProjectAnalytics.tsx
'use client';

import React from 'react';
import { BarChart3, PieChart, TrendingUp, Users, Calendar, Database, Building, CheckCircle } from 'lucide-react';
import type { Project } from './projectsData';

interface ProjectAnalyticsProps {
  projects: Project[];
  loading?: boolean;
}

export function ProjectAnalytics({ projects, loading = false }: ProjectAnalyticsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
            <div className="h-4 bg-slate-200 rounded mb-4"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Calculate statistics
  const totalProjects = projects.length;
  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const teamSizes = projects.map(p => p.projectUsers?.length || 0);
  const avgTeamSize = teamSizes.length > 0 ? Math.round(teamSizes.reduce((a, b) => a + b, 0) / teamSizes.length) : 0;
  const totalTeamMembers = teamSizes.reduce((a, b) => a + b, 0);

  const fieldCounts = projects.map(p => p.assignedFields?.length || 0);
  const avgFieldsPerProject = fieldCounts.length > 0 ? Math.round(fieldCounts.reduce((a, b) => a + b, 0) / fieldCounts.length) : 0;

  // Projects by month
  const projectsByMonth = projects.reduce((acc, project) => {
    const month = new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentMonths = Object.keys(projectsByMonth).slice(-6);

  // Completion rate
  const completedProjects = statusCounts['COMPLETED'] || 0;
  const activeProjects = statusCounts['ACTIVE'] || 0;
  const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    color = 'blue',
    trend 
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ComponentType<any>;
    color?: string;
    trend?: string;
  }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-${color}-50 flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {trend && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full bg-green-100 text-green-700`}>
            {trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-slate-600">{title}</div>
      <div className="text-sm text-slate-500 mt-1">{subtitle}</div>
    </div>
  );

  const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={totalProjects}
          subtitle="All projects in system"
          icon={Building}
          color="blue"
        />
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          subtitle={`${completedProjects} of ${totalProjects} completed`}
          icon={CheckCircle}
          color="green"
          trend={completionRate > 50 ? '+12%' : undefined}
        />
        <StatCard
          title="Team Members"
          value={totalTeamMembers}
          subtitle={`Avg ${avgTeamSize} per project`}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Avg Fields"
          value={avgFieldsPerProject}
          subtitle="Fields per project"
          icon={Database}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <ChartCard title="Project Status Distribution">
          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = Math.round((count / totalProjects) * 100);
              const colors = {
                PLANNING: 'bg-blue-500',
                ACTIVE: 'bg-green-500',
                ON_HOLD: 'bg-orange-500',
                COMPLETED: 'bg-purple-500',
                CANCELLED: 'bg-red-500'
              };
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${colors[status as keyof typeof colors] || 'bg-slate-500'}`} />
                    <span className="text-sm font-medium text-slate-700">
                      {status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[status as keyof typeof colors] || 'bg-slate-500'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 w-8 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* Monthly Project Creation */}
        <ChartCard title="Projects Created (Last 6 Months)">
          <div className="space-y-3">
            {recentMonths.map((month) => {
              const count = projectsByMonth[month];
              const maxCount = Math.max(...Object.values(projectsByMonth));
              const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
              
              return (
                <div key={month} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 w-16">
                    {month}
                  </span>
                  <div className="flex items-center space-x-3 flex-1 ml-4">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 w-6 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* Team Size Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Team Size Distribution">
          <div className="space-y-3">
            {[
              { range: '1-2', count: projects.filter(p => (p.projectUsers?.length || 0) <= 2).length },
              { range: '3-5', count: projects.filter(p => {
                const size = p.projectUsers?.length || 0;
                return size >= 3 && size <= 5;
              }).length },
              { range: '6-10', count: projects.filter(p => {
                const size = p.projectUsers?.length || 0;
                return size >= 6 && size <= 10;
              }).length },
              { range: '10+', count: projects.filter(p => (p.projectUsers?.length || 0) > 10).length }
            ].map(({ range, count }) => {
              const percentage = totalProjects > 0 ? (count / totalProjects) * 100 : 0;
              
              return (
                <div key={range} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    {range} members
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 bg-slate-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-purple-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 w-6 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        <div className="lg:col-span-2">
          <ChartCard title="Recent Activity">
            <div className="space-y-4">
              {projects
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((project) => (
                  <div key={project.id} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center`}>
                      <Building className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">
                        {project.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        Created {new Date(project.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      project.status === 'COMPLETED' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {project.status}
                    </div>
                  </div>
                ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}