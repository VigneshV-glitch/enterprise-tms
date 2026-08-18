/**
 * User Preference Types for Enterprise TMS
 */

export interface TablePreference {
  sorting: any[];
  columnVisibility: Record<string, boolean>;
  columnPinning: {
    left: string[];
    right: string[];
  };
  pagination: {
    pageSize: number;
  };
  filterChips: any[];
}

export interface UserPreferences {
  version: number;
  tablePreferences: Record<string, TablePreference>;
  navigationPreferences: {
    sidebarCollapsed: boolean;
  };
  dashboardPreferences: {
    activeTab: "Overview" | "Trips" | "Fleet" | "Drivers" | "Cargo" | "Facilities";
    barPeriod: string;
    linePeriod: string;
  };
  displayPreferences: {
    theme: 'light' | 'dark' | 'system';
  };
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  version: 1,
  tablePreferences: {},
  navigationPreferences: {
    sidebarCollapsed: true,
  },
  dashboardPreferences: {
    activeTab: "Overview",
    barPeriod: "Week",
    linePeriod: "7D",
  },
  displayPreferences: {
    theme: 'dark',
  },
};
