import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const ROUTE_NAME_MAP: Record<string, string> = {
  trips: 'Trips',
  vehicles: 'Vehicles',
  drivers: 'Drivers',
  locations: 'Locations',
  cargo: 'Cargo',
  dock: 'Dock',
  reports: 'Reports',
  notifications: 'Notifications',
  settings: 'Settings',
  dashboard: 'Dashboard',
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items: customItems, className = '' }) => {
  const location = useLocation();

  // If custom items passed, use them; otherwise auto-generate from URL path
  const items: BreadcrumbItem[] = React.useMemo(() => {
    if (customItems && customItems.length > 0) {
      return customItems;
    }

    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) {
      return [];
    }

    let accumulatedPath = '';
    return pathSegments.map((segment, index) => {
      accumulatedPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      const mappedLabel = ROUTE_NAME_MAP[segment.toLowerCase()] || segment;

      return {
        label: mappedLabel,
        href: isLast ? undefined : accumulatedPath,
        isCurrentPage: isLast,
      };
    });
  }, [customItems, location.pathname]);

  const isHomeActive = items.length === 0;

  // Responsive item rendering helper
  // If > 3 items: on mobile/tablet collapse middle items
  const shouldCollapse = items.length > 3;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center h-6 text-xs font-sans whitespace-nowrap overflow-hidden select-none ${className}`}
    >
      <ol className="flex items-center space-x-1 sm:space-x-1.5 flex-nowrap overflow-hidden">
        {/* Home Icon */}
        <li className="flex items-center shrink-0">
          <Link
            to="/"
            aria-label="Home Dashboard"
            aria-current={isHomeActive ? 'page' : undefined}
            className={`w-5 h-5 rounded-md transition-all duration-150 flex items-center justify-center ${
              isHomeActive
                ? 'text-slate-900 dark:text-slate-100 font-semibold cursor-default'
                : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-950/30 cursor-pointer'
            }`}
          >
            <Home className="h-4 w-4 shrink-0" />
          </Link>
        </li>

        {/* Breadcrumb Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          // For mobile/tablet responsiveness when long
          const isMiddleItem = shouldCollapse && index > 0 && index < items.length - 1;

          return (
            <React.Fragment key={index}>
              {/* Chevron Separator */}
              <li className="flex items-center shrink-0 text-slate-400 dark:text-slate-600" aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              </li>

              <li
                className={`flex items-center shrink-0 ${
                  isMiddleItem ? 'hidden sm:inline-flex' : 'inline-flex'
                }`}
              >
                {isLast || !item.href ? (
                  <span
                    aria-current="page"
                    className="font-semibold text-slate-900 dark:text-slate-100 px-1 py-0.5 cursor-default truncate max-w-[200px] sm:max-w-[300px]"
                    title={item.label}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className="font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#1a2130] rounded-md px-1.5 py-0.5 transition-colors truncate max-w-[150px] sm:max-w-[200px]"
                    title={item.label}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
