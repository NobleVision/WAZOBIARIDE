/**
 * WaZoBiaRide - Mock Drivers
 * 
 * Realistic driver data for demo purposes
 */

import { Location } from './locations';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  vehicleType: 'sedan' | 'suv' | 'motorcycle';
  vehicleColor: string;
  vehiclePlate: string;
  tier: 'standard' | 'premium';
  rating: number;
  ridesCompleted: number;
  status: 'online' | 'offline' | 'on-ride';
  currentLocation: Location;
  earnings: number;
  todayEarnings: number;
  commissionRate: number; // 20% for standard, 25% for premium
}

export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'driver-001',
    name: 'Chinedu Okafor',
    phone: '+234 801 234 5678',
    avatar: '👨‍💼',
    vehicleType: 'sedan',
    vehicleColor: 'Black',
    vehiclePlate: 'LSD 123 AB',
    tier: 'standard',
    rating: 4.9,
    ridesCompleted: 1247,
    status: 'online',
    currentLocation: {
      id: 'lko-001',
      name: 'Adetokunbo Ademola Street',
      area: 'Victoria Island',
      lat: 6.4281,
      lng: 3.4219,
      address: 'Near Eko Hotel'
    },
    earnings: 2450000,
    todayEarnings: 12500,
    commissionRate: 20
  },
  {
    id: 'driver-002',
    name: 'Adebayo Adeleke',
    phone: '+234 802 345 6789',
    avatar: '👨‍🦱',
    vehicleType: 'suv',
    vehicleColor: 'Silver',
    vehiclePlate: 'LSD 456 CD',
    tier: 'premium',
    rating: 4.8,
    ridesCompleted: 892,
    status: 'online',
    currentLocation: {
      id: 'lko-003',
      name: 'Awolowo Road',
      area: 'Ikoyi',
      lat: 6.4525,
      lng: 3.4102,
      address: 'Near Lagos Polo Club'
    },
    earnings: 3120000,
    todayEarnings: 18750,
    commissionRate: 25
  },
  {
    id: 'driver-003',
    name: 'Emeka Nnamdi',
    phone: '+234 803 456 7890',
    avatar: '👨‍🦰',
    vehicleType: 'sedan',
    vehicleColor: 'White',
    vehiclePlate: 'LSD 789 EF',
    tier: 'standard',
    rating: 4.7,
    ridesCompleted: 2341,
    status: 'online',
    currentLocation: {
      id: 'lek-001',
      name: 'Admiralty Way',
      area: 'Lekki Phase 1',
      lat: 6.4339,
      lng: 3.4471,
      address: 'Near Mega Plaza'
    },
    earnings: 4567000,
    todayEarnings: 15200,
    commissionRate: 20
  },
  {
    id: 'driver-004',
    name: 'Fatima Ibrahim',
    phone: '+234 804 567 8901',
    avatar: '👩',
    vehicleType: 'sedan',
    vehicleColor: 'Blue',
    vehiclePlate: 'LSD 234 GH',
    tier: 'standard',
    rating: 4.9,
    ridesCompleted: 1876,
    status: 'on-ride',
    currentLocation: {
      id: 'ike-001',
      name: 'Obafemi Awolowo Way',
      area: 'Ikeja',
      lat: 6.6018,
      lng: 3.3515,
      address: 'Near Ikeja City Mall'
    },
    earnings: 2890000,
    todayEarnings: 9800,
    commissionRate: 20
  },
  {
    id: 'driver-005',
    name: 'Oluwaseun Bankole',
    phone: '+234 805 678 9012',
    avatar: '👨‍🦳',
    vehicleType: 'suv',
    vehicleColor: 'Gold',
    vehiclePlate: 'LSD 567 IJ',
    tier: 'premium',
    rating: 5.0,
    ridesCompleted: 654,
    status: 'online',
    currentLocation: {
      id: 'iba-001',
      name: 'Ring Road',
      area: 'Ibadan North',
      lat: 7.4032,
      lng: 3.9087,
      address: 'Near Challenge'
    },
    earnings: 1980000,
    todayEarnings: 22100,
    commissionRate: 25
  },
  {
    id: 'driver-006',
    name: 'Ngozi Eze',
    phone: '+234 806 789 0123',
    avatar: '👩‍🦰',
    vehicleType: 'sedan',
    vehicleColor: 'Red',
    vehiclePlate: 'LSD 890 KL',
    tier: 'standard',
    rating: 4.6,
    ridesCompleted: 3421,
    status: 'offline',
    currentLocation: {
      id: 'sur-001',
      name: 'Lagos-Abeokuta Expressway',
      area: 'Surulere',
      lat: 6.4938,
      lng: 3.3478,
      address: 'Near National Stadium'
    },
    earnings: 5234000,
    todayEarnings: 0,
    commissionRate: 20
  },
  {
    id: 'driver-007',
    name: 'Tunde Bakare',
    phone: '+234 807 890 1234',
    avatar: '👨',
    vehicleType: 'motorcycle',
    vehicleColor: 'Black',
    vehiclePlate: 'LSD 111 MN',
    tier: 'standard',
    rating: 4.8,
    ridesCompleted: 4567,
    status: 'online',
    currentLocation: {
      id: 'yab-001',
      name: 'Muritala Muhammed Airport Road',
      area: 'Yaba',
      lat: 6.5145,
      lng: 3.3723,
      address: 'Near University of Lagos'
    },
    earnings: 1234000,
    todayEarnings: 6700,
    commissionRate: 20
  },
  {
    id: 'driver-008',
    name: 'Grace Afolayan',
    phone: '+234 808 901 2345',
    avatar: '👩‍🦱',
    vehicleType: 'suv',
    vehicleColor: 'Gray',
    vehiclePlate: 'LSD 222 OP',
    tier: 'premium',
    rating: 4.9,
    ridesCompleted: 765,
    status: 'online',
    currentLocation: {
      id: 'lko-002',
      name: 'Akin Adesola Street',
      area: 'Victoria Island',
      lat: 6.4292,
      lng: 3.4156,
      address: 'Opposite Civic Center'
    },
    earnings: 2345000,
    todayEarnings: 19500,
    commissionRate: 25
  }
];

// Get online drivers only
export const getOnlineDrivers = (): Driver[] => {
  return MOCK_DRIVERS.filter(d => d.status === 'online');
};

// Get drivers by tier
export const getDriversByTier = (tier: 'standard' | 'premium'): Driver[] => {
  return MOCK_DRIVERS.filter(d => d.tier === tier && d.status === 'online');
};

// Get driver by ID
export const getDriverById = (id: string): Driver | undefined => {
  return MOCK_DRIVERS.find(d => d.id === id);
};

// Get nearby drivers (within radius in km)
export const getNearbyDrivers = (lat: number, lng: number, radiusKm: number = 5): Driver[] => {
  return MOCK_DRIVERS.filter(driver => {
    if (driver.status !== 'online') return false;
    
    const R = 6371; // Earth's radius in km
    const dLat = (driver.currentLocation.lat - lat) * Math.PI / 180;
    const dLng = (driver.currentLocation.lng - lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat * Math.PI / 180) * Math.cos(driver.currentLocation.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance <= radiusKm;
  });
};