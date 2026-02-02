/**
 * WaZoBiaRide - Ride Timer Component
 * 
 * Countdown timer for driver ride acceptance (5-10 seconds)
 * Critical differentiator: Sequential dispatch with timeout
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RideTimerProps {
  duration: number; // in seconds (5-10)
  onAccept: () => void;
  onDecline: () => void;
  onTimeout: () => void;
  earnings: number;
  commissionRate: number;
  rideDetails: {
    pickup: string;
    dropoff: string;
    distance: string;
    time: string;
    serviceType: 'car' | 'okada' | 'share';
    tier: 'standard' | 'premium';
  };
  isDispatching?: boolean;
  dispatchAttempt?: number;
  totalDispatches?: number;
}

export const RideTimer: React.FC<RideTimerProps> = ({
  duration,
  onAccept,
  onDecline,
  onTimeout,
  earnings,
  commissionRate,
  rideDetails,
  isDispatching = false,
  dispatchAttempt = 1,
  totalDispatches = 5
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(100);
  const [status, setStatus] = useState<'active' | 'accepted' | 'declined' | 'timeout'>('active');

  useEffect(() => {
    if (status !== 'active') return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 0.1;
        const newProgress = (newTime / duration) * 100;
        
        setProgress(newProgress);
        
        if (newTime <= 0) {
          setStatus('timeout');
          setTimeout(() => onTimeout(), 500);
          return 0;
        }
        
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [status, duration, onTimeout]);

  const handleAccept = useCallback(() => {
    setStatus('accepted');
    setTimeout(() => onAccept(), 300);
  }, [onAccept]);

  const handleDecline = useCallback(() => {
    setStatus('declined');
    setTimeout(() => onDecline(), 300);
  }, [onDecline]);

  const getStatusColor = () => {
    switch (status) {
      case 'accepted':
        return 'stroke-green-500';
      case 'declined':
        return 'stroke-red-500';
      case 'timeout':
        return 'stroke-gray-400';
      default:
        return progress < 30 ? 'stroke-red-500' : progress < 60 ? 'stroke-gold' : 'stroke-primary';
    }
  };

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className={cn(
        "relative bg-card rounded-2xl shadow-2xl border-2 overflow-hidden",
        status === 'accepted' ? 'border-green-500' :
        status === 'declined' ? 'border-red-500' :
        status === 'timeout' ? 'border-gray-400' : 'border-primary'
      )}>
        {/* Progress Ring */}
        <div className="relative w-32 h-32 mx-auto pt-6">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="54"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted"
              opacity={0.2}
            />
            {/* Progress circle */}
            <motion.circle
              cx="64"
              cy="64"
              r="54"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className={getStatusColor()}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
                transition: 'stroke-dashoffset 0.1s linear'
              }}
            />
          </svg>
          
          {/* Timer Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {status === 'active' ? (
                <motion.div
                  key={Math.floor(timeLeft)}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl font-bold font-display"
                >
                  {Math.ceil(timeLeft)}
                </motion.div>
              ) : (
                <div className="text-4xl">
                  {status === 'accepted' && <Check className="w-12 h-12 text-green-500" />}
                  {status === 'declined' && <X className="w-12 h-12 text-red-500" />}
                  {status === 'timeout' && <Clock className="w-12 h-12 text-gray-400" />}
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                {status === 'active' ? 'seconds' : status}
              </div>
            </div>
          </div>
        </div>

        {/* Ride Details */}
        <div className="p-6 space-y-4">
          {/* Earnings - Key Differentiator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Your Earnings</p>
                <p className="text-3xl font-bold font-display text-primary">
                  ₦{earnings.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  after {commissionRate}% commission
                </p>
              </div>
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-4xl"
              >
                💰
              </motion.div>
            </div>
          </motion.div>

          {/* Pickup & Dropoff */}
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-3"
            >
              <div className="w-3 h-3 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Pickup</p>
                <p className="font-semibold">{rideDetails.pickup}</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start gap-3"
            >
              <div className="w-3 h-3 rounded-full bg-gold mt-2 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Dropoff</p>
                <p className="font-semibold">{rideDetails.dropoff}</p>
              </div>
            </motion.div>
          </div>

          {/* Trip Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-6 py-3 bg-muted/30 rounded-lg"
          >
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Distance</p>
              <p className="font-bold">{rideDetails.distance}</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Est. Time</p>
              <p className="font-bold">{rideDetails.time}</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Service</p>
              <p className="font-bold capitalize">{rideDetails.tier} {rideDetails.serviceType}</p>
            </div>
          </motion.div>

          {/* Dispatch Queue Info - Key Differentiator */}
          <AnimatePresence>
            {isDispatching && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-amber-50 border border-amber-200 rounded-lg"
              >
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-800 font-medium">
                    Sequential Dispatch: Driver {dispatchAttempt} of {totalDispatches}
                  </span>
                </div>
                <p className="text-xs text-amber-700 mt-1">
                  {dispatchAttempt === totalDispatches 
                    ? 'Final attempt - will timeout if declined'
                    : 'Next driver will receive request if you decline or timeout'}
                  </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          {status === 'active' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-3"
            >
              <Button
                onClick={handleDecline}
                variant="outline"
                className="flex-1 h-14 text-lg font-semibold"
                disabled={status !== 'active'}
              >
                <X className="w-5 h-5 mr-2" />
                Decline
              </Button>
              <Button
                onClick={handleAccept}
                className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                disabled={status !== 'active'}
              >
                <Check className="w-5 h-5 mr-2" />
                Accept
              </Button>
            </motion.div>
          )}

          {/* Status Message */}
          <AnimatePresence>
            {status !== 'active' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-2 font-medium"
              >
                {status === 'accepted' && (
                  <span className="text-green-600">Ride Accepted! 🎉</span>
                )}
                {status === 'declined' && (
                  <span className="text-red-600">Ride Declined</span>
                )}
                {status === 'timeout' && (
                  <span className="text-gray-600">Request Timed Out</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};