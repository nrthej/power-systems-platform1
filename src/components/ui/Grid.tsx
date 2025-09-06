import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 2 | 3 | 4 | 6;
  className?: string;
}

export function Grid({ children, cols = 1, gap = 4, className }: GridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-1 md:grid-cols-6 lg:grid-cols-12'
  };

  const gridGap = {
    2: 'gap-2',
    3: 'gap-3', 
    4: 'gap-4',
    6: 'gap-6'
  };

  return (
    <div className={cn('grid', gridCols[cols], gridGap[gap], className)}>
      {children}
    </div>
  );
}