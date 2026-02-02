/**
 * WaZoBiaRide - Login Page
 * 
 * Demo authentication for rider, driver, and admin accounts
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, User, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { VideoBackground } from '@/components/shared/VideoBackground';
import { useAuth } from '@/auth/AuthContext';
import { DEMO_ACCOUNTS } from '@/auth/demo-accounts';
import { cn } from '@/lib/utils';
import { useLocation } from 'wouter';

type UserRole = 'rider' | 'driver' | 'admin';

export const Login: React.FC = () => {
  const { login, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<UserRole>('rider');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDemoHint, setShowDemoHint] = useState(false);

  // Redirect to appropriate dashboard after successful login
  useEffect(() => {
    if (user) {
      const dashboardPath = `/${user.role}`;
      setLocation(dashboardPath);
    }
  }, [user, setLocation]);

  const handleQuickLogin = (role: UserRole) => {
    const account = DEMO_ACCOUNTS.find(acc => acc.role === role);
    if (account) {
      setEmail(account.email);
      setPassword(account.password);
      setSelectedRole(role);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);

    if (!success) {
      setError('Invalid credentials. Please use demo accounts.');
    }
  };

  const roles: Array<{
    value: UserRole;
    label: string;
    icon: React.ReactNode;
    color: string;
    description: string;
  }> = [
    {
      value: 'rider',
      label: 'Rider',
      icon: <User className="w-6 h-6" />,
      color: 'from-primary to-primary/80',
      description: 'Book rides and track trips'
    },
    {
      value: 'driver',
      label: 'Driver',
      icon: <Car className="w-6 h-6" />,
      color: 'from-gold to-gold/80',
      description: 'Accept rides and earn money'
    },
    {
      value: 'admin',
      label: 'Admin',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      description: 'Manage platform operations'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl mx-auto relative z-10"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Hero */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:block relative"
          >
            {/* Video Background */}
            <div className="absolute inset-0 -m-8 rounded-2xl overflow-hidden">
              <VideoBackground
                showGradient={false}
                showAdirePattern={false}
                overlayOpacity={0.5}
                fallbackImage="/images/lagos-skyline.png"
              />
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-6 font-display">
                <span className="text-primary">Wa</span>
                <span className="text-gold">Zo</span>
                <span className="text-primary">Bia</span>
                <span className="text-gold">Ride</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Nigeria's first ride-hailing platform built for unity, safety, and fair earnings. Experience the future of transportation.
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: <Shield className="w-5 h-5 text-primary" />, text: 'PIN verification for safety' },
                  { icon: <Car className="w-5 h-5 text-gold" />, text: 'Transparent driver earnings' },
                  { icon: <User className="w-5 h-5 text-blue-500" />, text: 'Sequential dispatch system' }
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="p-2 bg-white rounded-lg shadow-sm">{feature.icon}</div>
                    <span className="font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">
                  👆 Click on a demo account below for quick access
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 shadow-2xl border-2">
              <h2 className="text-2xl font-bold mb-6 font-display">Sign In</h2>

              {/* Role Selection */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {roles.map((role) => (
                  <motion.button
                    key={role.value}
                    onClick={() => handleQuickLogin(role.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'relative p-4 rounded-xl border-2 transition-all duration-200',
                      selectedRole === role.value
                        ? 'border-primary bg-gradient-to-br ' + role.color + ' text-white shadow-lg'
                        : 'border-border bg-white hover:border-primary/50'
                    )}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={selectedRole === role.value ? 'text-white' : 'text-muted-foreground'}>
                        {role.icon}
                      </div>
                      <span className="text-sm font-semibold">{role.label}</span>
                    </div>
                    
                    {/* Demo Badge */}
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                      Demo
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Demo Account Info */}
              <AnimatePresence>
                {selectedRole && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 bg-muted/50 rounded-lg border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">Demo Account Pre-filled</p>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p><span className="font-mono bg-white px-2 py-0.5 rounded">{email}</span></p>
                          <p>Password: <span className="font-mono">••••••••</span></p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="mt-1.5"
                  />
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>Investor Demo Application</p>
                <p className="text-xs mt-1">No real authentication required</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};