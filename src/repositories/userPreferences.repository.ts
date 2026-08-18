import { UserPreferences, DEFAULT_USER_PREFERENCES } from '../types/userPreferences.types';
import { supabase } from '../lib/supabaseClient';

class UserPreferencesRepository {
  private memoryCache: Record<string, UserPreferences> = {};

  /**
   * Retrieves the current user's ID.
   * If authenticated in Supabase, returns user.id, otherwise 'default-user'.
   */
  async getUserId(): Promise<string> {
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) return user.id;
      } catch (err) {
        console.warn('Failed to retrieve Supabase user, using default:', err);
      }
    }
    return 'default-user';
  }

  /**
   * Load user preferences.
   * This uses memory cache, falls back to Supabase if available, then local storage.
   */
  async loadPreferences(): Promise<UserPreferences> {
    const userId = await this.getUserId();

    // Check memory cache first
    if (this.memoryCache[userId]) {
      return this.memoryCache[userId];
    }

    let prefs: UserPreferences | null = null;

    // 1. Try to load from Supabase
    if (supabase && userId !== 'default-user') {
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('preference_value')
          .eq('user_id', userId)
          .single();

        if (!error && data?.preference_value) {
          prefs = data.preference_value as UserPreferences;
        }
      } catch (err) {
        // Suppress error since table might not exist or user lacks permissions
        console.debug('Supabase preferences loading failed or table not found. Using local storage.', err);
      }
    }

    // 2. Try to load from localStorage
    if (!prefs) {
      const localKey = `tms:user-preferences:${userId}`;
      const saved = localStorage.getItem(localKey);
      if (saved) {
        try {
          prefs = JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse local preferences:', e);
        }
      }
    }

    // 3. Version checking and schema upgrades
    if (prefs) {
      if (prefs.version !== DEFAULT_USER_PREFERENCES.version) {
        // Upgrade preference version if needed, or safely merge
        prefs = {
          ...DEFAULT_USER_PREFERENCES,
          ...prefs,
          version: DEFAULT_USER_PREFERENCES.version,
        };
      } else {
        // Ensure new preference fields are present
        prefs = {
          ...DEFAULT_USER_PREFERENCES,
          ...prefs,
          tablePreferences: {
            ...DEFAULT_USER_PREFERENCES.tablePreferences,
            ...prefs.tablePreferences,
          },
          navigationPreferences: {
            ...DEFAULT_USER_PREFERENCES.navigationPreferences,
            ...prefs.navigationPreferences,
          },
          dashboardPreferences: {
            ...DEFAULT_USER_PREFERENCES.dashboardPreferences,
            ...prefs.dashboardPreferences,
          },
          displayPreferences: {
            ...DEFAULT_USER_PREFERENCES.displayPreferences,
            ...prefs.displayPreferences,
          },
        };
      }
    } else {
      prefs = { ...DEFAULT_USER_PREFERENCES };
    }

    this.memoryCache[userId] = prefs;
    return prefs;
  }

  /**
   * Save user preferences.
   * Saves to memory cache, local storage, and then asynchronously to Supabase if authenticated.
   */
  async savePreferences(preferences: UserPreferences): Promise<void> {
    const userId = await this.getUserId();
    this.memoryCache[userId] = preferences;

    // 1. Save to local storage (instant and always reliable)
    const localKey = `tms:user-preferences:${userId}`;
    localStorage.setItem(localKey, JSON.stringify(preferences));

    // 2. Save to Supabase (async, does not block the user)
    if (supabase && userId !== 'default-user') {
      // Fire-and-forget background sync
      (async () => {
        try {
          const { error } = await supabase
            .from('user_preferences')
            .upsert({
              user_id: userId,
              preference_value: preferences,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });
          if (error) {
            console.warn('Could not sync user preferences to Supabase:', error.message);
          }
        } catch (err) {
          console.debug('Failed background sync of user preferences:', err);
        }
      })();
    }
  }

  /**
   * Reset user preferences to defaults.
   */
  async resetPreferences(): Promise<UserPreferences> {
    const userId = await this.getUserId();
    const defaultPrefs = { ...DEFAULT_USER_PREFERENCES };
    
    this.memoryCache[userId] = defaultPrefs;

    const localKey = `tms:user-preferences:${userId}`;
    localStorage.setItem(localKey, JSON.stringify(defaultPrefs));

    if (supabase && userId !== 'default-user') {
      (async () => {
        try {
          await supabase
            .from('user_preferences')
            .delete()
            .eq('user_id', userId);
        } catch (err) {
          console.debug('Failed to delete Supabase preferences:', err);
        }
      })();
    }

    return defaultPrefs;
  }
}

export const userPreferencesRepository = new UserPreferencesRepository();
