/**
 * WaZoBiaRide - PIN Entry Component
 * 
 * 4-digit PIN verification for ride pickup safety
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle2, XCircle, Shield } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface PINEntryProps {
  onPINComplete: (pin: string) => void;
  correctPIN?: string;
  onCancel?: () => void;
  title?: string;
  description?: string;
  maxAttempts?: number;
}

export const PINEntry: React.FC<PINEntryProps> = ({
  onPINComplete,
  correctPIN,
  onCancel,
  title = 'Enter PIN',
  description = 'Enter the 4-digit PIN shared by your driver',
  maxAttempts = 3
}) => {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handlePINChange = (value: string) => {
    if (status !== 'idle') return;
    setPin(value);

    if (value.length === 4) {
      // Verify PIN if provided
      if (correctPIN) {
        if (value === correctPIN) {
          setStatus('success');
          setTimeout(() => onPINComplete(value), 500);
        } else {
          handleIncorrectPIN();
        }
      } else {
        // No verification needed, just submit
        setStatus('success');
        setTimeout(() => onPINComplete(value), 500);
      }
    }
  };

  const handleIncorrectPIN = () => {
    setAttempts(prev => prev + 1);
    setStatus('error');
    setShake(true);

    setTimeout(() => {
      setShake(false);
      if (attempts + 1 >= maxAttempts) {
        onCancel?.();
      } else {
        setStatus('idle');
        setPin('');
      }
    }, 1000);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-8 h-8 text-green-500" />;
      case 'error':
        return <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Shield className="w-8 h-8 text-primary animate-pulse" />;
    }
  };

  const remainingAttempts = maxAttempts - attempts;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto p-8"
    >
      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
          className="mx-auto mb-6 flex justify-center"
        >
          {getStatusIcon()}
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-2 font-display"
        >
          {title}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-8"
        >
          {description}
        </motion.p>

        {/* PIN Input */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mb-6"
        >
          <InputOTP
            value={pin}
            onChange={handlePINChange}
            maxLength={4}
            disabled={status !== 'idle'}
            className="gap-3"
          >
            <InputOTPGroup>
              {[0, 1, 2, 3].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className={`w-16 h-16 text-2xl font-bold text-center transition-all duration-200 ${
                    status === 'error' ? 'border-red-500 bg-red-50' :
                    status === 'success' ? 'border-green-500 bg-green-50' :
                    'border-primary/50 hover:border-primary'
                  }`}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="flex items-center justify-center gap-2 text-red-500">
                <XCircle className="w-4 h-4" />
                <span className="text-sm">
                  Incorrect PIN. {remainingAttempts} {remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attempts Indicator */}
        <AnimatePresence>
          {status === 'idle' && attempts > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center gap-2 mb-6"
            >
              {[...Array(maxAttempts)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i < attempts ? 'bg-red-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cancel Button */}
        <AnimatePresence>
          {onCancel && status === 'idle' && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCancel}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </motion.button>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-600 font-medium"
            >
              PIN Verified! ✓
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <Lock className="w-3 h-3" />
          <span>Secure PIN verification powered by WaZoBiaRide</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};