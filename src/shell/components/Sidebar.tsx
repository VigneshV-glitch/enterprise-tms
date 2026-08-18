import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { NAV_GROUPS } from '../navigation/navigation.config';
import { useUserPreferences } from '../../hooks/useUserPreferences';

export const Sidebar: React.FC = () => {
  const { preferences, updateNavigationPreference } = useUserPreferences();
  const isCollapsed = preferences.navigationPreferences.sidebarCollapsed;
  const setIsCollapsed = (collapsed: boolean) => {
    updateNavigationPreference({ sidebarCollapsed: collapsed });
  };
  const [isHovered, setIsHovered] = useState(false);

  // Expanded if either pinned open (!isCollapsed) OR hovered while collapsed
  const isExpanded = !isCollapsed || isHovered;

  return (
    <div className="w-14 h-full shrink-0 relative z-30 bg-transparent">
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'absolute left-0 top-0 bottom-0 bg-white dark:bg-[#111111] border-r border-slate-200 dark:border-[#303030] h-full flex flex-col transition-all duration-300 ease-in-out select-none z-30 overflow-hidden shadow-none',
          isExpanded ? 'w-[210px]' : 'w-14'
        )}
      >
        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-2 px-2.5 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-[#303030]">
          {NAV_GROUPS.map((group) => (
            <div key={group.groupName} className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center w-full px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ease-in-out group h-[30px] overflow-hidden justify-start',
                      isActive
                        ? 'bg-[#F1F5F9] dark:bg-[#232323] text-slate-900 dark:text-[#FAFAFA] font-semibold shadow-xs'
                        : 'bg-transparent text-slate-600 dark:text-[#A3A3A3] hover:text-slate-900 dark:hover:text-[#FAFAFA] hover:bg-[#F1F5F9] dark:hover:bg-[#232323]'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={cn(
                          'shrink-0 transition-colors flex items-center justify-center w-4 h-4',
                          isActive
                            ? 'text-blue-600 dark:text-[#2196F3]'
                            : 'text-slate-500 dark:text-[#A3A3A3] group-hover:text-slate-900 dark:group-hover:text-[#FAFAFA]'
                        )}
                      >
                        {item.icon}
                      </div>
                      <div
                        className={cn(
                          'flex items-center justify-between flex-1 min-w-0 transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden',
                          isExpanded ? 'opacity-100 max-w-[150px] ml-2.5' : 'opacity-0 max-w-0 ml-0 pointer-events-none'
                        )}
                      >
                        <span className="truncate text-xs">{item.label}</span>
                        {item.badge && (
                          <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-slate-100 dark:bg-[#1D1D1D] text-blue-700 dark:text-[#2196F3] rounded border border-slate-200 dark:border-[#303030] font-mono font-semibold shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom Footer Section with Collapse Toggle Chevron */}
        <div className="px-2.5 h-[40px] border-t border-slate-200 dark:border-[#303030] bg-white dark:bg-[#111111] flex items-center justify-start">
          {/* Chevron / Panel Toggle at bottom */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-9 h-[30px] flex items-center justify-center text-slate-500 dark:text-[#A3A3A3] hover:text-slate-900 dark:hover:text-[#FAFAFA] rounded-md hover:bg-slate-100 dark:hover:bg-[#232323] transition-colors"
            title={isCollapsed ? 'Pin Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4 text-slate-500 dark:text-[#A3A3A3] hover:text-blue-600 dark:hover:text-[#2196F3]" />
            ) : (
              <PanelLeftClose className="h-4 w-4 text-slate-500 dark:text-[#A3A3A3] hover:text-blue-600 dark:hover:text-[#2196F3]" />
            )}
          </button>
        </div>
      </aside>
    </div>
  );
};
