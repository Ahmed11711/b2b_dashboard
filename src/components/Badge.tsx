import React from 'react';
import { cn } from '../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className }) => {
  const variants = {
    success: 'bg-emerald-tint/50 text-emerald-text border-emerald-solid/20',
    warning: 'bg-amber-50/50 text-amber-700 border-amber-500/20',
    error: 'bg-rose-50/50 text-rose-700 border-rose-500/20',
    info: 'bg-sky-50/50 text-sky-700 border-sky-500/20',
    neutral: 'bg-slate-50/50 text-slate-600 border-slate-200',
  };

  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
};
