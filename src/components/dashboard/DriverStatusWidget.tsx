import React from 'react';
import { Users } from 'lucide-react';

export const DriverStatusWidget: React.FC = () => {
  return (
    <div className="bg-[#171717] border border-[#262626] rounded p-3 text-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-sky-400" />
          Driver Roster
        </span>
        <span className="text-[10px] text-emerald-400 font-mono">12 On Duty</span>
      </div>
      <p className="text-slate-400 text-[11px]">All CDL Class A drivers active and compliant with HOS rules.</p>
    </div>
  );
};
