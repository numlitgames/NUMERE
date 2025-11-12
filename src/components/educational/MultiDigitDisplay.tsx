import React from 'react';
import { cn } from "@/lib/utils";

interface MultiDigitDisplayProps {
  number: number;
  numberOfDigits?: number;
  className?: string;
}

const POSITION_LABELS = [
  'UNITĂȚI',
  'ZECI', 
  'SUTE',
  'MII',
  'ZECI DE MII',
  'SUTE DE MII',
  'MILIOANE',
  'ZECI DE MILIOANE',
  'SUTE DE MILIOANE'
];

export default function MultiDigitDisplay({ 
  number, 
  numberOfDigits = 1, 
  className 
}: MultiDigitDisplayProps) {
  // For single digit, use simple display
  if (numberOfDigits === 1) {
    return (
      <div className={cn("text-6xl font-black text-primary", className)}>
        {number}
      </div>
    );
  }

  // Convert number to string and pad with zeros if needed
  const numberStr = number.toString().padStart(numberOfDigits, '0');
  const digits = numberStr.split('').map(digit => parseInt(digit));

  return (
    <div className={cn("flex items-end gap-2", className)}>
      {digits.map((digit, index) => {
        const isEven = digit % 2 === 0;
        const positionIndex = digits.length - 1 - index; // Rightmost is position 0 (units)
        const positionLabel = POSITION_LABELS[positionIndex] || '';
        
        return (
          <div key={index} className="flex flex-col items-center gap-2">
            {/* Digit display box */}
            <div 
              className={cn(
                "w-16 h-16 rounded-lg border-2 flex items-center justify-center text-3xl font-black",
                isEven 
                  ? "bg-red-50 border-red-400 text-red-600" 
                  : "bg-blue-50 border-blue-400 text-blue-600"
              )}
            >
              {digit}
            </div>
            
            {/* Position label */}
            <div className="text-xs font-bold text-gray-700 text-center min-h-[2rem] flex items-center">
              {positionLabel}
            </div>
          </div>
        );
      })}
    </div>
  );
}