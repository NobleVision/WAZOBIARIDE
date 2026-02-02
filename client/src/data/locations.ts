/**
 * WaZoBiaRide - Nigerian Locations
 * 
 * Realistic location data for Lagos and Ibadan
 */

export interface Location {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  address?: string;
}

export const LAGOS_LOCATIONS: Location[] = [
  {
    id: 'lko-001',
    name: 'Adetokunbo Ademola Street',
    area: 'Victoria Island',
    lat: 6.4281,
    lng: 3.4219,
    address: 'Near Eko Hotel'
  },
  {
    id: 'lko-002',
    name: 'Akin Adesola Street',
    area: 'Victoria Island',
    lat: 6.4292,
    lng: 3.4156,
    address: 'Opposite Civic Center'
  },
  {
    id: 'lko-003',
    name: 'Awolowo Road',
    area: 'Ikoyi',
    lat: 6.4525,
    lng: 3.4102,
    address: 'Near Lagos Polo Club'
  },
  {
    id: 'lko-004',
    name: 'Cameron Road',
    area: 'Ikoyi',
    lat: 6.4458,
    lng: 3.4023,
    address: 'Near Federal Palace Hotel'
  },
  {
    id: 'lek-001',
    name: 'Admiralty Way',
    area: 'Lekki Phase 1',
    lat: 6.4339,
    lng: 3.4471,
    address: 'Near Mega Plaza'
  },
  {
    id: 'lek-002',
    name: 'Aboyade Cole Street',
    area: 'Lekki Phase 1',
    lat: 6.4285,
    lng: 3.4428,
    address: 'Near Lekki Conservation Centre'
  },
  {
    id: 'lek-003',
    name: 'Freedom Way',
    area: 'Lekki Phase 1',
    lat: 6.4234,
    lng: 3.4512,
    address: 'Near Lekki Lagoon'
  },
  {
    id: 'ike-001',
    name: 'Obafemi Awolowo Way',
    area: 'Ikeja',
    lat: 6.6018,
    lng: 3.3515,
    address: 'Near Ikeja City Mall'
  },
  {
    id: 'ike-002',
    name: 'Allen Avenue',
    area: 'Ikeja',
    lat: 6.6045,
    lng: 3.3445,
    address: 'Near Ozone Cinemas'
  },
  {
    id: 'ike-003',
    name: 'Mobolaji Bank Anthony Way',
    area: 'Ikeja',
    lat: 6.5912,
    lng: 3.3678,
    address: 'Near Maryland Mall'
  },
  {
    id: 'sur-001',
    name: 'Lagos-Abeokuta Expressway',
    area: 'Surulere',
    lat: 6.4938,
    lng: 3.3478,
    address: 'Near National Stadium'
  },
  {
    id: 'sur-002',
    name: 'Adeniran Ogunsanya Street',
    area: 'Surulere',
    lat: 6.4892,
    lng: 3.3512,
    address: 'Near Shoprite Surulere'
  },
  {
    id: 'yab-001',
    name: 'Muritala Muhammed Airport Road',
    area: 'Yaba',
    lat: 6.5145,
    lng: 3.3723,
    address: 'Near University of Lagos'
  },
  {
    id: 'yab-002',
    name: 'Herbert Macaulay Way',
    area: 'Yaba',
    lat: 6.5189,
    lng: 3.3756,
    address: 'Near Yaba College of Technology'
  },
  {
    id: 'osh-001',
    name: 'Lagos-Ibadan Expressway',
    area: 'Oshodi',
    lat: 6.5508,
    lng: 3.3298,
    address: 'Near Oshodi Market'
  },
  {
    id: 'osh-002',
    name: 'Agege Motor Road',
    area: 'Oshodi',
    lat: 6.5456,
    lng: 3.3345,
    address: 'Near Murtala Muhammed International Airport'
  }
];

export const IBADAN_LOCATIONS: Location[] = [
  {
    id: 'iba-001',
    name: 'Ring Road',
    area: 'Ibadan North',
    lat: 7.4032,
    lng: 3.9087,
    address: 'Near Challenge'
  },
  {
    id: 'iba-002',
    name: 'Bodija Market Road',
    area: 'Ibadan North',
    lat: 7.4189,
    lng: 3.9123,
    address: 'Near Bodija Market'
  },
  {
    id: 'iba-003',
    name: 'Mokola Road',
    area: 'Ibadan North',
    lat: 7.3895,
    lng: 3.8976,
    address: 'Near University of Ibadan'
  },
  {
    id: 'iba-004',
    name: 'Dugbe Market Road',
    area: 'Ibadan Southwest',
    lat: 7.3765,
    lng: 3.9123,
    address: 'Near Dugbe Market'
  },
  {
    id: 'iba-005',
    name: 'Challenge Expressway',
    area: 'Ibadan North West',
    lat: 7.4102,
    lng: 3.8895,
    address: 'Near Challenge Roundabout'
  }
];

export const ALL_LOCATIONS = [...LAGOS_LOCATIONS, ...IBADAN_LOCATIONS];

export const AREAS = Array.from(new Set(ALL_LOCATIONS.map(loc => loc.area)));

// Helper to get random location
export const getRandomLocation = (): Location => {
  return ALL_LOCATIONS[Math.floor(Math.random() * ALL_LOCATIONS.length)];
};

// Helper to get locations by area
export const getLocationsByArea = (area: string): Location[] => {
  return ALL_LOCATIONS.filter(loc => loc.area.toLowerCase() === area.toLowerCase());
};