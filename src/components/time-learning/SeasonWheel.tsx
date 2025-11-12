import { useState } from 'react';
import { seasons, months, getTranslation, getSeasonById, getMonthById } from '@/lib/timeData';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import seasonWheelImg from '@/assets/season-wheel.png';

interface SeasonWheelProps {
  selectedSeason: string | null;
  onSeasonSelect: (seasonId: string) => void;
  onMonthSelect?: (monthId: number) => void;
  mode: 'season' | 'month';
  lang: string;
  isSpinning?: boolean;
  onSpinComplete?: () => void;
}

export default function SeasonWheel({ 
  selectedSeason, 
  onSeasonSelect,
  onMonthSelect,
  mode,
  lang,
  isSpinning = false,
  onSpinComplete
}: SeasonWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const handleSpin = () => {
    if (spinning) return;
    
    setSpinning(true);
    
    let targetAngle = 0;
    let resultMessage = '';
    
    if (mode === 'season') {
      // Random season selection
      const randomSeason = seasons[Math.floor(Math.random() * seasons.length)];
      
      // Season positions on the wheel (based on the image)
      // Looking at the wheel image: Spring(right)=0°, Summer(bottom)=90°, Autumn(left)=180°, Winter(top)=270°
      const seasonRotations: Record<string, number> = {
        'spring': 0,
        'summer': 90,
        'autumn': 180,
        'winter': 270
      };
      
      targetAngle = seasonRotations[randomSeason.id] || 0;
      resultMessage = `${randomSeason.t[lang] || randomSeason.t.ro}!`;
      
      // Calculate final rotation
      const spins = 3 + Math.random() * 2; // 3-5 full rotations
      const targetRotation = rotation + (360 * spins) + targetAngle;
      
      animateWheel(targetRotation, () => {
        onSeasonSelect(randomSeason.id);
        toast.success(resultMessage);
      });
      
    } else {
      // Random month selection
      const randomMonth = months[Math.floor(Math.random() * months.length)];
      
      // 12 months = 30 degrees each
      // Month positions: Ianuarie=0°, Februarie=30°, etc.
      // But we need to adjust based on where months are on the wheel
      // Looking at the image, months are arranged clockwise starting from top-right
      const monthAngle = ((randomMonth.id - 1) * 30) % 360;
      targetAngle = monthAngle;
      
      resultMessage = `${randomMonth.t[lang] || randomMonth.t.ro}!`;
      
      const spins = 3 + Math.random() * 2;
      const targetRotation = rotation + (360 * spins) + targetAngle;
      
      animateWheel(targetRotation, () => {
        if (onMonthSelect) {
          onMonthSelect(randomMonth.id);
        }
        toast.success(resultMessage);
      });
    }
  };
  
  const animateWheel = (targetRotation: number, onComplete: () => void) => {
    const duration = 3000;
    const startTime = Date.now();
    const startRotation = rotation;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + (targetRotation - startRotation) * easeOut;
      
      setRotation(currentRotation);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        setRotation(targetRotation % 360); // Normalize rotation
        onComplete();
        onSpinComplete?.();
      }
    };
    
    animate();
  };


  return (
    <div className="flex flex-col items-center gap-6">
      {/* Wheel container with pointer */}
      <div className="relative">
        {/* Pointer arrow at top */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-600 drop-shadow-lg" />
        </div>
        
        {/* Rotating wheel */}
        <div className="relative w-[500px] h-[500px]">
          <img 
            src={seasonWheelImg} 
            alt="Season Wheel"
            className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-300 ease-out"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center center'
            }}
          />
        </div>
      </div>

      {/* Spin button */}
      <Button 
        onClick={handleSpin}
        disabled={spinning}
        size="lg"
        className="gap-2 text-lg px-8 py-6"
      >
        <RefreshCw className={cn("h-6 w-6", spinning && "animate-spin")} />
        {getTranslation('ui', 'spin_wheel', lang)}
      </Button>
    </div>
  );
}
