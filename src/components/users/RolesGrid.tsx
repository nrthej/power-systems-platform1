import React from 'react';
import { Shield, Edit, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  color: string;
}

interface RolesGridProps {
  roles: Role[];
}

export function RolesGrid({ roles }: RolesGridProps) {
  return (
    <Grid cols={3} gap={4}>
      {roles.map((role) => (
        <Card key={role.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{role.name}</h3>
                <p className="text-xs text-slate-600">{role.userCount} users</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors rounded">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <p className="text-slate-600 text-xs mb-3">{role.description}</p>
          
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-700 uppercase tracking-wide">Permissions</p>
            <div className="flex flex-wrap gap-1">
              {role.permissions.slice(0, 3).map((permission, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-md text-xs font-medium ${role.color}`}
                >
                  {permission}
                </span>
              ))}
              {role.permissions.length > 3 && (
                <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                  +{role.permissions.length - 3} more
                </span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </Grid>
  );
}