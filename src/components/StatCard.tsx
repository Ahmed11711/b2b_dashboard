import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, trend, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-xl border border-border-light bg-white p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] transition-all hover:shadow-md", className)}
    >
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center border border-border-light">
          <Icon className="h-5 w-5 text-slate-400" />
        </div>
        {trend && (
          <span className={cn(
            "text-[11px] font-semibold px-2 py-0.5 rounded-full border",
            trend.isPositive ? "bg-emerald-tint/50 border-emerald-solid/20 text-emerald-text" : "bg-rose-50/50 border-rose-500/20 text-rose-700"
          )}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
          </span>
        )}
      </div>
      <div className="mt-5">
        <p className="text-[13px] font-medium text-slate-400 uppercase tracking-wider">{label}</p>
        <h3 className="text-3xl font-bold text-carbon-black mt-1.5 tracking-tight">{value}</h3>
      </div>
    </motion.div>
  );
};
