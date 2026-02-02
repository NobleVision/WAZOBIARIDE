/**
 * WaZoBiaRide - Mock Rides
 * 
 * Realistic ride history and active rides for demo purposes
 */

import { Location } from './locations';

export type RideStatus = 'requesting' | 'driver-assigned' | 'driver-arriving' | 'arrived' | 'in-progress' | 'completed' | 'cancelled';
export type ServiceType = 'car' | 'okada' | 'share';
export type PaymentMethod = 'cash' | 'card' | 'mobile-money';

export interface Ride {
  id: string;
  riderId: string;
  driverId?: string;
  driverName?: string;
  driverAvatar?: string;
  vehicleType?: string;
  vehicleColor?: string;
  vehiclePlate?: string;
  pickup: Location;
  dropoff: Location;
  status: RideStatus;
  serviceType: ServiceType;
  tier: 'standard' | 'premium';
  fare: number;
  distance: number; // in km
  duration: number; // in minutes
  paymentMethod: PaymentMethod;
  pin?: string; // 4-digit PIN for verification
  driverEarnings?: number;
  commission?: number;
  rating?: number;
  review?: string;
  createdAt: string;
  completedAt?: string;
  cancelledReason?: string;
}

// Generate a random 4-digit PIN
const generatePIN = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Helper to calculate fare based on distance, service type, and tier
const calculateFare = (distance: number, serviceType: ServiceType, tier: 'standard' | 'premium'): number => {
  const baseRates = {
    car: 500,
    okada: 300,
    share: 400
  };
  
  const perKmRates = {
    car: 200,
    okada: 100,
    share: 150
  };
  
  const tierMultipliers = {
    standard: 1,
    premium: 1.5
  };
  
  const baseFare = baseRates[serviceType];
  const distanceFare = distance * perKmRates[serviceType];
  const totalFare = (baseFare + distanceFare) * tierMultipliers[tier];
  
  return Math.round(totalFare / 100) * 100; // Round to nearest 100
};

export const MOCK_RIDES: Ride[] = [
  // Active rides
  {
    id: 'ride-001',
    riderId: 'rider-002',
    driverId: 'driver-004',
    driverName: 'Fatima Ibrahim',
    driverAvatar: '👩',
    vehicleType: 'sedan',
    vehicleColor: 'Blue',
    vehiclePlate: 'LSD 234 GH',
    pickup: {
      id: 'ike-001',
      name: 'Obafemi Awolowo Way',
      area: 'Ikeja',
      lat: 6.6018,
      lng: 3.3515,
      address: 'Near Ikeja City Mall'
    },
    dropoff: {
      id: 'yab-001',
      name: 'Muritala Muhammed Airport Road',
      area: 'Yaba',
      lat: 6.5145,
      lng: 3.3723,
      address: 'Near University of Lagos'
    },
    status: 'in-progress',
    serviceType: 'car',
    tier: 'standard',
    fare: 2500,
    distance: 12.5,
    duration: 35,
    paymentMethod: 'card',
    pin: '3847',
    driverEarnings: 2000,
    commission: 500,
    createdAt: '2025-01-31T18:30:00Z'
  },
  // Completed rides
  {
    id: 'ride-002',
    riderId: 'rider-001',
    driverId: 'driver-001',
    driverName: 'Chinedu Okafor',
    driverAvatar: '👨‍💼',
    vehicleType: 'sedan',
    vehicleColor: 'Black',
    vehiclePlate: 'LSD 123 AB',
    pickup: {
      id: 'lko-001',
      name: 'Adetokunbo Ademola Street',
      area: 'Victoria Island',
      lat: 6.4281,
      lng: 3.4219,
      address: 'Near Eko Hotel'
    },
    dropoff: {
      id: 'lek-001',
      name: 'Admiralty Way',
      area: 'Lekki Phase 1',
      lat: 6.4339,
      lng: 3.4471,
      address: 'Near Mega Plaza'
    },
    status: 'completed',
    serviceType: 'car',
    tier: 'standard',
    fare: 1800,
    distance: 6.8,
    duration: 18,
    paymentMethod: 'card',
    rating: 5,
    review: 'Excellent driver! Very professional and the car was clean.',
    createdAt: '2025-01-31T08:15:00Z',
    completedAt: '2025-01-31T08:35:00Z'
  },
  {
    id: 'ride-003',
    riderId: 'rider-004',
    driverId: 'driver-002',
    driverName: 'Adebayo Adeleke',
    driverAvatar: '👨‍🦱',
    vehicleType: 'suv',
    vehicleColor: 'Silver',
    vehiclePlate: 'LSD 456 CD',
    pickup: {
      id: 'lko-003',
      name: 'Awolowo Road',
      area: 'Ikoyi',
      lat: 6.4525,
      lng: 3.4102,
      address: 'Near Lagos Polo Club'
    },
    dropoff: {
      id: 'ike-002',
      name: 'Allen Avenue',
      area: 'Ikeja',
      lat: 6.6045,
      lng: 3.3445,
      address: 'Near Ozone Cinemas'
    },
    status: 'completed',
    serviceType: 'car',
    tier: 'premium',
    fare: 5200,
    distance: 18.5,
    duration: 45,
    paymentMethod: 'mobile-money',
    rating: 5,
    review: 'Premium experience! The SUV was very comfortable.',
    createdAt: '2025-01-30T16:45:00Z',
    completedAt: '2025-01-30T17:32:00Z'
  },
  {
    id: 'ride-004',
    riderId: 'rider-006',
    driverId: 'driver-003',
    driverName: 'Emeka Nnamdi',
    driverAvatar: '👨‍🦰',
    vehicleType: 'sedan',
    vehicleColor: 'White',
    vehiclePlate: 'LSD 789 EF',
    pickup: {
      id: 'sur-001',
      name: 'Lagos-Abeokuta Expressway',
      area: 'Surulere',
      lat: 6.4938,
      lng: 3.3478,
      address: 'Near National Stadium'
    },
    dropoff: {
      id: 'yab-002',
      name: 'Herbert Macaulay Way',
      area: 'Yaba',
      lat: 6.5189,
      lng: 3.3756,
      address: 'Near Yaba College of Technology'
    },
    status: 'completed',
    serviceType: 'car',
    tier: 'standard',
    fare: 1400,
    distance: 4.2,
    duration: 15,
    paymentMethod: 'cash',
    rating: 4,
    review: 'Good ride, driver was friendly.',
    createdAt: '2025-01-30T12:30:00Z',
    completedAt: '2025-01-30T12:47:00Z'
  },
  {
    id: 'ride-005',
    riderId: 'rider-002',
    driverId: 'driver-007',
    driverName: 'Tunde Bakare',
    driverAvatar: '👨',
    vehicleType: 'motorcycle',
    vehicleColor: 'Black',
    vehiclePlate: 'LSD 111 MN',
    pickup: {
      id: 'lek-002',
      name: 'Aboyade Cole Street',
      area: 'Lekki Phase 1',
      lat: 6.4285,
      lng: 3.4428,
      address: 'Near Lekki Conservation Centre'
    },
    dropoff: {
      id: 'lek-003',
      name: 'Freedom Way',
      area: 'Lekki Phase 1',
      lat: 6.4234,
      lng: 3.4512,
      address: 'Near Lekki Lagoon'
    },
    status: 'completed',
    serviceType: 'okada',
    tier: 'standard',
    fare: 500,
    distance: 1.2,
    duration: 5,
    paymentMethod: 'card',
    rating: 5,
    review: 'Quick and efficient! Perfect for short trips.',
    createdAt: '2025-01-30T09:00:00Z',
    completedAt: '2025-01-30T09:06:00Z'
  },
  {
    id: 'ride-006',
    riderId: 'rider-008',
    driverId: 'driver-005',
    driverName: 'Oluwaseun Bankole',
    driverAvatar: '👨‍🦳',
    vehicleType: 'suv',
    vehicleColor: 'Gold',
    vehiclePlate: 'LSD 567 IJ',
    pickup: {
      id: 'iba-001',
      name: 'Ring Road',
      area: 'Ibadan North',
      lat: 7.4032,
      lng: 3.9087,
      address: 'Near Challenge'
    },
    dropoff: {
      id: 'iba-002',
      name: 'Bodija Market Road',
      area: 'Ibadan North',
      lat: 7.4189,
      lng: 3.9123,
      address: 'Near Bodija Market'
    },
    status: 'completed',
    serviceType: 'car',
    tier: 'premium',
    fare: 2800,
    distance: 8.5,
    duration: 22,
    paymentMethod: 'card',
    rating: 5,
    review: 'Best service in Ibadan! Very reliable.',
    createdAt: '2025-01-29T14:20:00Z',
    completedAt: '2025-01-29T14:44:00Z'
  },
  {
    id: 'ride-007',
    riderId: 'rider-003',
    driverId: 'driver-001',
    driverName: 'Chinedu Okafor',
    driverAvatar: '👨‍💼',
    vehicleType: 'sedan',
    vehicleColor: 'Black',
    vehiclePlate: 'LSD 123 AB',
    pickup: {
      id: 'osh-001',
      name: 'Lagos-Ibadan Expressway',
      area: 'Oshodi',
      lat: 6.5508,
      lng: 3.3298,
      address: 'Near Oshodi Market'
    },
    dropoff: {
      id: 'ike-003',
      name: 'Mobolaji Bank Anthony Way',
      area: 'Ikeja',
      lat: 6.5912,
      lng: 3.3678,
      address: 'Near Maryland Mall'
    },
    status: 'completed',
    serviceType: 'share',
    tier: 'standard',
    fare: 900,
      distance: 5.5,
    duration: 20,
    paymentMethod: 'mobile-money',
    rating: 4,
    review: 'Shared ride was okay, a bit crowded but got there on time.',
    createdAt: '2025-01-29T10:15:00Z',
    completedAt: '2025-01-29T10:37:00Z'
  },
  {
    id: 'ride-008',
    riderId: 'rider-010',
    driverId: 'driver-008',
    driverName: 'Grace Afolayan',
    driverAvatar: '👩‍🦱',
    vehicleType: 'suv',
    vehicleColor: 'Gray',
    vehiclePlate: 'LSD 222 OP',
    pickup: {
      id: 'lko-002',
      name: 'Akin Adesola Street',
      area: 'Victoria Island',
      lat: 6.4292,
      lng: 3.4156,
      address: 'Opposite Civic Center'
    },
    dropoff: {
      id: 'lko-004',
      name: 'Cameron Road',
      area: 'Ikoyi',
      lat: 6.4458,
      lng: 3.4023,
      address: 'Near Federal Palace Hotel'
    },
    status: 'completed',
    serviceType: 'car',
    tier: 'premium',
    fare: 3200,
    distance: 10.2,
    duration: 28,
    paymentMethod: 'card',
    rating: 5,
    review: 'Amazing service! Will definitely book again.',
    createdAt: '2025-01-28T19:30:00Z',
    completedAt: '2025-01-28T20:00:00Z'
  },
  {
    id: 'ride-009',
    riderId: 'rider-005',
    driverId: 'driver-003',
    driverName: 'Emeka Nnamdi',
    driverAvatar: '👨‍🦰',
    vehicleType: 'sedan',
    vehicleColor: 'White',
    vehiclePlate: 'LSD 789 EF',
    pickup: {
      id: 'lek-003',
      name: 'Freedom Way',
      area: 'Lekki Phase 1',
      lat: 6.4234,
      lng: 3.4512,
      address: 'Near Lekki Lagoon'
    },
    dropoff: {
      id: 'sur-002',
      name: 'Adeniran Ogunsanya Street',
      area: 'Surulere',
      lat: 6.4892,
      lng: 3.3512,
      address: 'Near Shoprite Surulere'
    },
    status: 'cancelled',
    serviceType: 'car',
    tier: 'standard',
    fare: 2200,
    distance: 9.8,
    duration: 30,
    paymentMethod: 'cash',
    cancelledReason: 'Driver cancelled - vehicle issue',
    createdAt: '2025-01-28T07:45:00Z'
  },
  {
    id: 'ride-010',
    riderId: 'rider-009',
    driverId: 'driver-006',
    driverName: 'Ngozi Eze',
    driverAvatar: '👩‍🦰',
    vehicleType: 'sedan',
    vehicleColor: 'Red',
    vehiclePlate: 'LSD 890 KL',
    pickup: {
      id: 'ike-002',
      name: 'Allen Avenue',
      area: 'Ikeja',
      lat: 6.6045,
      lng: 3.3445,
      address: 'Near Ozone Cinemas'
    },
    dropoff: {
      id: 'ike-001',
      name: 'Obafemi Awolowo Way',
      area: 'Ikeja',
      lat: 6.6018,
      lng: 3.3515,
      address: 'Near Ikeja City Mall'
    },
    status: 'completed',
    serviceType: 'okada',
    tier: 'standard',
    fare: 400,
    distance: 0.8,
    duration: 4,
    paymentMethod: 'cash',
    rating: 4,
    review: 'Quick trip through traffic. Good value.',
    createdAt: '2025-01-27T17:00:00Z',
    completedAt: '2025-01-27T17:05:00Z'
  },
  {
    id: 'ride-011',
    riderId: 'rider-001',
    driverId: 'driver-002',
    driverName: 'Adebayo Adeleke',
    driverAvatar: '👨‍🦱',
    vehicleType: 'suv',
    vehicleColor: 'Silver',
    vehiclePlate: 'LSD 456 CD',
    pickup: {
      id: 'yab-001',
      name: 'Muritala Muhammed Airport Road',
      area: 'Yaba',
      lat: 6.5145,
      lng: 3.3723,
      address: 'Near University of Lagos'
    },
    dropoff: {
      id: 'lko-001',
      name: 'Adetokunbo Ademola Street',
      area: 'Victoria Island',
      lat: 6.4281,
      lng: 3.4219,
      address: 'Near Eko Hotel'
    },
    status: 'completed',
    serviceType: 'car',
    tier: 'premium',
    fare: 4800,
    distance: 15.2,
    duration: 42,
    paymentMethod: 'card',
    rating: 5,
    review: 'Premium ride worth every naira!',
    createdAt: '2025-01-27T08:00:00Z',
    completedAt: '2025-01-27T08:44:00Z'
  },
  {
    id: 'ride-012',
    riderId: 'rider-007',
    driverId: 'driver-001',
    driverName: 'Chinedu Okafor',
    driverAvatar: '👨‍💼',
    vehicleType: 'sedan',
    vehicleColor: 'Black',
    vehiclePlate: 'LSD 123 AB',
    pickup: {
      id: 'lko-003',
      name: 'Awolowo Road',
      area: 'Ikoyi',
      lat: 6.4525,
      lng: 3.4102,
      address: 'Near Lagos Polo Club'
    },
    dropoff: {
      id: 'lko-002',
      name: 'Akin Adesola Street',
      area: 'Victoria Island',
      lat: 6.4292,
      lng: 3.4156,
      address: 'Opposite Civic Center'
    },
    status: 'completed',
    serviceType: 'share',
    tier: 'standard',
    fare: 700,
    distance: 3.5,
    duration: 12,
    paymentMethod: 'mobile-money',
    rating: 4,
    review: 'Good shared ride option.',
    createdAt: '2025-01-26T13:45:00Z',
    completedAt: '2025-01-26T13:59:00Z'
  }
];

// Get rides by rider ID
export const getRidesByRider = (riderId: string): Ride[] => {
  return MOCK_RIDES.filter(r => r.riderId === riderId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// Get rides by driver ID
export const getRidesByDriver = (driverId: string): Ride[] => {
  return MOCK_RIDES.filter(r => r.driverId === driverId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// Get active rides
export const getActiveRides = (): Ride[] => {
  return MOCK_RIDES.filter(r => 
    ['requesting', 'driver-assigned', 'driver-arriving', 'arrived', 'in-progress'].includes(r.status)
  );
};

// Get completed rides
export const getCompletedRides = (): Ride[] => {
  return MOCK_RIDES.filter(r => r.status === 'completed');
};

// Cancelled rides
export const getCancelledRides = (): Ride[] => {
  return MOCK_RIDES.filter(r => r.status === 'cancelled');
};

// Create a new ride
export const createRide = (
  riderId: string,
  pickup: Location,
  dropoff: Location,
  serviceType: ServiceType,
  tier: 'standard' | 'premium',
  paymentMethod: PaymentMethod
): Omit<Ride, 'id' | 'createdAt'> => {
  // Calculate distance using Haversine formula
  const R = 6371; // Earth's radius in km
  const dLat = (dropoff.lat - pickup.lat) * Math.PI / 180;
  const dLng = (dropoff.lng - pickup.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(pickup.lat * Math.PI / 180) * Math.cos(dropoff.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  // Estimate duration (assuming 30 km/h average speed in traffic)
  const duration = Math.round(distance / 0.5);
  
  // Calculate fare
  const fare = calculateFare(distance, serviceType, tier);
  
  // Calculate commission
  const commissionRate = tier === 'premium' ? 25 : 20;
  const commission = Math.round(fare * (commissionRate / 100));
  const driverEarnings = fare - commission;
  
  return {
    riderId,
    pickup,
    dropoff,
    status: 'requesting',
    serviceType,
    tier,
    fare,
    distance: Math.round(distance * 10) / 10,
    duration,
    paymentMethod,
    pin: generatePIN(),
    driverEarnings,
    commission
  };
};