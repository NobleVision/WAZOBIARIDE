/**
 * VideoBackground Component
 * Displays random b-roll videos with smooth transitions
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useVideoTransition } from './useVideoTransition';
import {
  getVideoUrl,
  getTransitionVariants,
  getTransitionTiming,
  type TransitionEffect,
} from './videoUtils';
import { cn } from '@/lib/utils';

interface VideoBackgroundProps {
  /**
   * Opacity of the gradient overlay (0-1)
   * @default 0.7
   */
  overlayOpacity?: number;
  
  /**
   * Whether to show the adire pattern overlay
   * @default true
   */
  showAdirePattern?: boolean;
  
  /**
   * Whether to show the gradient overlay
   * @default true
   */
  showGradient?: boolean;
  
  /**
   * Transition interval in milliseconds
   * If not provided, uses random interval between 8000-10000ms
   */
  transitionInterval?: number;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Fallback image to show if videos fail to load
   */
  fallbackImage?: string;
  
  /**
   * Whether the video background is enabled
   * @default true
   */
  enabled?: boolean;
}

export function VideoBackground({
  overlayOpacity = 0.7,
  showAdirePattern = true,
  showGradient = true,
  transitionInterval,
  className,
  fallbackImage = '/images/hero-lagos-ride.png',
  enabled = true,
}: VideoBackgroundProps) {
  const {
    currentVideo,
    nextVideo,
    transitionEffect,
    isTransitioning,
    hasError,
    handleTransitionComplete,
    handleError,
  } = useVideoTransition({ enabled, interval: transitionInterval });
  
  const [showFallback, setShowFallback] = useState(false);
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  
  // Handle video error
  useEffect(() => {
    if (hasError) {
      setShowFallback(true);
    }
  }, [hasError]);
  
  // Play current video when it changes
  useEffect(() => {
    if (currentVideoRef.current && enabled && !showFallback) {
      currentVideoRef.current.play().catch(() => {
        // Auto-play was prevented, show fallback
        setShowFallback(true);
      });
    }
  }, [currentVideo, enabled, showFallback]);
  
  // Play next video when transition starts
  useEffect(() => {
    if (nextVideoRef.current && nextVideo && isTransitioning && !showFallback) {
      nextVideoRef.current.play().catch(() => {
        // Auto-play was prevented
        handleError();
      });
    }
  }, [nextVideo, isTransitioning, handleError, showFallback]);
  
  // Handle transition animation completion
  const handleAnimationComplete = () => {
    handleTransitionComplete();
  };
  
  // Get transition variants and timing
  const variants = getTransitionVariants(transitionEffect);
  const timing = getTransitionTiming(transitionEffect);
  
  // Fallback image component
  if (showFallback) {
    return (
      <div className={cn('absolute inset-0', className)}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${fallbackImage}')` }}
        />
        {showGradient && (
          <div
            className="absolute inset-0 gradient-hero"
            style={{ opacity: overlayOpacity }}
          />
        )}
        {showAdirePattern && (
          <div className="absolute inset-0 adire-pattern opacity-30" />
        )}
      </div>
    );
  }
  
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      {/* Current Video */}
      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.video
            key={`current-${currentVideo}`}
            ref={currentVideoRef}
            src={getVideoUrl(currentVideo)}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            transition={timing.center}
            onError={handleError}
          />
        )}
      </AnimatePresence>
      
      {/* Next Video (for crossfade transition) */}
      <AnimatePresence>
        {isTransitioning && nextVideo && (
          <motion.video
            key={`next-${nextVideo}`}
            ref={nextVideoRef}
            src={getVideoUrl(nextVideo)}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            initial="enter"
            animate="center"
            variants={variants}
            transition={timing.enter}
            onAnimationComplete={handleAnimationComplete}
            onError={handleError}
          />
        )}
      </AnimatePresence>
      
      {/* Gradient Overlay */}
      {showGradient && (
        <div
          className="absolute inset-0 gradient-hero"
          style={{ opacity: overlayOpacity }}
        />
      )}
      
      {/* Adire Pattern Overlay */}
      {showAdirePattern && (
        <div className="absolute inset-0 adire-pattern opacity-30" />
      )}
    </div>
  );
}
