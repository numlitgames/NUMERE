import React from 'react';
import { cn } from "@/lib/utils";

interface PlaceValueContainerProps {
  digit: number;
  position: number;
  placeValue: string;
  onDrop?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  rigletaItems?: any[];
  className?: string;
  translations?: {
    units?: string;
    tens?: string;
    hundreds?: string;
    thousands?: string;
    tenThousands?: string;
    hundredThousands?: string;
    millions?: string;
    tenMillions?: string;
    hundredMillions?: string;
  };
}

const PlaceValueContainer: React.FC<PlaceValueContainerProps> = ({
  digit,
  position,
  placeValue,
  onDrop,
  onDragOver,
  rigletaItems = [],
  className,
  translations = {
    units: "U",
    tens: "Z", 
    hundreds: "S",
    thousands: "M",
    tenThousands: "ZM",
    hundredThousands: "SM",
    millions: "Mil",
    tenMillions: "ZMil",
    hundredMillions: "SMil"
  }
}) => {
  const getPlaceValueLabel = (pos: number) => {
    switch (pos) {
      case 0: return translations.units;
      case 1: return translations.tens;
      case 2: return translations.hundreds;
      case 3: return translations.thousands;
      case 4: return translations.tenThousands;
      case 5: return translations.hundredThousands;
      case 6: return translations.millions;
      case 7: return translations.tenMillions;
      case 8: return translations.hundredMillions;
      default: return `10^${pos}`;
    }
  };

  const getPlaceValueColor = (pos: number) => {
    const colors = [
      'border-blue-500 bg-blue-50', // units
      'border-red-500 bg-red-50',   // tens
      'border-orange-500 bg-orange-50', // hundreds
      'border-black bg-gray-50',    // thousands
      'border-blue-700 bg-blue-100', // ten thousands
      'border-red-700 bg-red-100',   // hundred thousands
      'border-orange-700 bg-orange-100', // millions
      'border-purple-500 bg-purple-50', // ten millions
      'border-green-500 bg-green-50'  // hundred millions
    ];
    return colors[pos % colors.length];
  };

  return (
    <div className="relative flex flex-col items-center gap-2">
      {/* Overlay MARE invizibil pentru drop - captează drop-ul din orice direcție */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="absolute inset-0 -top-20 -bottom-20 -left-10 -right-10 z-10"
        style={{ pointerEvents: 'auto' }}
      />
      
      {/* Conținutul vizibil (cu z-index mai mare pentru interacțiuni) */}
      <div className={cn('relative z-20 flex flex-col items-center gap-2', className)}>
        {/* Digit display */}
        <div className={cn(
          'w-20 h-20 border-2 rounded-lg flex items-center justify-center text-3xl font-bold',
          getPlaceValueColor(position)
        )}>
          {digit}
        </div>
        
        {/* Mini-containers for riglete */}
        <div 
          className={cn(
            'w-20 h-14 border-2 border-dashed rounded-lg flex items-center justify-center text-xs transition-colors duration-200',
            'hover:bg-primary/10 hover:border-primary',
            getPlaceValueColor(position)
          )}
        >
          {rigletaItems.length === 0 ? (
            <span className="text-muted-foreground text-xs">Drop</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {rigletaItems.map((item, idx) => (
                <div 
                  key={idx}
                  className="w-2 h-2 bg-primary rounded-full"
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Place value label */}
        <div className={cn(
          'px-2 py-1 rounded text-xs font-semibold text-white',
          position === 0 ? 'bg-blue-500' : 
          position === 1 ? 'bg-red-500' :
          position === 2 ? 'bg-orange-500' :
          position === 3 ? 'bg-black' :
          position === 4 ? 'bg-blue-700' :
          position === 5 ? 'bg-red-700' :
          position === 6 ? 'bg-orange-700' :
          position === 7 ? 'bg-purple-500' :
          'bg-green-500'
        )}>
          {getPlaceValueLabel(position)}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PlaceValueContainer);