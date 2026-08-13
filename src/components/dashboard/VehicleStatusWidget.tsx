import React from 'react';
import { Truck } from 'lucide-react';

export const VehicleStatusWidget: React.FC = () => {
  return (
    <div className="bg-[#171717] border border-[#262626] rounded p-3 text-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5 text-teal-400" />
          Fleet Readiness
        </span>
        <span className="text-[10px] text-teal-400 font-mono">18 Units Active</span>
      </div>
      <p className="text-slate-400 text-[11px]">All power units cleared for long-haul interstate transit.</p>
    </div>
  );
};
