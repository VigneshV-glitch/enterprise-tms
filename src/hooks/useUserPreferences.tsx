import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserPreferences, TablePreference, DEFAULT_USER_PREFERENCES } from '../types/userPreferences.types';
import { userPreferencesRepository } from '../repositories/userPreferences.repository';

interface UserPreferencesContextType {
  preferences: UserPreferences;
  isLoading: boolean;
  updateTablePreference: (tableName: string, prefs: Partial<TablePreference>) => Promise<void>;
  updateNavigationPreference: (prefs: Partial<UserPreferences['navigationPreferences']>) => Promise<void>;
  updateDashboardPreference: (prefs: Partial<UserPreferences['dashboardPreferences']>) => Promise<void>;
  updateDisplayPreference: (prefs: Partial<UserPreferences['displayPreferences']>) => Promise<void>;
  resetAllPreferences: () => Promise<void>;
  refreshPreferences: () => Promise<void>;
}

export const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_USER_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  const refreshPreferences = useCallback(async () => {
    setIsLoading(true);
    try {
      const prefs = await userPreferencesRepository.loadPreferences();
      setPreferences(prefs);
    } catch (err) {
      console.error('Failed to load user preferences:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPreferences();
  }, [refreshPreferences]);

  const updateTablePreference = async (tableName: string, prefs: Partial<TablePreference>) => {
    const currentTablePref = preferences.tablePreferences[tableName] || {
      sorting: [],
      columnVisibility: {},
      columnPinning: { left: [], right: [] },
      pagination: { pageSize: 50 },
      filterChips: [],
    };

    const updatedTablePref: TablePreference = {
      ...currentTablePref,
      ...prefs,
    };

    const newPreferences: UserPreferences = {
      ...preferences,
      tablePreferences: {
        ...preferences.tablePreferences,
        [tableName]: updatedTablePref,
      },
    };

    setPreferences(newPreferences);
    await userPreferencesRepository.savePreferences(newPreferences);
  };

  const updateNavigationPreference = async (prefs: Partial<UserPreferences['navigationPreferences']>) => {
    const newPreferences: UserPreferences = {
      ...preferences,
      navigationPreferences: {
        ...preferences.navigationPreferences,
        ...prefs,
      },
    };

    setPreferences(newPreferences);
    await userPreferencesRepository.savePreferences(newPreferences);
  };

  const updateDashboardPreference = async (prefs: Partial<UserPreferences['dashboardPreferences']>) => {
    const newPreferences: UserPreferences = {
      ...preferences,
      dashboardPreferences: {
        ...preferences.dashboardPreferences,
        ...prefs,
      },
    };

    setPreferences(newPreferences);
    await userPreferencesRepository.savePreferences(newPreferences);
  };

  const updateDisplayPreference = async (prefs: Partial<UserPreferences['displayPreferences']>) => {
    const newPreferences: UserPreferences = {
      ...preferences,
      displayPreferences: {
        ...preferences.displayPreferences,
        ...prefs,
      },
    };

    setPreferences(newPreferences);
    await userPreferencesRepository.savePreferences(newPreferences);
  };

  const resetAllPreferences = async () => {
    setIsLoading(true);
    try {
      const defaultPrefs = await userPreferencesRepository.resetPreferences();
      setPreferences(defaultPrefs);
    } catch (err) {
      console.error('Failed to reset user preferences:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        isLoading,
        updateTablePreference,
        updateNavigationPreference,
        updateDashboardPreference,
        updateDisplayPreference,
        resetAllPreferences,
        refreshPreferences,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
