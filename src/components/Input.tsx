import React from 'react';
import { cn } from '../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{label}</label>}
      <input
        className={cn(
          'flex h-10 w-full rounded-lg border border-border-thin bg-white px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-solid/10 focus:border-emerald-solid disabled:cursor-not-allowed disabled:opacity-50 transition-all',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
