/**
 * WaZoBiaRide - Mock Riders
 * 
 * Realistic rider data for demo purposes
 */

import { Location } from './locations';

export interface Rider {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  rating: number;
  ridesCompleted: number;
  joinedDate: string;
  paymentMethods: ('cash' | 'card' | 'mobile-money')[];
  defaultPaymentMethod: 'cash' | 'card' | 'mobile-money';
}

export const MOCK_RIDERS: Rider[] = [
  {
    id: 'rider-001',
    name: 'Adebayo Okafor',
    email: 'rider@demo.com',
    phone: '+234 802 345 6789',
    avatar: '👤',
    rating: 4.8,
    ridesCompleted: 47,
    joinedDate: '2024-08-15',
    paymentMethods: ['cash', 'card', 'mobile-money'],
    defaultPaymentMethod: 'card'
  },
  {
    id: 'rider-002',
    name: 'Chisom Eze',
    email: 'chisom.eze@example.com',
    phone: '+234 803 456 7890',
    avatar: '👩',
    rating: 4.9,
    ridesCompleted: 156,
    joinedDate: '2024-01-20',
    paymentMethods: ['card', 'mobile-money'],
    defaultPaymentMethod: 'mobile-money'
  },
  {
    id: 'rider-003',
    name: 'Oluwasegun Adeyemi',
    email: 'segun.ade@example.com',
    phone: '+234 804 567 8901',
    avatar: '👨',
    rating: 4.7,
    ridesCompleted: 89,
    joinedDate: '2024-03-10',
    paymentMethods: ['cash', 'card'],
    defaultPaymentMethod: 'cash'
  },
  {
    id: 'rider-004',
    name: 'Ngozi Nwosu',
    email: 'ngozi.nw@example.com',
    phone: '+234 805 678 9012',
    avatar: '👩‍🦰',
    rating: 5.0,
    ridesCompleted: 234,
    joinedDate: '2023-11-05',
    paymentMethods: ['card', 'mobile-money'],
    defaultPaymentMethod: 'card'
  },
  {
    id: 'rider-005',
    name: 'Emmanuel Okoro',
    email: 'emma.okoro@example.com',
    phone: '+234 806 789 0123',
    avatar: '👨‍🦱',
    rating: 4.6,
    ridesCompleted: 67,
    joinedDate: '2024-06-22',
    paymentMethods: ['cash'],
    defaultPaymentMethod: 'cash'
  },
  {
    id: 'rider-006',
    name: 'Fatima Abdullahi',
    email: 'fatima.abd@example.com',
    phone: '+234 807 890 1234',
    avatar: '👩‍🦱',
    rating: 4.8,
    ridesCompleted: 145,
    joinedDate: '2024-02-14',
    paymentMethods: ['cash', 'card', 'mobile-money'],
    defaultPaymentMethod: 'mobile-money'
  },
  {
    id: 'rider-007',
    name: 'Chinedu Obi',
    email: 'chinedu.obi@example.com',
    phone: '+234 808 901 2345',
    avatar: '👨',
    rating: 4.5,
    ridesCompleted: 38,
    joinedDate: '2024-09-01',
    paymentMethods: ['card'],
    defaultPaymentMethod: 'card'
  },
  {
    id: 'rider-008',
    name: 'Adaeze Okafor',
    email: 'adaeze.o@example.com',
    phone: '+234 809 012 3456',
    avatar: '👩',
    rating: 4.9,
    ridesCompleted: 198,
    joinedDate: '2023-12-18',
    paymentMethods: ['cash', 'card'],
    defaultPaymentMethod: 'card'
  },
  {
    id: 'rider-009',
    name: 'Tunde Bakare',
    email: 'tunde.bak@example.com',
    phone: '+234 810 123 4567',
    avatar: '👨‍🦳',
    rating: 4.7,
    ridesCompleted: 76,
    joinedDate: '2024-05-30',
    paymentMethods: ['cash', 'mobile-money'],
    defaultPaymentMethod: 'mobile-money'
  },
  {
    id: 'rider-010',
    name: 'Grace Eze',
    email: 'grace.eze@example.com',
    phone: '+234 811 234 5678',
    avatar: '👩‍🦱',
    rating: 4.8,
    ridesCompleted: 112,
    joinedDate: '2024-04-08',
    paymentMethods: ['cash', 'card', 'mobile-money'],
    defaultPaymentMethod: 'card'
  }
];

// Get rider by ID
export const getRiderById = (id: string): Rider | undefined => {
  return MOCK_RIDERS.find(r => r.id === id);
};