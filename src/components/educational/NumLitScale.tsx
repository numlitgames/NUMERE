import React, { useState, useRef } from 'react';
import { cn } from "@/lib/utils";
import Rigleta from "./Rigleta";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, Move, ZoomIn, ZoomOut, Minimize2, Maximize2 } from "lucide-react";

interface NumLitScaleProps {
  maxValue?: number;
  className?: string;
  showLabels?: boolean;
  orientation?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large';
  onValueClick?: (value: string) => void;
  interactive?: boolean;
  onDragStart?: (value: number) => void;
  onDragEnd?: () => void;
  onClose?: () => void;
  standalone?: boolean;
}

// Color mapping for different values based on the NumLit system
const getScaleColor = (value: number): string => {
  // Special case for 0 - gray color
  if (value === 0) {
    return 'bg-gray-400';
  }
  
  const colors = [
    'bg-red-500',      // 1 - Red
    'bg-red-600',      // 2 - Dark Red
    'bg-orange-500',   // 3 - Orange
    'bg-orange-600',   // 4 - Dark Orange
    'bg-yellow-400',   // 5 - Yellow
    'bg-green-400',    // 6 - Light Green
    'bg-green-500',    // 7 - Green
    'bg-blue-400',     // 8 - Light Blue
    'bg-blue-500',     // 9 - Blue
    'bg-red-400',      // 10 - Pink/Light Red
  ];
  
  if (value <= 10) {
    return colors[value - 1] || 'bg-gray-400';
  }
  return 'bg-gray-400';
};


// Get block height based on value
const getBlockHeight = (value: number): string => {
  // Special case for 0 - half the height of rigleta 1
  if (value === 0) {
    const rigleta1Height = 16 + (1 * 24); // Height of rigleta 1
    return `${rigleta1Height / 2}px`; // Half the height
  }
  
  // Progressive height increase: each value gets 24px more height
  const height = 16 + (value * 24);
  return `${height}px`;
};

// Get block width - fixed width for all
const getBlockWidth = (): string => {
  return '32px';
};

const NumLitScale: React.FC<NumLitScaleProps> = ({
  maxValue = 10,
  className = '',
  showLabels = true,
  orientation = 'horizontal',
  size = 'medium',
  onValueClick,
  interactive = false,
  onDragStart,
  onDragEnd,
  onClose,
  standalone = false
}) => {
  const [draggedValue, setDraggedValue] = useState<number | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isCompact, setIsCompact] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0.8);
  
  const scaleRef = useRef<HTMLDivElement>(null);
  
  // Generate array of values starting from 0 to maxValue
  const values = [0, ...Array.from({ length: Math.min(maxValue, 10) }, (_, i) => i + 1)];
  
  const handleRigletaDragStart = (value: number) => {
    setDraggedValue(value);
    onDragStart?.(value);
  };

  const handleRigletaDragEnd = () => {
    setDraggedValue(null);
    onDragEnd?.();
  };

  const handleRigletaClick = (value: number) => {
    if (interactive && onValueClick) {
      onValueClick(value.toString());
    }
  };

  // Window drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!standalone) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  // Calculate rigleta size based on scale size
  const getRigletaScale = () => {
    switch (size) {
      case 'small': return 0.6;
      case 'medium': return 0.8;
      case 'large': return 1.0;
      default: return 0.8;
    }
  };

  const rigletaScale = getRigletaScale();

  // Zoom functions
  const zoomLevels = [0.4, 0.6, 0.8, 1, 1.25, 1.5];
  const currentZoomIndex = zoomLevels.indexOf(zoomLevel);
  
  const handleZoomIn = () => {
    if (currentZoomIndex < zoomLevels.length - 1) {
      setZoomLevel(zoomLevels[currentZoomIndex + 1]);
    }
  };
  
  const handleZoomOut = () => {
    if (currentZoomIndex > 0) {
      setZoomLevel(zoomLevels[currentZoomIndex - 1]);
    }
  };

  const renderScaleContent = () => (
    <div className={cn(
      "flex items-end gap-2",
      orientation === 'vertical' && "flex-col-reverse items-center gap-2"
    )}>
      {values.map((value) => {
        const isDraggedRigleta = draggedValue === value;
        
        return (
          <div 
            key={value} 
            className="flex flex-col items-center gap-1"
          >
            {/* Rigleta component */}
            <div
              className={cn(
                "transition-all duration-200",
                interactive && "cursor-pointer hover:scale-105",
                isDraggedRigleta && "scale-105 opacity-70"
              )}
              style={{
                transform: `scale(${rigletaScale})`,
                transformOrigin: 'bottom center'
              }}
              draggable={interactive}
              onDragStart={(e) => {
                handleRigletaDragStart(value);
                // Set data for drag & drop compatibility with BalantaInteractiva
                e.dataTransfer.setData('application/reactflow', 'rigleta');
                e.dataTransfer.setData('rigleta-value', value.toString());
              }}
              onDragEnd={handleRigletaDragEnd}
              onClick={() => handleRigletaClick(value)}
              title={`Rigleta ${value} - ${interactive ? 'Drag & drop sau click pentru a selecta' : 'Valoarea ' + value}`}
            >
              <Rigleta
                number={value}
                orientation={orientation === 'vertical' ? 'horizontal' : 'vertical'}
                interactive={false} // Handled by parent
                className="pointer-events-none"
              />
            </div>
            
            {/* Number label at bottom */}
            {showLabels && !isCompact && (
              <span className="text-sm font-bold text-gray-800 mt-1">
                {value}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );

  if (standalone) {
    return (
      <div 
        ref={scaleRef}
        className={cn(
          'bg-white rounded-lg border-2 border-gray-300 shadow-lg select-none',
          isDragging ? 'cursor-grabbing' : 'cursor-grab',
          className
        )}
        style={{
          position: 'fixed',
          right: `${20 - position.x}px`,
          bottom: `${20 - position.y}px`,
          zIndex: 1000,
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'bottom right'
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="p-4" onMouseDown={(e) => e.stopPropagation()}>
          {/* Header with controls */}
          <div className="flex items-center justify-between mb-2 p-1 bg-gray-100 rounded">
            <div className="flex items-center gap-1">
              <div 
                className="flex items-center justify-center cursor-grab hover:bg-blue-200 px-2 py-1 rounded bg-blue-100 border-2 border-blue-300"
                onMouseDown={handleMouseDown}
                title="Mutare Scară NumLit"
              >
                <Move className="w-6 h-6 text-blue-700" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCompact(!isCompact)}
                className="h-8 w-8 p-0 hover:bg-green-200 bg-green-100 border-2 border-green-300 rounded"
                title={isCompact ? "Extinde scara" : "Compactează scara"}
              >
                {isCompact ? <Maximize2 className="w-5 h-5 text-green-700" /> : <Minimize2 className="w-5 h-5 text-green-700" />}
              </Button>
            </div>
            
            <div className="flex items-center gap-1">
              {/* Zoom controls */}
              <div className="flex items-center gap-2 bg-purple-100 rounded-lg p-2 border-2 border-purple-300 min-w-[200px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={currentZoomIndex === 0}
                  className="h-8 w-8 p-0 hover:bg-purple-200 disabled:opacity-50 bg-purple-50"
                  title="Micșorează scara"
                >
                  <ZoomOut className="w-4 h-4 text-purple-700" />
                </Button>
                <div className="flex-1">
                  <Slider
                    value={[zoomLevel * 100]}
                    onValueChange={(value) => {
                      const newZoomLevel = value[0] / 100;
                      const closestLevel = zoomLevels.reduce((prev, curr) => 
                        Math.abs(curr - newZoomLevel) < Math.abs(prev - newZoomLevel) ? curr : prev
                      );
                      setZoomLevel(closestLevel);
                    }}
                    min={40}
                    max={150}
                    step={1}
                    className="w-full"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={currentZoomIndex === zoomLevels.length - 1}
                  className="h-8 w-8 p-0 hover:bg-purple-200 disabled:opacity-50 bg-purple-50"
                  title="Mărește scara"
                >
                  <ZoomIn className="w-4 h-4 text-purple-700" />
                </Button>
                <span className="text-sm text-purple-700 font-bold min-w-[3ch]">
                  {Math.round(zoomLevel * 100)}%
                </span>
              </div>
              
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 hover:bg-red-200 bg-red-100 border-2 border-red-300 rounded"
                  title="Închide Scară NumLit"
                >
                  <X className="w-5 h-5 text-red-700" />
                </Button>
              )}
            </div>
          </div>

          {/* Scale content */}
          <div className={cn(
            "flex items-end justify-center gap-2 p-4 bg-white rounded-lg",
            orientation === 'vertical' && "flex-col items-center"
          )}>
            {renderScaleContent()}
          </div>
        </div>
      </div>
    );
  }

  // Non-standalone version (embedded)
  return (
    <div className={cn(
      "flex items-end justify-center gap-2 p-6 bg-white rounded-lg",
      orientation === 'vertical' && "flex-col items-center",
      className
    )}>
      {renderScaleContent()}
    </div>
  );
};

export default NumLitScale;