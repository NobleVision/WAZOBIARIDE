/**
 * WaZoBiaRide - Authentication Context
 * 
 * Mock authentication system for demo purposes
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, AuthContextType } from './types';
import { DEMO_ACCOUNTS, RIDER_USER_ID, DRIVER_USER_ID, ADMIN_USER_ID } from './demo-accounts';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('wazobiaride_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const account = DEMO_ACCOUNTS.find(
      acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
    );

    if (account) {
      const user: User = {
        id: account.role === 'rider' ? RIDER_USER_ID :
            account.role === 'driver' ? DRIVER_USER_ID : ADMIN_USER_ID,
        email: account.email,
        name: account.name,
        role: account.role,
        avatar: account.role === 'rider' ? '👤' : account.role === 'driver' ? '🚗' : '👨‍💼',
        // Driver-specific
        vehicleType: account.role === 'driver' ? 'sedan' : undefined,
        tier: account.role === 'driver' ? 'standard' : undefined,
        earnings: account.role === 'driver' ? 45000 : undefined,
        // Rider-specific
        rating: account.role === 'rider' ? 4.8 : undefined,
        ridesCompleted: account.role === 'rider' ? 47 : undefined,
        // Phone for all
        phone: account.role === 'driver' ? '+234 801 234 5678' :
               account.role === 'rider' ? '+234 802 345 6789' : '+234 800 000 0000'
      };

      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('wazobiaride_user', JSON.stringify(user));
      toast.success(`Welcome back, ${user.name}!`, {
        duration: 2000,
        style: {
          background: 'var(--color-nigeria-green)',
          color: 'white',
        }
      });
    } else {
      toast.error('Invalid credentials. Try the demo accounts shown on the login page.', {
        duration: 4000,
      });
    }

    setIsLoading(false);
    return account ? true : false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('wazobiaride_user');
    toast.success('Logged out successfully', {
      duration: 2000,
    });
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};