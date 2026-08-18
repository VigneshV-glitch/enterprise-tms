import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './routes';
import { ThemeProvider } from './shell';
import { UserPreferencesProvider } from './hooks/useUserPreferences';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserPreferencesProvider>
        <ThemeProvider defaultTheme="dark">
          <AppRouter />
        </ThemeProvider>
      </UserPreferencesProvider>
    </QueryClientProvider>
  );
}
