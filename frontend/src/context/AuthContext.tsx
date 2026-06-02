"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('admin_token');
        if (token) {
          // Verify with backend
          const isValid = await api.verifyToken(token);
          if (isValid) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('admin_token');
            setIsAuthenticated(false);
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (password: string): Promise<boolean> => {
    setIsLoading(true);
    const isValid = await api.verifyToken(password);
    if (isValid) {
      localStorage.setItem('admin_token', password);
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    } else {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
