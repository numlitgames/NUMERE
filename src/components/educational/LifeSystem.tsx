import React from 'react';
import { Heart } from 'lucide-react';
import { cn } from "@/lib/utils";

interface LifeSystemProps {
  totalLives: number;
  currentLives: number;
  className?: string;
}

export default function LifeSystem({ totalLives, currentLives, className }: LifeSystemProps) {
  const hearts = Array.from({ length: totalLives }, (_, index) => {
    const isActive = index < currentLives;
    
    return (
      <Heart
        key={index}
        className={cn(
          'w-8 h-8 transition-all duration-300',
          isActive 
            ? 'text-life-full fill-life-full scale-100' 
            : 'text-life-empty fill-life-empty scale-75 opacity-50'
        )}
      />
    );
  });

  return (
    <div className={cn('flex gap-1', className)}>
      {hearts}
    </div>
  );
}