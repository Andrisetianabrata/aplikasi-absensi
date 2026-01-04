import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from '../services/api/client';
import type { User, Company, ProfileData, ApiResponse, AuthTokenData } from '../types/api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  companies: Company[];
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [token, setToken] = useState<string | null>(null);

  // Load stored auth data on mount
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const storedUser = await SecureStore.getItemAsync(USER_KEY);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // Refresh profile from server
          await refreshProfileInternal(storedToken);
        }
      } catch (error) {
        console.error('Failed to load auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const refreshProfileInternal = async (authToken: string) => {
    try {
      const response = await apiClient.get<ApiResponse<ProfileData>>('/auth/profile', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data.success) {
        setUser(response.data.data.user);
        setCompanies(response.data.data.companies);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(response.data.data.user));
      }
    } catch (error) {
      // Token might be invalid, clear auth
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      setToken(null);
      setUser(null);
      setCompanies([]);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<ApiResponse<AuthTokenData>>('/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        const { user: userData, token: authToken } = response.data.data;

        setUser(userData);
        setToken(authToken);
        await SecureStore.setItemAsync(TOKEN_KEY, authToken);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));

        await refreshProfileInternal(authToken);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<ApiResponse<AuthTokenData>>('/auth/google', {
        id_token: idToken,
      });

      if (response.data.success) {
        const { user: userData, token: authToken } = response.data.data;

        setUser(userData);
        setToken(authToken);
        await SecureStore.setItemAsync(TOKEN_KEY, authToken);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));

        await refreshProfileInternal(authToken);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<ApiResponse<AuthTokenData>>('/auth/register', {
        name,
        email,
        password,
        password_confirmation: password,
      });

      if (response.data.success) {
        const { user: userData, token: authToken } = response.data.data;

        setUser(userData);
        setToken(authToken);
        await SecureStore.setItemAsync(TOKEN_KEY, authToken);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await apiClient.post('/auth/logout');
      }
    } catch (error) {
      // Ignore logout errors
    } finally {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      setToken(null);
      setUser(null);
      setCompanies([]);
    }
  }, [token]);

  const refreshProfile = useCallback(async () => {
    if (token) {
      await refreshProfileInternal(token);
    }
  }, [token]);

  const value: AuthContextType = {
    isAuthenticated: !!token && !!user,
    isLoading,
    user,
    companies,
    token,
    login,
    loginWithGoogle,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
