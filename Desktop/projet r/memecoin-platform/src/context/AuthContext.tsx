'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  zth: number;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;  // Ajouté cette ligne
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    // Uniquement côté client
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    // Client-side validation
    if (!username || !password) {
      setError('Email et mot de passe requis');
      setIsLoading(false);
      throw new Error('Email et mot de passe requis');
    }

    try {
      console.log('Login attempt with:', { username });
      
      // Appeler votre point de terminaison API de connexion
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('Login response:', { status: response.status, ok: response.ok });
      
      if (!response.ok) {
        const errorMessage = data.message || 'Échec de la connexion';
        console.error('Login failed:', errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      console.log('Login successful, user data received');
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } catch (err: any) {
      console.error('Error during login process:', err);
      setError(err.message || 'Une erreur est survenue');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  };

  const value = {
    user,
    setUser, // Ajouté cette ligne
    login,
    logout,
    isLoading,
    error,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
