import React from 'react';
import { Search, X } from 'lucide-react';
import { useUniversalSearch } from './useUniversalSearch';
import { SearchResults } from './SearchResults';
import { useNavigate } from 'react-router-dom';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const { query, setQuery, results, history, selectQuery } = useUniversalSearch();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#121212] border border-[#2a2a2a] rounded-lg p-4 max-w-lg w-full shadow-lg space-y-3">
        <div className="flex items-center gap-2 bg-[#171717] border border-[#2e2e2e] rounded px-3 py-1.5 text-xs">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search trips, vehicles, drivers, or ask AI..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 outline-none"
            autoFocus
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        {results.length > 0 ? (
          <SearchResults
            results={results}
            onSelectResult={(res) => {
              navigate(res.url);
              onClose();
            }}
          />
        ) : history.length > 0 ? (
          <div className="space-y-1 text-xs">
            <span className="text-[10px] text-slate-500 font-mono uppercase">Recent Searches</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => selectQuery(h)}
                  className="px-2 py-1 bg-[#1c1c1c] hover:bg-[#252525] border border-[#2e2e2e] rounded text-slate-300 text-[11px]"
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
