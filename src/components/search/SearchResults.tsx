import React from 'react';
import { SearchResultItem } from './types';
import { Route, Truck, User, Building2 } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResultItem[];
  onSelectResult: (result: SearchResultItem) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, onSelectResult }) => {
  if (!results.length) return null;

  const getIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'trip':
        return <Route className="h-3.5 w-3.5 text-emerald-400" />;
      case 'vehicle':
        return <Truck className="h-3.5 w-3.5 text-sky-400" />;
      case 'driver':
        return <User className="h-3.5 w-3.5 text-teal-400" />;
      default:
        return <Building2 className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-1">
      {results.map((res) => (
        <div
          key={res.id}
          onClick={() => onSelectResult(res)}
          className="flex items-center gap-2.5 p-2 bg-[#171717] hover:bg-[#222] border border-[#262626] rounded cursor-pointer transition-colors text-xs"
        >
          {getIcon(res.type)}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-200 truncate">{res.title}</p>
            <p className="text-[10px] text-slate-400 truncate">{res.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
