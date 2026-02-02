/**
 * WaZoBiaRide - Tier Selector Component
 * 
 * Standard vs Premium tier selection with pricing
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Car, Gem, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type Tier = 'standard' | 'premium';

interface TierSelectorProps {
  selectedTier: Tier;
  onTierChange: (tier: Tier) => void;
  basePrice: number;
  serviceType: 'car' | 'okada' | 'share';
}

interface TierOption {
  value: Tier;
  label: string;
  icon: React.ReactNode;
  multiplier: number;
  features: string[];
  badge?: string;
}

const TIERS: Record<Tier, TierOption> = {
  standard: {
    value: 'standard',
    label: 'Standard',
    icon: <Car className="w-6 h-6" />,
    multiplier: 1,
    features: [
      'Sedan/Okada',
      'AC included',
      'GPS tracking',
      'Professional drivers'
    ],
    badge: 'Best Value'
  },
  premium: {
    value: 'premium',
    label: 'Premium',
    icon: <Gem className="w-6 h-6" />,
    multiplier: 1.5,
    features: [
      'SUV/Executive',
      'Luxury comfort',
      'Priority pickup',
      'Top-rated drivers',
      'Extra legroom'
    ],
    badge: 'Popular'
  }
};

export const TierSelector: React.FC<TierSelectorProps> = ({
  selectedTier,
  onTierChange,
  basePrice,
  serviceType
}) => {
  // Okada doesn't have premium tier
  if (serviceType === 'okada') {
    return null;
  }

  const calculatePrice = (tier: Tier): number => {
    return Math.round(basePrice * TIERS[tier].multiplier);
  };

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-semibold font-display">Select Service Tier</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(TIERS) as Tier[]).map((tier) => {
          const tierOption = TIERS[tier];
          const isSelected = selectedTier === tier;
          const price = calculatePrice(tier);
          const priceDiff = price - basePrice;

          return (
            <motion.div
              key={tier}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTierChange(tier)}
              className="cursor-pointer"
            >
              <Card
                className={cn(
                  'relative p-6 transition-all duration-300 border-2',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                    : 'border-border hover:border-primary/50'
                )}
              >
                {/* Badge */}
                {tierOption.badge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-3 right-4"
                  >
                    <span
                      className={cn(
                        'px-3 py-1 text-xs font-semibold rounded-full',
                        tier === 'premium'
                          ? 'bg-gold text-navy'
                          : 'bg-nigeria-green text-white'
                      )}
                    >
                      {tierOption.badge}
                    </span>
                  </motion.div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'p-3 rounded-xl',
                        tier === 'premium'
                          ? 'bg-gold/20 text-gold'
                          : 'bg-primary/20 text-primary'
                      )}
                    >
                      {tierOption.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg font-display">{tierOption.label}</h4>
                      {tier === 'premium' && (
                        <div className="flex items-center gap-1 text-gold">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-medium">Premium Experience</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-display">
                      ₦{price.toLocaleString()}
                    </span>
                  </div>
                  {tier === 'premium' && priceDiff > 0 && (
                    <p className="text-sm text-muted-foreground">
                      +₦{priceDiff.toLocaleString()} more
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {tierOption.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full flex items-center justify-center',
                          tier === 'premium'
                            ? 'bg-gold/20 text-gold'
                            : 'bg-primary/20 text-primary'
                        )}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none"
                    style={{
                      boxShadow: '0 0 0 4px rgba(0, 135, 81, 0.1)',
                    }}
                  />
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Commission Note for Demo */}
      <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Driver Commission</p>
            <p className="text-xs text-muted-foreground">
              {selectedTier === 'premium'
                ? '25% commission on Premium rides. Drivers earn 75% of fare.'
                : '20% commission on Standard rides. Drivers earn 80% of fare.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};