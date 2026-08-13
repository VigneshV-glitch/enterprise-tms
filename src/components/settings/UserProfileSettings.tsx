import React from 'react';
import { User, Shield } from 'lucide-react';

export const UserProfileSettings: React.FC = () => {
  return (
    <div className="bg-[#171717] border border-[#262626] rounded p-4 space-y-4 text-xs">
      <div className="flex items-center gap-2 font-semibold text-slate-200 border-b border-[#242424] pb-2">
        <User className="h-4 w-4 text-sky-400" />
        <span>User Profile & Security</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Full Name</label>
          <input
            type="text"
            defaultValue="Vignesh V"
            className="w-full bg-[#121212] border border-[#282828] rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Email Address</label>
          <input
            type="email"
            defaultValue="vigneshv7678@gmail.com"
            className="w-full bg-[#121212] border border-[#282828] rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  );
};
