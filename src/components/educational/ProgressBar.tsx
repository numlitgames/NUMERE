import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
  showCelebration?: boolean;
  onComplete?: () => void;
}

export default function ProgressBar({ 
  current, 
  total = 10, 
  className,
  showCelebration = false,
  onComplete
}: ProgressBarProps) {
  const [showExplosion, setShowExplosion] = useState(false);

  useEffect(() => {
    if (current === total && !showExplosion) {
      setShowExplosion(true);
      const timer = setTimeout(() => {
        setShowExplosion(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [current, total, showExplosion, onComplete]);

  const steps = Array.from({ length: total }, (_, index) => {
    const isCompleted = index < current;
    const isActive = index === current - 1;
    
    return (
      <div
        key={index}
        className={cn(
          'w-4 h-3 rounded-sm border transition-all duration-500 relative',
          isCompleted 
            ? 'bg-green-500 border-green-500 scale-110 shadow-sm shadow-green-300/50' 
            : 'bg-gray-200 border-gray-300',
          isActive && 'animate-pulse ring-1 ring-green-400',
          showExplosion && isCompleted && 'animate-bounce scale-125'
        )}
      >
        {isCompleted && (
          <div className="absolute inset-0 bg-green-400 rounded-sm animate-pulse opacity-50" />
        )}
      </div>
    );
  });

  return (
    <div className={cn('flex gap-1 items-center justify-center', className)}>
      {steps}
      {showExplosion && (
        <div className="ml-2 flex items-center gap-1 animate-bounce">
          <span className="text-xl">🎉</span>
          <span className="text-xl">⭐</span>
          <span className="text-xl">🎊</span>
        </div>
      )}
    </div>
  );
}