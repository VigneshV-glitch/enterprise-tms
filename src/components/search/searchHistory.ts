const SEARCH_HISTORY_KEY = 'tms_search_history';

export const searchHistory = {
  get: (): string[] => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },
  add: (query: string): void => {
    if (!query.trim()) return;
    const history = searchHistory.get().filter((q) => q !== query);
    history.unshift(query);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.slice(0, 10)));
  },
  clear: (): void => {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  },
};
