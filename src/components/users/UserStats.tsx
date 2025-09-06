import React from 'react';
import { UserPlus, Shield, Edit, Users as UsersIcon } from 'lucide-react';
import { Grid } from '@/components/ui/Grid';
import { StatsCard } from '@/components/ui/StatsCard';

interface UserStatsProps {
  totalUsers: number;
  activeUsers: number;
  totalRoles: number;
  roleAssignments: number;
}

export function UserStats({ totalUsers, activeUsers, totalRoles, roleAssignments }: UserStatsProps) {
  return (
    <Grid cols={4} gap={4}>
      <StatsCard
        title="Total Users"
        value={totalUsers}
        icon={<UsersIcon className="w-8 h-8" />}
        variant="blue"
      />
      <StatsCard
        title="Active Users"
        value={activeUsers}
        icon={<UserPlus className="w-8 h-8" />}
        variant="green"
      />
      <StatsCard
        title="Total Roles"
        value={totalRoles}
        icon={<Shield className="w-8 h-8" />}
        variant="purple"
      />
      <StatsCard
        title="Role Assignments"
        value={roleAssignments}
        icon={<Edit className="w-8 h-8" />}
        variant="orange"
      />
    </Grid>
  );
}