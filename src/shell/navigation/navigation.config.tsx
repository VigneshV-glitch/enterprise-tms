import React from 'react';
import {
  LayoutDashboard,
  Database,
  Terminal,
  KeyRound,
  Building2,
  HardDrive,
  Anchor,
  BarChart3,
  Bell,
  Settings,
} from 'lucide-react';
import { NavGroup } from './navigation.types';

export const NAV_GROUPS: NavGroup[] = [
  {
    groupName: 'Core Modules',
    items: [
      { id: 'dashboard', label: 'Dashboard', path: '/', icon: <LayoutDashboard className="h-4 w-4" /> },
      { id: 'trips', label: 'Trips', path: '/trips', icon: <Database className="h-4 w-4" />, badge: '5' },
      { id: 'vehicles', label: 'Vehicles', path: '/vehicles', icon: <Terminal className="h-4 w-4" /> },
      { id: 'drivers', label: 'Drivers', path: '/drivers', icon: <KeyRound className="h-4 w-4" /> },
    ],
  },
  {
    groupName: 'Storage & Hubs',
    items: [
      { id: 'locations', label: 'Locations', path: '/locations', icon: <Building2 className="h-4 w-4" /> },
      { id: 'cargo', label: 'Cargo', path: '/cargo', icon: <HardDrive className="h-4 w-4" /> },
      { id: 'dock', label: 'Dock', path: '/dock', icon: <Anchor className="h-4 w-4" /> },
    ],
  },
  {
    groupName: 'Observability & Config',
    items: [
      { id: 'reports', label: 'Reports', path: '/reports', icon: <BarChart3 className="h-4 w-4" /> },
      { id: 'notifications', label: 'Notifications', path: '/notifications', icon: <Bell className="h-4 w-4" />, badge: '3' },
      { id: 'settings', label: 'Settings', path: '/settings', icon: <Settings className="h-4 w-4" /> },
    ],
  },
];
