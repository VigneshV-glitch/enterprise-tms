import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, hoverable = false, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-[#12161f] border border-slate-200 dark:border-[#1e2638] rounded-md p-4 shadow-xs transition-colors duration-150',
        hoverable && 'hover:border-slate-300 dark:hover:border-[#2d384e] hover:bg-slate-50 dark:hover:bg-[#161b26]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
