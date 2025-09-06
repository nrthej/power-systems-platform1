import React from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  className?: string;
}

export function StatsCard({ title, value, icon, variant = 'blue', className }: StatsCardProps) {
  const variants = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    red: 'bg-red-50 border-red-200 text-red-600'
  };

  const textColors = {
    blue: 'text-blue-900',
    green: 'text-green-900',
    purple: 'text-purple-900',
    orange: 'text-orange-900',
    red: 'text-red-900'
  };

  return (
    <div className={cn('rounded-lg p-4 border', variants[variant], className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className={cn('text-xl font-bold', textColors[variant])}>{value}</p>
        </div>
        <div className="w-8 h-8">
          {icon}
        </div>
      </div>
    </div>
  );
}