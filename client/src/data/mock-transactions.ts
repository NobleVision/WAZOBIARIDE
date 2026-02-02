/**
 * WaZoBiaRide - Mock Transactions
 * 
 * Realistic transaction history for driver wallets
 */

export type TransactionType = 'ride' | 'payout' | 'bonus' | 'penalty';
export type PayoutStatus = 'pending' | 'processing' | 'completed';

export interface Transaction {
  id: string;
  driverId: string;
  type: TransactionType;
  amount: number;
  description: string;
  rideId?: string;
  payoutId?: string;
  status?: PayoutStatus;
  balanceAfter: number;
  createdAt: string;
  processedAt?: string;
}

// Generate mock transactions for drivers
export const MOCK_TRANSACTIONS: Transaction[] = [
  // Driver 001 transactions
  {
    id: 'txn-001',
    driverId: 'driver-001',
    type: 'ride',
    amount: 2000,
    description: 'Ride earnings - VI to Lekki',
    rideId: 'ride-002',
    balanceAfter: 2452000,
    createdAt: '2025-01-31T08:35:00Z',
    processedAt: '2025-01-31T08:35:00Z'
  },
  {
    id: 'txn-002',
    driverId: 'driver-001',
    type: 'ride',
    amount: 700,
    description: 'Ride earnings - Ikoyi to VI',
    rideId: 'ride-012',
    balanceAfter: 2450000,
    createdAt: '2025-01-26T13:59:00Z',
    processedAt: '2025-01-26T13:59:00Z'
  },
  {
    id: 'txn-003',
    driverId: 'driver-001',
    type: 'payout',
    amount: -50000,
    description: 'Weekly payout - W25 2025',
    payoutId: 'payout-001',
    status: 'completed',
    balanceAfter: 2450000,
    createdAt: '2025-01-25T00:00:00Z',
    processedAt: '2025-01-26T10:30:00Z'
  },
  {
    id: 'txn-004',
    driverId: 'driver-001',
    type: 'bonus',
    amount: 5000,
    description: 'Weekend bonus - 50+ rides',
    balanceAfter: 2500000,
    createdAt: '2025-01-20T00:00:00Z',
    processedAt: '2025-01-20T00:00:00Z'
  },
  {
    id: 'txn-005',
    driverId: 'driver-001',
    type: 'ride',
    amount: 3800,
    description: 'Ride earnings - Yaba to VI (Premium)',
    rideId: 'ride-011',
    balanceAfter: 2495000,
    createdAt: '2025-01-27T08:44:00Z',
    processedAt: '2025-01-27T08:44:00Z'
  },
  // Driver 002 transactions
  {
    id: 'txn-006',
    driverId: 'driver-002',
    type: 'ride',
    amount: 4160,
    description: 'Ride earnings - Ikoyi to Ikeja (Premium)',
    rideId: 'ride-003',
    balanceAfter: 3122160,
    createdAt: '2025-01-30T17:32:00Z',
    processedAt: '2025-01-30T17:32:00Z'
  },
  {
    id: 'txn-007',
    driverId: 'driver-002',
    type: 'ride',
    amount: 3840,
    description: 'Ride earnings - Yaba to VI (Premium)',
    rideId: 'ride-011',
    balanceAfter: 3118000,
    createdAt: '2025-01-27T08:44:00Z',
    processedAt: '2025-01-27T08:44:00Z'
  },
  {
    id: 'txn-008',
    driverId: 'driver-002',
    type: 'payout',
    amount: -75000,
    description: 'Weekly payout - W25 2025',
    payoutId: 'payout-002',
    status: 'completed',
    balanceAfter: 3118000,
    createdAt: '2025-01-25T00:00:00Z',
    processedAt: '2025-01-26T11:15:00Z'
  },
  {
    id: 'txn-009',
    driverId: 'driver-002',
    type: 'bonus',
    amount: 3000,
    description: 'New driver bonus - First 10 Premium rides',
    balanceAfter: 3193000,
    createdAt: '2025-01-15T00:00:00Z',
    processedAt: '2025-01-15T00:00:00Z'
  },
  // Driver 003 transactions
  {
    id: 'txn-010',
    driverId: 'driver-003',
    type: 'ride',
    amount: 1200,
    description: 'Ride earnings - Surulere to Yaba',
    rideId: 'ride-004',
    balanceAfter: 4568200,
    createdAt: '2025-01-30T12:47:00Z',
    processedAt: '2025-01-30T12:47:00Z'
  },
  {
    id: 'txn-011',
    driverId: 'driver-003',
    type: 'ride',
    amount: 720,
    description: 'Ride earnings - Lekki to Surulere',
    rideId: 'ride-009',
    balanceAfter: 4567000,
    createdAt: '2025-01-28T07:45:00Z',
    processedAt: '2025-01-28T07:45:00Z'
  },
  {
    id: 'txn-012',
    driverId: 'driver-003',
    type: 'ride',
    amount: 720,
    description: 'Ride earnings - Oshodi to Maryland',
    rideId: 'ride-007',
    balanceAfter: 4566280,
    createdAt: '2025-01-29T10:37:00Z',
    processedAt: '2025-01-29T10:37:00Z'
  },
  {
    id: 'txn-013',
    driverId: 'driver-003',
    type: 'penalty',
    amount: -500,
    description: 'Late arrival penalty',
    balanceAfter: 4565560,
    createdAt: '2025-01-28T14:00:00Z',
    processedAt: '2025-01-28T14:00:00Z'
  },
  // Driver 004 transactions (has active ride)
  {
    id: 'txn-014',
    driverId: 'driver-004',
    type: 'ride',
    amount: 1120,
    description: 'Ride earnings - Oshodi to Maryland',
    rideId: 'ride-007',
    balanceAfter: 2891120,
    createdAt: '2025-01-29T10:37:00Z',
    processedAt: '2025-01-29T10:37:00Z'
  },
  {
    id: 'txn-015',
    driverId: 'driver-004',
    type: 'ride',
    amount: 2000,
    description: 'Ride earnings - Ikeja to Yaba',
    rideId: 'ride-001',
    balanceAfter: 2890000,
    createdAt: '2025-01-31T18:30:00Z',
    processedAt: '2025-01-31T18:30:00Z'
  },
  // Driver 005 transactions
  {
    id: 'txn-016',
    driverId: 'driver-005',
    type: 'ride',
    amount: 2240,
    description: 'Ride earnings - Ring Road to Bodija',
    rideId: 'ride-006',
    balanceAfter: 1982240,
    createdAt: '2025-01-29T14:44:00Z',
    processedAt: '2025-01-29T14:44:00Z'
  },
  {
    id: 'txn-017',
    driverId: 'driver-005',
    type: 'bonus',
    amount: 10000,
    description: 'Ibadan pioneer bonus - Top weekly earner',
    balanceAfter: 1980000,
    createdAt: '2025-01-20T00:00:00Z',
    processedAt: '2025-01-20T00:00:00Z'
  },
  // Driver 007 transactions
  {
    id: 'txn-018',
    driverId: 'driver-007',
    type: 'ride',
    amount: 500,
    description: 'Ride earnings - Lekki short trip',
    rideId: 'ride-005',
    balanceAfter: 1234500,
    createdAt: '2025-01-30T09:06:00Z',
    processedAt: '2025-01-30T09:06:00Z'
  },
  {
    id: 'txn-019',
    driverId: 'driver-007',
    type: 'ride',
    amount: 400,
    description: 'Ride earnings - Allen to Ikeja Mall',
    rideId: 'ride-010',
    balanceAfter: 1234000,
    createdAt: '2025-01-27T17:05:00Z',
    processedAt: '2025-01-27T17:05:00Z'
  },
  // Driver 008 transactions
  {
    id: 'txn-020',
    driverId: 'driver-008',
    type: 'ride',
    amount: 2560,
    description: 'Ride earnings - VI to Ikoyi (Premium)',
    rideId: 'ride-008',
    balanceAfter: 2347560,
    createdAt: '2025-01-28T20:00:00Z',
    processedAt: '2025-01-28T20:00:00Z'
  }
];

// Get transactions by driver ID
export const getTransactionsByDriver = (driverId: string): Transaction[] => {
  return MOCK_TRANSACTIONS
    .filter(t => t.driverId === driverId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Calculate total earnings for a driver
export const getTotalEarnings = (driverId: string): number => {
  return MOCK_TRANSACTIONS
    .filter(t => t.driverId === driverId && t.type === 'ride')
    .reduce((sum, t) => sum + t.amount, 0);
};

// Get current balance for a driver
export const getCurrentBalance = (driverId: string): number => {
  const transactions = getTransactionsByDriver(driverId);
  if (transactions.length === 0) return 0;
  return transactions[0].balanceAfter;
};

// Get weekly earnings (last 7 days)
export const getWeeklyEarnings = (driverId: string): number => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return MOCK_TRANSACTIONS
    .filter(t => 
      t.driverId === driverId && 
      t.type === 'ride' &&
      new Date(t.createdAt) >= sevenDaysAgo
    )
    .reduce((sum, t) => sum + t.amount, 0);
};