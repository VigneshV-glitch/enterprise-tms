import React from 'react';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  unit?: string;
  icon?: React.ReactNode;
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  unit,
  icon,
  subtitle,
}) => {
  return (
    <div className="bg-white dark:bg-[#12161f] border border-slate-200 dark:border-[#1e2638] rounded-md p-4 space-y-2 hover:border-slate-300 dark:hover:border-[#2d384e] transition-colors shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</span>
        {icon && <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">{icon}</div>}
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-xl font-semibold text-slate-900 dark:text-slate-100 font-mono tracking-tight">{value}</span>
        {unit && <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">{unit}</span>}
      </div>
      {(change || subtitle) && (
        <div className="flex items-center justify-between pt-1 text-[11px]">
          {change && (
            <span
              className={cn(
                'inline-flex items-center gap-1 font-medium font-mono',
                isPositive ? 'text-blue-700 dark:text-blue-400' : 'text-rose-700 dark:text-rose-400'
              )}
            >
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {change}
            </span>
          )}
          {subtitle && <span className="text-slate-500 dark:text-slate-400 text-[10px]">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
