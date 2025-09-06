import React from 'react';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const sizes = {
    sm: { container: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-lg' },
    md: { container: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-2xl' },
    lg: { container: 'w-20 h-20', icon: 'w-10 h-10', text: 'text-3xl' }
  };

  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn(
        "flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg",
        sizes[size].container,
        showText ? "mr-3" : ""
      )}>
        <Zap className={cn("text-white", sizes[size].icon)} />
      </div>
      {showText && (
        <div>
          <h1 className={cn("font-bold text-slate-800", sizes[size].text)}>
            Power Systems
          </h1>
          <p className="text-slate-600 text-xs">Project Management Platform</p>
        </div>
      )}
    </div>
  );
}