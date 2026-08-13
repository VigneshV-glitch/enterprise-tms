import React from 'react';
import { Plus, RefreshCw, FileSpreadsheet } from 'lucide-react';

interface QuickActionsMenuProps {
  onNewTrip?: () => void;
  onRefresh?: () => void;
}

export const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({ onNewTrip, onRefresh }) => {
  return (
    <div className="flex items-center gap-2">
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="p-1.5 bg-[#171717] border border-[#262626] hover:bg-[#222] rounded text-slate-300 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      )}
      {onNewTrip && (
        <button
          onClick={onNewTrip}
          className="flex items-center gap-1 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs rounded transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Dispatch</span>
        </button>
      )}
    </div>
  );
};
