import React from 'react';
import { cn } from '@/lib/utils';

interface ActionButton {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick: () => void;
}

interface ActionButtonGroupProps {
  buttons: ActionButton[];
  className?: string;
}

export function ActionButtonGroup({ buttons, className }: ActionButtonGroupProps) {
  return (
    <div className={cn('flex items-center space-x-3', className)}>
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={button.onClick}
          className={cn(
            'inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm',
            button.variant === 'primary'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
          )}
        >
          {button.icon && <span className="mr-2">{button.icon}</span>}
          {button.label}
        </button>
      ))}
    </div>
  );
}