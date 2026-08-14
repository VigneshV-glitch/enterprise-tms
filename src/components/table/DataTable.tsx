import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  ColumnPinningState,
} from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Download,
  RotateCw,
  SlidersHorizontal,
  Search,
  Plus,
  Shield,
  ChevronDown,
  MoreHorizontal,
  Key,
  Database,
  FileSpreadsheet,
  ArrowDownUp,
  TableProperties,
  Upload,
  Pin,
} from 'lucide-react';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';

export interface FilterChip {
  id: string;
  columnId: string;
  columnName: string;
  columnType: string;
  condition: string;
  value: any;
  value2?: any;
  logicalOperator?: 'AND' | 'OR';
}

function getColType(colId: string, columnTypes: Record<string, string>): string {
  if (columnTypes[colId]) return columnTypes[colId];
  if (colId.includes('id') || colId.includes('uuid')) return 'uuid';
  if (colId.includes('code') || colId.includes('name') || colId.includes('status') || colId.includes('city') || colId.includes('state') || colId.includes('type')) return 'varchar';
  if (colId.includes('desc') || colId.includes('address')) return 'text';
  if (colId.includes('count') || colId.includes('percent') || colId.includes('capacity') || colId.includes('weight') || colId.includes('volume') || colId.includes('cost')) return 'numeric';
  if (colId.includes('date') || colId.includes('time') || colId.includes('at')) return 'timestamp';
  if (colId.includes('is') || colId.includes('has')) return 'bool';
  return 'varchar';
}

function getDefaultCondition(type: string): string {
  switch (type) {
    case 'numeric': return 'equals';
    case 'timestamp': return 'equals';
    case 'bool': return 'is_true';
    case 'status':
    case 'enum': return 'equals';
    default: return 'contains';
  }
}

function getConditionSymbol(value: string): string {
  switch (value) {
    case 'equals': return '=';
    case 'not_equals': return '≠';
    case 'greater_than': return '>';
    case 'greater_than_or_equal': return '≥';
    case 'less_than': return '<';
    case 'less_than_or_equal': return '≤';
    case 'between': return '↔';
    case 'contains': return '⊃';
    case 'does_not_contain': return '∌';
    case 'starts_with': return '⇥';
    case 'ends_with': return '⇤';
    case 'is_empty': return '∅';
    case 'is_not_empty': return '!∅';
    case 'before': return '<';
    case 'after': return '>';
    case 'today': return '📅';
    case 'yesterday': return '⏪';
    case 'last_7_days': return '7d';
    case 'last_30_days': return '30d';
    case 'this_month': return 'M';
    case 'this_year': return 'Y';
    case 'is_true': return '✓';
    case 'is_false': return '✗';
    case 'in': return '∈';
    case 'not_in': return '∉';
    default: return '=';
  }
}

function getConditionsForType(type: string) {
  switch (type) {
    case 'numeric':
      return [
        { label: 'Equals', value: 'equals' },
        { label: 'Not Equals', value: 'not_equals' },
        { label: 'Greater Than', value: 'greater_than' },
        { label: 'Greater Than or Equal', value: 'greater_than_or_equal' },
        { label: 'Less Than', value: 'less_than' },
        { label: 'Less Than or Equal', value: 'less_than_or_equal' },
        { label: 'Between', value: 'between' },
        { label: 'Is Empty', value: 'is_empty' },
        { label: 'Is Not Empty', value: 'is_not_empty' },
      ];
    case 'timestamp':
      return [
        { label: 'Equals', value: 'equals' },
        { label: 'Before', value: 'before' },
        { label: 'After', value: 'after' },
        { label: 'Between', value: 'between' },
        { label: 'Today', value: 'today' },
        { label: 'Yesterday', value: 'yesterday' },
        { label: 'Last 7 Days', value: 'last_7_days' },
        { label: 'Last 30 Days', value: 'last_30_days' },
        { label: 'This Month', value: 'this_month' },
        { label: 'This Year', value: 'this_year' },
      ];
    case 'bool':
      return [
        { label: 'Is True', value: 'is_true' },
        { label: 'Is False', value: 'is_false' },
      ];
    case 'status':
    case 'enum':
      return [
        { label: 'Equals', value: 'equals' },
        { label: 'Not Equals', value: 'not_equals' },
        { label: 'In', value: 'in' },
        { label: 'Not In', value: 'not_in' },
      ];
    default:
      return [
        { label: 'Equals', value: 'equals' },
        { label: 'Not Equals', value: 'not_equals' },
        { label: 'Contains', value: 'contains' },
        { label: 'Does Not Contain', value: 'does_not_contain' },
        { label: 'Starts With', value: 'starts_with' },
        { label: 'Ends With', value: 'ends_with' },
        { label: 'Is Empty', value: 'is_empty' },
        { label: 'Is Not Empty', value: 'is_not_empty' },
      ];
  }
}

function evaluateCondition(rowVal: any, condition: string, val1: any, val2: any, type: string): boolean {
  if (condition === 'is_empty') {
    return rowVal === null || rowVal === undefined || String(rowVal).trim() === '';
  }
  if (condition === 'is_not_empty') {
    return rowVal !== null && rowVal !== undefined && String(rowVal).trim() !== '';
  }
  if (condition === 'is_true') {
    return Boolean(rowVal) === true;
  }
  if (condition === 'is_false') {
    return Boolean(rowVal) === false;
  }

  if (rowVal === null || rowVal === undefined) return false;

  const strRow = String(rowVal).toLowerCase();
  const strVal1 = String(val1 || '').toLowerCase();

  switch (condition) {
    case 'equals':
      return strRow === strVal1;
    case 'not_equals':
      return strRow !== strVal1;
    case 'contains':
      return strRow.includes(strVal1);
    case 'does_not_contain':
      return !strRow.includes(strVal1);
    case 'starts_with':
      return strRow.startsWith(strVal1);
    case 'ends_with':
      return strRow.endsWith(strVal1);
    case 'greater_than':
      return Number(rowVal) > Number(val1);
    case 'greater_than_or_equal':
      return Number(rowVal) >= Number(val1);
    case 'less_than':
      return Number(rowVal) < Number(val1);
    case 'less_than_or_equal':
      return Number(rowVal) <= Number(val1);
    case 'between':
      const num = Number(rowVal);
      return num >= Number(val1) && num <= Number(val2);
    case 'before':
      return new Date(rowVal).getTime() < new Date(val1).getTime();
    case 'after':
      return new Date(rowVal).getTime() > new Date(val1).getTime();
    case 'in':
      const listIn = String(val1).split(',').map((s) => s.trim().toLowerCase());
      return listIn.includes(strRow);
    case 'not_in':
      const listNotIn = String(val1).split(',').map((s) => s.trim().toLowerCase());
      return !listNotIn.includes(strRow);
    default:
      return true;
  }
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  tableName?: string;
  onRefresh?: () => void;
  onBulkDelete?: (selectedRows: TData[]) => void;
  onExport?: (data: TData[]) => void;
  onInsertRow?: () => void;
  searchPlaceholder?: string;
  columnTypes?: Record<string, string>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  tableName = 'public.locations',
  onRefresh,
  onBulkDelete,
  onExport,
  onInsertRow,
  searchPlaceholder = 'Filter by Conditions...',
  columnTypes = {},
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);

  // Condition Builder Filter State
  const [filterChips, setFilterChips] = useState<FilterChip[]>([]);
  const [activePopover, setActivePopover] = useState<{
    type: 'column' | 'condition';
    chipId?: string | null;
    rect: { top: number; bottom: number; left: number; right: number; width: number };
  } | null>(null);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  const filteredData = React.useMemo(() => {
    if (filterChips.length === 0 && !globalFilter) return data;

    return data.filter((row) => {
      if (globalFilter) {
        const q = globalFilter.toLowerCase();
        const matchesGlobal = Object.values(row as Record<string, any>).some((val) =>
          val !== null && val !== undefined && String(val).toLowerCase().includes(q)
        );
        if (!matchesGlobal) return false;
      }

      if (filterChips.length === 0) return true;

      let overallResult = true;
      for (let i = 0; i < filterChips.length; i++) {
        const chip = filterChips[i];
        const rowVal = (row as Record<string, any>)[chip.columnId];
        const match = evaluateCondition(rowVal, chip.condition, chip.value, chip.value2, chip.columnType);

        if (i === 0) {
          overallResult = match;
        } else {
          const op = chip.logicalOperator || 'AND';
          if (op === 'OR') {
            overallResult = overallResult || match;
          } else {
            overallResult = overallResult && match;
          }
        }
      }
      return overallResult;
    });
  }, [data, filterChips, globalFilter]);

  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: [],
    right: [],
  });
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [selectColumnWidth, setSelectColumnWidth] = useState(40);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollLeft > 0);
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
      columnPinning,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Measures column widths dynamically so left offsets for sticky columns are perfect
  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      const widths: Record<string, number> = {};
      table.getAllLeafColumns().forEach((col) => {
        const el = document.getElementById(`th-${col.id}`);
        if (el) {
          widths[col.id] = el.getBoundingClientRect().width;
        }
      });
      setColumnWidths(widths);

      const selectEl = document.getElementById('th-select');
      if (selectEl) {
        setSelectColumnWidth(selectEl.getBoundingClientRect().width);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [columnPinning, columnVisibility, isLoading, table, data]);

  const getLeftOffset = (columnId: string) => {
    let offset = selectColumnWidth; // dynamic width of the sticky select checkbox column
    const leftPinned = columnPinning.left || [];
    const index = leftPinned.indexOf(columnId);
    if (index <= 0) {
      return offset;
    }
    for (let i = 0; i < index; i++) {
      const prevColId = leftPinned[i];
      offset += columnWidths[prevColId] || 120; // fallback to 120px
    }
    return offset;
  };

  const isLastPinned = (columnId: string) => {
    const leftPinned = columnPinning.left || [];
    return leftPinned[leftPinned.length - 1] === columnId;
  };

  const visibleColumns = table.getAllLeafColumns().filter(
    (col) => col.getIsVisible() && col.id !== 'actions' && col.id !== 'select'
  );

  const handleSelectColumnForNewChip = (col: any) => {
    const headerName = typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id;
    const colType = getColType(col.id, columnTypes);
    const newChip: FilterChip = {
      id: Math.random().toString(36).substring(2, 9),
      columnId: col.id,
      columnName: headerName,
      columnType: colType,
      condition: '',
      value: '',
      logicalOperator: filterChips.length > 0 ? 'AND' : undefined,
    };
    setFilterChips([...filterChips, newChip]);
    setActivePopover({
      type: 'condition',
      chipId: newChip.id,
      rect: activePopover?.rect || { top: 100, bottom: 150, left: 100, right: 200, width: 150 },
    });
  };

  const handleSelectColumnForExistingChip = (chipId: string, col: any) => {
    const headerName = typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id;
    const colType = getColType(col.id, columnTypes);
    setFilterChips(
      filterChips.map((c) =>
        c.id === chipId
          ? { ...c, columnId: col.id, columnName: headerName, columnType: colType, condition: '', value: '' }
          : c
      )
    );
    setActivePopover({
      type: 'condition',
      chipId: chipId,
      rect: activePopover?.rect || { top: 100, bottom: 150, left: 100, right: 200, width: 150 },
    });
  };

  const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);

  const handleExportCSV = () => {
    if (onExport) {
      onExport(data);
      return;
    }
    const headers = table.getAllLeafColumns().map((col) => col.id).join(',');
    const csvRows = data.map((row) =>
      table
        .getAllLeafColumns()
        .map((col) => {
          const val = (row as Record<string, unknown>)[col.id];
          return `"${val !== undefined ? String(val).replace(/"/g, '""') : ''}"`;
        })
        .join(',')
    );
    const blob = new Blob([[headers, ...csvRows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supabase-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-row flex-1 h-full w-full min-h-0">
      {/* Empty spacer/sidebar div: width around 180px */}
      <div 
        className="w-[190px] shrink-0 h-full border-t border-r border-slate-200 dark:border-[#21262d] bg-white dark:bg-[#171717] hidden md:block" 
      />

      {/* Actual Table Component */}
      <div className="flex flex-col flex-1 h-full min-h-0 min-w-0 bg-white dark:bg-[#12161f] border-t border-slate-200 dark:border-[#21262d] rounded-none text-xs select-none">
      {/* Table Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-[10px] py-[8px] min-h-[46px] bg-slate-50 dark:bg-[#161b26] border-b border-slate-200 dark:border-[#21262d]">
        {/* Condition Builder Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 flex-1 max-w-full">
          {filterChips.map((chip, index) => {
            const conditions = getConditionsForType(chip.columnType);
            const condLabel = conditions.find((cond) => cond.value === chip.condition)?.label || chip.condition;

            return (
              <React.Fragment key={chip.id}>
                {index > 0 && (
                  <button
                    onClick={() => {
                      setFilterChips(
                        filterChips.map((c, idx) =>
                          idx === index
                            ? { ...c, logicalOperator: c.logicalOperator === 'OR' ? 'AND' : 'OR' }
                            : c
                        )
                      );
                    }}
                    className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-slate-200 dark:bg-[#21262d] text-slate-700 dark:text-slate-300 rounded hover:bg-slate-300 dark:hover:bg-[#303848] transition-colors shrink-0"
                    title="Toggle Logical Operator (AND / OR)"
                  >
                    {chip.logicalOperator || 'AND'}
                  </button>
                )}

                <div className="flex items-center gap-1 bg-white dark:bg-[#1a202c] border border-slate-300 dark:border-[#303848] rounded-md shadow-xs text-xs px-1.5 py-0.5 shrink-0">
                  {/* Column Part */}
                  <div>
                    <button
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setActivePopover({
                          type: 'column',
                          chipId: chip.id,
                          rect: { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, width: rect.width },
                        });
                      }}
                      className="px-1.5 py-0.5 font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#28303e] rounded transition-colors"
                    >
                      <span>{chip.columnName}</span>
                    </button>
                  </div>

                  {/* Condition Part */}
                  <div>
                    <button
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setActivePopover({
                          type: 'condition',
                          chipId: chip.id,
                          rect: { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, width: rect.width },
                        });
                      }}
                      className={cn(
                        "px-1.5 py-0.5 rounded transition-colors font-mono text-[11px] flex items-center gap-1.5",
                        chip.condition
                          ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#28303e]"
                          : "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 font-semibold"
                      )}
                    >
                      {!chip.condition && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                        </span>
                      )}
                      {chip.condition && <span>{getConditionSymbol(chip.condition)}</span>}
                    </button>
                  </div>

                  {/* Value Part (Inline) */}
                  {chip.condition && (
                    <div className="px-1 py-0.5 flex items-center">
                      {['is_empty', 'is_not_empty', 'today', 'yesterday', 'last_7_days', 'last_30_days', 'this_month', 'this_year', 'is_true', 'is_false'].includes(chip.condition) ? (
                        <span className="text-[11px] text-slate-400 italic">No value needed</span>
                      ) : chip.condition === 'between' ? (
                        <div className="flex items-center gap-1">
                          <input
                            type={chip.columnType === 'numeric' ? 'number' : 'date'}
                            value={chip.value || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFilterChips(filterChips.map((c) => (c.id === chip.id ? { ...c, value: val } : c)));
                            }}
                            placeholder="Min"
                            className="w-9 sm:w-12 px-1 py-0.5 text-xs bg-transparent border border-slate-200 dark:border-[#303848] rounded text-slate-800 dark:text-slate-200 focus:outline-none"
                          />
                          <span className="text-slate-400">-</span>
                          <input
                            type={chip.columnType === 'numeric' ? 'number' : 'date'}
                            value={chip.value2 || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFilterChips(filterChips.map((c) => (c.id === chip.id ? { ...c, value2: val } : c)));
                            }}
                            placeholder="Max"
                            className="w-9 sm:w-12 px-1 py-0.5 text-xs bg-transparent border border-slate-200 dark:border-[#303848] rounded text-slate-800 dark:text-slate-200 focus:outline-none"
                          />
                        </div>
                      ) : (
                        <input
                          type={chip.columnType === 'numeric' ? 'number' : chip.columnType === 'timestamp' ? 'date' : 'text'}
                          value={chip.value || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFilterChips(filterChips.map((c) => (c.id === chip.id ? { ...c, value: val } : c)));
                          }}
                          placeholder="Value..."
                          className="w-12 sm:w-18 px-1 py-0.5 text-xs bg-transparent border-0 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-0 placeholder-slate-400"
                          autoFocus={!chip.value}
                        />
                      )}
                    </div>
                  )}

                  {/* Remove Chip Button */}
                  <button
                    onClick={() => {
                      setFilterChips(filterChips.filter((c) => c.id !== chip.id));
                      setActivePopover(null);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-[#28303e] transition-colors rounded"
                    title="Remove Filter"
                  >
                    <span className="text-xs">×</span>
                  </button>
                </div>
              </React.Fragment>
            );
          })}

          {/* Add Filter / Column Selector Button */}
          <div className="shrink-0">
            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setActivePopover({
                  type: 'column',
                  chipId: null,
                  rect: { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, width: rect.width },
                });
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-transparent hover:bg-slate-200/60 dark:hover:bg-[#21262d] text-slate-700 dark:text-slate-300 rounded-md transition-colors"
            >
              <Search className="h-3 w-3 text-slate-400" />
              <span>{filterChips.length === 0 ? 'Filter by conditions...' : 'Add filter...'}</span>
            </button>
          </div>

          {filterChips.length > 0 && (
            <button
              onClick={() => setFilterChips([])}
              className="text-[11px] text-slate-500 hover:text-rose-500 underline ml-2 shrink-0"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Global Fixed Positioning Popover for Column or Condition Selection */}
        {activePopover && (
          <>
            <div className="fixed inset-0 z-[9998]" onClick={() => setActivePopover(null)} />
            <div
              className="fixed bg-white dark:bg-[#1a202c] border border-slate-200 dark:border-[#2b3548] rounded-md shadow-md z-[9999] p-2 max-h-72 overflow-y-auto no-scrollbar w-36 sm:w-44"
              style={{
                top: `${activePopover.rect.bottom + 4}px`,
                left: `${activePopover.rect.left}px`,
              }}
            >
              {activePopover.type === 'column' ? (
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1 pb-1 border-b border-slate-100 dark:border-[#2b3548] mb-1">
                    {activePopover.chipId ? 'Change Column' : 'Select Column to Filter'}
                  </div>
                  <div className="space-y-0.5">
                    {visibleColumns.map((col) => {
                      const hName = typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id;
                      return (
                        <button
                          key={col.id}
                          onClick={() => {
                            if (activePopover.chipId) {
                              handleSelectColumnForExistingChip(activePopover.chipId, col);
                            } else {
                              handleSelectColumnForNewChip(col);
                            }
                          }}
                          className={cn(
                            'w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center justify-between',
                            activePopover.chipId && filterChips.find((c) => c.id === activePopover.chipId)?.columnId === col.id
                              ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-semibold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#21262d]'
                          )}
                        >
                          <span>{hName}</span>
                          <span className="text-[10px] font-mono text-slate-400">{getColType(col.id, columnTypes)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : activePopover.type === 'condition' && activePopover.chipId ? (
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1 pb-1 border-b border-slate-100 dark:border-[#2b3548] mb-1">
                    Select Condition
                  </div>
                  <div className="space-y-0.5">
                    {getConditionsForType(
                      filterChips.find((c) => c.id === activePopover.chipId)?.columnType || 'varchar'
                    ).map((cond) => {
                      const currentChip = filterChips.find((c) => c.id === activePopover.chipId);
                      return (
                        <button
                          key={cond.value}
                          onClick={() => {
                            setFilterChips(
                              filterChips.map((c) => (c.id === activePopover.chipId ? { ...c, condition: cond.value } : c))
                            );
                            setActivePopover(null);
                          }}
                          className={cn(
                            'w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center justify-between',
                            currentChip?.condition === cond.value
                              ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-semibold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#21262d]'
                          )}
                        >
                          <span>{cond.label}</span>
                          <span className="font-mono text-[11px] text-slate-400">{getConditionSymbol(cond.value)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </>
        )}

        {/* Action Controls on the right */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-[#171717] border border-slate-200 dark:border-[#262626] hover:bg-slate-100 dark:hover:bg-[#222] rounded-md text-slate-700 dark:text-slate-300 transition-colors"
            title="Refresh"
          >
            <RotateCw className={cn('h-3.5 w-3.5 text-slate-500 dark:text-slate-400', isLoading && 'animate-spin')} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-[#171717] border border-slate-200 dark:border-[#262626] hover:bg-slate-100 dark:hover:bg-[#222] rounded-md text-slate-700 dark:text-slate-300 transition-colors"
            title="Export CSV"
          >
            <Download className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Column Selection Popover */}
          <div className="relative">
            <button
              onClick={() => setShowColumnDropdown(!showColumnDropdown)}
              className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1 bg-white dark:bg-[#171717] border border-slate-200 dark:border-[#262626] hover:bg-slate-100 dark:hover:bg-[#222] rounded-md text-slate-700 dark:text-slate-300 transition-colors"
              title="Select Columns"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Columns</span>
            </button>

            {showColumnDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowColumnDropdown(false)} />
                <div className="absolute right-0 mt-1.5 w-[380px] bg-white dark:bg-[#1a202c] border border-slate-200 dark:border-[#2b3548] rounded-md shadow-md z-50 p-3 max-h-80 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-2 gap-3 divide-x divide-slate-100 dark:divide-[#2b3548]">
                  {/* Column 1: Visible / In Table */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1 pb-1 border-b border-slate-100 dark:border-[#2b3548]">
                      Active Columns (In Table)
                    </div>
                    <div className="space-y-0.5 pt-1">
                      {table.getAllLeafColumns()
                        .filter((column) => column.getIsVisible() && column.id !== 'actions' && column.id !== 'select')
                        .map((column) => {
                          const headerName = typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id;
                          const isPinned = column.getIsPinned() === 'left';
                          return (
                            <div
                              key={column.id}
                              className="flex items-center justify-between px-1 py-0.5 hover:bg-slate-100 dark:hover:bg-[#21262d] rounded text-xs text-slate-700 dark:text-slate-300 group"
                            >
                              <label className="flex items-center gap-2 cursor-pointer flex-1 py-1">
                                <input
                                  type="checkbox"
                                  checked={true}
                                  onChange={column.getToggleVisibilityHandler()}
                                  className="rounded border-slate-300 dark:border-[#333] text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                                />
                                <span className="capitalize">{headerName.replace(/([A-Z])/g, ' $1')}</span>
                              </label>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  column.pin(isPinned ? false : 'left');
                                }}
                                className={cn(
                                  "p-1 rounded transition-all ml-1",
                                  isPinned
                                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                                    : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#303030]"
                                )}
                                title={isPinned ? "Unpin column" : "Pin column to left"}
                              >
                                <Pin className={cn("h-3 w-3", isPinned && "fill-current")} />
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Column 2: Hidden / Not In Table */}
                  <div className="space-y-1 pl-2">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1 pb-1 border-b border-slate-100 dark:border-[#2b3548]">
                      Hidden Columns
                    </div>
                    <div className="space-y-0.5 pt-1">
                      {table.getAllLeafColumns()
                        .filter((column) => !column.getIsVisible())
                        .map((column) => {
                          const headerName = typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id;
                          return (
                            <label
                              key={column.id}
                              className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-[#21262d] rounded cursor-pointer text-xs text-slate-700 dark:text-slate-300"
                            >
                              <input
                                type="checkbox"
                                checked={false}
                                onChange={column.getToggleVisibilityHandler()}
                                className="rounded border-slate-300 dark:border-[#333] text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                              />
                              <span className="capitalize">{headerName.replace(/([A-Z])/g, ' $1')}</span>
                            </label>
                          );
                        })}
                      {table.getAllLeafColumns().filter((c) => !c.getIsVisible()).length === 0 && (
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 px-2 py-3 text-center italic">
                          All columns are active
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              </>
            )}
          </div>

          {(onInsertRow || onExport) && (
            <button
              onClick={onInsertRow || onExport}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition-colors shadow-xs"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Import</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table Grid View */}
      <div 
        onScroll={handleScroll}
        className="flex-1 overflow-x-auto overflow-y-auto bg-white dark:bg-[#12161f] min-h-[360px] w-full"
      >
        <table className="min-w-full w-max text-left border-separate border-spacing-0 text-xs">
          <thead className="bg-slate-100 dark:bg-[#1A1A1A] font-sans">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {/* Select Checkbox Column */}
                <th 
                  id="th-select"
                  className={cn(
                    "px-3 py-2.5 text-center bg-slate-100 dark:bg-[#1A1A1A] sticky top-0 left-0 z-30 border-b border-slate-200 dark:border-[#303030]",
                    "before:content-[''] before:absolute before:right-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 dark:before:bg-[#303030] before:pointer-events-none before:z-10",
                    "after:content-[''] after:absolute after:top-0 after:bottom-0 after:left-full after:w-[5px] after:bg-gradient-to-r after:from-black/25 dark:after:from-black/60 after:to-transparent after:pointer-events-none after:z-30 transition-opacity duration-75",
                    isScrolled && (!columnPinning.left || columnPinning.left.length === 0) ? "after:opacity-100" : "after:opacity-0"
                  )}
                  style={{ width: '40px', minWidth: '40px', maxWidth: '40px', top: '0px', left: '0px', position: 'sticky' }}
                >
                  <input
                    type="checkbox"
                    checked={table.getIsAllRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                    className="rounded border-slate-300 dark:border-[#333] bg-white dark:bg-[#222] text-blue-600 dark:text-blue-500 focus:ring-0"
                  />
                </th>
                {headerGroup.headers.map((header) => {
                  const isPinned = header.column.getIsPinned() === 'left';
                  const leftOffset = isPinned ? getLeftOffset(header.column.id) : undefined;
                  const lastPinned = isPinned && isLastPinned(header.column.id);

                  return (
                    <th
                      key={header.id}
                      id={`th-${header.column.id}`}
                      className={cn(
                        "px-3 py-2.5 font-semibold text-[11px] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-[#303030] select-none whitespace-nowrap bg-slate-100 dark:bg-[#1A1A1A] relative",
                        "before:content-[''] before:absolute before:right-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 dark:before:bg-[#303030] before:pointer-events-none before:z-10 last:before:hidden",
                        isPinned ? "sticky z-30" : "sticky z-10",
                        "after:content-[''] after:absolute after:top-0 after:bottom-0 after:left-full after:w-[5px] after:bg-gradient-to-r after:from-black/25 dark:after:from-black/60 after:to-transparent after:pointer-events-none after:z-30 transition-opacity duration-75",
                        lastPinned && isScrolled ? "after:opacity-100" : "after:opacity-0"
                      )}
                      style={{
                        top: '0px',
                        left: isPinned ? `${leftOffset}px` : undefined,
                        position: 'sticky'
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            'flex items-center gap-1.5',
                            header.column.getCanSort() && 'cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors'
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          {header.column.getIsPinned() === 'left' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                header.column.pin(false);
                              }}
                              className="text-blue-600 dark:text-blue-400 p-0.5 hover:bg-slate-200 dark:hover:bg-[#222] rounded transition-colors"
                              title="Unpin column"
                            >
                              <Pin className="h-3 w-3 fill-current" />
                            </button>
                          )}
                          {header.column.getCanSort() && (
                            <ArrowUpDown className="h-3 w-3 text-slate-400 dark:text-slate-500 hover:text-blue-500 ml-auto shrink-0" />
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="font-sans">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="h-[30px] animate-pulse bg-white dark:bg-[#12161f]">
                  <td 
                    className={cn(
                      "px-3 py-1 text-center bg-white dark:bg-[#12161f] sticky left-0 z-10 border-b border-slate-100 dark:border-[#222]",
                      "after:content-[''] after:absolute after:top-0 after:bottom-0 after:left-full after:w-[5px] after:bg-gradient-to-r after:from-black/25 dark:after:from-black/60 after:to-transparent after:pointer-events-none after:z-30 transition-opacity duration-75",
                      isScrolled && (!columnPinning.left || columnPinning.left.length === 0) ? "after:opacity-100" : "after:opacity-0"
                    )}
                    style={{ width: '40px', minWidth: '40px', maxWidth: '40px', left: '0px', position: 'sticky' }}
                  >
                    <div className="w-3.5 h-3.5 bg-slate-200 dark:bg-[#222] rounded mx-auto" />
                  </td>
                  {table.getVisibleFlatColumns().map((column, colIdx) => {
                    const isPinned = column.getIsPinned() === 'left';
                    const leftOffset = isPinned ? getLeftOffset(column.id) : undefined;
                    const lastPinned = isPinned && isLastPinned(column.id);

                    return (
                      <td
                        key={column.id || colIdx}
                        className={cn(
                          "px-3 py-1 bg-white dark:bg-[#12161f] border-b border-slate-100 dark:border-[#222]",
                          isPinned && "sticky z-10",
                          "after:content-[''] after:absolute after:top-0 after:bottom-0 after:left-full after:w-[5px] after:bg-gradient-to-r after:from-black/25 dark:after:from-black/60 after:to-transparent after:pointer-events-none after:z-30 transition-opacity duration-75",
                          lastPinned && isScrolled ? "after:opacity-100" : "after:opacity-0"
                        )}
                        style={isPinned ? { left: `${leftOffset}px` } : undefined}
                      >
                        <div className="h-3 bg-slate-200 dark:bg-[#222] rounded w-3/4"></div>
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    'group h-[30px] hover:bg-slate-50 dark:hover:bg-[#181e2b] transition-colors',
                    row.getIsSelected() && 'bg-blue-50/50 dark:bg-blue-950/20'
                  )}
                >
                  <td 
                    className={cn(
                      "px-3 py-1 text-center bg-white dark:bg-[#12161f] group-hover:bg-slate-50 dark:group-hover:bg-[#181e2b] transition-colors sticky left-0 z-10 border-b border-slate-100 dark:border-[#222]",
                      row.getIsSelected() && "bg-[#f5f8ff] dark:bg-[#151c2e] group-hover:bg-[#ebf2ff] dark:group-hover:bg-[#1a2542]",
                      "after:content-[''] after:absolute after:top-0 after:bottom-0 after:left-full after:w-[5px] after:bg-gradient-to-r after:from-black/25 dark:after:from-black/60 after:to-transparent after:pointer-events-none after:z-30 transition-opacity duration-75",
                      isScrolled && (!columnPinning.left || columnPinning.left.length === 0) ? "after:opacity-100" : "after:opacity-0"
                    )}
                    style={{ width: '40px', minWidth: '40px', maxWidth: '40px', left: '0px', position: 'sticky' }}
                  >
                    <input
                      type="checkbox"
                      checked={row.getIsSelected()}
                      onChange={row.getToggleSelectedHandler()}
                      className="rounded border-slate-300 dark:border-[#333] bg-white dark:bg-[#222] text-blue-600 dark:text-blue-500 focus:ring-0"
                    />
                  </td>
                  {row.getVisibleCells().map((cell) => {
                    const isPinned = cell.column.getIsPinned() === 'left';
                    const leftOffset = isPinned ? getLeftOffset(cell.column.id) : undefined;
                    const lastPinned = isPinned && isLastPinned(cell.column.id);
                    const isActionsCol = cell.column.id === 'actions';

                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          "px-3 py-1 whitespace-nowrap text-slate-800 dark:text-slate-300 bg-white dark:bg-[#12161f] group-hover:bg-slate-50 dark:group-hover:bg-[#181e2b] transition-colors border-b border-slate-100 dark:border-[#222]",
                          row.getIsSelected() && "bg-[#f5f8ff] dark:bg-[#151c2e] group-hover:bg-[#ebf2ff] dark:group-hover:bg-[#1a2542]",
                          isPinned && "sticky z-10",
                          "after:content-[''] after:absolute after:top-0 after:bottom-0 after:left-full after:w-[5px] after:bg-gradient-to-r after:from-black/25 dark:after:from-black/60 after:to-transparent after:pointer-events-none after:z-30 transition-opacity duration-75",
                          lastPinned && isScrolled ? "after:opacity-100" : "after:opacity-0",
                          isActionsCol && "[&_button]:!h-6 [&_button]:!w-6 [&_button]:p-0 [&_button]:flex [&_button]:items-center [&_button]:justify-center [&_button]:rounded-md [&_button]:transition-all [&_button]:text-slate-500 [&_button]:dark:text-slate-400 [&_button]:hover:text-blue-600 [&_button]:dark:hover:text-blue-400 [&_button]:hover:bg-blue-50/70 [&_button]:dark:hover:bg-blue-950/40"
                        )}
                        style={isPinned ? { left: `${leftOffset}px` } : undefined}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-16 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">This table is empty</p>
                    <button
                      onClick={handleExportCSV}
                      className="px-4 py-1.5 bg-slate-100 dark:bg-[#171717] hover:bg-slate-200 dark:hover:bg-[#222] border border-slate-200 dark:border-[#2e2e2e] text-slate-700 dark:text-slate-200 rounded font-medium text-xs transition-colors"
                    >
                      Import data from CSV
                    </button>
                    <p className="text-xs text-slate-400 dark:text-slate-500">or drag and drop a CSV file here</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>

      {/* Table Status Footer Bar */}
      <div className="flex items-center justify-between px-3 h-[40px] bg-slate-50 dark:bg-[#161b26] border-t border-slate-200 dark:border-[#21262d] text-[11px] text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-30 rounded hover:bg-slate-200/50 dark:hover:bg-[#222]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <div className="flex items-center gap-1">
              <span>Page</span>
              <input
                type="number"
                min={1}
                max={table.getPageCount() || 1}
                value={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(Math.max(0, Math.min(page, (table.getPageCount() || 1) - 1)));
                }}
                className="w-12 px-1.5 py-0.5 text-center bg-white dark:bg-[#12161f] border border-slate-300 dark:border-[#2b3548] rounded text-xs focus:outline-none focus:border-blue-500 font-mono"
              />
              <span>of {table.getPageCount() || 1}</span>
            </div>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-30 rounded hover:bg-slate-200/50 dark:hover:bg-[#222]"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <span className="text-slate-300 dark:text-slate-700">|</span>

          <div className="flex items-center gap-1.5">
            <span>Show:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="bg-white dark:bg-[#12161f] border border-slate-300 dark:border-[#2b3548] rounded px-1.5 py-0.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            >
              {[50, 100, 150, 200].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          <span className="text-slate-300 dark:text-slate-700">|</span>

          <span>{data.length} total records</span>
        </div>


      </div>
    </div>
    </div>
  );
}

