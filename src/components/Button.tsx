import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  ...props
}) => {
  const variants = {
    primary: 'bg-emerald-solid text-white hover:brightness-110 shadow-sm',
    secondary: 'bg-emerald-tint text-emerald-text border border-emerald-solid/10 hover:bg-emerald-solid/10',
    outline: 'border border-border-thin text-secondary-link bg-white hover:bg-emerald-tint hover:text-emerald-text hover:border-emerald-solid/20',
    ghost: 'hover:bg-emerald-tint text-secondary-link hover:text-emerald-text',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg min-h-[44px] md:min-h-[32px]',
    md: 'px-4 py-2 text-sm rounded-lg min-h-[44px] md:min-h-[40px]',
    lg: 'px-6 py-3 text-base rounded-xl min-h-[48px] md:min-h-[48px]',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-solid/30 focus:ring-offset-2 disabled:opacity-50 active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};
