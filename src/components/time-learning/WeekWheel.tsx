import { useState, useRef, useEffect } from 'react';
import { getDayOfWeekName } from '@/lib/timeData';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface WeekWheelProps {
  selectedDay?: string | null;
  onDaySelect?: (day: string) => void;
  onSpinComplete?: (day: string) => void;
  lang: string;
  isInteractive?: boolean;
}

const WEEKDAYS = [
  { id: 'monday', color: '#ef4444' },    // Red
  { id: 'tuesday', color: '#f97316' },   // Orange
  { id: 'wednesday', color: '#eab308' }, // Yellow
  { id: 'thursday', color: '#22c55e' },  // Green
  { id: 'friday', color: '#3b82f6' },    // Blue
  { id: 'saturday', color: '#6366f1' },  // Indigo
  { id: 'sunday', color: '#a855f7' }     // Violet
];

export default function WeekWheel({ selectedDay, onDaySelect, onSpinComplete, lang, isInteractive = true }: WeekWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const sectorAngle = (2 * Math.PI) / WEEKDAYS.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((currentRotation * Math.PI) / 180);

    WEEKDAYS.forEach((day, index) => {
      const startAngle = index * sectorAngle - Math.PI / 2;
      const endAngle = startAngle + sectorAngle;

      // Draw sector
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = day.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    ctx.restore();

    // Draw text without rotation (after restoring context)
    WEEKDAYS.forEach((day, index) => {
      const angle = (index * sectorAngle) + (sectorAngle / 2) - Math.PI / 2 + (currentRotation * Math.PI) / 180;
      const textRadius = radius * 0.65;
      const x = centerX + Math.cos(angle) * textRadius;
      const y = centerY + Math.sin(angle) * textRadius;

      ctx.save();
      ctx.translate(x, y);
      
      // Rotate text to be radial
      const textAngle = angle + Math.PI / 2;
      ctx.rotate(textAngle);
      
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 18px Arial';
      
      // Black stroke for better visibility
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      
      const text = getDayOfWeekName(day.id, lang);
      ctx.strokeText(text, 0, 0);
      
      // White fill
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 3;
      ctx.fillText(text, 0, 0);
      
      ctx.restore();
    });

    // Draw pointer
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(centerX + radius - 20, centerY);
    ctx.lineTo(centerX + radius + 10, centerY - 10);
    ctx.lineTo(centerX + radius + 10, centerY + 10);
    ctx.closePath();
    ctx.fill();

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center text
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'transparent';
    ctx.fillText('7 Zile', centerX, centerY);
  };

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const minSpins = 3;
    const maxSpins = 6;
    const spins = minSpins + Math.random() * (maxSpins - minSpins);
    const totalRotation = spins * 360 + Math.random() * 360;
    
    let start: number | null = null;
    const duration = 3000;

    const animate = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const rotation = currentRotation + totalRotation * easeOut;
      
      setCurrentRotation(rotation);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        
        const normalizedRotation = (360 - (rotation % 360)) % 360;
        const sectorAngle = 360 / WEEKDAYS.length;
        // Add 90 degrees offset to account for sectors starting at -90° while pointer is at 0°
        const offsetRotation = (normalizedRotation + 90 + sectorAngle / 2) % 360;
        const selectedIndex = Math.floor(offsetRotation / sectorAngle) % WEEKDAYS.length;
        const selectedDay = WEEKDAYS[selectedIndex];
        
        if (selectedDay) {
          if (onDaySelect) {
            onDaySelect(selectedDay.id);
          }
          if (onSpinComplete) {
            onSpinComplete(selectedDay.id);
          }
        }
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    drawWheel();
  }, [currentRotation, lang]);

  return (
    <div className="flex flex-col items-center gap-3">
      <h3 className="text-lg font-bold text-center">Roata Săptămânii</h3>
      
      <canvas
        ref={canvasRef}
        width={330}
        height={330}
        className="border-2 border-muted rounded-full"
      />
      
      {isInteractive && (
        <Button
          onClick={spinWheel}
          disabled={isSpinning}
          className="flex items-center gap-2"
          size="lg"
        >
          <RotateCcw className={`h-5 w-5 ${isSpinning ? 'animate-spin' : ''}`} />
          Învârte Roata
        </Button>
      )}
    </div>
  );
}
