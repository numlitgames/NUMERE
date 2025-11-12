import React from 'react';
import { cn } from "@/lib/utils";

interface RigletaNumLitProps {
  number: number;
  orientation?: 'horizontal' | 'vertical';
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
  translations?: {
    units: string;
    tens: string;
    hundreds: string;
    thousands: string;
    unitsClass?: string;
    thousandsClass?: string;
    millionsClass?: string;
    unitsShort?: string;
    tensShort?: string;
    hundredsShort?: string;
    thousandsShort?: string;
  };
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

// Simboluri pentru ordine - conform specificațiilor
const getOrderSymbol = (orderValue: number) => {
  if (orderValue >= 1000) {
    return { symbol: '★', color: 'text-yellow-600', title: 'Mii' }; // Stea cu 5 colțuri pentru mii
  } else if (orderValue >= 100) {
    return { symbol: '⬢', color: 'text-black', title: 'Sute' }; // Hexagon negru pentru sute
  } else if (orderValue >= 10) {
    return { symbol: '◆', color: 'text-purple-600', title: 'Zeci' }; // Romb mov pentru zeci
  }
  return null;
};

// Culorile axelor conform specificațiilor
const getAxisColor = (orderValue: number) => {
  if (orderValue >= 1000) return 'bg-black text-white'; // Negru pentru mii
  if (orderValue >= 100) return 'bg-orange-500 text-white'; // Portocaliu pentru sute
  if (orderValue >= 10) return 'bg-red-500 text-white'; // Roșu pentru zeci
  return 'bg-blue-500 text-white'; // Albastru pentru unități
};

const decompose = (number: number) => {
  const digits = number.toString().split('').reverse();
  const components = [];
  
  for (let i = 0; i < digits.length; i++) {
    const digit = parseInt(digits[i]);
    if (digit > 0) {
      const orderValue = digit * Math.pow(10, i);
      components.push({
        digit,
        orderValue,
        position: i
      });
    }
  }
  
  return components.reverse();
};

// Funcție pentru a determina culoarea cifrelor (pare = roșu, impare = albastru)
const getDigitColor = (digit: number) => {
  return digit % 2 === 0 ? 'text-red-600 bg-red-50' : 'text-blue-600 bg-blue-50';
};

// Funcție pentru a obține etichetele ordinelor în funcție de poziție
const getOrderLabels = (digits: number, translations?: RigletaNumLitProps['translations']) => {
  const defaultTranslations = {
    units: 'UNITĂȚI',
    tens: 'ZECI',
    hundreds: 'SUTE',
    thousands: 'MII'
  };
  
  const t = translations || defaultTranslations;
  const labels = [];
  for (let i = digits - 1; i >= 0; i--) {
    if (i === 0) labels.push(t.units);
    else if (i === 1) labels.push(t.tens); 
    else if (i === 2) labels.push(t.hundreds);
    else if (i === 3) labels.push(t.thousands);
  }
  return labels;
};

// Funcție pentru a obține culorile de fundal pentru ordine
const getOrderBgColor = (position: number) => {
  if (position === 0) return 'bg-blue-500 text-gray-100 rounded-md'; // UNITĂȚI - albastru
  if (position === 1) return 'bg-red-500 text-gray-100 rounded-md'; // ZECI - roșu
  if (position === 2) return 'bg-orange-500 text-gray-100 rounded-md'; // SUTE - portocaliu
  if (position === 3) return 'bg-black text-gray-100 rounded-md'; // MII - negru
  return 'bg-gray-500 text-gray-100 rounded-md';
};

export default function RigletaNumLit({ 
  number, 
  orientation = 'vertical', 
  interactive = true, 
  className,
  onClick,
  translations
}: RigletaNumLitProps) {
  // Pentru numere cu lungimi diferite, adaugă un container cu aliniere la dreapta
  const containerStyle = {
    display: 'flex',
    justifyContent: 'flex-end', // Aliniază la dreapta
    alignItems: 'flex-end', // Aliniază la partea de jos pentru a sincroniza etichetele
    minWidth: '600px' // Lățime minimă pentru a asigura spațiul necesar
  };
  
  if (number <= 10) {
    // Pentru numărul 10, returnează o rigleta invizibilă (dezactivată)
    if (number === 10) {
      return (
        <div 
          className={cn('flex flex-col items-center gap-2 opacity-0 pointer-events-none', className)}
        >
          {/* Rigleta invizibilă pentru numărul 10 */}
          <div className="flex gap-1">
            <div className="w-12 h-12 bg-transparent border-transparent"></div>
            <div className="w-12 h-12 bg-transparent border-transparent"></div>
          </div>
          <div className="flex gap-0">
            <div className="w-14 h-8 bg-transparent"></div>
            <div className="w-14 h-8 bg-transparent"></div>
          </div>
        </div>
      );
    }
    
    // Pentru numere 1-9, afișăm întotdeauna 2 pătrate cu cifra în poziția corectă
    const numberStr = number.toString();
    const digits = numberStr.length;
    const orderLabels = getOrderLabels(Math.max(2, digits), translations); // Minim 2 pentru a avea ZECI și UNITĂȚI
    const isSingleDigit = digits === 1; // Pentru numere 1-9
    
    return (
      <div 
        className={cn('flex flex-col items-end gap-2', className)}
        onClick={onClick}
        style={containerStyle}
      >
        {/* Afișarea cifrelor în 2 pătrate */}
        <div className="flex gap-0">
          {/* Pătratul pentru zeci (stânga) - întotdeauna gol pentru 1-9 */}
          <div className="w-16 h-16 bg-gray-100 text-transparent border-gray-200 border-2"></div>
          
          {/* Pătratul pentru unități (dreapta) */}
          <div
            className={cn(
              'w-16 h-16 flex items-center justify-center text-6xl font-bold border-2 border-gray-400',
              getDigitColor(number % 10),
              interactive && 'hover:scale-105 transition-transform cursor-pointer'
            )}
          >
            {number % 10}
          </div>
        </div>
        
        {/* Tabelul cu Clase și Ordine */}
        <div className="flex gap-0">
          <div className="w-16 h-8 bg-gray-100 text-gray-300 rounded-md flex items-center justify-center text-[10px] font-bold">
            {translations?.tens || 'ZECI'}
          </div>
          <div className={cn('w-16 h-8 flex items-center justify-center text-[10px] font-bold', getOrderBgColor(0))}>
            {translations?.units || 'UNITĂȚI'}
          </div>
        </div>
      </div>
    );
  }
  
  // Pentru numere mai mari, afișăm cu formatare specială
  const numberStr = number.toString();
  const digits = numberStr.length;
  
  // Pentru numere cu mai mult de 4 cifre, folosim layout-ul cu clase
  if (digits > 4) {
    // Completăm cu zerouri la stânga pentru a avea grupuri complete de 3 cifre
    const paddedNumber = numberStr.padStart(Math.ceil(digits / 3) * 3, '0');
    const groups = [];
    
    // Împărțim în grupuri de 3 cifre de la dreapta la stânga
    for (let i = paddedNumber.length; i > 0; i -= 3) {
      groups.unshift(paddedNumber.slice(Math.max(0, i - 3), i));
    }
    
    const getClassColor = (groupIndex) => {
      // De la dreapta la stânga: UNITĂȚI (albastru), MII (roșu), MILIOANE (portocaliu)
      switch (groupIndex) {
        case 0: return 'bg-blue-500'; // CLASA UNITĂȚILOR
        case 1: return 'bg-red-500';  // CLASA MIILOR
        case 2: return 'bg-orange-500'; // CLASA MILIOANELOR
        default: return 'bg-purple-500'; // Pentru numere foarte mari
      }
    };
    
    const getClassName = (groupIndex, translations?: RigletaNumLitProps['translations']) => {
      const defaultTranslations = {
        unitsClass: 'CLASA UNITĂȚILOR',
        thousandsClass: 'CLASA MIILOR',
        millionsClass: 'CLASA MILIOANELOR'
      };
      
      const t_classes = translations || defaultTranslations;
      
      switch (groupIndex) {
        case 0: return t_classes.unitsClass || 'CLASA UNITĂȚILOR';
        case 1: return t_classes.thousandsClass || 'CLASA MIILOR';
        case 2: return t_classes.millionsClass || 'CLASA MILIOANELOR';
        default: return `CLASA ${Math.pow(1000, groupIndex + 1)}`;
      }
    };
    
    return (
      <div 
        className={cn('flex flex-col items-end gap-0', className)}
        onClick={onClick}
        style={containerStyle}
      >
        {/* Etichetele de clasă în partea de sus */}
        <div className="flex gap-1">
          {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="flex flex-col gap-0">
              {/* Eticheta clasei */}
              <div 
                className={cn(
                  'flex items-center justify-center text-white text-xs font-bold px-2 py-2 rounded-md',
                  getClassColor(groups.length - 1 - groupIndex)
                )}
                style={{ width: '192px', height: '32px' }}
              >
                {getClassName(groups.length - 1 - groupIndex, translations)}
              </div>
              
              {/* Etichetele SUTE, ZECI, UNITĂȚI */}
              <div className="flex gap-0">
                <div className={cn(
                  'w-16 h-6 flex items-center justify-center text-white text-xs font-bold rounded-sm',
                  getClassColor(groups.length - 1 - groupIndex)
                )}>
                  S
                </div>
                <div className={cn(
                  'w-16 h-6 flex items-center justify-center text-white text-xs font-bold rounded-sm',
                  getClassColor(groups.length - 1 - groupIndex)
                )}>
                  Z
                </div>
                <div className={cn(
                  'w-16 h-6 flex items-center justify-center text-white text-xs font-bold rounded-sm',
                  getClassColor(groups.length - 1 - groupIndex)
                )}>
                  U
                </div>
              </div>
            </div>
          ))}
          
          {/* Adaugă spațiu gol dacă nu avem suficiente grupuri pentru alinierea perfectă */}
          {groups.length === 1 && (
            <>
              <div className="flex flex-col">
                <div className="w-48 h-6 border border-transparent"></div>
                <div className="flex">
                  <div className="w-16 h-6 border border-transparent"></div>
                  <div className="w-16 h-6 border border-transparent"></div>
                  <div className="w-16 h-6 border border-transparent"></div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="w-48 h-6 border border-transparent"></div>
                <div className="flex">
                  <div className="w-16 h-6 border border-transparent"></div>
                  <div className="w-16 h-6 border border-transparent"></div>
                  <div className="w-16 h-6 border border-transparent"></div>
                </div>
              </div>
            </>
          )}
          
          {groups.length === 2 && (
            <div className="flex flex-col">
              <div className="w-48 h-6 border border-transparent"></div>
              <div className="flex">
                <div className="w-16 h-6 border border-transparent"></div>
                <div className="w-16 h-6 border border-transparent"></div>
                <div className="w-16 h-6 border border-transparent"></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Cifrele în căsuțe */}
        <div className="flex">
          {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="flex">
              {group.split('').map((digit, digitIndex) => {
                const digitNum = parseInt(digit);
                const globalIndex = groups.slice(0, groupIndex).join('').length + digitIndex;
                
                // Verifică dacă este leading zero
                const numberStr = number.toString();
                const totalPadding = paddedNumber.length - numberStr.length;
                const isLeadingZero = globalIndex < totalPadding;
                
                // Pentru leading zeros, afișează căsuță invisibilă dar care ocupă spațiu
                if (isLeadingZero) {
                  return (
                    <div
                      key={`${groupIndex}-${digitIndex}`}
                      className="w-16 h-16 border border-transparent"
                    >
                    </div>
                  );
                }
                
                return (
                  <div
                    key={`${groupIndex}-${digitIndex}`}
                    className={cn(
                      'w-16 h-16 flex items-center justify-center text-6xl font-bold border border-gray-400 bg-white text-black rounded-sm',
                      interactive && 'hover:scale-105 transition-transform cursor-pointer'
                    )}
                  >
                    {digit}
                  </div>
                );
              })}
            </div>
          ))}
          
          {/* Adaugă spațiu gol pentru alinierea perfectă */}
          {groups.length === 1 && (
            <>
              <div className="flex">
                <div className="w-16 h-16 border border-transparent"></div>
                <div className="w-16 h-16 border border-transparent"></div>
                <div className="w-16 h-16 border border-transparent"></div>
              </div>
              <div className="flex">
                <div className="w-16 h-16 border border-transparent"></div>
                <div className="w-16 h-16 border border-transparent"></div>
                <div className="w-16 h-16 border border-transparent"></div>
              </div>
            </>
          )}
          
          {groups.length === 2 && (
            <div className="flex">
              <div className="w-16 h-16 border border-transparent"></div>
              <div className="w-16 h-16 border border-transparent"></div>
              <div className="w-16 h-16 border border-transparent"></div>
            </div>
          )}
        </div>
        
        {/* Afișarea valorilor descompuse pentru numere mari */}
        <div className="text-xs text-muted-foreground text-center mt-1 max-w-md">
          {paddedNumber.split('').map((digit, index) => {
            const digitNum = parseInt(digit);
            const position = paddedNumber.length - index - 1;
            const value = digitNum * Math.pow(10, position);
            
            if (digitNum === 0) return null;
            
            return (
              <span key={index}>
                {value.toLocaleString()}
                {index < paddedNumber.length - 1 && digitNum !== 0 ? ' + ' : ''}
              </span>
            );
          }).filter(Boolean)}
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={cn('flex flex-col items-end gap-2', className)}
      onClick={onClick}
      style={containerStyle}
    >
      {/* Afișarea cifrelor în pătrățele colorate pentru numere ≤ 4 cifre */}
      <div className="flex gap-0">
        {numberStr.split('').map((digit, index) => {
          const digitNum = parseInt(digit);
          const position = digits - index - 1; // Poziția de la dreapta la stânga
          
          return (
            <div
              key={index}
              className={cn(
                'w-16 h-16 flex items-center justify-center text-6xl font-bold border-2 border-gray-400',
                getDigitColor(digitNum),
                interactive && 'hover:scale-105 transition-transform cursor-pointer'
              )}
            >
              {digit}
            </div>
          );
        })}
      </div>
      
      {/* Tabelul cu Clase și Ordine pentru numere ≤ 4 cifre */}
      <div className="flex gap-0">
        {getOrderLabels(digits, translations).map((label, index) => {
          const position = digits - index - 1;
          
          return (
            <div
              key={index}
              className={cn(
                'w-16 h-8 flex items-center justify-center text-[10px] font-bold',
                getOrderBgColor(position)
              )}
            >
              {label}
            </div>
          );
        })}
      </div>
      
      {/* Afișarea valorilor descompuse pentru numere cu 2-4 cifre */}
      {digits > 1 && (
        <div className="text-xs text-muted-foreground text-center mt-1">
          {numberStr.split('').map((digit, index) => {
            const digitNum = parseInt(digit);
            const position = digits - index - 1;
            const value = digitNum * Math.pow(10, position);
            
            if (digitNum === 0) return null;
            
            return (
              <span key={index}>
                {value}
                {index < digits - 1 && digitNum !== 0 ? ' + ' : ''}
              </span>
            );
          }).filter(Boolean)}
        </div>
      )}
    </div>
  );
}