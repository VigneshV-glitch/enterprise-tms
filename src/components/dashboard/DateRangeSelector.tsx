import React from 'react';
import { Calendar } from 'lucide-react';

export const DateRangeSelector: React.FC = () => {
  return (
    <div className="flex items-center gap-2 bg-[#171717] border border-[#262626] rounded px-2.5 py-1 text-xs text-slate-300 font-mono">
      <Calendar className="h-3.5 w-3.5 text-slate-400" />
      <span>Last 7 Days (Jul 20 - Jul 26)</span>
    </div>
  );
};
