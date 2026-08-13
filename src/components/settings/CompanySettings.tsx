import React from 'react';
import { Building2, Save } from 'lucide-react';

export const CompanySettings: React.FC = () => {
  return (
    <div className="bg-[#171717] border border-[#262626] rounded p-4 space-y-4 text-xs">
      <div className="flex items-center gap-2 font-semibold text-slate-200 border-b border-[#242424] pb-2">
        <Building2 className="h-4 w-4 text-emerald-400" />
        <span>Enterprise Logistics Organization</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Company Name</label>
          <input
            type="text"
            defaultValue="Glitch Logistics Corp"
            className="w-full bg-[#121212] border border-[#282828] rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">DOT / MC Registration</label>
          <input
            type="text"
            defaultValue="USDOT-3920194 / MC-884012"
            className="w-full bg-[#121212] border border-[#282828] rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-black font-semibold rounded hover:bg-emerald-600 transition-colors">
          <Save className="h-3.5 w-3.5" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};
