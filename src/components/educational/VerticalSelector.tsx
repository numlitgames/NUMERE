import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerticalSelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
  outlineColor?: string;
}

export default function VerticalSelector({ 
  value, 
  min = 0, 
  max = 100, 
  onChange,
  className,
  outlineColor = '#000000'
}: VerticalSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const getNumberColor = (num: number) => {
    if (num === 0) return 'text-black';
    const isEven = num % 2 === 0;
    return isEven ? 'text-red-500' : 'text-blue-500';
  };

  return (
    <div className={cn('relative', className)}>
      <div className="flex flex-col items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleIncrease}
          disabled={value >= max}
          className="w-8 h-6 p-0 mb-1"
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
        
        <div 
          className={cn(
            'w-12 h-10 rounded border-2 bg-white flex items-center justify-center font-bold text-lg cursor-pointer transition-all duration-200 hover:scale-105',
            getNumberColor(value)
          )}
          style={{ borderColor: outlineColor }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {value}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleDecrease}
          disabled={value <= min}
          className="w-8 h-6 p-0 mt-1"
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
      
      {isOpen && (
        <div className="absolute top-0 left-14 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-2 z-50 max-h-60 overflow-y-auto">
          <div className="grid grid-cols-5 gap-1">
            {Array.from({ length: Math.min(51, max - min + 1) }, (_, i) => {
              const num = min + i;
              return (
                <Button
                  key={num}
                  variant="outline"
                  size="sm"
                  className={cn(
                    'w-8 h-8 text-xs font-bold',
                    getNumberColor(num),
                    value === num && 'ring-2 ring-yellow-400'
                  )}
                  onClick={() => {
                    onChange(num);
                    setIsOpen(false);
                  }}
                >
                  {num}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}