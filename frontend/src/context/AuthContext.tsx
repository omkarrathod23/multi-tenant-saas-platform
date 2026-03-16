import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthResponse } from '../types';
import apiService from '../services/api';
import websocketService from '../services/websocket';

interface AuthContextType {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      
      // Reconnect WebSocket if user is logged in
      const token = localStorage.getItem('token');
      const tenantId = localStorage.getItem('tenantId');
      if (token && tenantId && !websocketService.isConnected()) {
        websocketService.connect(token, Number(tenantId));
      }
    }

    // Cleanup on unmount
    return () => {
      websocketService.disconnect();
    };
  }, []);

  // ✅ LOGIN
  const login = async (email: string, password: string) => {
    const tenantId = localStorage.getItem('tenantId') || '1';
    const response = await apiService.login({ email, password, tenantId });

    if (response.success && response.data) {
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // Connect WebSocket after successful login
      const token = localStorage.getItem('token');
      if (token && response.data.tenantId) {
        websocketService.connect(token, response.data.tenantId);
      }
    } else {
      throw new Error(response.message || 'Login failed');
    }
  };

  // ✅ REGISTER (TENANT FIX HERE)
  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const response = await apiService.register({
      email,
      password,
      firstName,
      lastName,
      tenantId: 1, // ✅ FIX (HARDCODED)
    });

    if (response.success && response.data) {
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  };

  const logout = () => {
    // Disconnect WebSocket before logout
    websocketService.disconnect();
    apiService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
