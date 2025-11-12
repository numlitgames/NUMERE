import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameControlsProps {
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onRepeat?: () => void;
  onShuffle?: () => void;
  className?: string;
}

export default function GameControls({
  isPlaying = false,
  onPlay,
  onPause,
  onRepeat,
  onShuffle,
  className
}: GameControlsProps) {
  return (
    <div className={cn('flex gap-2', className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={onRepeat}
        className="hover:bg-accent transition-all duration-200 hover:scale-105"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      
      <Button
        variant="default"
        size="icon"
        onClick={isPlaying ? onPause : onPlay}
        className="bg-green-500 hover:bg-green-600 transition-all duration-200 hover:scale-105"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onShuffle}
        className="hover:bg-accent transition-all duration-200 hover:scale-105"
      >
        <Shuffle className="h-4 w-4" />
      </Button>
    </div>
  );
}