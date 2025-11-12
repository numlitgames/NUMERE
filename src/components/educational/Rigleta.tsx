import React from 'react';
import { cn } from "@/lib/utils";

interface RigletaProps {
  number: number;
  orientation?: 'horizontal' | 'vertical';
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

const rigletaColors = {
  1: 'bg-rigleta-1', // #d51818
  2: 'bg-rigleta-2', // #ed0000
  3: 'bg-rigleta-3', // #ed7300
  4: 'bg-rigleta-4', // #ff7200
  5: 'bg-rigleta-5', // #cfd518
  6: 'bg-rigleta-6', // #e5ed00
  7: 'bg-rigleta-7', // #00c32e
  8: 'bg-rigleta-8', // #0131b4
  9: 'bg-rigleta-9', // #241178
  10: 'bg-rigleta-10', // #791cf8
} as const;

const getInnerShape = (number: number) => {
  if (number === 1 || number === 2) {
    return 'rounded-full'; // Circle
  } else if (number === 3 || number === 4) {
    return 'rounded-none'; // Square
  } else if (number === 5 || number === 6) {
    return 'rounded-none'; // Triangle (approximated with square for now)
  } else if (number === 7 || number === 8) {
    return 'rounded-sm'; // Rectangle
  } else if (number === 9) {
    return 'rounded-full'; // Oval (approximated with circle)
  } else if (number === 10) {
    return 'rounded-none rotate-45'; // Diamond (rotated square)
  }
  return 'rounded-none';
};

export default function Rigleta({ 
  number, 
  orientation = 'vertical', 
  interactive = true, 
  className,
  onClick 
}: RigletaProps) {
  const rigletaColor = rigletaColors[number as keyof typeof rigletaColors];
  const innerShapeClass = getInnerShape(number);
  
  const squareSize = 'w-8 h-8'; // Base square size
  const containerClass = orientation === 'horizontal' 
    ? `flex flex-row`
    : `flex flex-col`;
  
  const squares = Array.from({ length: number }, (_, index) => (
    <div
      key={index}
      className={cn(
        squareSize,
        rigletaColor,
        'relative',
        'border border-gray-300',
        interactive && 'hover:scale-110 hover:brightness-110 transition-all duration-200 cursor-pointer'
      )}
    >
      {/* Inner white shape */}
      <div 
        className={cn(
          'absolute inset-2 bg-white',
          innerShapeClass
        )}
      />
      
      {/* Number display - only on first square for vertical, middle for horizontal */}
      {((orientation === 'vertical' && index === 0) || (orientation === 'horizontal' && index === Math.floor(number / 2))) && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800 z-10">
          {number}
        </div>
      )}
    </div>
  ));

  return (
    <div 
      className={cn(containerClass, 'gap-0', className)}
      onClick={onClick}
    >
      {squares}
    </div>
  );
}