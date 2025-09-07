// components/projects/ProjectStats.tsx
import React from 'react';
import { StatsCard } from '@/components/ui/StatsCard';
import { 
  FolderOpen, 
  Play, 
  CheckCircle, 
  Pause 
} from 'lucide-react';

interface ProjectStatsProps {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
}

export function ProjectStats({ 
  totalProjects, 
  activeProjects, 
  completedProjects, 
  onHoldProjects 
}: ProjectStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Projects"
        value={totalProjects}
        icon={<FolderOpen className="w-6 h-6" />}
        color="blue"
      />
      <StatsCard
        title="Active Projects"
        value={activeProjects}
        icon={<Play className="w-6 h-6" />}
        color="green"
      />
      <StatsCard
        title="Completed Projects"
        value={completedProjects}
        icon={<CheckCircle className="w-6 h-6" />}
        color="purple"
      />
      <StatsCard
        title="On Hold Projects"
        value={onHoldProjects}
        icon={<Pause className="w-6 h-6" />}
        color="orange"
      />
    </div>
  );
}