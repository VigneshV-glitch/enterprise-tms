/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { PageHeader } from '../../../shell';
import { KPICards } from '../../../components/dashboard/KPICards';
import { OperationalPerformance } from '../../../components/dashboard/OperationalPerformance';
import { ExceptionCenter } from '../../../components/dashboard/ExceptionCenter';
import { ChartsSection } from '../../../components/dashboard/ChartsSection';
import { useTMSData } from '../../../utils/useTMSData';

export const DashboardPage: React.FC = () => {
  const { isLoading } = useTMSData();

  if (isLoading) {
    return (
      <div className="px-4 py-2 space-y-6">
        <PageHeader
          title="Fleet & Logistics Control Center"
          description="Real-time operational metrics, dispatch activity, and fleet health monitors."
        />

        <div className="space-y-6 pb-8 animate-pulse">
          {/* 1. Operational KPIs Skeleton (Matches KPICards) */}
          <div className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-[#2d2d2d] p-4 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-50 dark:border-gray-800/40 pb-3">
              <div className="h-6 w-40 bg-slate-200 dark:bg-[#252e40] rounded" />
              <div className="h-8 w-80 bg-slate-100 dark:bg-[#1c2230] rounded-full hidden sm:block" />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 border-t border-l border-gray-50 dark:border-[#2b3548]/30 rounded-xl overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-5 flex flex-col justify-between gap-4 border-r border-b border-gray-50 dark:border-[#2b3548]/30 bg-white dark:bg-[#121212]">
                  <div className="flex items-start justify-between">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1c2230]" />
                    <div className="w-12 h-5 rounded-full bg-slate-100 dark:bg-[#1c2230]" />
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="w-14 h-7 bg-slate-200 dark:bg-[#252e40] rounded" />
                    <div className="w-20 h-4 bg-slate-100 dark:bg-[#1c2230] rounded" />
                    <div className="w-16 h-3 bg-slate-50 dark:bg-[#141822] rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Operational Performance & Exception Center Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Operational Health Skeleton (col-span-3, Matches OperationalPerformance) */}
            <div className="lg:col-span-3 bg-white dark:bg-[#121212] rounded-[24px] border border-gray-100 dark:border-[#2d2d2d] p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2">
                <div className="space-y-1">
                  <div className="h-6 w-44 bg-slate-200 dark:bg-[#252e40] rounded" />
                  <div className="h-4 w-60 bg-slate-100 dark:bg-[#1c2230] rounded" />
                </div>
                <div className="w-8 h-8 bg-slate-100 dark:bg-[#1c2230] rounded-lg" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-[8px] border border-gray-50 dark:border-[#1c2230] p-5 flex flex-col bg-white dark:bg-[#121212] min-h-[220px]">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1c2230] mb-6" />
                    <div className="space-y-2 mb-4">
                      <div className="w-16 h-8 bg-slate-200 dark:bg-[#252e40] rounded" />
                      <div className="w-14 h-4 bg-slate-100 dark:bg-[#1c2230] rounded" />
                      <div className="w-20 h-3 bg-slate-50 dark:bg-[#141822] rounded" />
                    </div>
                    <div className="mt-auto h-12 w-full bg-slate-50/50 dark:bg-[#141822]/40 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Exception Center Skeleton (col-span-1, Matches ExceptionCenter) */}
            <div className="lg:col-span-1 bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-[#2d2d2d] p-4 flex flex-col h-full gap-4">
              <div className="flex items-center justify-between">
                <div className="h-6 w-32 bg-slate-200 dark:bg-[#252e40] rounded" />
                <div className="h-4 w-16 bg-slate-100 dark:bg-[#1c2230] rounded" />
              </div>
              <div className="flex-1 flex flex-col border-t border-l border-gray-50 dark:border-[#2b3548]/30 rounded-xl overflow-hidden mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 bg-white dark:bg-[#121212] border-b border-r border-gray-50 dark:border-[#2b3548]/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#1c2230]" />
                      <div className="w-24 h-4 bg-slate-100 dark:bg-[#1c2230] rounded" />
                    </div>
                    <div className="w-6 h-6 bg-slate-200 dark:bg-[#252e40] rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Charts Section Skeleton (Matches ChartsSection) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1 (Trips by Day) */}
            <div className="bg-white dark:bg-[#121212] p-6 rounded-[24px] border border-gray-100 dark:border-[#2d2d2d] flex flex-col min-h-[480px]">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <div className="h-6 w-36 bg-slate-200 dark:bg-[#252e40] rounded" />
                  <div className="h-4 w-44 bg-slate-100 dark:bg-[#1c2230] rounded" />
                </div>
                <div className="h-8 w-24 bg-slate-100 dark:bg-[#1c2230] rounded-full" />
              </div>
              <div className="flex gap-4 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-[3px] bg-slate-100 dark:bg-[#1c2230]" />
                    <div className="w-14 h-4 bg-slate-50 dark:bg-[#141822] rounded" />
                  </div>
                ))}
              </div>
              <div className="flex-1 min-h-[240px] bg-slate-50/30 dark:bg-[#141822]/20 rounded-xl flex items-end justify-around p-4">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="w-8 flex items-end gap-1 h-3/4">
                    <div className="w-2 h-2/3 bg-slate-200/80 dark:bg-[#252e40]/80 rounded-t" />
                    <div className="w-2 h-1/2 bg-slate-100 dark:bg-[#1c2230] rounded-t" />
                    <div className="w-2 h-1/3 bg-slate-50 dark:bg-[#141822] rounded-t" />
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800/40">
                <div className="h-4 w-full bg-slate-100 dark:bg-[#1c2230] rounded" />
              </div>
            </div>

            {/* Chart 2 (OTP Performance) */}
            <div className="bg-white dark:bg-[#121212] p-6 rounded-[24px] border border-gray-100 dark:border-[#2d2d2d] flex flex-col min-h-[480px]">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <div className="h-6 w-56 bg-slate-200 dark:bg-[#252e40] rounded" />
                  <div className="h-4 w-48 bg-slate-100 dark:bg-[#1c2230] rounded" />
                </div>
                <div className="h-8 w-24 bg-slate-100 dark:bg-[#1c2230] rounded-full" />
              </div>
              <div className="flex-1 min-h-[240px] bg-slate-50/30 dark:bg-[#141822]/20 rounded-xl flex items-end justify-around p-4 mb-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="w-4 bg-slate-200/50 dark:bg-[#252e40]/50 rounded-t" style={{ height: `${40 + i * 4}%` }} />
                ))}
              </div>
              <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800/40">
                <div className="h-4 w-full bg-slate-100 dark:bg-[#1c2230] rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 space-y-6">
      <PageHeader
        title="Fleet & Logistics Control Center"
        description="Real-time operational metrics, dispatch activity, and fleet health monitors."
      />

      <div className="space-y-6 pb-8">
        {/* KPI Cards */}
        <KPICards />

        {/* Operational Performance & Exception Center */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <OperationalPerformance />
          </div>
          <div className="lg:col-span-1">
            <ExceptionCenter />
          </div>
        </div>

        {/* Interactive Charts Section */}
        <ChartsSection />
      </div>
    </div>
  );
};
