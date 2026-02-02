/**
 * WaZoBiaRide - Admin Dashboard
 * 
 * Administrative interface for monitoring, analytics, and management
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Users, Car, DollarSign, 
  AlertTriangle, MapPin, Clock, Menu, X,
  LogOut, TrendingUp, TrendingDown, Shield,
  CheckCircle, XCircle, Clock as ClockIcon
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapView, MapMarker } from '@/components/shared/MapView';
import { MOCK_DRIVERS, getOnlineDrivers } from '@/data/mock-drivers';
import { MOCK_RIDES } from '@/data/mock-rides';
import { MOCK_RIDERS } from '@/data/mock-riders';
import { MOCK_TRANSACTIONS } from '@/data/mock-transactions';
import { useAuth } from '@/auth/AuthContext';
import { cn } from '@/lib/utils';

type View = 'overview' | 'rides' | 'drivers' | 'riders' | 'analytics';
type TimeRange = 'today' | 'week' | 'month';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [view, setView] = useState<View>('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('today');
  const [showSidebar, setShowSidebar] = useState(false);

  // Statistics
  const onlineDrivers = getOnlineDrivers();
  const activeRides = MOCK_RIDES.filter(r => r.status === 'in-progress');
  const pendingRides = MOCK_RIDES.filter(r => r.status === 'driver-assigned');
  const completedRides = MOCK_RIDES.filter(r => r.status === 'completed');
  const totalRevenue = MOCK_TRANSACTIONS
    .filter(t => t.type === 'ride')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const stats = {
    totalDrivers: MOCK_DRIVERS.length,
    onlineDrivers: onlineDrivers.length,
    totalRiders: MOCK_RIDERS.length,
    activeRides: activeRides.length,
    pendingRides: pendingRides.length,
    completedRides: completedRides.length,
    totalRevenue,
    avgRating: 4.8,
    completionRate: 94.5
  };

  const renderSidebar = () => (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-y-0 right-0 w-72 bg-white shadow-2xl z-50 p-6"
    >
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold font-display">Admin Menu</h3>
        <Button variant="ghost" size="icon" onClick={() => setShowSidebar(false)}>
          <X className="w-6 h-6" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <Button
          variant={view === 'overview' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => { setView('overview'); setShowSidebar(false); }}
        >
          <BarChart3 className="w-5 h-5 mr-3" />
          Overview
        </Button>
        <Button
          variant={view === 'rides' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => { setView('rides'); setShowSidebar(false); }}
        >
          <Car className="w-5 h-5 mr-3" />
          Rides
        </Button>
        <Button
          variant={view === 'drivers' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => { setView('drivers'); setShowSidebar(false); }}
        >
          <Car className="w-5 h-5 mr-3" />
          Drivers
        </Button>
        <Button
          variant={view === 'riders' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => { setView('riders'); setShowSidebar(false); }}
        >
          <Users className="w-5 h-5 mr-3" />
          Riders
        </Button>
        <Button
          variant={view === 'analytics' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => { setView('analytics'); setShowSidebar(false); }}
        >
          <TrendingUp className="w-5 h-5 mr-3" />
          Analytics
        </Button>
        <div className="border-t pt-2 mt-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700"
            onClick={() => { logout(); setShowSidebar(false); }}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
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
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              Admin
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setShowSidebar(true)}>
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <AnimatePresence mode="wait">
          {view === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto"
            >
              <h2 className="text-2xl font-bold mb-6 font-display">Overview</h2>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <Car className="w-8 h-8 text-primary mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">Active Rides</p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-bold font-display text-primary">
                      {stats.activeRides}
                    </p>
                    <div className="flex items-center text-green-600 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +12%
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-gold/10 to-gold/5 border-gold/20">
                  <Users className="w-8 h-8 text-gold mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">Online Drivers</p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-bold font-display text-gold">
                      {stats.onlineDrivers}/{stats.totalDrivers}
                    </p>
                    <div className="flex items-center text-green-600 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +8%
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <DollarSign className="w-8 h-8 text-green-600 mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-bold font-display text-green-600">
                      ₦{(stats.totalRevenue / 1000000).toFixed(1)}M
                    </p>
                    <div className="flex items-center text-green-600 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +15%
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <Users className="w-8 h-8 text-blue-600 mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">Total Riders</p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-bold font-display text-blue-600">
                      {stats.totalRiders}
                    </p>
                    <div className="flex items-center text-green-600 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +22%
                    </div>
                  </div>
                </Card>
              </div>

              {/* Live Map */}
              <Card className="p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold font-display">Live Activity</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm">Online</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-sm">Active Ride</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-[400px]">
                  <MapView
                    markers={[
                      ...onlineDrivers.map(driver => ({
                        id: driver.id,
                        lat: driver.currentLocation.lat,
                        lng: driver.currentLocation.lng,
                        type: 'driver' as const,
                        label: driver.name,
                        tier: driver.tier
                      })),
                      ...activeRides.slice(0, 5).map(ride => ({
                        id: ride.id,
                        lat: ride.pickup.lat,
                        lng: ride.pickup.lng,
                        type: 'pickup' as const,
                        label: `Active Ride: ${ride.pickup.name}`
                      }))
                    ]}
                    showRoute={true}
                  />
                </div>
              </Card>

              {/* Recent Activity */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4 font-display">Recent Rides</h3>
                  <div className="space-y-3">
                    {MOCK_RIDES.slice(0, 5).map(ride => (
                      <div key={ride.id} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          ride.status === 'completed' ? 'bg-green-100' :
                          ride.status === 'in-progress' ? 'bg-primary/10' :
                          'bg-gray-100'
                        )}>
                          {ride.status === 'completed' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                           ride.status === 'in-progress' ? <ClockIcon className="w-5 h-5 text-primary" /> :
                           <AlertTriangle className="w-5 h-5 text-gray-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{ride.pickup.name} → {ride.dropoff.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(ride.createdAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <span className="font-bold text-primary">₦{ride.fare.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4 font-display">Safety Alerts</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Delayed Pickup</p>
                        <p className="text-xs text-muted-foreground">Driver 004 - 10 min delay</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <Shield className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Safety Report</p>
                        <p className="text-xs text-muted-foreground">Route deviation detected - Ride 008</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Driver Verified</p>
                        <p className="text-xs text-muted-foreground">Driver 006 - Documents approved</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {view === 'drivers' && (
            <motion.div
              key="drivers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto"
            >
              <h2 className="text-2xl font-bold mb-6 font-display">Driver Management</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_DRIVERS.map(driver => (
                  <Card key={driver.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                          {driver.avatar}
                        </div>
                        <div>
                          <h3 className="font-bold">{driver.name}</h3>
                          <p className="text-sm text-muted-foreground">{driver.vehicleColor} {driver.vehicleType}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-semibold",
                        driver.tier === 'premium' ? 'bg-gold text-navy' : 'bg-slate-100 text-slate-700'
                      )}>
                        {driver.tier === 'premium' ? 'Premium' : 'Standard'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <span className={cn(
                          "font-semibold",
                          (driver as any).isOnline ? 'text-green-600' : 'text-gray-600'
                        )}>
                          {(driver as any).isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rating</span>
                        <span className="font-semibold">4.8</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Rides</span>
                        <span className="font-semibold">{Math.floor(Math.random() * 500) + 100}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        {(driver as any).isOnline ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'riders' && (
            <motion.div
              key="riders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto"
            >
              <h2 className="text-2xl font-bold mb-6 font-display">Rider Management</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_RIDERS.slice(0, 6).map(rider => (
                  <Card key={rider.id} className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-2xl">
                        {rider.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold">{rider.name}</h3>
                        <p className="text-sm text-muted-foreground">{rider.phone}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Rides</span>
                        <span className="font-semibold">{Math.floor(Math.random() * 100) + 20}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rating</span>
                        <span className="font-semibold">4.9</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Joined</span>
                        <span className="font-semibold">{new Date((rider as any).createdAt || '2024-01-01').toLocaleDateString()}</span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      View Activity
                    </Button>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-display">Analytics</h2>
                <div className="flex gap-2">
                  {(['today', 'week', 'month'] as TimeRange[]).map(range => (
                    <Button
                      key={range}
                      variant={timeRange === range ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeRange(range)}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Revenue Chart */}
              <Card className="p-6 mb-8">
                <h3 className="text-lg font-bold mb-6 font-display">Revenue Trends</h3>
                <div className="h-64 flex items-end justify-between gap-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                    const height = Math.random() * 60 + 20;
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full text-center text-sm font-semibold">
                          ₦{(height * 1000).toLocaleString()}
                        </div>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg relative group cursor-pointer"
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            ₦{(height * 1000).toLocaleString()}
                          </div>
                        </motion.div>
                        <span className="text-sm text-muted-foreground">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Metrics Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Ride Completion Rate</h4>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-4xl font-bold font-display text-green-600">
                    {stats.completionRate}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    +2.3% from last {timeRange}
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Average Trip Time</h4>
                    <ClockIcon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-4xl font-bold font-display text-primary">
                    18 min
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    -1.2 min from last {timeRange}
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Driver Retention</h4>
                    <TrendingUp className="w-5 h-5 text-gold" />
                  </div>
                  <p className="text-4xl font-bold font-display text-gold">
                    87%
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    +5.1% from last {timeRange}
                  </p>
                </Card>
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