import React from 'react';
import { BarChart3, Download, TrendingUp, DollarSign, Fuel, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../../../shell';
import { Card } from '../../../components/common/Card';
import { MetricCard } from '../../../components/common/MetricCard';
import { Button } from '../../../components/common/Button';

export const ReportsPage: React.FC = () => {
  return (
    <div className="px-4 py-[2px] space-y-6">
      <PageHeader
        title="Analytics & Executive Logistics Reports"
        description="Comprehensive analysis on fleet performance, freight spend, fuel efficiency, and SLA compliance."
        breadcrumbs={[{ label: 'Reports' }]}
        actions={
          <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
            Export Executive PDF
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Freight Spend" value="$184,500" change="-3.2% vs budget" isPositive={true} icon={<DollarSign className="h-4 w-4 text-emerald-400" />} />
        <MetricCard title="Fleet Fuel Economy" value="6.8 MPG" change="+0.4 MPG" isPositive={true} icon={<Fuel className="h-4 w-4 text-sky-400" />} />
        <MetricCard title="On-Time Delivery Rate" value="96.2%" change="+1.2%" isPositive={true} icon={<ShieldCheck className="h-4 w-4 text-teal-400" />} />
        <MetricCard title="Carbon Offsets" value="142.8 Tons" change="Target Met" isPositive={true} icon={<TrendingUp className="h-4 w-4 text-emerald-400" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold text-slate-100 pb-2 border-b border-[#1e2638] mb-4">
            Monthly Freight Volume by Quarter
          </h3>
          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-4 border-b border-slate-800 font-mono text-xs text-slate-400">
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-emerald-500/30 border border-emerald-500/50 rounded-t h-32" />
              <span>Q1</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-emerald-500/40 border border-emerald-500/60 rounded-t h-36" />
              <span>Q2</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-emerald-500/60 border border-emerald-500/80 rounded-t h-40" />
              <span>Q3</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-emerald-500 border border-emerald-400 rounded-t h-44" />
              <span>Q4 (Est)</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-100 pb-2 border-b border-[#1e2638] mb-4">
            Cost Breakdown by Logistics Component
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Driver Compensation & HOS</span>
                <span className="font-mono">$82,400 (44%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[44%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Diesel Fuel Costs</span>
                <span className="font-mono">$54,200 (29%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-sky-400 h-full w-[29%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Fleet Maintenance & Parts</span>
                <span className="font-mono">$28,100 (15%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-[15%]" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
