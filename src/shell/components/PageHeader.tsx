import React from 'react';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';

export interface PageHeaderProps {
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
}) => {
  const hasTitleOrActions = Boolean(title || actions);

  return (
    <div className={hasTitleOrActions ? 'mb-3 space-y-2' : 'flex items-center h-full w-full'}>
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
      {hasTitleOrActions && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {title && (
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">{title}</h1>
              {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
            </div>
          )}
          {actions && <div className="flex items-center gap-2.5 flex-wrap">{actions}</div>}
        </div>
      )}
    </div>
  );
};
