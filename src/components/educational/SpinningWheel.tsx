import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface WheelSector {
  id: string;
  text: string;
  color: string;
}

interface SpinningWheelProps {
  sectors: WheelSector[];
  onResult: (sector: WheelSector) => void;
  className?: string;
}

export default function SpinningWheel({ sectors, onResult, className }: SpinningWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas || sectors.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const sectorAngle = (2 * Math.PI) / sectors.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((currentRotation * Math.PI) / 180);

    sectors.forEach((sector, index) => {
      const startAngle = index * sectorAngle;
      const endAngle = (index + 1) * sectorAngle;

      // Draw sector
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = sector.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw radial text
      ctx.save();
      const midAngle = startAngle + sectorAngle / 2;
      ctx.rotate(midAngle);
      
      // Perfect centering settings
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = sector.color === '#ffffff' ? '#000000' : '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      const textRadius = radius * 0.6;
      const text = sector.text;
      
      // Optimal text positioning for readability
      const angleDegrees = (midAngle * 180) / Math.PI;
      
      // If text would be upside down, rotate it 180 degrees for readability
      if (angleDegrees > 90 && angleDegrees < 270) {
        ctx.rotate(Math.PI);
        ctx.fillText(text, 0, -textRadius);
      } else {
        ctx.fillText(text, 0, textRadius);
      }
      
      ctx.restore();
    });

    ctx.restore();

    // Draw pointer
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(centerX + radius - 20, centerY);
    ctx.lineTo(centerX + radius + 10, centerY - 10);
    ctx.lineTo(centerX + radius + 10, centerY + 10);
    ctx.closePath();
    ctx.fill();
  };

  const spinWheel = () => {
    if (isSpinning || sectors.length === 0) return;

    setIsSpinning(true);
    const minSpins = 3;
    const maxSpins = 6;
    const spins = minSpins + Math.random() * (maxSpins - minSpins);
    const totalRotation = spins * 360 + Math.random() * 360;
    
    let start: number | null = null;
    const duration = 3000; // 3 seconds

    const animate = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for realistic spin
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const rotation = currentRotation + totalRotation * easeOut;
      
      setCurrentRotation(rotation);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        
        // Calculate which sector was selected
        const normalizedRotation = (360 - (rotation % 360)) % 360;
        const sectorAngle = 360 / sectors.length;
        const selectedIndex = Math.floor(normalizedRotation / sectorAngle);
        const selectedSector = sectors[selectedIndex];
        
        if (selectedSector) {
          onResult(selectedSector);
        }
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    drawWheel();
  }, [sectors, currentRotation]);

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="border-2 border-muted rounded-full"
      />
      <Button
        onClick={spinWheel}
        disabled={isSpinning || sectors.length === 0}
        className="flex items-center gap-2"
        size="lg"
      >
        <RotateCcw className={`h-5 w-5 ${isSpinning ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
}