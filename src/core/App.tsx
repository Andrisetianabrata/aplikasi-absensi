import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PermissionGuard } from '../components/guards/PermissionGuard';
import { AuthProvider } from '../contexts/AuthContext';
import { SnackbarProvider } from '../contexts/SnackbarContext';
import { RootNavigator } from './navigation/RootNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Volta App - Main Entry Point
 * 
 * Architecture:
 * 1. QueryClientProvider - React Query for API caching
 * 2. AuthProvider - Authentication state management
 * 3. PermissionGuard - BLOCKS app if Camera or Location permissions denied
 * 4. RootNavigator - Conditional navigation (Auth/Onboarding/App stacks)
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SnackbarProvider>
          <StatusBar style="light" backgroundColor="#0F172A" />
          <PermissionGuard>
            <RootNavigator />
          </PermissionGuard>
        </SnackbarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
