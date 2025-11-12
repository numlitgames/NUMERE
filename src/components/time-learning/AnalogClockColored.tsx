import React, { useState, useRef } from 'react';

interface AnalogClockColoredProps {
  hours: number; // 0-23
  minutes: number; // 0-59
  seconds?: number; // 0-59
  size?: number;
  show24Hour?: boolean;
  showSeconds?: boolean;
  interactive?: boolean;
  onTimeChange?: (hours: number, minutes: number) => void;
  difficulty?: 'easy' | 'medium' | 'advanced';
}

export default function AnalogClockColored({
  hours,
  minutes,
  seconds = 0,
  size = 240,
  show24Hour = true,
  showSeconds = true,
  interactive = false,
  onTimeChange,
  difficulty = 'advanced'
}: AnalogClockColoredProps) {
  const [isDragging, setIsDragging] = useState<'hour' | 'minute' | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Convert 24h to 12h format for hand positioning
  const hours12 = hours % 12;
  
  // Calculate angles for hands
  const hourDegrees = (hours12 * 30) + (minutes * 0.5);
  const minuteDegrees = minutes * 6;
  const secondDegrees = seconds * 6;

  // Calculate position for numbers on circle
  const getNumberPosition = (num: number, radius: number) => {
    const angle = (num * 30 - 90) * (Math.PI / 180); // -90 to start at 12 o'clock
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle)
    };
  };

  // Snap to grid based on difficulty
  const snapToGrid = (angle: number, hand: 'hour' | 'minute'): number => {
    if (hand === 'minute') {
      if (difficulty === 'easy') {
        return 0;
      } else if (difficulty === 'medium') {
        const snapTo = Math.round(angle / 90) * 90;
        return snapTo % 360;
      }
    }
    return angle;
  };

  const handleMouseDown = (e: React.MouseEvent, hand: 'hour' | 'minute') => {
    if (!interactive) return;
    e.preventDefault();
    setIsDragging(hand);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !svgRef.current || !interactive) return;

    const rect = svgRef.current.getBoundingClientRect();
    const centerX = size / 2;
    const centerY = size / 2;
    const mouseX = e.clientX - rect.left - centerX;
    const mouseY = e.clientY - rect.top - centerY;

    let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    angle = snapToGrid(angle, isDragging);

    if (isDragging === 'minute') {
      let newMinutes = Math.round((angle / 360) * 60) % 60;
      
      if (difficulty === 'easy') {
        newMinutes = 0;
      } else if (difficulty === 'medium') {
        newMinutes = Math.round(newMinutes / 15) * 15;
        if (newMinutes === 60) newMinutes = 0;
      }
      
      onTimeChange?.(hours, newMinutes);
    } else if (isDragging === 'hour') {
      let newHours = Math.round((angle / 360) * 12);
      if (newHours === 0) newHours = 12;
      onTimeChange?.(newHours, minutes);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  // Create SVG path for colored sectors
  const createSectorPath = (startAngle: number, endAngle: number) => {
    const start = (startAngle - 90) * (Math.PI / 180);
    const end = (endAngle - 90) * (Math.PI / 180);
    const radius = 45;
    
    const x1 = 50 + radius * Math.cos(start);
    const y1 = 50 + radius * Math.sin(start);
    const x2 = 50 + radius * Math.cos(end);
    const y2 = 50 + radius * Math.sin(end);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <svg 
      ref={svgRef}
      width={size} 
      height={size} 
      viewBox="0 0 100 100"
      className={`drop-shadow-lg ${interactive ? 'cursor-pointer select-none' : ''}`}
      onMouseMove={interactive ? handleMouseMove : undefined}
      onMouseUp={interactive ? handleMouseUp : undefined}
      onMouseLeave={interactive ? handleMouseUp : undefined}
    >
      {/* Colored sectors */}
      {/* Green sector: 7-12 (210° to 360°) */}
      <path 
        d={createSectorPath(210, 360)} 
        fill="#A3D977"
      />
      
      {/* Orange sector: 12-6 (0° to 180°) */}
      <path 
        d={createSectorPath(0, 180)} 
        fill="#F4A261"
      />
      
      {/* Grey sector: 6-7 (180° to 210°) */}
      <path 
        d={createSectorPath(180, 210)} 
        fill="#C0C0C0"
      />

      {/* Cyan border */}
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill="none" 
        stroke="#00BCD4" 
        strokeWidth="2"
      />

      {/* Hour markers (small lines) */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = 50 + 38 * Math.cos(angle);
        const y1 = 50 + 38 * Math.sin(angle);
        const x2 = 50 + 42 * Math.cos(angle);
        const y2 = 50 + 42 * Math.sin(angle);
        
        return (
          <line
            key={`marker-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#333"
            strokeWidth="1"
          />
        );
      })}

      {/* 12-hour numbers (white, interior) */}
      {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
        const pos = getNumberPosition(i, 32);
        return (
          <text
            key={`hour12-${num}`}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="7"
            fontWeight="bold"
            className="select-none"
          >
            {num}
          </text>
        );
      })}

      {/* 24-hour numbers (blue, exterior) */}
      {show24Hour && [0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((num, i) => {
        const pos = getNumberPosition(i, 40);
        const displayNum = num === 0 ? 24 : num;
        return (
          <text
            key={`hour24-${num}`}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#3B82F6"
            fontSize="4.5"
            fontWeight="600"
            className="select-none"
          >
            {displayNum}
          </text>
        );
      })}

      {/* Hour hand (dark grey) */}
      {interactive ? (
        <g
          onMouseDown={(e) => handleMouseDown(e, 'hour')}
          className="cursor-grab active:cursor-grabbing"
        >
          <line
            x1="50"
            y1="50"
            x2={50 + 20 * Math.sin(hourDegrees * Math.PI / 180)}
            y2={50 - 20 * Math.cos(hourDegrees * Math.PI / 180)}
            stroke="#333333"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ filter: isDragging === 'hour' ? 'drop-shadow(0 0 2px #00BCD4)' : 'none' }}
          />
        </g>
      ) : (
        <line
          x1="50"
          y1="50"
          x2={50 + 20 * Math.sin(hourDegrees * Math.PI / 180)}
          y2={50 - 20 * Math.cos(hourDegrees * Math.PI / 180)}
          stroke="#333333"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}

      {/* Minute hand (blue) */}
      {interactive ? (
        <g
          onMouseDown={(e) => handleMouseDown(e, 'minute')}
          className="cursor-grab active:cursor-grabbing"
        >
          <line
            x1="50"
            y1="50"
            x2={50 + 28 * Math.sin(minuteDegrees * Math.PI / 180)}
            y2={50 - 28 * Math.cos(minuteDegrees * Math.PI / 180)}
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ filter: isDragging === 'minute' ? 'drop-shadow(0 0 2px #00BCD4)' : 'none' }}
          />
        </g>
      ) : (
        <line
          x1="50"
          y1="50"
          x2={50 + 28 * Math.sin(minuteDegrees * Math.PI / 180)}
          y2={50 - 28 * Math.cos(minuteDegrees * Math.PI / 180)}
          stroke="#3B82F6"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}

      {/* Second hand (red, optional) */}
      {showSeconds && (
        <line
          x1="50"
          y1="50"
          x2={50 + 30 * Math.sin(secondDegrees * Math.PI / 180)}
          y2={50 - 30 * Math.cos(secondDegrees * Math.PI / 180)}
          stroke="#EF4444"
          strokeWidth="1"
          strokeLinecap="round"
        />
      )}

      {/* Center dot (cyan) */}
      <circle 
        cx="50" 
        cy="50" 
        r="2.5" 
        fill="#00BCD4"
      />
    </svg>
  );
}
