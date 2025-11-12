import React from 'react';
import { cn } from "@/lib/utils";

interface UnitCascadeProps {
  units: string[];
  color: string;
  bgColor: string;
  borderColor: string;
  cascadeColors: string[];
  fromUnit?: string;
  toUnit?: string;
  onStepClick?: (index: number) => void;
  characterPosition?: number;
  gameMode?: 'easy' | 'pro';
  isAnimating?: boolean;
  displayValues?: (number | null)[];
}

export default function UnitCascade({ 
  units, 
  color, 
  bgColor, 
  borderColor,
  cascadeColors,
  fromUnit,
  toUnit,
  onStepClick,
  characterPosition = 0,
  gameMode = 'easy',
  isAnimating = false,
  displayValues
}: UnitCascadeProps) {
  return (
    <div className="relative flex flex-col items-center justify-center p-2 min-h-[500px]">
      {units.map((unit, index) => {
        const width = 240 - index * 30;
        const height = 100 - index * 10;
        const isHighlighted = fromUnit === unit || toUnit === unit;
        const isClickable = gameMode === 'easy' && !isAnimating;
        const isActive = characterPosition === index;
        
        return (
          <div 
            key={unit}
            className="relative flex flex-col items-center"
            style={{ 
              marginBottom: index < units.length - 1 ? '10px' : '0'
            }}
          >
            {/* Label unitate deasupra */}
            <div className="text-xl font-black mb-2" style={{ color: cascadeColors[index] }}>
              {unit}
            </div>

            {/* Scara ca dreptunghi clickable */}
            <button
              onClick={() => isClickable && onStepClick?.(index)}
              disabled={!isClickable}
              className={cn(
                "border-4 rounded-lg flex items-center justify-center font-black transition-all",
                "bg-background relative",
                isClickable && "hover:scale-105 cursor-pointer hover:shadow-lg",
                isActive && "ring-4 ring-primary scale-110",
                isHighlighted && !isActive && "ring-2 ring-secondary"
              )}
              style={{ 
                width: `${width}px`, 
                height: `${height}px`,
                borderColor: cascadeColors[index]
              }}
            >
              {displayValues?.[index] !== null && displayValues?.[index] !== undefined ? (
                <span className="text-2xl font-black" style={{ color: cascadeColors[index] }}>
                  {displayValues[index]}
                </span>
              ) : isClickable && !isActive ? (
                <span className="text-xs text-muted-foreground opacity-50">
                  Click
                </span>
              ) : null}
            </button>

            {/* Săgeată groasă între scări */}
            {index < units.length - 1 && (
              <div className="flex items-center justify-center my-1">
                <svg width="60" height="30" viewBox="0 0 60 30" className="relative">
                  <defs>
                    <marker
                      id={`arrowhead-${index}`}
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="5"
                      orient="auto"
                    >
                      <polygon 
                        points="0 0, 10 5, 0 10" 
                        fill={cascadeColors[index]}
                      />
                    </marker>
                  </defs>
                  <line
                    x1="30"
                    y1="0"
                    x2="30"
                    y2="20"
                    stroke={cascadeColors[index]}
                    strokeWidth="6"
                    markerEnd={`url(#arrowhead-${index})`}
                  />
                </svg>
                <span 
                  className="text-lg font-black ml-2" 
                  style={{ color: cascadeColors[index] }}
                >
                  ×10
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
