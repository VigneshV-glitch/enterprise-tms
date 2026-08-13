import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Filter records...',
  className = '',
}) => {
  return (
    <div className={`relative flex items-center min-w-[220px] ${className}`}>
      <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-8 bg-slate-900/90 border border-slate-700/80 rounded-md pl-8 pr-7 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 text-slate-400 hover:text-slate-200 p-0.5 rounded-sm"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};
