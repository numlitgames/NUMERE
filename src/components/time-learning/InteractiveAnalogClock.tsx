import React, { useState, useRef } from 'react';

interface InteractiveAnalogClockProps {
  hours: number;
  minutes: number;
  onTimeChange: (hours: number, minutes: number) => void;
  size?: number;
  show24Hour?: boolean;
  difficulty?: 'easy' | 'medium' | 'advanced';
}

export default function InteractiveAnalogClock({
  hours,
  minutes,
  onTimeChange,
  size = 240,
  show24Hour = false,
  difficulty = 'advanced'
}: InteractiveAnalogClockProps) {
  const [isDragging, setIsDragging] = useState<'hour' | 'minute' | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const radius = size / 2 - 20;
  const centerX = size / 2;
  const centerY = size / 2;

  // Calculate angles
  const minuteAngle = (minutes / 60) * 360;
  const hourAngle = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  const snapToGrid = (angle: number, hand: 'hour' | 'minute'): number => {
    if (hand === 'minute') {
      if (difficulty === 'easy') {
        // Snap to hours (0 minutes only)
        return 0;
      } else if (difficulty === 'medium') {
        // Snap to 15-minute intervals
        const snapTo = Math.round(angle / 90) * 90;
        return snapTo % 360;
      }
    }
    return angle;
  };

  const handleMouseDown = (e: React.MouseEvent, hand: 'hour' | 'minute') => {
    e.preventDefault();
    setIsDragging(hand);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - centerX;
    const mouseY = e.clientY - rect.top - centerY;

    let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    angle = snapToGrid(angle, isDragging);

    if (isDragging === 'minute') {
      let newMinutes = Math.round((angle / 360) * 60) % 60;
      
      // Apply difficulty constraints
      if (difficulty === 'easy') {
        newMinutes = 0;
      } else if (difficulty === 'medium') {
        // Snap to 0, 15, 30, 45
        newMinutes = Math.round(newMinutes / 15) * 15;
        if (newMinutes === 60) newMinutes = 0;
      }
      
      onTimeChange(hours, newMinutes);
    } else if (isDragging === 'hour') {
      let newHours = Math.round((angle / 360) * 12);
      if (newHours === 0) newHours = 12;
      onTimeChange(newHours, minutes);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  // Create colored sector path
  const createSectorPath = (startAngle: number, endAngle: number) => {
    const start = ((startAngle - 90) * Math.PI) / 180;
    const end = ((endAngle - 90) * Math.PI) / 180;
    const x1 = centerX + radius * Math.cos(start);
    const y1 = centerY + radius * Math.sin(start);
    const x2 = centerX + radius * Math.cos(end);
    const y2 = centerY + radius * Math.sin(end);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      className="cursor-pointer select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background circle */}
      <circle cx={centerX} cy={centerY} r={radius} fill="white" stroke="none" />

      {/* Colored sectors */}
      <path d={createSectorPath(0, 90)} fill="hsl(var(--chart-1))" opacity="0.3" />
      <path d={createSectorPath(90, 180)} fill="hsl(var(--chart-2))" opacity="0.3" />
      <path d={createSectorPath(180, 270)} fill="hsl(var(--chart-3))" opacity="0.3" />
      <path d={createSectorPath(270, 360)} fill="hsl(var(--chart-4))" opacity="0.3" />

      {/* Outer border */}
      <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="hsl(var(--primary))" strokeWidth="3" />

      {/* Hour markers */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = centerX + (radius - 10) * Math.cos(angle);
        const y1 = centerY + (radius - 10) * Math.sin(angle);
        const x2 = centerX + radius * Math.cos(angle);
        const y2 = centerY + radius * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
          />
        );
      })}

      {/* Hour numbers */}
      {Array.from({ length: 12 }, (_, i) => {
        const hour = i === 0 ? 12 : i;
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = centerX + (radius - 30) * Math.cos(angle);
        const y = centerY + (radius - 30) * Math.sin(angle);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground font-bold"
            fontSize="16"
          >
            {hour}
          </text>
        );
      })}

      {/* 24-hour numbers (optional) */}
      {show24Hour && Array.from({ length: 12 }, (_, i) => {
        const hour24 = i === 0 ? 12 : i;
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = centerX + (radius - 50) * Math.cos(angle);
        const y = centerY + (radius - 50) * Math.sin(angle);
        return (
          <text
            key={`24-${i}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-primary"
            fontSize="12"
            fontWeight="600"
          >
            {hour24 + 12}
          </text>
        );
      })}

      {/* Hour hand */}
      <g
        onMouseDown={(e) => handleMouseDown(e, 'hour')}
        className="cursor-grab active:cursor-grabbing"
      >
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX + (radius * 0.5) * Math.sin((hourAngle * Math.PI) / 180)}
          y2={centerY - (radius * 0.5) * Math.cos((hourAngle * Math.PI) / 180)}
          stroke="hsl(var(--foreground))"
          strokeWidth="6"
          strokeLinecap="round"
          className="transition-all"
          style={{ filter: isDragging === 'hour' ? 'drop-shadow(0 0 4px hsl(var(--primary)))' : 'none' }}
        />
      </g>

      {/* Minute hand */}
      <g
        onMouseDown={(e) => handleMouseDown(e, 'minute')}
        className="cursor-grab active:cursor-grabbing"
      >
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX + (radius * 0.75) * Math.sin((minuteAngle * Math.PI) / 180)}
          y2={centerY - (radius * 0.75) * Math.cos((minuteAngle * Math.PI) / 180)}
          stroke="hsl(var(--primary))"
          strokeWidth="4"
          strokeLinecap="round"
          className="transition-all"
          style={{ filter: isDragging === 'minute' ? 'drop-shadow(0 0 4px hsl(var(--primary)))' : 'none' }}
        />
      </g>

      {/* Center dot */}
      <circle cx={centerX} cy={centerY} r="8" fill="hsl(var(--primary))" />
    </svg>
  );
}
