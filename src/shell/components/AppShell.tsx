import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNavigation } from './TopNavigation';

export interface AppShellProps {
  children: React.ReactNode;
  onOpenSearch?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children, onOpenSearch }) => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#121212] text-slate-100 font-sans">
      {/* Top Header spans full width */}
      <TopNavigation
        onOpenSearch={onOpenSearch}
      />

      {/* Main Workspace Container below TopBar */}
      <div className="flex-1 flex flex-row min-h-0 min-w-0 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Page View Area */}
        <main className="flex-1 flex flex-col min-h-0 min-w-0 overflow-y-auto pt-[10px] px-0 pb-0 bg-[#121212]">
          <div className="flex-1 flex flex-col min-h-0 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
