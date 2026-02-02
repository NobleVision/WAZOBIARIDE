/**
 * WaZoBiaRide - Rider Dashboard
 * 
 * Main rider interface with map, ride booking, and tracking
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Navigation, Star, Clock, CreditCard, 
  Wallet, Menu, X, Car as CarIcon, 
  History, LogOut, Home 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapView, MapMarker } from '@/components/shared/MapView';
import { TierSelector } from '@/components/shared/TierSelector';
import { PINEntry } from '@/components/shared/PINEntry';
import { MOCK_DRIVERS, getOnlineDrivers, getNearbyDrivers } from '@/data/mock-drivers';
import { ALL_LOCATIONS } from '@/data/locations';
import { MOCK_RIDES, getRidesByRider, createRide, Ride, RideStatus, ServiceType, PaymentMethod } from '@/data/mock-rides';
import { getRiderById } from '@/data/mock-riders';
import { useAuth } from '@/auth/AuthContext';
import { cn } from '@/lib/utils';

type View = 'map' | 'history' | 'wallet';

export const RiderDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [view, setView] = useState<View>('map');
  const [selectedPickup, setSelectedPickup] = useState(ALL_LOCATIONS[0]);
  const [selectedDropoff, setSelectedDropoff] = useState(ALL_LOCATIONS[5]);
  const [serviceType, setServiceType] = useState<ServiceType>('car');
  const [tier, setTier] = useState<'standard' | 'premium'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [step, setStep] = useState<'search' | 'tier' | 'confirm' | 'requesting' | 'driver' | 'pin' | 'active' | 'complete' | 'rating'>('search');
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState<'pickup' | 'dropoff' | null>(null);
  const [rideHistory, setRideHistory] = useState<Ride[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);

  // Load ride history
  useEffect(() => {
    if (user) {
      const history = getRidesByRider('rider-001');
      setRideHistory(history);
    }
  }, [user]);

  // Get nearby drivers for map
  const nearbyDrivers = getNearbyDrivers(selectedPickup.lat, selectedPickup.lng, 10);
  const driverMarkers: MapMarker[] = nearbyDrivers.slice(0, 5).map(driver => ({
    id: driver.id,
    lat: driver.currentLocation.lat,
    lng: driver.currentLocation.lng,
    type: 'driver',
    label: `${driver.name} (${driver.vehicleColor} ${driver.vehiclePlate})`,
    tier: driver.tier
  }));

  // Calculate fare estimate
  const calculateEstimate = () => {
    const R = 6371;
    const dLat = (selectedDropoff.lat - selectedPickup.lat) * Math.PI / 180;
    const dLng = (selectedDropoff.lng - selectedPickup.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(selectedPickup.lat * Math.PI / 180) * Math.cos(selectedDropoff.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    const baseRates = { car: 500, okada: 300, share: 400 };
    const perKmRates = { car: 200, okada: 100, share: 150 };
    const tierMultipliers = { standard: 1, premium: 1.5 };
    
    const baseFare = baseRates[serviceType];
    const distanceFare = distance * perKmRates[serviceType];
    const totalFare = (baseFare + distanceFare) * tierMultipliers[tier];
    
    return {
      fare: Math.round(totalFare / 100) * 100,
      distance: Math.round(distance * 10) / 10,
      duration: Math.round(distance / 0.5)
    };
  };

  const estimate = calculateEstimate();

  const handleRequestRide = () => {
    setStep('requesting');
    
    // Simulate finding driver
    setTimeout(() => {
      const assignedDriver = MOCK_DRIVERS.find(d => d.id === 'driver-003');
      const newRide: Ride = {
        ...createRide('rider-001', selectedPickup, selectedDropoff, serviceType, tier, paymentMethod),
        id: `ride-${Date.now()}`,
        createdAt: new Date().toISOString(),
        driverId: assignedDriver?.id,
        driverName: assignedDriver?.name,
        driverAvatar: assignedDriver?.avatar,
        vehicleType: assignedDriver?.vehicleType,
        vehicleColor: assignedDriver?.vehicleColor,
        vehiclePlate: assignedDriver?.vehiclePlate,
        status: 'driver-assigned'
      };
      
      setCurrentRide(newRide);
      setStep('driver');
    }, 2000);
  };

  const handlePINVerified = () => {
    setStep('active');
    
    // Simulate ride progress
    setTimeout(() => {
      if (currentRide) {
        setCurrentRide({
          ...currentRide,
          status: 'in-progress'
        });
      }
    }, 3000);
    
    setTimeout(() => {
      if (currentRide) {
        setCurrentRide({
          ...currentRide,
          status: 'completed'
        });
        setStep('complete');
      }
    }, 10000);
  };

  const handleNewRide = () => {
    setCurrentRide(null);
    setStep('search');
  };

  const renderSidebar = () => (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-y-0 right-0 w-72 bg-white shadow-2xl z-50 p-6"
    >
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold font-display">Menu</h3>
        <Button variant="ghost" size="icon" onClick={() => setShowSidebar(false)}>
          <X className="w-6 h-6" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <Button
          variant={view === 'map' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => { setView('map'); setShowSidebar(false); }}
        >
          <MapPin className="w-5 h-5 mr-3" />
          Book Ride
        </Button>
        <Button
          variant={view === 'history' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => { setView('history'); setShowSidebar(false); }}
        >
          <History className="w-5 h-5 mr-3" />
          Ride History
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700"
          onClick={() => { logout(); setShowSidebar(false); }}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="bg-white shadow-sm border-b border-border px-4 py-3"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-display">
              <span className="text-primary">Wa</span>
              <span className="text-gold">Zo</span>
              <span className="text-primary">Bia</span>
              <span className="text-gold">Ride</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
              <span className="text-primary font-semibold">4.8</span>
              <Star className="w-4 h-4 text-gold fill-current" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowSidebar(true)}>
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {view === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              {/* Map View */}
              <div className="h-[50vh] relative">
                <MapView
                  markers={[
                    ...driverMarkers,
                    {
                      id: 'pickup',
                      lat: selectedPickup.lat,
                      lng: selectedPickup.lng,
                      type: 'pickup',
                      label: selectedPickup.name
                    },
                    {
                      id: 'dropoff',
                      lat: selectedDropoff.lat,
                      lng: selectedDropoff.lng,
                      type: 'dropoff',
                      label: selectedDropoff.name
                    }
                  ]}
                  showRoute={step !== 'search'}
                  selectedMarkerId={showLocationPicker ? (showLocationPicker === 'pickup' ? 'pickup' : 'dropoff') : undefined}
                />
              </div>

              {/* Ride Booking Panel */}
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl border-t border-border"
              >
                {step === 'search' && (
                  <div className="p-6 space-y-4">
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start h-14 text-left px-4"
                        onClick={() => setShowLocationPicker('pickup')}
                      >
                        <MapPin className="w-5 h-5 mr-3 text-primary" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Pickup</p>
                          <p className="font-semibold truncate">{selectedPickup.name}</p>
                        </div>
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full justify-start h-14 text-left px-4"
                        onClick={() => setShowLocationPicker('dropoff')}
                      >
                        <Navigation className="w-5 h-5 mr-3 text-gold" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Dropoff</p>
                          <p className="font-semibold truncate">{selectedDropoff.name}</p>
                        </div>
                      </Button>
                    </div>

                    <div className="flex gap-3">
                      {['car', 'okada', 'share'].map((type) => (
                        <Button
                          key={type}
                          variant={serviceType === type ? 'default' : 'outline'}
                          className="flex-1 h-14"
                          onClick={() => setServiceType(type as ServiceType)}
                        >
                          <CarIcon className="w-5 h-5 mr-2" />
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                      ))}
                    </div>

                    <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-muted-foreground">Estimated Fare</p>
                          <p className="text-3xl font-bold font-display text-primary">
                            ₦{estimate.fare.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{estimate.distance} km</p>
                          <p>{estimate.duration} min</p>
                        </div>
                      </div>
                    </Card>

                    <Button
                      size="lg"
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90"
                      onClick={() => setStep('tier')}
                    >
                      Continue
                    </Button>
                  </div>
                )}

                {step === 'tier' && (
                  <div className="p-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep('search')}
                      className="mb-4"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <TierSelector
                      selectedTier={tier}
                      onTierChange={setTier}
                      basePrice={estimate.fare}
                      serviceType={serviceType}
                    />
                    <Button
                      size="lg"
                      className="w-full h-14 text-lg font-semibold mt-6"
                      onClick={() => setStep('confirm')}
                    >
                      Confirm Booking
                    </Button>
                  </div>
                )}

                {step === 'confirm' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep('tier')}
                      className="mb-4"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Back
                    </Button>

                    <h3 className="text-xl font-bold mb-6 font-display">Confirm Your Ride</h3>

                    <Card className="p-4 space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service</span>
                        <span className="font-semibold capitalize">{tier} {serviceType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment</span>
                        <span className="font-semibold capitalize">{paymentMethod}</span>
                      </div>
                      <div className="border-t pt-4 flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="text-2xl font-bold text-primary">₦{estimate.fare.toLocaleString()}</span>
                      </div>
                    </Card>

                    <Button
                      size="lg"
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90"
                      onClick={handleRequestRide}
                    >
                      Request Ride
                    </Button>
                  </motion.div>
                )}

                {step === 'requesting' && (
                  <div className="p-12 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full"
                    />
                    <h3 className="text-xl font-bold mb-2">Finding your driver...</h3>
                    <p className="text-muted-foreground">Searching for nearby drivers</p>
                  </div>
                )}

                {step === 'driver' && currentRide && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
                        {currentRide.driverAvatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{currentRide.driverName}</h3>
                        <p className="text-muted-foreground">{currentRide.vehicleColor} {currentRide.vehicleType} • {currentRide.vehiclePlate}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-gold">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-semibold">4.9</span>
                        </div>
                      </div>
                    </div>

                    <Card className="p-4 bg-primary/5 border-primary/20 mb-6">
                      <p className="text-sm text-muted-foreground mb-2">Arriving in</p>
                      <p className="text-3xl font-bold text-primary">3 min</p>
                      <p className="text-sm text-muted-foreground">0.8 km away</p>
                    </Card>

                    <Button
                      size="lg"
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90"
                      onClick={() => setStep('pin')}
                    >
                      Verify PIN to Start
                    </Button>
                  </motion.div>
                )}

                {step === 'pin' && (
                  <div className="p-6">
                    <PINEntry
                      onPINComplete={handlePINVerified}
                      correctPIN={currentRide?.pin}
                      onCancel={() => setStep('driver')}
                      title="Enter Driver PIN"
                      description="Enter the 4-digit PIN provided by your driver"
                    />
                  </div>
                )}

                {step === 'active' && currentRide && (
                  <div className="p-6">
                    <div className="text-center mb-6">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-4xl mb-4"
                      >
                        {currentRide.driverAvatar}
                      </motion.div>
                      <h3 className="text-xl font-bold">Ride in Progress</h3>
                      <p className="text-muted-foreground">Heading to {selectedDropoff.name}</p>
                    </div>

                    <Card className="p-4 bg-primary/5 border-primary/20 mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-muted-foreground">ETA</p>
                          <p className="text-2xl font-bold text-primary">{estimate.duration - 5} min</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Distance</p>
                          <p className="text-2xl font-bold">{(estimate.distance * 0.6).toFixed(1)} km</p>
                        </div>
                      </div>
                    </Card>

                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1">
                        <span>Share Trip</span>
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <span>SOS</span>
                      </Button>
                    </div>
                  </div>
                )}

                {step === 'complete' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 text-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: 1 }}
                      className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center text-5xl mb-6"
                    >
                      ✓
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2 font-display">Ride Complete!</h3>
                    <p className="text-muted-foreground mb-6">Thank you for riding with WaZoBiaRide</p>
                    
                    <Card className="p-6 mb-6">
                      <p className="text-sm text-muted-foreground mb-2">Total Fare</p>
                      <p className="text-4xl font-bold text-primary mb-4">₦{estimate.fare.toLocaleString()}</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rate your ride</span>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(star => (
                              <button
                                key={star}
                                className="text-2xl hover:scale-110 transition-transform"
                              >
                                <Star className={star <= 5 ? "w-6 h-6 text-gold fill-current" : "w-6 h-6 text-gray-300"} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Button
                      size="lg"
                      className="w-full h-14 text-lg font-semibold"
                      onClick={handleNewRide}
                    >
                      Book Another Ride
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto p-6"
            >
              <h2 className="text-2xl font-bold mb-6 font-display">Ride History</h2>
              
              <div className="space-y-4">
                {rideHistory.map((ride) => (
                  <Card key={ride.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(ride.createdAt).toLocaleDateString('en-NG', { 
                            month: 'short', day: 'numeric', year: 'numeric' 
                          })}
                        </p>
                        <p className="font-semibold capitalize">{ride.serviceType} • {ride.tier}</p>
                      </div>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        ride.status === 'completed' ? 'bg-green-100 text-green-700' :
                        ride.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      )}>
                        {ride.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{ride.pickup.name}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Navigation className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{ride.dropoff.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        {ride.rating && (
                          <div className="flex items-center gap-1 text-gold">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-semibold">{ride.rating}</span>
                          </div>
                        )}
                        <span className="text-sm text-muted-foreground">{ride.distance} km</span>
                      </div>
                      <span className="text-xl font-bold text-primary">₦{ride.fare.toLocaleString()}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSidebar(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSidebar && renderSidebar()}
      </AnimatePresence>
    </div>
  );
};