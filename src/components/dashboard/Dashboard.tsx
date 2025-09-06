import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Activity, Users, FolderKanban, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Welcome back, John! 👋
            </h2>
            <p className="text-slate-600 mb-4">
              Here's what's happening with your power systems projects today.
            </p>
            <Button variant="primary">
              Create New Project
            </Button>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
              <Activity className="w-16 h-16 text-white opacity-80" />
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Projects</p>
              <p className="text-2xl font-bold text-slate-800">24</p>
              <p className="text-green-600 text-sm">+12% from last month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FolderKanban className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Active Users</p>
              <p className="text-2xl font-bold text-slate-800">12</p>
              <p className="text-green-600 text-sm">+2 new this week</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Completion Rate</p>
              <p className="text-2xl font-bold text-slate-800">87%</p>
              <p className="text-green-600 text-sm">+5% improvement</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">System Health</p>
              <p className="text-2xl font-bold text-slate-800">98%</p>
              <p className="text-green-600 text-sm">All systems normal</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Projects</h3>
          <div className="space-y-4">
            {[
              { name: 'Solar Farm Phase 2', status: 'In Progress', progress: 75 },
              { name: 'Grid Modernization', status: 'Planning', progress: 25 },
              { name: 'Wind Turbine Installation', status: 'Completed', progress: 100 },
            ].map((project, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">{project.name}</p>
                  <p className="text-sm text-slate-600">{project.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800">{project.progress}%</p>
                  <div className="w-16 h-2 bg-slate-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-blue-600 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <FolderKanban className="w-4 h-4 mr-2" />
              Create New Project
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Invite Team Member
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Activity className="w-4 h-4 mr-2" />
              System Diagnostics
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}