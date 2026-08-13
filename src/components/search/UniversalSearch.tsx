import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { SearchOverlay } from './SearchOverlay';

export const UniversalSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-[#171717] border border-[#282828] hover:border-[#383838] rounded px-3 py-1 text-xs text-slate-400 font-mono transition-colors"
      >
        <Search className="h-3.5 w-3.5 text-slate-500" />
        <span>Filter or ask AI... (⌘K)</span>
      </button>
      <SearchOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
