import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import MathExpression from './MathExpression';

interface InteractiveMultiplicationTableProps {
  firstNumber: number;
  secondNumber: number;
  onProgressUpdate: (correct: boolean) => void;
  onGenerateNew?: () => void;
  language: string;
  translations?: {
    units: string;
    tens: string;
    hundreds: string;
    thousands: string;
    findResult: string;
    allMultiplicationsFor: string;
    newProblemGenerated: string;
    validateAndContinue: string;
    pressButtonFromTable: string;
    resultsWillAppearHere: string;
    concentru: string;
    pitagora: string;
  };
}

interface FlippedButton {
  number: number;
  isCorrect: boolean;
  multiplications: string[];
}

// Get all multiplication combinations for a given result
const getMultiplicationsForResult = (result: number): string[] => {
  const multiplications: string[] = [];
  for (let i = 1; i <= 12; i++) {
    for (let j = 1; j <= 12; j++) {
      if (i * j === result) {
        multiplications.push(`${i} × ${j}`);
      }
    }
  }
  return multiplications;
};

// Check if a number is a result of multiplication between 1-12
const isMultiplicationResult = (num: number): boolean => {
  for (let i = 1; i <= 12; i++) {
    for (let j = 1; j <= 12; j++) {
      if (i * j === num) {
        return true;
      }
    }
  }
  return false;
};

export default function InteractiveMultiplicationTable({
  firstNumber,
  secondNumber,
  onProgressUpdate,
  onGenerateNew,
  language,
  translations
}: InteractiveMultiplicationTableProps) {
  const [flippedButtons, setFlippedButtons] = useState<Map<number, FlippedButton>>(new Map());
  const [currentExpression, setCurrentExpression] = useState<{
    first: number;
    second: number;
    result: number;
    multiplications: string[];
  } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [tableMode, setTableMode] = useState<'concentru' | 'pitagora'>('concentru');
  
  const correctResult = firstNumber * secondNumber;

  // Timer for hints
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1;
        if (newTime >= 15) {
          setShowHints(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Reset timer when new problem is generated
  useEffect(() => {
    setTimeElapsed(0);
    setShowHints(false);
    setFlippedButtons(new Map());
    setCurrentExpression(null);
  }, [firstNumber, secondNumber]);

  // Generate numbers in column format: 0-10-20-30... then 1-11-21-31... etc
  const generateNumberGrid = () => {
    const grid = [];
    
    // Create 11 rows (0-9, plus 100 separately)
    for (let row = 0; row < 10; row++) {
      const rowNumbers = [];
      // Create 10 columns (0-9)
      for (let col = 0; col < 10; col++) {
        const number = row * 10 + col;
        rowNumbers.push(number);
      }
      grid.push(rowNumbers);
    }
    
    return grid;
  };

  const handleButtonClick = (number: number) => {
    if (flippedButtons.has(number)) {
      return; // Button already flipped
    }

    const isCorrect = number === correctResult;
    const multiplications = getMultiplicationsForResult(number);
    
    // Add to flipped buttons
    setFlippedButtons(prev => new Map(prev).set(number, {
      number,
      isCorrect,
      multiplications
    }));

    // Show the expression
    setCurrentExpression({
      first: firstNumber,
      second: secondNumber,
      result: number,
      multiplications
    });

    // Handle success/failure
    if (isCorrect) {
      setShowConfetti(true);
      toast.success("🎉 Bravo! Răspuns corect! 🎉", {
        description: `${firstNumber} × ${secondNumber} = ${number}`,
        duration: 3000,
      });
      onProgressUpdate(true);
      
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      if (isMultiplicationResult(number)) {
        toast.info("Încurajare!", {
          description: `${number} = ${multiplications.join(', ')}`,
          duration: 2000,
        });
      } else {
        toast.info("Încearcă din nou!", {
          description: "Acest număr nu este rezultatul unei înmulțiri 1-12",
          duration: 2000,
        });
      }
      onProgressUpdate(false);
    }
  };

  const renderNumberButton = (number: number) => {
    const isFlipped = flippedButtons.has(number);
    const isEven = number % 2 === 0;
    const isNumber100 = number === 100;
    
    if (isFlipped) {
      const buttonData = flippedButtons.get(number)!;
      return (
        <Button
          key={number}
          variant="outline"
          className={cn(
            'h-16 text-2xl font-bold border-2 rounded-lg transition-all duration-500 transform rotate-y-180',
            isNumber100 ? 'w-[73.6px]' : 'w-16',
            buttonData.isCorrect 
              ? 'bg-green-500 text-white border-green-600 shadow-lg scale-110' 
              : 'bg-gray-300 text-gray-600 border-gray-400'
          )}
          disabled
        >
          {buttonData.isCorrect ? '✓' : '✗'}
        </Button>
      );
    }

    return (
      <Button
        key={number}
        variant="outline"
        className={cn(
          'h-16 text-4xl font-bold border-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md',
          isNumber100 ? 'w-[73.6px]' : 'w-16',
          isEven ? 'bg-red-500 text-white border-red-600' : 'bg-blue-500 text-white border-blue-600'
        )}
        onClick={() => handleButtonClick(number)}
      >
        {number}
      </Button>
    );
  };

  // Get rigleta color for a number
  const getRigletaBorderColor = (num: number): string => {
    if (num === 0) return 'border-gray-400';
    if (num >= 1 && num <= 10) return `border-rigleta-${num}`;
    return 'border-gray-400';
  };

  const renderPitagoraTable = () => {
    return (
      <div className="bg-white rounded-lg border-2 border-gray-300">
        {/* Header row with column numbers */}
        <div className="flex">
          {/* Empty corner cell */}
          <div className="w-16 h-16 border border-gray-300 bg-gray-100 flex items-center justify-center font-bold text-2xl rounded-tl-lg">
            ×
          </div>
          {/* Column headers 0-10 */}
          {Array.from({length: 11}, (_, i) => (
            <div key={`header-${i}`} className={cn(
              "w-16 h-16 border-4 bg-gray-100 flex items-center justify-center font-bold text-2xl rounded-md",
              getRigletaBorderColor(i),
              i === 10 && "rounded-tr-lg"
            )}>
              {i}
            </div>
          ))}
        </div>
        
        {/* Table rows */}
        {Array.from({length: 11}, (_, row) => (
          <div key={`pitagora-row-${row}`} className="flex">
            {/* Row header */}
            <div className={cn(
              "w-16 h-16 border-4 bg-gray-100 flex items-center justify-center font-bold text-2xl rounded-md",
              getRigletaBorderColor(row),
              row === 10 && "rounded-bl-lg"
            )}>
              {row}
            </div>
            {/* Row cells */}
            {Array.from({length: 11}, (_, col) => {
              const result = row * col;
              return renderPitagoraCell(result, row, col);
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderPitagoraCell = (result: number, row: number, col: number) => {
    const isFlipped = flippedButtons.has(result);
    
    // Get text color based on number value
    const getTextColor = (num: number) => {
      if (num === 0) return 'text-black';
      return num % 2 === 0 ? 'text-red-500' : 'text-blue-500';
    };
    
    if (isFlipped) {
      const buttonData = flippedButtons.get(result)!;
      return (
        <div
          key={`cell-${row}-${col}`}
          className={cn(
            'w-16 h-16 border-2 border-gray-400 flex items-center justify-center text-2xl font-bold cursor-default transition-all duration-500 rounded-md',
            buttonData.isCorrect 
              ? 'bg-green-500 text-white border-green-600 shadow-lg scale-110' 
              : 'bg-gray-300 text-gray-600 border-gray-400',
            row === 10 && col === 10 && "rounded-br-lg"
          )}
        >
          {buttonData.isCorrect ? '✓' : '✗'}
        </div>
      );
    }

    return (
      <div
        key={`cell-${row}-${col}`}
        className={cn(
          "w-16 h-16 border-2 border-gray-400 bg-white flex items-center justify-center text-4xl font-bold cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md rounded-md",
          getTextColor(result),
          row === 10 && col === 10 && "rounded-br-lg"
        )}
        onClick={() => handleButtonClick(result)}
      >
        {result}
      </div>
    );
  };

  const renderGrid = () => {
    if (tableMode === 'pitagora') {
      return renderPitagoraTable();
    }

    const grid = generateNumberGrid();
    
    return (
      <>
        {/* Main grid: 0-99 arranged in 10 rows x 10 columns */}
        {grid.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex gap-1 justify-start">
            {row.map(renderNumberButton)}
          </div>
        ))}
        
        {/* Number 100 on its own row */}
        <div className="flex gap-1 justify-start mt-2">
          {renderNumberButton(100)}
        </div>
      </>
    );
  };

  return (
    <div className="flex gap-8 p-4 min-h-screen">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">
            🎉 🎊 ✨ 🎉 🎊
          </div>
        </div>
      )}
      
      {/* Left Side: Interactive Number Grid */}
      <div className="flex-shrink-0">
        {/* Mode Selection Buttons */}
        <div className="mb-4 flex gap-2 justify-center">
          <Button
            onClick={() => {
              setTableMode('concentru');
              setFlippedButtons(new Map());
              setCurrentExpression(null);
            }}
            variant={tableMode === 'concentru' ? 'default' : 'outline'}
            className="px-6 py-2 font-semibold"
          >
            {translations?.concentru || "Concentru"}
          </Button>
          <Button
            onClick={() => {
              setTableMode('pitagora');
              setFlippedButtons(new Map());
              setCurrentExpression(null);
            }}
            variant={tableMode === 'pitagora' ? 'default' : 'outline'}
            className="px-6 py-2 font-semibold"
          >
            {translations?.pitagora || "Pitagora"}
          </Button>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200">          
          <div className={cn(
            "flex flex-col items-center",
            tableMode === 'concentru' ? "space-y-1" : ""
          )}>
            {renderGrid()}
          </div>
          
          {/* Validation Button at bottom of table */}
          {currentExpression && (
            <div className="mt-4 flex justify-center">
                <Button 
                onClick={() => {
                  // Clear current result and generate new problem
                  setFlippedButtons(new Map());
                  setCurrentExpression(null);
                  setTimeElapsed(0);
                  setShowHints(false);
                  
                  if (onGenerateNew) {
                    onGenerateNew();
                    toast.success(translations?.newProblemGenerated || "Problemă nouă generată!", {
                      duration: 2000,
                    });
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
              >
                {translations?.validateAndContinue || "Validează și continuă"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Results Display */}
      <div className="flex-1 min-w-0">
        {/* Requirement text - no hints */}
        <div className="mb-4">
          <h3 className="text-3xl font-semibold text-gray-700 mb-2">
            {translations?.findResult || 'Găsește rezultatul:'} {firstNumber} × {secondNumber} = ?
          </h3>
        </div>
        
        {currentExpression && (
          <div className="bg-white rounded-xl border-2 border-gray-300 p-6 sticky top-4">
            {/* Show all multiplications if multiple exist */}
            {currentExpression.multiplications.length > 1 && (
              <div className="mt-6">
                <p className="text-xl font-medium text-gray-700 mb-3 text-center">
                  {translations?.allMultiplicationsFor || 'Toate înmulțirile pentru'} {currentExpression.result}:
                </p>
                <div className="space-y-3">
                  {currentExpression.multiplications.map((mult, index) => {
                    const [first, second] = mult.split(' × ').map(Number);
                    return (
                      <div key={index} className="flex items-center justify-center gap-4 p-3 bg-blue-50 rounded-lg">
                        {/* First factor with label */}
                        <div className="flex flex-col items-center">
                          <div className={`border-2 border-black rounded-md bg-white px-8 py-4 text-3xl font-bold ${
                            first % 2 === 0 ? 'text-red-500' : 'text-blue-500'
                          }`}>
                            {first}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {translations?.units || 'unități'}
                          </div>
                        </div>
                        
                        <div className="text-2xl font-bold text-gray-700">×</div>
                        
                        {/* Second factor with label */}
                        <div className="flex flex-col items-center">
                          <div className={`border-2 border-black rounded-md bg-white px-8 py-4 text-3xl font-bold ${
                            second % 2 === 0 ? 'text-red-500' : 'text-blue-500'
                          }`}>
                            {second}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {translations?.units || 'unități'}
                          </div>
                        </div>
                        
                        <div className="text-2xl font-bold text-gray-700">=</div>
                        
                        {/* Result with label */}
                        <div className="flex flex-col items-center">
                          <div className={`border-2 border-black rounded-md bg-white px-8 py-4 text-3xl font-bold ${
                            currentExpression.result % 2 === 0 ? 'text-red-500' : 'text-blue-500'
                          }`}>
                            {currentExpression.result}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {currentExpression.result >= 100 ? (translations?.hundreds || 'sute') : 
                             currentExpression.result >= 10 ? (translations?.tens || 'zeci') : 
                             (translations?.units || 'unități')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Progress bar */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(flippedButtons.size / 101) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
        
        {!currentExpression && (
          <div className="bg-gray-50 rounded-xl border-2 border-gray-300 p-8 text-center">
            <h4 className="text-xl font-semibold text-gray-600 mb-2">
              {translations?.pressButtonFromTable || 'Apasă pe un buton din tabel'}
            </h4>
            <p className="text-gray-500">
              {translations?.resultsWillAppearHere || 'Rezultatele vor apărea aici'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}