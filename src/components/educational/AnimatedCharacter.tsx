import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface AnimatedCharacterProps {
  position: number;           // 0-3 for 4 units (m, dm, cm, mm)
  direction: 'up' | 'down';   
  isAnimating: boolean;       
  onAnimationEnd: () => void; 
  totalSteps: number;         // Total number of units
}

export default function AnimatedCharacter({ 
  position, 
  direction, 
  isAnimating,
  onAnimationEnd,
  totalSteps = 4
}: AnimatedCharacterProps) {
  const [localPosition, setLocalPosition] = useState(position);

  useEffect(() => {
    if (isAnimating) {
      // Start animation
      const timeout = setTimeout(() => {
        setLocalPosition(position);
        onAnimationEnd();
      }, 600);
      
      return () => clearTimeout(timeout);
    } else {
      setLocalPosition(position);
    }
  }, [position, isAnimating, onAnimationEnd]);

  // Calculate position between ladders (140px per step: 100px ladder + 40px arrow)
  const stepHeight = 140;
  const topOffset = 80; // Offset pentru primul label și scară
  const topPosition = topOffset + (localPosition * stepHeight);

  return (
    <div 
      className={cn(
        "absolute w-16 h-16 transition-all duration-600 ease-in-out z-30",
        isAnimating && direction === 'down' && "animate-bounce",
        isAnimating && direction === 'up' && "animate-pulse"
      )}
      style={{
        top: `${topPosition}px`,
        right: '40px',
        transform: `translateY(-50%)`
      }}
    >
      <img 
        src="/images/characters/climber-character.svg" 
        alt="Character"
        className={cn(
          "w-full h-full drop-shadow-lg",
          isAnimating && "scale-110"
        )}
      />
    </div>
  );
}
