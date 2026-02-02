/**
 * useBackgroundAudio Hook
 * Manages background audio playback with random track selection
 * Similar to Gogetter's BackgroundMusic implementation
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  shuffleArray,
  selectRandomAudio,
  getAudioUrl,
  formatTrackName,
  AUDIO_FILES,
} from './videoUtils';

const FADE_DURATION = 1000; // ms

interface UseBackgroundAudioOptions {
  enabled?: boolean;
  volume?: number;
  onTrackChange?: (trackName: string) => void;
}

interface UseBackgroundAudioReturn {
  isPlaying: boolean;
  isFading: boolean;
  currentTrackName: string;
  togglePlay: () => void;
  skipToNextTrack: () => void;
  setVolume: (volume: number) => void;
  audioElement: HTMLAudioElement | null;
  musicUrl: string;
}

export function useBackgroundAudio(
  options: UseBackgroundAudioOptions = {}
): UseBackgroundAudioReturn {
  const { enabled = true, volume = 0.1, onTrackChange } = options;

  // Create audio element lazily (only in browser)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playlist, setPlaylist] = useState<string[]>(() => shuffleArray(AUDIO_FILES));
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [pendingPlay, setPendingPlay] = useState(false);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use refs to avoid stale closure issues
  const playlistRef = useRef(playlist);
  const currentTrackIndexRef = useRef(currentTrackIndex);
  const volumeRef = useRef(volume);

  // Get current track URL
  const currentTrack = playlist[currentTrackIndex];
  const musicUrl = getAudioUrl(currentTrack);

  // Initialize audio element once on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.loop = false; // We handle track advancement manually
      audio.volume = volume;
      audioRef.current = audio;

      // Set initial source
      audio.src = getAudioUrl(playlist[0]);
    }

    return () => {
      // Cleanup on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // Attach track ended handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      // Advance to next track when current track finishes
      const currentIndex = currentTrackIndexRef.current;
      const currentPlaylist = playlistRef.current;
      const nextIndex = (currentIndex + 1) % currentPlaylist.length;

      if (nextIndex === 0) {
        // Reshuffle when playlist ends
        const newPlaylist = shuffleArray(AUDIO_FILES);
        setPlaylist(newPlaylist);
        playlistRef.current = newPlaylist;
      }

      setCurrentTrackIndex(nextIndex);
      currentTrackIndexRef.current = nextIndex;
    };

    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && musicUrl) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.src = musicUrl;

      // If it was playing, continue playing the new track
      if (wasPlaying && isPlaying) {
        audioRef.current.volume = volumeRef.current;
        audioRef.current.play().catch(() => {
          // Autoplay prevented
        });
      }
    }
  }, [musicUrl]);
  
  // Keep refs in sync with state
  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);
  
  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);
  
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);
  
  // Listen for user interaction to unlock autoplay
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserHasInteracted(true);
      // Remove listeners once user has interacted
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);
  
  // When user interacts and we have a pending play, start the music
  useEffect(() => {
    if (userHasInteracted && pendingPlay && enabled) {
      setPendingPlay(false);
      fadeIn();
    }
  }, [userHasInteracted, pendingPlay, enabled]);
  
  // Fade in function
  const fadeIn = useCallback(() => {
    if (!audioRef.current) return;
    
    setIsFading(true);
    audioRef.current.volume = 0;
    
    const playPromise = audioRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay was prevented - mark as pending and wait for user interaction
        setIsFading(false);
        setPendingPlay(true);
      });
    }
    
    const targetVolume = volumeRef.current;
    const steps = 20;
    const stepDuration = FADE_DURATION / steps;
    const volumeStep = targetVolume / steps;
    let currentStep = 0;
    
    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      if (audioRef.current) {
        audioRef.current.volume = Math.min(volumeStep * currentStep, targetVolume);
      }
      if (currentStep >= steps) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        setIsFading(false);
        setIsPlaying(true);
      }
    }, stepDuration);
  }, []);
  
  // Fade out function
  const fadeOut = useCallback(() => {
    if (!audioRef.current || !isPlaying) return;
    
    setIsFading(true);
    const startVolume = audioRef.current.volume;
    const steps = 20;
    const stepDuration = FADE_DURATION / steps;
    const volumeStep = startVolume / steps;
    let currentStep = 0;
    
    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      if (audioRef.current) {
        audioRef.current.volume = Math.max(startVolume - (volumeStep * currentStep), 0);
      }
      if (currentStep >= steps) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsFading(false);
        setIsPlaying(false);
      }
    }, stepDuration);
  }, [isPlaying]);

  // Skip track function - explicitly stops current and plays next
  const skipToNextTrack = useCallback(() => {
    if (!audioRef.current) return;
    
    // Stop current playback
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    
    // Calculate next track
    const currentIndex = currentTrackIndexRef.current;
    const currentPlaylist = playlistRef.current;
    const nextIndex = (currentIndex + 1) % currentPlaylist.length;
    
    if (nextIndex === 0) {
      // Reshuffle when playlist ends
      const newPlaylist = shuffleArray(AUDIO_FILES);
      setPlaylist(newPlaylist);
      playlistRef.current = newPlaylist;
    }
    
    setCurrentTrackIndex(nextIndex);
    currentTrackIndexRef.current = nextIndex;
    
    // The audio src will update due to state change, then we need to play
    // Use a small timeout to let React update the src first
    setTimeout(() => {
      if (audioRef.current && enabled && !isFading) {
        audioRef.current.volume = volumeRef.current;
        audioRef.current.play().catch(() => {
          // Autoplay prevented, will play on next user interaction
        });
      }
    }, 50);
  }, [enabled, isFading]);
  
  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      fadeOut();
    } else {
      fadeIn();
    }
  }, [isPlaying, fadeIn, fadeOut]);
  
  // Set volume
  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current && !isFading) {
      audioRef.current.volume = newVolume;
    }
  }, [isFading]);
  
  // Update volume when preference changes
  useEffect(() => {
    if (audioRef.current && !isFading) {
      audioRef.current.volume = volume;
    }
  }, [volume, isFading]);
  
  // Start/stop music based on enabled state
  useEffect(() => {
    if (enabled && !isPlaying && !isFading && userHasInteracted) {
      fadeIn();
    } else if ((!enabled) && isPlaying && !isFading) {
      fadeOut();
    }
  }, [enabled, isPlaying, isFading, fadeIn, fadeOut, userHasInteracted]);
  
  // Cleanup fade interval on unmount
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  // Update current track name (using derived values from top of hook)
  const currentTrackName = formatTrackName(currentTrack);

  useEffect(() => {
    if (onTrackChange) {
      onTrackChange(currentTrackName);
    }
  }, [currentTrackName, onTrackChange]);

  return {
    isPlaying,
    isFading,
    currentTrackName,
    togglePlay,
    skipToNextTrack,
    setVolume,
    audioElement: audioRef.current,
    musicUrl,
  };
}
