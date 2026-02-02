/**
 * WaZoBiaRide - Demo Accounts
 * 
 * Demo credentials for investor presentation
 */

import { DemoAccount } from './types';

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'rider@demo.com',
    password: 'demo123',
    name: 'Adebayo Okafor',
    role: 'rider'
  },
  {
    email: 'driver@demo.com',
    password: 'demo123',
    name: 'Emeka Nnamdi',
    role: 'driver'
  },
  {
    email: 'admin@demo.com',
    password: 'demo123',
    name: 'Admin User',
    role: 'admin'
  }
];

export const RIDER_USER_ID = 'rider-001';
export const DRIVER_USER_ID = 'driver-001';
export const ADMIN_USER_ID = 'admin-001';