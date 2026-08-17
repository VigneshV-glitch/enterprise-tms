import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Zap,
  ChevronDown,
  HelpCircle,
  Moon,
  Sun,
  Monitor,
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  CheckCheck,
  User,
  LogOut,
} from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import { useNavigate } from 'react-router-dom';
import { notificationsRepository } from '../../repositories/notificationsRepository';
import { TMSNotification } from '../../types';

export interface TopNavigationProps {
  onQuickAction?: () => void;
  onOpenSearch?: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ onQuickAction, onOpenSearch }) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSiteMenu, setShowSiteMenu] = useState(false);
  const [showUnitMenu, setShowUnitMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [notifications, setNotifications] = useState<TMSNotification[]>([]);
  
  const [selectedSite, setSelectedSite] = useState('Chennai DC');
  const [selectedUnit, setSelectedUnit] = useState('South Region');
  const [logo, setLogo] = useState<string | null>(() => localStorage.getItem('custom_app_logo'));

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationsRepository.getAll();
        setNotifications(data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    fetchNotifications();
  }, [showNotificationsMenu]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleLogoUpdate = () => {
      setLogo(localStorage.getItem('custom_app_logo'));
    };
    window.addEventListener('logo-updated', handleLogoUpdate);
    window.addEventListener('storage', handleLogoUpdate);
    return () => {
      window.removeEventListener('logo-updated', handleLogoUpdate);
      window.removeEventListener('storage', handleLogoUpdate);
    };
  }, []);

  const operatingSites = ['Chennai DC', 'Mumbai Hub', 'Delhi Gateway', 'Bangalore Depot', 'Hyderabad Terminal'];
  const businessUnits = ['South Region', 'North Region', 'West Region', 'East Region', 'Central Region'];

  const closeAllMenus = () => {
    setShowSiteMenu(false);
    setShowUnitMenu(false);
    setShowProfileMenu(false);
    setShowNotificationsMenu(false);
  };

  return (
    <header className="h-11 bg-white dark:bg-[#12161f] border-b border-slate-200 dark:border-[#1e2638] pl-[18px] pr-3 flex items-center justify-between z-40 shrink-0 text-xs select-none relative">
      {/* Backdrop to close menus on outside click */}
      {(showSiteMenu || showUnitMenu || showProfileMenu || showNotificationsMenu) && (
        <div className="fixed inset-0 z-40 bg-transparent" onClick={closeAllMenus} />
      )}

      {/* Left Workspace & Organization / Site / Unit Structure */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Supabase Blue Bolt Logo / Custom Configured Logo */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-5 h-5 flex items-center justify-center overflow-hidden">
            {logo ? (
              <img
                src={logo}
                alt="App Logo"
                className="w-5 h-5 object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Zap className="h-4 w-4 fill-blue-600 dark:fill-blue-400" />
              </div>
            )}
          </div>
        </div>

        <span className="text-slate-300 dark:text-slate-700 font-mono hidden sm:inline">/</span>

        {/* Organization */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium hidden md:inline">Organization :</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100 tracking-tight text-[11px]">
            FleetOne Logistics
          </span>
          <span className="text-[9px] font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.2 rounded border border-blue-200 dark:border-blue-500/20">
            ENTERPRISE
          </span>
          <span className="text-[9px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            LIVE
          </span>
        </div>

        <span className="text-slate-300 dark:text-slate-700 font-mono">/</span>

        {/* Operating Site Dropdown Selector */}
        <div className="relative shrink-0 flex items-center gap-1">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium hidden md:inline">Operating Site :</span>
          <button
            onClick={() => {
              setShowSiteMenu(!showSiteMenu);
              setShowUnitMenu(false);
              setShowProfileMenu(false);
            }}
            className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1c2230] border border-slate-200 dark:border-[#2b3548] hover:border-slate-300 dark:hover:border-[#3d4a63] transition-colors"
          >
            <span className="text-blue-700 dark:text-blue-400 font-semibold text-[11px]">{selectedSite}</span>
            <ChevronDown className="h-3 w-3 text-slate-500 dark:text-slate-400" />
          </button>

          {showSiteMenu && (
            <div className="absolute left-0 top-full mt-1.5 w-52 bg-white dark:bg-[#161b26] border border-slate-200 dark:border-[#2b3548] rounded-md shadow-md py-1 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-[#21262d]">Select Operating Site</div>
              {operatingSites.map((site) => (
                <button
                  key={site}
                  onClick={() => {
                    setSelectedSite(site);
                    setShowSiteMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-[#1e2638] flex items-center justify-between transition-colors ${
                    selectedSite === site ? 'text-blue-700 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-950/20' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{site}</span>
                  {selectedSite === site && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-slate-300 dark:text-slate-700 font-mono">/</span>

        {/* Business Unit Dropdown Selector */}
        <div className="relative shrink-0 flex items-center gap-1">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium hidden md:inline">Business Unit :</span>
          <button
            onClick={() => {
              setShowUnitMenu(!showUnitMenu);
              setShowSiteMenu(false);
              setShowProfileMenu(false);
            }}
            className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1c2230] border border-slate-200 dark:border-[#2b3548] hover:border-slate-300 dark:hover:border-[#3d4a63] transition-colors"
          >
            <span className="text-blue-700 dark:text-blue-400 font-semibold text-[11px]">{selectedUnit}</span>
            <ChevronDown className="h-3 w-3 text-slate-500 dark:text-slate-400" />
          </button>

          {showUnitMenu && (
            <div className="absolute left-0 top-full mt-1.5 w-52 bg-white dark:bg-[#161b26] border border-slate-200 dark:border-[#2b3548] rounded-md shadow-md py-1 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-[#21262d]">Select Business Unit</div>
              {businessUnits.map((unit) => (
                <button
                  key={unit}
                  onClick={() => {
                    setSelectedUnit(unit);
                    setShowUnitMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-[#1e2638] flex items-center justify-between transition-colors ${
                    selectedUnit === unit ? 'text-blue-700 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-950/20' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{unit}</span>
                  {selectedUnit === unit && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Feedback Button */}
        <button className="text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-[#1e2638] transition-colors">
          Feedback
        </button>

        {/* Search Command Palette Trigger */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-slate-100 dark:bg-[#1c2230] border border-slate-200 dark:border-[#2b3548] rounded text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-[#3d4a63] transition-colors"
        >
          <Search className="h-3 w-3 text-slate-500 dark:text-slate-400" />
          <span>Search...</span>
          <kbd className="px-1 text-[9px] bg-slate-200 dark:bg-[#252e40] border border-slate-300 dark:border-[#38455e] rounded text-slate-600 dark:text-slate-400 font-mono">
            Ctrl K
          </kbd>
        </button>

        {/* Help Circle */}
        <button className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1e2638] rounded transition-colors" title="Help & Documentation">
          <HelpCircle className="h-3.5 w-3.5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotificationsMenu(!showNotificationsMenu);
              setShowSiteMenu(false);
              setShowUnitMenu(false);
              setShowProfileMenu(false);
            }}
            className="relative p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1e2638] rounded transition-colors"
            title="Notifications"
          >
            <Bell className="h-3.5 w-3.5" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </button>

          {showNotificationsMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#161b26] border border-slate-200 dark:border-[#2b3548] rounded-md shadow-md py-1.5 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-slate-200 dark:border-[#21262d] flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-slate-100">System Alerts</span>
                {unreadCount > 0 && (
                  <button
                    onClick={async () => {
                      await notificationsRepository.markAllAsRead();
                      const data = await notificationsRepository.getAll();
                      setNotifications(data);
                    }}
                    className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 font-medium"
                  >
                    <CheckCheck className="h-3 w-3" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-[#1e2638]">
                {notifications.length === 0 ? (
                  <div className="px-3 py-4 text-center text-slate-500 dark:text-slate-400">
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={async () => {
                        await notificationsRepository.markAsRead(n.id);
                        const data = await notificationsRepository.getAll();
                        setNotifications(data);
                      }}
                      className={`px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-[#1e2638] transition-colors cursor-pointer ${
                        !n.read ? 'bg-blue-50/40 dark:bg-blue-950/10' : ''
                      }`}
                    >
                      <div className="flex gap-2 items-start">
                        <div className="mt-0.5 shrink-0">
                          {n.severity === 'warning' ? (
                            <AlertTriangle className="h-3 w-3 text-amber-500" />
                          ) : n.severity === 'success' ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          ) : n.severity === 'danger' ? (
                            <XCircle className="h-3 w-3 text-rose-500" />
                          ) : (
                            <Info className="h-3 w-3 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`font-medium text-slate-900 dark:text-slate-200 truncate ${!n.read ? 'font-semibold' : ''}`}>
                              {n.title}
                            </span>
                            <span className="text-[9px] text-slate-400 shrink-0">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-3 pt-1.5 pb-0.5 border-t border-slate-200 dark:border-[#21262d] text-center">
                <button
                  onClick={() => {
                    navigate('/notifications');
                    closeAllMenus();
                  }}
                  className="w-full text-center text-blue-600 dark:text-blue-400 hover:underline text-[11px] font-semibold block"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-1 p-0.5 rounded-full hover:ring-2 hover:ring-blue-500/40 transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-600/30 border border-blue-300 dark:border-blue-500/50 flex items-center justify-center font-bold text-[10px] text-blue-800 dark:text-blue-300">
              V
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#161b26] border border-slate-200 dark:border-[#2b3548] rounded-md shadow-md py-1 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-200 dark:border-[#21262d]">
                <p className="font-semibold text-slate-900 dark:text-slate-100">Vignesh V</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">vigneshv7678@gmail.com</p>
              </div>

              <a
                href="#settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e2638] transition-colors"
              >
                <User className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                <span>Profile Settings</span>
              </a>

              {/* Theme Preference Segment */}
              <div className="px-3 py-2 border-t border-b border-slate-200 dark:border-[#21262d] my-1 space-y-1.5 bg-slate-50 dark:bg-[#0e1117]">
                <span className="text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400 font-mono tracking-wider block">
                  Appearance
                </span>
                <div className="grid grid-cols-3 gap-1 bg-slate-200/70 dark:bg-[#1a202c] p-1 rounded border border-slate-300/70 dark:border-[#2d384e]">
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('dark');
                      setShowProfileMenu(false);
                    }}
                    className={`flex items-center justify-center gap-1 py-1 rounded text-[10px] font-medium transition-all ${
                      theme === 'dark'
                        ? 'bg-white dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-bold border border-slate-300 dark:border-blue-500/30 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                    title="Dark Theme"
                  >
                    <Moon className="h-3 w-3" />
                    <span>Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('light');
                      setShowProfileMenu(false);
                    }}
                    className={`flex items-center justify-center gap-1 py-1 rounded text-[10px] font-medium transition-all ${
                      theme === 'light'
                        ? 'bg-white dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-bold border border-slate-300 dark:border-blue-500/30 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                    title="Light Theme"
                  >
                    <Sun className="h-3 w-3" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('system');
                      setShowProfileMenu(false);
                    }}
                    className={`flex items-center justify-center gap-1 py-1 rounded text-[10px] font-medium transition-all ${
                      theme === 'system'
                        ? 'bg-white dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-bold border border-slate-300 dark:border-blue-500/30 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                    title="System Theme"
                  >
                    <Monitor className="h-3 w-3" />
                    <span>System</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowProfileMenu(false)}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
