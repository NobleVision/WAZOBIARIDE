/**
 * WaZoBiaRide - Driver Dashboard
 * 
 * Main driver interface with ride requests, earnings, and status management
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car as CarIcon, Wallet, History, User, MapPin, 
  Navigation, Clock, DollarSign, Star, Menu, X,
  Power, Check, X as XIcon, Bell 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapView, MapMarker } from '@/components/shared/MapView';
import { PINEntry } from '@/components/shared/PINEntry';
import { ALL_LOCATIONS } from '@/data/locations';
import { MOCK_DRIVERS, getDriverById } from '@/data/mock-drivers';
import { MOCK_RIDES, getRidesByDriver, createRide, Ride, ServiceType } from '@/data/mock-rides';
import { MOCK_TRANSACTIONS } from '@/data/mock-transactions';
import { useAuth } from '@/auth/AuthContext';
import { cn } from '@/lib/utils';

type View = 'home' | 'earnings' | 'profile';
type DriverStatus = 'online' | 'offline' | 'busy';

export const DriverDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [view, setView] = useState<View>('home');
  const [isOnline, setIsOnline] = useState(false);
  const [status, setStatus] = useState<DriverStatus>('offline');
  const [incomingRide, setIncomingRide] = useState<Ride | null>(null);
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [showPINModal, setShowPINModal] = useState(false);
  const [rideStep, setRideStep] = useState<'arriving' | 'pickup' | 'trip' | 'complete'>('arriving');
  const [showSidebar, setShowSidebar] = useState(false);
  
  const driver = getDriverById('driver-001');
  const earnings = MOCK_TRANSACTIONS.filter(t => t.driverId === 'driver-001');
  const totalEarnings = earnings.reduce((sum, t) => sum + t.amount, 0);
  const todayEarnings = earnings
    .filter(t => t.createdAt.startsWith(new Date().toISOString().split('T')[0]))
    .reduce((sum, t) => sum + t.amount, 0);

  // Simulate incoming ride request
  useEffect(() => {
    if (isOnline && !currentRide && !incomingRide) {
      const timer = setTimeout(() => {
        const pickup = ALL_LOCATIONS[Math.floor(Math.random() * ALL_LOCATIONS.length)];
        const dropoff = ALL_LOCATIONS[Math.floor(Math.random() * ALL_LOCATIONS.length)];
        
        // Skip if same location
        if (pickup.id === dropoff.id) return;

        const newRide: Ride = {
          ...createRide('rider-001', pickup, dropoff, 'car', driver?.tier || 'standard', 'card'),
          id: `ride-${Date.now()}`,
          createdAt: new Date().toISOString(),
          pin: Math.floor(1000 + Math.random() * 9000).toString(),
          status: 'driver-assigned'
        };

        setIncomingRide(newRide);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOnline, currentRide, incomingRide, driver?.tier]);

  const calculateEarnings = (fare: number, commission: number) => {
    const platformFee = fare * (commission / 100);
    const driverEarnings = fare - platformFee;
    return {
      fare,
      platformFee,
      driverEarnings,
      commission
    };
  };

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    setStatus(!isOnline ? 'online' : 'offline');
  };

  const handleAcceptRide = () => {
    if (incomingRide) {
      setIncomingRide(null);
      setCurrentRide(incomingRide);
      setRideStep('arriving');
    }
  };

  const handleDeclineRide = () => {
    setIncomingRide(null);
  };

  const handlePickupPIN = () => {
    setRideStep('trip');
    setShowPINModal(false);
    
    // Simulate trip completion
    setTimeout(() => {
      if (currentRide) {
        setCurrentRide({
          ...currentRide,
          status: 'completed'
        });
        setRideStep('complete');
      }
    }, 10000);
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
          variant={view === 'home' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => { setView('home'); setShowSidebar(false); }}
        >
          <CarIcon className="w-5 h-5 mr-3" />
          Dashboard
        </Button>
        <Button
          variant={view === 'earnings' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => { setView('earnings'); setShowSidebar(false); }}
        >
          <Wallet className="w-5 h-5 mr-3" />
          Earnings
        </Button>
        <Button
          variant={view === 'profile' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => { setView('profile'); setShowSidebar(false); }}
        >
          <User className="w-5 h-5 mr-3" />
          Profile
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700"
          onClick={() => { logout(); setShowSidebar(false); }}
        >
          <Power className="w-5 h-5 mr-3" />
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
            <Button
              variant={isOnline ? 'default' : 'outline'}
              onClick={handleToggleOnline}
              className={cn(
                isOnline && 'bg-green-600 hover:bg-green-700'
              )}
            >
              <Power className="w-4 h-4 mr-2" />
              {isOnline ? 'Online' : 'Go Online'}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowSidebar(true)}>
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Map */}
              <div className="h-[50vh] relative">
                <MapView
                  markers={[
                    ...(incomingRide ? [
                      {
                        id: 'pickup',
                        lat: incomingRide.pickup.lat,
                        lng: incomingRide.pickup.lng,
                        type: 'pickup' as const,
                        label: incomingRide.pickup.name
                      }
                    ] : []),
                    ...(currentRide ? [
                      {
                        id: 'pickup',
                        lat: currentRide.pickup.lat,
                        lng: currentRide.pickup.lng,
                        type: 'pickup' as const,
                        label: currentRide.pickup.name
                      },
                      {
                        id: 'dropoff',
                        lat: currentRide.dropoff.lat,
                        lng: currentRide.dropoff.lng,
                        type: 'dropoff' as const,
                        label: currentRide.dropoff.name
                      }
                    ] : [])
                  ]}
                  showRoute={!!currentRide}
                />
              </div>

              {/* Status Panel */}
              <div className="p-6 space-y-4">
                {!isOnline && (
                  <Card className="p-6 bg-gradient-to-r from-slate-100 to-slate-50 border-slate-200">
                    <div className="text-center">
                      <CarIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-bold mb-2">You're Offline</h3>
                      <p className="text-muted-foreground mb-4">Go online to start receiving ride requests</p>
                      <Button
                        size="lg"
                        className="w-full"
                        onClick={handleToggleOnline}
                      >
                        Go Online
                      </Button>
                    </div>
                  </Card>
                )}

                {isOnline && !currentRide && !incomingRide && (
                  <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                    <div className="text-center">
                      <Bell className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
                      <h3 className="text-xl font-bold mb-2">Waiting for Requests...</h3>
                      <p className="text-muted-foreground">Stay online and you'll be notified when a rider needs a ride</p>
                    </div>
                  </Card>
                )}

                {incomingRide && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-4"
                  >
                    {/* KEY DIFFERENTIATOR: Upfront Earnings with Countdown */}
                    <Card className="p-6 bg-gradient-to-br from-gold/10 to-gold/5 border-gold/20 shadow-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm text-gold font-semibold mb-1">UPFRONT EARNINGS</p>
                          <p className="text-4xl font-bold font-display text-gold">
                            ₦{calculateEarnings(incomingRide.fare, 20).driverEarnings.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            After 20% platform fee
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
                            <DollarSign className="w-8 h-8 text-gold" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Ride Fare</p>
                          <p className="text-xl font-bold">₦{incomingRide.fare.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Distance</p>
                          <p className="text-xl font-bold">{incomingRide.distance} km</p>
                        </div>
                      </div>

                      {/* KEY DIFFERENTIATOR: Countdown Timer */}
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-center mb-2">Expires in</p>
                        <div className="flex justify-center">
                          <div className="w-20 h-20 rounded-full bg-gold/10 border-4 border-gold/30 flex items-center justify-center">
                            <span className="text-3xl font-bold text-gold font-display">10</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Pickup</p>
                            <p className="font-semibold">{incomingRide.pickup.name}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Navigation className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Dropoff</p>
                            <p className="font-semibold">{incomingRide.dropoff.name}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={handleDeclineRide}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <XIcon className="w-5 h-5 mr-2" />
                          Decline
                        </Button>
                        <Button
                          size="lg"
                          onClick={handleAcceptRide}
                          className="bg-gradient-to-r from-primary to-primary/90"
                        >
                          <Check className="w-5 h-5 mr-2" />
                          Accept
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {currentRide && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="space-y-4"
                  >
                    {rideStep === 'arriving' && (
                      <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                        <div className="text-center mb-6">
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4"
                          >
                            <CarIcon className="w-10 h-10 text-primary" />
                          </motion.div>
                          <h3 className="text-2xl font-bold mb-2 font-display">Heading to Pickup</h3>
                          <p className="text-muted-foreground">{currentRide.pickup.name}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="text-center p-4 bg-white/50 rounded-lg">
                            <p className="text-2xl font-bold text-primary">3 min</p>
                            <p className="text-xs text-muted-foreground">ETA</p>
                          </div>
                          <div className="text-center p-4 bg-white/50 rounded-lg">
                            <p className="text-2xl font-bold">1.2 km</p>
                            <p className="text-xs text-muted-foreground">Distance</p>
                          </div>
                        </div>

                        <Button
                          size="lg"
                          className="w-full"
                          onClick={() => setShowPINModal(true)}
                        >
                          Arrived at Pickup
                        </Button>
                      </Card>
                    )}

                    {rideStep === 'trip' && (
                      <Card className="p-6 bg-gradient-to-r from-gold/10 to-gold/5 border-gold/20">
                        <div className="text-center mb-6">
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-20 h-20 mx-auto rounded-full bg-gold/10 flex items-center justify-center mb-4"
                          >
                            <Navigation className="w-10 h-10 text-gold" />
                          </motion.div>
                          <h3 className="text-2xl font-bold mb-2 font-display">Trip in Progress</h3>
                          <p className="text-muted-foreground">Heading to {currentRide.dropoff.name}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="text-center p-4 bg-white/50 rounded-lg">
                            <p className="text-2xl font-bold text-gold">8 min</p>
                            <p className="text-xs text-muted-foreground">ETA</p>
                          </div>
                          <div className="text-center p-4 bg-white/50 rounded-lg">
                            <p className="text-2xl font-bold">{(currentRide.distance * 0.6).toFixed(1)} km</p>
                            <p className="text-xs text-muted-foreground">Remaining</p>
                          </div>
                        </div>

                        <Card className="p-4 mb-4 bg-white/50">
                          <p className="text-xs text-muted-foreground mb-2">Earnings This Trip</p>
                          <p className="text-3xl font-bold font-display text-gold">
                            ₦{calculateEarnings(currentRide.fare, 20).driverEarnings.toLocaleString()}
                          </p>
                        </Card>
                      </Card>
                    )}

                    {rideStep === 'complete' && (
                      <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <div className="text-center mb-6">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: 1 }}
                            className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4"
                          >
                            <Check className="w-12 h-12 text-green-600" />
                          </motion.div>
                          <h3 className="text-2xl font-bold mb-2 font-display">Ride Complete!</h3>
                          <p className="text-muted-foreground mb-4">Great job! You earned:</p>
                          <p className="text-4xl font-bold font-display text-green-600">
                            ₦{calculateEarnings(currentRide.fare, 20).driverEarnings.toLocaleString()}
                          </p>
                        </div>

                        <Button
                          size="lg"
                          className="w-full"
                          onClick={() => {
                            setCurrentRide(null);
                            setRideStep('arriving');
                          }}
                        >
                          Ready for Next Ride
                        </Button>
                      </Card>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'earnings' && (
            <motion.div
              key="earnings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto p-6"
            >
              <h2 className="text-2xl font-bold mb-6 font-display">Earnings</h2>

              {/* Earnings Overview */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <Card className="p-6 bg-gradient-to-br from-gold/10 to-gold/5 border-gold/20">
                  <Wallet className="w-8 h-8 text-gold mb-3" />
                  <p className="text-sm text-muted-foreground">Total Balance</p>
                  <p className="text-3xl font-bold font-display text-gold">
                    ₦{totalEarnings.toLocaleString()}
                  </p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <Clock className="w-8 h-8 text-primary mb-3" />
                  <p className="text-sm text-muted-foreground">Today's Earnings</p>
                  <p className="text-3xl font-bold font-display text-primary">
                    ₦{todayEarnings.toLocaleString()}
                  </p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <History className="w-8 h-8 text-blue-600 mb-3" />
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-3xl font-bold font-display text-blue-600">
                    ₦{(totalEarnings * 0.4).toLocaleString()}
                  </p>
                </Card>
              </div>

              {/* Payout Schedule */}
              <Card className="p-6 mb-8">
                <h3 className="text-lg font-bold mb-4 font-display">Payout Schedule</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600" />
                      <span>Monday Payout</span>
                    </div>
                    <span className="font-semibold text-green-600">Completed</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span>Wednesday Payout</span>
                    </div>
                    <span className="font-semibold text-blue-600">In 2 days</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <span>Friday Payout</span>
                    </div>
                    <span className="font-semibold text-gray-600">In 4 days</span>
                  </div>
                </div>
              </Card>

              {/* Transaction History */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 font-display">Transaction History</h3>
                <div className="space-y-3">
                  {earnings.slice(0, 10).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-white/50 rounded-lg border"
                    >
                      <div>
                        <p className="font-semibold">Ride Earnings</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString('en-NG', { 
                          month: 'short', day: 'numeric', year: 'numeric' 
                        })}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        +₦{transaction.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {view === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto p-6"
            >
              <h2 className="text-2xl font-bold mb-6 font-display">Driver Profile</h2>

              <Card className="p-8 mb-6">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-4xl text-white">
                    {driver?.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold font-display">{driver?.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="w-5 h-5 text-gold fill-current" />
                      <span className="font-semibold">4.9</span>
                      <span className="text-muted-foreground">(1,247 rides)</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-sm font-semibold",
                        driver?.tier === 'premium' 
                          ? 'bg-gold text-navy' 
                          : 'bg-primary text-white'
                      )}>
                        {driver?.tier === 'premium' ? '⭐ Premium Driver' : 'Standard'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                        Online
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Vehicle Type</p>
                    <p className="font-semibold capitalize">{driver?.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Vehicle Color</p>
                    <p className="font-semibold">{driver?.vehicleColor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">License Plate</p>
                    <p className="font-semibold">{driver?.vehiclePlate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="font-semibold">{driver?.phone}</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3">Documents</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span>Driver's License</span>
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span>Vehicle Insurance</span>
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span>Vehicle Registration</span>
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-gold/10 to-gold/5 border-gold/20">
                <h3 className="font-semibold mb-2">Want to upgrade to Premium?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Premium drivers earn 20% more and get priority access to high-value rides.
                </p>
                <Button className="w-full">
                  Learn More
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* PIN Modal */}
      <AnimatePresence>
        {showPINModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPINModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="p-8 w-full max-w-md">
                <PINEntry
                  onPINComplete={handlePickupPIN}
                  correctPIN={currentRide?.pin}
                  onCancel={() => setShowPINModal(false)}
                  title="Enter Rider PIN"
                  description="Enter the 4-digit PIN provided by your rider to confirm pickup"
                />
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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