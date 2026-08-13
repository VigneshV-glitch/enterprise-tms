import { useState, useEffect } from 'react';
import { SearchResultItem } from './types';
import { performUniversalSearch } from './searchUtils';
import { searchHistory } from './searchHistory';

export function useUniversalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setHistory(searchHistory.get());
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const res = performUniversalSearch(query);
    setResults(res);
  }, [query]);

  const selectQuery = (q: string) => {
    setQuery(q);
    searchHistory.add(q);
    setHistory(searchHistory.get());
  };

  return { query, setQuery, results, history, selectQuery };
}
