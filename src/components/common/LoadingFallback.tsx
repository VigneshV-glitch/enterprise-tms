import React from 'react';

export const LoadingFallback: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col min-h-0 w-full p-4 space-y-4 bg-transparent animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between h-[34px] border-b border-slate-200/60 dark:border-[#21262d] pb-2">
        <div className="flex items-center gap-3">
          <div className="w-32 h-5 bg-slate-200 dark:bg-[#21262d] rounded" />
          <div className="w-48 h-4 bg-slate-200 dark:bg-[#21262d] rounded hidden sm:block" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-7 bg-slate-200 dark:bg-[#21262d] rounded" />
          <div className="w-24 h-7 bg-slate-200 dark:bg-[#21262d] rounded" />
        </div>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="bg-white dark:bg-[#161b26] border border-slate-200/80 dark:border-[#21262d] rounded-md p-4 space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="w-24 h-3.5 bg-slate-200 dark:bg-[#21262d] rounded" />
              <div className="w-6 h-6 bg-slate-200 dark:bg-[#21262d] rounded-full" />
            </div>
            <div className="w-16 h-6 bg-slate-200 dark:bg-[#21262d] rounded" />
            <div className="w-32 h-3 bg-slate-200 dark:bg-[#21262d] rounded" />
          </div>
        ))}
      </div>

      {/* Table / Content Area Skeleton */}
      <div className="bg-white dark:bg-[#161b26] border border-slate-200/80 dark:border-[#21262d] rounded-md flex-1 p-4 space-y-4 min-h-[300px]">
        <div className="flex items-center justify-between">
          <div className="w-48 h-8 bg-slate-200 dark:bg-[#21262d] rounded" />
          <div className="flex gap-2">
            <div className="w-28 h-8 bg-slate-200 dark:bg-[#21262d] rounded" />
            <div className="w-28 h-8 bg-slate-200 dark:bg-[#21262d] rounded" />
          </div>
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-[#21262d]"
            >
              <div className="w-1/4 h-4 bg-slate-200 dark:bg-[#21262d] rounded" />
              <div className="w-1/5 h-4 bg-slate-200 dark:bg-[#21262d] rounded" />
              <div className="w-1/6 h-4 bg-slate-200 dark:bg-[#21262d] rounded" />
              <div className="w-1/6 h-4 bg-slate-200 dark:bg-[#21262d] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
