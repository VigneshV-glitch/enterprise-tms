import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Filter,
  ChevronDown,
  ChevronUp,
  Search,
  RotateCcw,
  SlidersHorizontal,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import {
  FilterConfig,
  FilterCondition,
  FilterFieldConfig,
  FilterOption,
} from './filter.types';
import { getFilterConfigForPath } from './filterRegistry';
import { cn } from '../../lib/utils';

export interface FilterPanelProps {
  config?: FilterConfig;
  tableName?: string;
  appliedConditions: FilterCondition[];
  onApplyFilters: (conditions: FilterCondition[]) => void;
  onClearFilters: () => void;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  config: explicitConfig,
  tableName,
  appliedConditions,
  onApplyFilters,
  onClearFilters,
  className,
}) => {
  const location = useLocation();

  // Resolve configuration from explicit prop or route registry
  const activeConfig: FilterConfig = useMemo(() => {
    if (explicitConfig) return explicitConfig;
    if (tableName) {
      const cleanTab = tableName.replace(/^public\./, '');
      return getFilterConfigForPath(cleanTab);
    }
    return getFilterConfigForPath(location.pathname);
  }, [explicitConfig, tableName, location.pathname]);

  // Track expanded accordion section IDs (default first 3 expanded)
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    activeConfig.fields.forEach((field, index) => {
      initial[field.id] = index < 3; // Open top 3 accordions by default
    });
    return initial;
  });

  // Track search filter queries inside individual accordion containers
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});

  // Map of fieldId -> array of selected option values
  const [selectedValuesMap, setSelectedValuesMap] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    appliedConditions.forEach((cond) => {
      if (cond.value) {
        const strVal = String(cond.value);
        initial[cond.fieldId] = strVal.split(',').map((v) => v.trim());
      }
    });
    return initial;
  });

  // Sync internal selected values map when appliedConditions changes externally
  useEffect(() => {
    const nextMap: Record<string, string[]> = {};
    appliedConditions.forEach((cond) => {
      if (cond.value) {
        const strVal = String(cond.value);
        nextMap[cond.fieldId] = strVal.split(',').map((v) => v.trim());
      }
    });
    setSelectedValuesMap(nextMap);
  }, [appliedConditions]);

  // Toggle individual accordion collapse/expand
  const toggleAccordion = (fieldId: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  // Handle option checkbox click inside an accordion container
  const handleToggleOption = (field: FilterFieldConfig, optionValue: string) => {
    const currentList = selectedValuesMap[field.id] || [];
    let updatedList: string[];

    if (currentList.includes(optionValue)) {
      updatedList = currentList.filter((v) => v !== optionValue);
    } else {
      updatedList = [...currentList, optionValue];
    }

    const nextMap = {
      ...selectedValuesMap,
      [field.id]: updatedList,
    };

    if (updatedList.length === 0) {
      delete nextMap[field.id];
    }

    setSelectedValuesMap(nextMap);

    // Convert updated map into normalized FilterCondition[] and emit
    const newConditions: FilterCondition[] = Object.entries(nextMap)
      .filter(([_, vals]: [string, string[]]) => vals && vals.length > 0)
      .map(([fieldId, vals]: [string, string[]]) => {
        const fConfig = activeConfig.fields.find((f) => f.id === fieldId);
        return {
          id: `${fieldId}_condition`,
          fieldId,
          fieldLabel: fConfig?.label || fieldId,
          fieldType: fConfig?.type || 'text',
          operator: 'in',
          value: vals.join(', '),
        };
      });

    onApplyFilters(newConditions);
  };

  // Clear all selected filter checkboxes across accordions
  const handleClearAll = () => {
    setSelectedValuesMap({});
    setSearchQueries({});
    onClearFilters();
  };

  // Total active filter count across all accordions
  const totalActiveCount = useMemo(() => {
    return Object.values(selectedValuesMap).reduce((acc: number, list: string[]) => acc + (list?.length || 0), 0);
  }, [selectedValuesMap]);

  return (
    <div
      className={cn(
        'w-[210px] shrink-0 h-full border-t border-r border-slate-200 dark:border-[#21262d] bg-white dark:bg-[#12161f] flex flex-col justify-between select-none text-xs overflow-hidden',
        className
      )}
    >
      {/* Top Header */}
      <div className="px-3 py-2.5 border-b border-slate-200 dark:border-[#21262d] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="h-3.5 w-3.5 text-blue-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-100 text-xs tracking-tight">
            {activeConfig.title || 'Filters'}
          </span>
          <span className="text-[9px] uppercase font-mono px-1 py-0.2 bg-slate-100 dark:bg-[#21262d] text-slate-500 dark:text-slate-400 rounded">
            BETA
          </span>
        </div>

        {totalActiveCount > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 text-[10px] text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900/50"
            title="Clear all filters"
          >
            <RotateCcw className="h-2.5 w-2.5" />
            <span>Clear ({totalActiveCount})</span>
          </button>
        )}
      </div>

      {/* Accordions List - Clean, Seamless, Merged into Filter Pane */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 no-scrollbar">
        {activeConfig.fields.map((field) => {
          const isOpen = Boolean(openAccordions[field.id]);
          const selectedForField = selectedValuesMap[field.id] || [];
          const searchQuery = (searchQueries[field.id] || '').toLowerCase();

          // Get available options for field
          const rawOptions: FilterOption[] = field.options || [];

          // Filter options based on search query inside accordion container
          const filteredOptions = rawOptions.filter((opt) =>
            opt.label.toLowerCase().includes(searchQuery) ||
            String(opt.value).toLowerCase().includes(searchQuery)
          );

          return (
            <div key={field.id} className="transition-all">
              {/* Borderless Accordion Header sitting cleanly on background */}
              <button
                type="button"
                onClick={() => toggleAccordion(field.id)}
                className="w-full py-1 flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-1 min-w-0 pr-1">
                  <span className="font-medium text-slate-900 dark:text-slate-100 text-[12px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {field.label}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400 shrink-0" />
                  )}
                </div>

                {selectedForField.length > 0 && (
                  <span className="px-1.5 py-0.2 text-[9.5px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full shrink-0">
                    {selectedForField.length}
                  </span>
                )}
              </button>

              {/* Accordion Content Container - Seamless & Merged */}
              {isOpen && (
                <div className="mt-1 mb-1 space-y-1.5 pl-0.5">
                  {/* Search box if there are multiple options */}
                  {rawOptions.length > 3 && (
                    <div className="relative my-1">
                      <Search className="absolute left-2 top-1.5 h-3 w-3 text-slate-400" />
                      <input
                        type="text"
                        value={searchQueries[field.id] || ''}
                        onChange={(e) =>
                          setSearchQueries({
                            ...searchQueries,
                            [field.id]: e.target.value,
                          })
                        }
                        placeholder="Search..."
                        className="w-full pl-6 pr-5 py-1 text-[12px] bg-slate-50 dark:bg-[#181e2a] border border-slate-200 dark:border-[#2b3548] rounded text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                      {searchQuery && (
                        <button
                          onClick={() =>
                            setSearchQueries({
                              ...searchQueries,
                              [field.id]: '',
                            })
                          }
                          className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Clean Option Checkboxes List Container with 185px height and auto scroll */}
                  <div className="h-[185px] overflow-y-auto space-y-0.5 border border-slate-200/70 dark:border-[#21262d] rounded-md p-1 bg-slate-50/40 dark:bg-[#161b26]/40">
                    {filteredOptions.length === 0 ? (
                      <div className="py-2 text-center text-[10px] text-slate-400 dark:text-slate-500 italic">
                        No options found
                      </div>
                    ) : (
                      filteredOptions.map((opt) => {
                        const valStr = String(opt.value);
                        const isChecked = selectedForField.includes(valStr);

                        return (
                          <label
                            key={valStr}
                            onClick={() => handleToggleOption(field, valStr)}
                            className={cn(
                              'flex items-center gap-2 px-1.5 py-1 rounded text-[12px] cursor-pointer transition-colors group select-none',
                              isChecked
                                ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 font-medium'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-[#222938]'
                            )}
                          >
                            <div
                              className={cn(
                                'w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-all',
                                isChecked
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'border-slate-300 dark:border-[#3a475d] bg-white dark:bg-[#1a202c] group-hover:border-blue-400'
                              )}
                            >
                              {isChecked && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                            </div>

                            <span className="truncate flex-1 text-[12px]">
                              {opt.label}
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="px-3 py-1.5 border-t border-slate-200 dark:border-[#21262d] text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between shrink-0 bg-white dark:bg-[#12161f]">
        <span>{activeConfig.fields.length} Filters</span>
        {totalActiveCount > 0 ? (
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {totalActiveCount} Selected
          </span>
        ) : (
          <span className="text-slate-400">All Records</span>
        )}
      </div>
    </div>
  );
};
