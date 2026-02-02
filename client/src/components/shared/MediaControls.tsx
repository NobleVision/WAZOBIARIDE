/**
 * MediaControls Component
 * Provides audio controls for VideoBackground
 * Similar to Gogetter's MediaControls implementation
 */

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Volume2,
  VolumeX,
  Music,
  Music2,
  SkipForward,
} from 'lucide-react';

interface MediaControlsProps {
  /** Show volume slider in a popover */
  showVolumeSlider?: boolean;
  /** Compact mode for mobile */
  compact?: boolean;
  /** Custom className */
  className?: string;
  /** Whether audio is playing */
  isPlaying?: boolean;
  /** Toggle audio play/pause */
  onTogglePlay?: () => void;
  /** Skip to next track */
  onSkipTrack?: () => void;
  /** Audio volume */
  volume?: number;
  /** Set audio volume */
  onSetVolume?: (volume: number) => void;
  /** Current track name */
  currentTrackName?: string;
}

export default function MediaControls({
  showVolumeSlider = true,
  compact = false,
  className = '',
  isPlaying = false,
  onTogglePlay,
  onSkipTrack,
  volume = 0.1,
  onSetVolume,
  currentTrackName = '',
}: MediaControlsProps) {
  const buttonSize = compact ? 'sm' : 'default';
  const iconSize = compact ? 'h-4 w-4' : 'h-5 w-5';
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Audio Toggle with Volume Control */}
      {showVolumeSlider ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={buttonSize}
              className={`${
                isPlaying 
                  ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10' 
                  : 'text-muted-foreground hover:text-white hover:bg-slate-800'
              }`}
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
              onClick={onTogglePlay}
            >
              {isPlaying ? (
                <Music2 className={iconSize} />
              ) : (
                <Music className={iconSize} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{isPlaying ? 'Pause Background Music' : 'Play Background Music'}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={buttonSize}
              className={`${
                isPlaying 
                  ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10' 
                  : 'text-muted-foreground hover:text-white hover:bg-slate-800'
              }`}
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
              onClick={onTogglePlay}
            >
              {isPlaying ? (
                <Music2 className={iconSize} />
              ) : (
                <Music className={iconSize} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{isPlaying ? 'Pause Background Music' : 'Play Background Music'}</p>
          </TooltipContent>
        </Tooltip>
      )}
      
      {/* Skip Track Button */}
      {onSkipTrack && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={buttonSize}
              className="text-muted-foreground hover:text-white hover:bg-slate-800"
              aria-label="Skip to next track"
              onClick={onSkipTrack}
            >
              <SkipForward className={iconSize} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Skip Track</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
