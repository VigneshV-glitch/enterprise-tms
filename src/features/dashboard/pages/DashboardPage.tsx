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

export const DashboardPage: React.FC = () => {
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
