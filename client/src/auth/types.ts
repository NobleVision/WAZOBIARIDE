/**
 * WaZoBiaRide - Authentication Types
 * 
 * Type definitions for authentication system
 */

export type UserRole = 'rider' | 'driver' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  // Driver-specific fields
  vehicleType?: 'sedan' | 'suv' | 'motorcycle';
  tier?: 'standard' | 'premium';
  earnings?: number;
  // Rider-specific fields
  rating?: number;
  ridesCompleted?: number;
}

export interface DemoAccount {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}