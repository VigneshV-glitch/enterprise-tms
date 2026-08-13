import React from 'react';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

export interface NavGroup {
  groupName: string;
  items: NavItem[];
}
