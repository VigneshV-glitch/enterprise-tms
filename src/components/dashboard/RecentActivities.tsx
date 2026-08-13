import React from 'react';
import { Clock } from 'lucide-react';

export const RecentActivities: React.FC = () => {
  const activities = [
    { id: '1', title: 'Trip TRP-8041 dispatched to Chicago', time: '10m ago' },
    { id: '2', title: 'Vehicle V-102 status set to Available', time: '25m ago' },
    { id: '3', title: 'Driver Marcus Vance logged HOS compliance check', time: '1h ago' },
  ];

  return (
    <div className="bg-[#171717] border border-[#262626] rounded p-3 text-xs space-y-2">
      <div className="flex items-center gap-1.5 font-semibold text-slate-200">
        <Clock className="h-3.5 w-3.5 text-emerald-400" />
        <span>Recent Audit Log Activity</span>
      </div>
      <div className="space-y-1.5">
        {activities.map((act) => (
          <div key={act.id} className="flex items-center justify-between py-1 border-b border-[#222] last:border-b-0 text-[11px]">
            <span className="text-slate-300">{act.title}</span>
            <span className="text-slate-500 font-mono">{act.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
