/**
 * useVideoTransition Hook
 * Manages video background transitions with random video selection
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  selectRandomVideo,
  getTransitionEffect,
  getTransitionInterval,
  getVideoUrl,
  preloadVideo,
  type TransitionEffect,
} from './videoUtils';

interface UseVideoTransitionOptions {
  enabled?: boolean;
  interval?: number;
}

interface UseVideoTransitionReturn {
  currentVideo: string;
  nextVideo: string | null;
  transitionEffect: TransitionEffect;
  isTransitioning: boolean;
  hasError: boolean;
  nextTransition: () => void;
  handleTransitionComplete: () => void;
  handleError: () => void;
}

export function useVideoTransition(
  options: UseVideoTransitionOptions = {}
): UseVideoTransitionReturn {
  const { enabled = true, interval } = options;
  
  const [currentVideo, setCurrentVideo] = useState(() => selectRandomVideo());
  const [nextVideo, setNextVideo] = useState<string | null>(null);
  const [transitionEffect, setTransitionEffect] = useState<TransitionEffect>(() => getTransitionEffect());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const intervalRef = useRef<number | null>(null);
  const preloadTimeoutRef = useRef<number | null>(null);
  const playedVideosRef = useRef<Set<string>>(new Set([currentVideo]));
  
  /**
   * Transition to the next video
   */
  const nextTransition = useCallback(() => {
    if (!enabled) return;
    
    setIsTransitioning(true);
    
    // Select a new random video that hasn't been played recently
    const playedArray = Array.from(playedVideosRef.current);
    const newVideo = selectRandomVideo(playedArray.slice(-10)); // Avoid last 10 played
    
    // Update played videos history
    playedVideosRef.current.add(newVideo);
    if (playedVideosRef.current.size > 20) {
      // Keep only last 20 videos in history to avoid memory issues
      const oldest = Array.from(playedVideosRef.current)[0];
      playedVideosRef.current.delete(oldest);
    }
    
    setNextVideo(newVideo);
    setTransitionEffect(getTransitionEffect());
  }, [enabled]);
  
  /**
   * Handle transition completion
   */
  const handleTransitionComplete = useCallback(() => {
    if (nextVideo) {
      setCurrentVideo(nextVideo);
      setNextVideo(null);
      setIsTransitioning(false);
      setHasError(false);
    }
  }, [nextVideo]);
  
  /**
   * Handle video error
   */
  const handleError = useCallback(() => {
    setHasError(true);
    setIsTransitioning(false);
    setNextVideo(null);
  }, []);
  
  /**
   * Preload next video before transition
   */
  useEffect(() => {
    if (!enabled || isTransitioning) return;
    
    const transitionInterval = interval || getTransitionInterval();
    
    // Schedule next transition
    intervalRef.current = window.setTimeout(() => {
      // Preload next video before triggering transition
      const nextVid = selectRandomVideo(Array.from(playedVideosRef.current).slice(-10));
      preloadVideo(getVideoUrl(nextVid))
        .then(() => {
          nextTransition();
        })
        .catch(() => {
          // If preloading fails, still transition (will handle error in component)
          nextTransition();
        });
    }, transitionInterval);
    
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [enabled, isTransitioning, interval, nextTransition]);
  
  /**
   * Clean up on unmount
   */
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    currentVideo,
    nextVideo,
    transitionEffect,
    isTransitioning,
    hasError,
    nextTransition,
    handleTransitionComplete,
    handleError,
  };
}
