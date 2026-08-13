import React from 'react';
import { cn } from '../../lib/utils';
import { StatusType } from '../../types';
import { DESIGN_TOKENS } from '../../styles/tokens';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: StatusType;
  variant?: 'status' | 'neutral' | 'outline' | 'brand';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  status,
  variant = 'status',
  size = 'sm',
  className,
  ...props
}) => {
  let styleClasses = 'bg-slate-800/80 text-slate-300 border-slate-700/60';

  if (variant === 'status' && status) {
    const sToken = DESIGN_TOKENS.colors.status[status as keyof typeof DESIGN_TOKENS.colors.status];
    if (sToken) {
      styleClasses = `${sToken.bg} ${sToken.text} ${sToken.border}`;
    }
  } else if (variant === 'brand') {
    styleClasses = 'bg-blue-500/10 text-blue-400 border-blue-500/25';
  } else if (variant === 'outline') {
    styleClasses = 'bg-transparent text-slate-300 border-slate-700';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border whitespace-nowrap tracking-wide capitalize',
        styleClasses,
        sizeClasses,
        className
      )}
      {...props}
    >
      {status && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            status === 'active' || status === 'in_transit' || status === 'completed' || status === 'available'
              ? 'bg-blue-400'
              : status === 'pending'
              ? 'bg-amber-400'
              : status === 'delayed'
              ? 'bg-rose-400'
              : 'bg-slate-400'
          )}
        />
      )}
      {children || (status ? status.replace('_', ' ') : null)}
    </span>
  );
};
