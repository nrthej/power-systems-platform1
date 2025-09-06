import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass';
}

export default function Card({ children, className, variant = 'default' }: CardProps) {
  const baseStyles = "rounded-2xl shadow-xl border p-8";
  
  const variants = {
    default: "bg-white border-slate-200",
    glass: "bg-white/80 backdrop-blur-sm border-white/50"
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)}>
      {children}
    </div>
  );
}