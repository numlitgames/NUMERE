import React from 'react';
import { cn } from "@/lib/utils";

interface MathExpressionProps {
  firstNumber: number;
  secondNumber: number;
  result?: number;
  showResult?: boolean;
  className?: string;
  translations?: {
    units: string;
    tens: string;
    hundreds: string;
    thousands: string;
  };
}

// Funcție pentru a determina culoarea cifrelor (pare = roșu, impare = albastru)
const getDigitColor = (digit: number) => {
  return digit % 2 === 0 ? 'text-red-600 bg-red-50' : 'text-blue-600 bg-blue-50';
};

const SingleDigitDisplay = ({ number, translations }: { number: number, translations?: MathExpressionProps['translations'] }) => (
  <div className="flex flex-col items-center gap-2">
    {/* Cifra în pătrat */}
    <div
      className={cn(
        'w-12 h-12 flex items-center justify-center font-bold text-3xl border-2 border-gray-400',
        getDigitColor(number)
      )}
    >
      {number}
    </div>
    
    {/* Eticheta UNITĂȚI */}
    <div className="w-14 h-8 flex items-center justify-center text-[10px] font-bold bg-blue-500 text-gray-100 rounded-md">
      {translations?.units || 'UNITĂȚI'}
    </div>
  </div>
);

export default function MathExpression({
  firstNumber,
  secondNumber,
  result,
  showResult = false,
  className,
  translations
}: MathExpressionProps) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* First Number */}
      <SingleDigitDisplay number={firstNumber} translations={translations} />
      
      {/* Plus Sign - centrat la înălțimea pătratului */}
      <div className="flex items-start pt-[6px]">
        <span className="text-4xl font-bold text-gray-700">+</span>
      </div>
      
      {/* Second Number */}
      <SingleDigitDisplay number={secondNumber} translations={translations} />
      
      {/* Equals Sign - centrat la înălțimea pătratului */}
      <div className="flex items-start pt-[6px]">
        <span className="text-4xl font-bold text-gray-700">=</span>
      </div>
      
      {/* Result */}
      {showResult && result !== undefined ? (
        <SingleDigitDisplay number={result} translations={translations} />
      ) : (
        <div className="flex flex-col items-center gap-2">
          {/* Question mark box */}
          <div className="w-12 h-12 flex items-center justify-center font-bold text-4xl border-2 border-gray-400 bg-white">
            ?
          </div>
          
          {/* Eticheta UNITĂȚI */}
          <div className="w-14 h-8 flex items-center justify-center text-[10px] font-bold bg-blue-500 text-gray-100 rounded-md">
            {translations?.units || 'UNITĂȚI'}
          </div>
        </div>
      )}
    </div>
  );
}