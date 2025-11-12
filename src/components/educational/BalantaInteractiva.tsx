import React, { useState, useEffect, useImperativeHandle, forwardRef, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import RigletaNumLit from "./RigletaNumLit";
import PlaceValueContainer from "./PlaceValueContainer";

interface BalanceItem {
  id: string;
  value: number;
  type: 'number' | 'rigleta';
  position: { x: number; y: number };
}

interface BalantaInteractivaProps {
  gameVariant?: 'riglete' | 'numere' | 'ecuatii';
  onBalanceChange?: (leftValue: number, rightValue: number) => void;
  leftValue?: number;
  rightValue?: number;
  concentration?: number;
  gameLevel?: number;
  onShowKeyboard?: () => void;
  digits?: number;
  onDigitsChange?: (digits: number) => void;
  translations?: {
    dragHere?: string;
    resetTrays?: string;
    balanced?: string;
    leftHeavier?: string;
    rightHeavier?: string;
    showKeyboard?: string;
    writeNumber?: string;
    dragRigleta?: string;
    correct?: string;
    tryAgain?: string;
    numberOfDigits?: string;
    smaller?: string;
    equal?: string;
    bigger?: string;
    drop?: string;
    delete?: string;
    units?: string;
    tens?: string;
    hundreds?: string;
    thousands?: string;
    tenThousands?: string;
    hundredThousands?: string;
    chooseAndDragCorrect?: string;
    dragCorrectOption?: string;
    dropZoneFor?: string;
    difference?: string;
    youChose?: string;
  };
  onKeyPress?: (key: string) => void;
  keyboardInput?: string; // Add this to receive keyboard input from parent
}

const BalantaInteractiva: React.FC<BalantaInteractivaProps> = ({
  gameVariant = 'riglete',
  onBalanceChange,
  leftValue = 0,
  rightValue = 0,
  concentration = 10,
  gameLevel = 1,
  onShowKeyboard,
  digits = 1,
  onDigitsChange,
  onKeyPress,
  keyboardInput,
  translations = {
    dragHere: 'Trage aici',
    resetTrays: 'Resetează Tăvile',
    balanced: 'ECHILIBRAT',
    leftHeavier: 'STÂNGA MAI GREA',
    rightHeavier: 'DREAPTA MAI GREA',
    showKeyboard: 'Arată Tastatura',
    writeNumber: 'Scrie numărul',
    dragRigleta: 'Trage rigleta aici',
    correct: 'Correct!',
    tryAgain: 'Mai încearcă!',
    numberOfDigits: 'Numărul de cifre',
    smaller: '<',
    equal: '=',
    bigger: '>',
    drop: 'Pune',
    delete: '🗑️ Șterge',
    units: 'U',
    tens: 'Z',
    hundreds: 'S',
    thousands: 'M',
    tenThousands: 'ZM',
    hundredThousands: 'SM',
    chooseAndDragCorrect: 'Alege și trage diferența corectă:',
    dragCorrectOption: 'Trage opțiunea corectă pe brațul balanței',
    dropZoneFor: 'Zone de drop pentru diferență',
    difference: 'Diferența',
    youChose: 'Ai ales:'
  }
}) => {
  // Common state
  const [leftItems, setLeftItems] = useState<BalanceItem[]>([]);
  const [rightItems, setRightItems] = useState<BalanceItem[]>([]);
  const [balanceState, setBalanceState] = useState<'balanced' | 'left-heavy' | 'right-heavy'>('balanced');
  const [isAnimating, setIsAnimating] = useState(false);
  const [bounceAnimation, setBounceAnimation] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  // Level-specific state
  const [leftDisplayValue, setLeftDisplayValue] = useState<number>(0);
  const [rightDisplayValue, setRightDisplayValue] = useState<number>(0);
  const [targetEquilibrium, setTargetEquilibrium] = useState<number>(0);
  const [showRigletaLeft, setShowRigletaLeft] = useState(false);
  const [showRigletaRight, setShowRigletaRight] = useState(false);
  const [digitContainers, setDigitContainers] = useState<Array<{digit: number, rigletaItems: any[]}>>([]);
  const [selectedComparison, setSelectedComparison] = useState<'<' | '=' | '>' | null>(null);
  
  // Level 1 Multi-digit place value containers (digits >= 2)
  const [placeValueContainers, setPlaceValueContainers] = useState<Array<{
    position: number;        // 0=units, 1=tens, 2=hundreds, etc.
    expectedDigit: number;   // cifra corectă
    rigletaValue: number | null; // valoarea rigletei plasate (sau null)
    isCorrect: boolean | null;      // verificare dacă e corectă (null = nu s-a verificat încă)
  }>>([]);
  
  // Level 3 specific state
  const [difference, setDifference] = useState<number>(0);
  const [showResultEquation, setShowResultEquation] = useState(false);
  const [showAdditionProof, setShowAdditionProof] = useState(false);
  const [numbersHighlighted, setNumbersHighlighted] = useState(false);
  const [activeDifferenceBox, setActiveDifferenceBox] = useState<number>(0);
  const [differenceInput, setDifferenceInput] = useState<string[]>([]);
  
  // Level 3 drag & drop options
  const [differenceOptions, setDifferenceOptions] = useState<number[]>([]);
  const [droppedResult, setDroppedResult] = useState<number | null>(null);
  const [draggedOption, setDraggedOption] = useState<number | null>(null);

  // Calculate total values based on current state
  const leftTotal = leftItems.reduce((sum, item) => sum + item.value, 0) + leftDisplayValue;
  
  // Include placeValueContainers total for Level 1 multi-digit
  const containersTotal = gameLevel === 1 && digits >= 2
    ? placeValueContainers.reduce((sum, c) => {
        const v = c.rigletaValue || 0;
        return sum + v * Math.pow(10, c.position);
      }, 0)
    : 0;
  
  const rightTotal = rightItems.reduce((sum, item) => sum + item.value, 0) + rightDisplayValue + (inputValue ? parseInt(inputValue) || 0 : 0) + containersTotal;

  // Update balance state with animation
  useEffect(() => {
    setIsAnimating(true);
    
    const timer = setTimeout(() => {
      const previousState = balanceState;
      let newState: 'balanced' | 'left-heavy' | 'right-heavy';
      
      if (leftTotal === rightTotal) {
        newState = 'balanced';
      } else if (leftTotal > rightTotal) {
        newState = 'left-heavy';
      } else {
        newState = 'right-heavy';
      }
      
      setBalanceState(newState);
      
      if (previousState !== newState) {
        setBounceAnimation(true);
        setTimeout(() => setBounceAnimation(false), 600);
        
        if (navigator.vibrate) {
          if (newState === 'balanced') {
            navigator.vibrate([100, 50, 100]);
          } else {
            navigator.vibrate(200);
          }
        }
      }
      
      setIsAnimating(false);
    }, 300);

    onBalanceChange?.(leftTotal, rightTotal);
    return () => clearTimeout(timer);
  }, [leftTotal, rightTotal, balanceState]);

  // Generate random value based on concentration
  const generateValue = () => {
    return Math.floor(Math.random() * concentration) + 1;
  };

  // Initialize game based on level
  const initializeGame = () => {
    setLeftItems([]);
    setRightItems([]);
    setInputValue('');
    setSelectedComparison(null);
    setShowSuccess(false);

    switch (gameLevel) {
      case 1:
        // Nivel 1: Un taler cu număr/rigleta, celălalt gol pentru completare
        let value: number;
        if (digits >= 2) {
          const min = Math.pow(10, digits - 1);
          const max = Math.pow(10, digits) - 1;
          value = Math.floor(Math.random() * (max - min + 1)) + min;
        } else {
          value = generateValue();
        }
        
        if (digits >= 2) {
          // Multi-digit mode: decompose number into individual digits
          setShowRigletaLeft(false);
          setLeftDisplayValue(value);
          setShowRigletaRight(false);
          setRightDisplayValue(0);
          
          // Create place value containers for each digit
          const valueStr = value.toString();
          const containers = valueStr.split('').map((digitChar, index) => ({
            position: digits - 1 - index, // 0=units, 1=tens, etc.
            expectedDigit: parseInt(digitChar),
            rigletaValue: null,
            isCorrect: null
          }));
          
          setPlaceValueContainers(containers);
        } else {
          // Single digit mode (existing logic)
          const showRigleta = Math.random() > 0.5;
          
          if (showRigleta) {
            setShowRigletaLeft(true);
            setLeftDisplayValue(value);
            setShowRigletaRight(false);
            setRightDisplayValue(0);
          } else {
            setShowRigletaLeft(false);
            setLeftDisplayValue(value);
            setShowRigletaRight(false);
            setRightDisplayValue(0);
          }
          setPlaceValueContainers([]);
        }
        break;

      case 2:
        // Nivel 2: Comparația sau echilibrare cu număr țintă
        const leftVal = generateValue();
        const rightVal = generateValue();
        setLeftDisplayValue(leftVal);
        setRightDisplayValue(rightVal);
        setShowRigletaLeft(false);
        setShowRigletaRight(false);
        break;

      case 3:
        // Nivel 3: Două numere diferite pe brațele balanței cu opțiuni drag & drop
        const leftNumber = generateValue();
        let rightNumber = generateValue();
        
        // Asigură că numerele sunt diferite
        while (rightNumber === leftNumber) {
          rightNumber = generateValue();
        }
        
        const correctDifference = Math.abs(leftNumber - rightNumber);
        
        // Generează 3 opțiuni: corect, corect-1, corect+1
        const options = [
          correctDifference,
          Math.max(0, correctDifference - 1),
          correctDifference + 1
        ];
        
        // Amestecă opțiunile pentru afișare aleatorie
        const shuffledOptions = options.sort(() => Math.random() - 0.5);
        
        setLeftDisplayValue(leftNumber);
        setRightDisplayValue(rightNumber);
        setDifference(correctDifference);
        setDifferenceOptions(shuffledOptions);
        setDroppedResult(null);
        setDraggedOption(null);
        setShowRigletaLeft(false);
        setShowRigletaRight(false);
        setShowResultEquation(false);
        setShowAdditionProof(false);
        setNumbersHighlighted(false);
        break;

      case 4:
        // Nivel 4: Ecuații pe ambele tăvi (implementare viitoare)
        setLeftDisplayValue(generateValue());
        setRightDisplayValue(generateValue());
        setShowRigletaLeft(false);
        setShowRigletaRight(false);
        break;

      default:
        break;
    }
  };

  // Initialize game on mount and level change
  useEffect(() => {
    initializeGame();
  }, [gameLevel, concentration]);

  // React to keyboard input from parent component (Level 3)
  useEffect(() => {
    if (keyboardInput && gameLevel === 3) {
      console.log('Received keyboardInput from parent:', keyboardInput);
      handleKeyPress(keyboardInput);
      
      // Notify parent that we processed the input (if callback exists)
      if (onKeyPress) {
        onKeyPress('processed');
      }
    }
  }, [keyboardInput, gameLevel]);


  // Handle drag and drop on place value containers (Level 1, digits >= 2)
  const handleDropOnPlaceValue = useCallback((e: React.DragEvent, position: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rigletaValue = parseInt(e.dataTransfer.getData('rigleta-value'));
    
    // Validate input
    if (isNaN(rigletaValue) || rigletaValue < 0 || rigletaValue > 9) {
      console.warn('Invalid rigleta value:', rigletaValue);
      return;
    }
    
    // Optimized update: only update the specific container
    setPlaceValueContainers(prev => {
      const index = prev.findIndex(c => c.position === position);
      if (index === -1) return prev;
      
      const newContainers = [...prev];
      newContainers[index] = {
        ...newContainers[index],
        rigletaValue,
        isCorrect: null
      };
      return newContainers;
    });
  }, []);

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent, side: 'left' | 'right') => {
    e.preventDefault();
    
    // Handle Level 3 difference option drop
    if (gameLevel === 3) {
      const droppedDifference = e.dataTransfer.getData('difference-option');
      if (droppedDifference) {
        const droppedValue = parseInt(droppedDifference);
        setDroppedResult(droppedValue);
        
        // Validate immediately when dropped
        const correctDifference = Math.abs(leftDisplayValue - rightDisplayValue);
        if (droppedValue === correctDifference) {
          // Correct answer - start countdown validation display
          setBalanceState('balanced');
          setNumbersHighlighted(true);
          setShowSuccess(true);
          setShowValidation(true);
          setCountdown(7);
          
          toast({
            title: translations.correct || 'Correct!',
            description: "Diferența este corectă! Balanța este în echilibru!",
            duration: 2000,
          });
          
          // Show equation and proof with countdown
          setTimeout(() => {
            setShowResultEquation(true);
          }, 500);
          
          setTimeout(() => {
            setShowAdditionProof(true);
          }, 1500);
        } else {
          // Wrong answer
          toast({
            title: translations.tryAgain || 'Try again!',
            description: "Diferența nu este corectă. Încearcă din nou!",
            variant: "destructive",
            duration: 2000,
          });
          
          // Reset after a moment
          setTimeout(() => {
            setDroppedResult(null);
          }, 1500);
        }
        return;
      }
    }
    
    // Original drag & drop logic for rigletas and other levels
    const itemType = e.dataTransfer.getData('application/reactflow');
    if (itemType === 'rigleta') {
      const rigletaValue = parseInt(e.dataTransfer.getData('rigleta-value'));
      
      
      const newItem: BalanceItem = {
        id: Date.now().toString(),
        value: rigletaValue,
        type: 'rigleta',
        position: { x: 0, y: 0 }
      };

      if (side === 'left') {
        setLeftItems(prev => [...prev, newItem]);
      } else {
        setRightItems(prev => [...prev, newItem]);
      }
      return;
    }
    
    const data = e.dataTransfer.getData('text/plain');
    try {
      const item: BalanceItem = JSON.parse(data);
      const newItem = {
        ...item,
        id: Date.now().toString(),
        position: { x: 0, y: 0 }
      };

      if (side === 'left') {
        setLeftItems(prev => [...prev, newItem]);
      } else {
        setRightItems(prev => [...prev, newItem]);
      }
    } catch (error) {
      console.error('Error parsing dropped item:', error);
    }
  };

  const dragOverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    // Throttle drag over events to reduce re-renders
    if (dragOverTimeoutRef.current) return;
    
    dragOverTimeoutRef.current = setTimeout(() => {
      dragOverTimeoutRef.current = null;
    }, 16); // ~60fps
  }, []);

  // Remove item from tray
  const removeItem = (id: string, side: 'left' | 'right') => {
    if (side === 'left') {
      setLeftItems(prev => prev.filter(item => item.id !== id));
    } else {
      setRightItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // Handle keyboard input
  const handleKeyPress = (key: string) => {
    console.log('BalantaInteractiva handleKeyPress called with key:', key, 'gameLevel:', gameLevel);
    
    if (gameLevel === 3) {
      console.log('Level 3 - activeDifferenceBox:', activeDifferenceBox, 'differenceInput:', differenceInput);
      // Level 3: Handle input in difference boxes
      if (key === 'backspace') {
        if (activeDifferenceBox > 0 && differenceInput[activeDifferenceBox] === '') {
          // Move to previous box if current is empty
          setActiveDifferenceBox(prev => prev - 1);
          setDifferenceInput(prev => {
            const newInput = [...prev];
            newInput[activeDifferenceBox - 1] = '';
            return newInput;
          });
        } else {
          // Clear current box
          setDifferenceInput(prev => {
            const newInput = [...prev];
            newInput[activeDifferenceBox] = '';
            return newInput;
          });
        }
      } else if (key === 'validate') {
        validateAnswer();
      } else if (!isNaN(Number(key))) {
        // Add digit to current box
        setDifferenceInput(prev => {
          const newInput = [...prev];
          newInput[activeDifferenceBox] = key;
          
          // Move to next box if not at the end
          if (activeDifferenceBox < newInput.length - 1) {
            setActiveDifferenceBox(prev => prev + 1);
          }
          
          return newInput;
        });
        
        // Update inputValue for validation (join all digits)
        setTimeout(() => {
          setInputValue(differenceInput.join('').replace(/^0+/, '') || '0');
        }, 0);
      }
    } else {
      // Original logic for other levels
      if (key === 'backspace') {
        setInputValue(prev => prev.slice(0, -1));
      } else if (key === 'validate') {
        validateAnswer();
      } else if (key === '+' || key === '-' || !isNaN(Number(key))) {
        setInputValue(prev => prev + key);
      }
    }
  };


  const [countdown, setCountdown] = useState<number | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  // Countdown effect for validation display
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Auto restart after countdown
      restartGame();
    }
  }, [countdown]);

  const restartGame = () => {
    setShowSuccess(false);
    setNumbersHighlighted(false);
    setShowResultEquation(false);
    setShowAdditionProof(false);
    setShowValidation(false);
    setCountdown(null);
    initializeGame();
  };

  // Calculate total value from place value containers
  const calculateTotalFromContainers = () => {
    return placeValueContainers.reduce((sum, container) => {
      const value = container.rigletaValue || 0;
      return sum + (value * Math.pow(10, container.position));
    }, 0);
  };

  // Validate answer based on game level
  const validateAnswer = () => {
    let isCorrect = false;

    switch (gameLevel) {
      case 1:
        if (digits >= 2 && placeValueContainers.length > 0) {
          // Multi-digit mode: Verifică fiecare container individual
          const allFilled = placeValueContainers.every(c => c.rigletaValue !== null);
          
          if (!allFilled) {
            toast({
              title: translations.tryAgain || 'Try again!',
              description: "Completează toate căsuțele cu rigletele corespunzătoare!",
              variant: "destructive",
              duration: 2000,
            });
            return;
          }
          
          // Multi-digit mode: Check each container
          let allCorrect = true;
          
          // Create updated containers with validation
          const updatedContainers = placeValueContainers.map(container => {
            const isCorrect = container.rigletaValue === container.expectedDigit;
            if (!isCorrect) allCorrect = false;
            return { ...container, isCorrect };
          });
          
          // Update state with validation results
          setPlaceValueContainers(updatedContainers);
          
          // Set final isCorrect based on all containers
          isCorrect = allCorrect;
          
          // Show feedback for wrong answers
          if (!isCorrect) {
            setTimeout(() => {
              setPlaceValueContainers(prev => prev.map(c => ({ ...c, isCorrect: null })));
            }, 2000);
          }
        } else {
          // Single digit mode (existing logic)
          if (showRigletaLeft) {
            // Dacă pe stânga e rigleta, pe dreapta trebuie scris numărul
            const inputNum = parseInt(inputValue);
            isCorrect = inputNum === leftDisplayValue;
          } else {
            // Dacă pe stânga e număr, pe dreapta trebuie adusă rigleta
            const rightTotal = rightItems.reduce((sum, item) => sum + item.value, 0);
            isCorrect = rightTotal === leftDisplayValue;
          }
        }
        break;

      case 2:
        // Nivel 2: Verifică comparația selectată
        if (selectedComparison) {
          const actualComparison = leftDisplayValue < rightDisplayValue ? '<' : 
                                   leftDisplayValue === rightDisplayValue ? '=' : '>';
          isCorrect = selectedComparison === actualComparison;
        }
        break;

      case 3:
        // Nivel 3: Verifică diferența dintre cele două numere
        const differenceValue = differenceInput.join('').replace(/^0+/, '') || '0';
        const inputNum = parseInt(differenceValue);
        const expectedDifference = Math.abs(leftDisplayValue - rightDisplayValue);
        isCorrect = inputNum === expectedDifference;
        break;

      case 4:
        // Nivel 4: Verifică ecuațiile (implementare viitoare)
        isCorrect = leftTotal === rightTotal;
        break;

      default:
        break;
    }

    if (isCorrect) {
      if (gameLevel === 1 && digits >= 2 && placeValueContainers.length > 0) {
        // Level 1 multi-digit: Show balance animation and equation
        setBalanceState('balanced');
        setNumbersHighlighted(true);
        setShowSuccess(true);
        setShowValidation(true);
        setShowResultEquation(true);
        setCountdown(5);
        
        toast({
          title: translations.correct || 'Correct!',
          description: "Egalitatea este corectă!",
          duration: 2000,
        });
      } else if (gameLevel === 3) {
        // Nivel 3: Start countdown validation display
        setNumbersHighlighted(true);
        setShowSuccess(true);
        setShowValidation(true);
        setCountdown(7);
        
        // Show equation and proof with countdown
        setTimeout(() => {
          setShowResultEquation(true);
        }, 500);
        
        setTimeout(() => {
          setShowAdditionProof(true);
        }, 1500);
        
        toast({
          title: translations.correct || 'Correct!',
          description: "Diferența este corectă!",
          duration: 2000,
        });
      } else {
        setShowSuccess(true);
        toast({
          title: translations.correct || 'Correct!',
          description: "Răspuns corect! Se încarcă un nou joc...",
          duration: 2000,
        });
        
        setTimeout(() => {
          setShowSuccess(false);
          initializeGame();
        }, 2500);
      }
    } else {
      toast({
        title: translations.tryAgain || 'Try again!',
        description: "Încearcă din nou cu un alt răspuns.",
        variant: "destructive",
        duration: 2000,
      });
      setInputValue('');
      setSelectedComparison(null);
    }
  };

  // Handle comparison button click (Level 2)
  const handleComparisonClick = (comparison: '<' | '=' | '>') => {
    setSelectedComparison(comparison);
    
    // Auto-validate for comparison
    const actualComparison = leftDisplayValue < rightDisplayValue ? '<' : 
                             leftDisplayValue === rightDisplayValue ? '=' : '>';
    
    if (comparison === actualComparison) {
      // Correct - animate balance with scale and glow effect
      setIsValidating(true);
      
      if (comparison === '=') {
        setBalanceState('balanced');
      } else if (comparison === '<') {
        setBalanceState('right-heavy');
      } else {
        setBalanceState('left-heavy');
      }
      
      setShowSuccess(true);
      toast({
        title: translations.correct || 'Correct!',
        description: "Comparația este corectă!",
        duration: 2000,
      });
      
      // Scale animation with glow effect
      setTimeout(() => {
        setIsValidating(false);
      }, 1200);
      
      setTimeout(() => {
        setShowSuccess(false);
        initializeGame();
      }, 2500);
    } else {
      toast({
        title: translations.tryAgain || 'Try again!',
        description: "Comparația nu este corectă.",
        variant: "destructive",
        duration: 2000,
      });
      setSelectedComparison(null);
    }
  };

  // Get balance rotation angle
  const getBalanceRotation = () => {
    if (balanceState === 'balanced') return 'rotate-0';
    if (balanceState === 'left-heavy') return '-rotate-6';
    return 'rotate-6';
  };

  // Reset game
  const resetGame = () => {
    initializeGame();
  };

  return (
    <div className="flex flex-col items-center p-8 select-none">
      {/* Level 3: Display drag & drop options instead of input boxes */}
      {gameLevel === 3 && !showResultEquation && (
        <div className="flex flex-col items-center mb-6">
          {/* Difference options - drag & drop */}
          <div className="flex flex-col items-center mb-4">
            <div className="text-lg font-medium text-gray-700 mb-4">{translations.chooseAndDragCorrect}</div>
            <div className="flex gap-4">
              {differenceOptions.map((option, i) => (
                <div 
                  key={i}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', option.toString());
                    e.dataTransfer.setData('difference-option', option.toString());
                    setDraggedOption(option);
                  }}
                  onDragEnd={() => setDraggedOption(null)}
                  className={cn(
                    "w-16 h-16 border-2 rounded-lg flex items-center justify-center text-2xl font-bold cursor-move transition-all duration-200 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 text-blue-800 shadow-lg hover:shadow-xl hover:scale-105",
                    draggedOption === option && "opacity-50 scale-95"
                  )}
                >
                  {option}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-2">{translations.dragCorrectOption}</div>
          </div>
          
          {/* Drop zone indicator */}
          {droppedResult !== null && (
            <div className="text-lg font-semibold text-green-600 mb-2">
              {translations.youChose}: {droppedResult}
            </div>
          )}
        </div>
      )}
      
      {/* Level 1: Equation validation display */}
      {gameLevel === 1 && showValidation && showResultEquation && (
        <div className="flex flex-col items-center mb-6 space-y-4">
          {/* Countdown timer */}
          {countdown !== null && countdown > 0 && (
            <div className="text-5xl font-bold text-green-500 animate-pulse">
              {countdown}
            </div>
          )}
          
          {/* Equation: leftValue = rightValue */}
          <div className="flex items-center gap-4 animate-fade-in bg-green-50 p-6 rounded-2xl border-4 border-green-400 shadow-2xl">
            {/* Left side number */}
            <div className="flex gap-1">
              {leftDisplayValue.toString().split('').map((digit, index) => (
                <div 
                  key={`left-${index}`}
                  className="w-16 h-16 border-2 border-blue-500 bg-white rounded-lg flex items-center justify-center text-3xl font-bold text-black shadow-md"
                >
                  {digit}
                </div>
              ))}
            </div>
            
            {/* Equals sign */}
            <div className="text-5xl font-bold text-green-600">=</div>
            
            {/* Right side number (from containers) */}
            <div className="flex gap-1">
              {calculateTotalFromContainers().toString().split('').map((digit, index) => (
                <div 
                  key={`right-${index}`}
                  className="w-16 h-16 border-2 border-green-500 bg-green-50 rounded-lg flex items-center justify-center text-3xl font-bold text-black shadow-md"
                >
                  {digit}
                </div>
              ))}
            </div>
          </div>
          
          {/* Success message */}
          <div className="text-2xl font-bold text-green-600 animate-bounce">
            ✓ Balanța este echilibrată!
          </div>
        </div>
      )}
      
      {/* Level 3: Mathematical validation display with countdown */}
      {gameLevel === 3 && showValidation && (
        <div className="flex flex-col items-center mb-6 space-y-4">
          {/* Countdown timer */}
          {countdown !== null && (
            <div className="text-6xl font-bold text-red-500 animate-pulse">
              {countdown}
            </div>
          )}
          
          {/* Result equation in mathematical squares */}
          {showResultEquation && (
            <div className="flex flex-col items-center space-y-4 animate-fade-in">
              {/* Equation display */}
              <div className="flex items-center gap-2">
                {/* First number */}
                <div className="flex flex-col items-center">
                  <div className="flex gap-1">
                    {Math.max(leftDisplayValue, rightDisplayValue).toString().split('').map((digit, index) => (
                      <div 
                        key={index}
                        className="w-16 h-16 border-2 border-blue-500 bg-white rounded-lg flex items-center justify-center text-3xl font-bold text-black shadow-md"
                      >
                        {digit}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {Math.max(leftDisplayValue, rightDisplayValue).toString().split('').map((_, index) => {
                      const position = Math.max(leftDisplayValue, rightDisplayValue).toString().length - 1 - index;
                      const placeLabels = [translations.units, translations.tens, translations.hundreds, translations.thousands];
                      return (
                        <div key={index} className="text-xs font-medium text-gray-600 text-center w-16">
                          {placeLabels[position] || ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Minus sign */}
                <div className="text-4xl font-bold text-black mx-2">-</div>
                
                {/* Second number */}
                <div className="flex flex-col items-center">
                  <div className="flex gap-1">
                    {Math.min(leftDisplayValue, rightDisplayValue).toString().split('').map((digit, index) => (
                      <div 
                        key={index}
                        className="w-16 h-16 border-2 border-blue-500 bg-white rounded-lg flex items-center justify-center text-3xl font-bold text-black shadow-md"
                      >
                        {digit}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {Math.min(leftDisplayValue, rightDisplayValue).toString().split('').map((_, index) => {
                      const position = Math.min(leftDisplayValue, rightDisplayValue).toString().length - 1 - index;
                      const placeLabels = [translations.units, translations.tens, translations.hundreds, translations.thousands];
                      return (
                        <div key={index} className="text-xs font-medium text-gray-600 text-center w-16">
                          {placeLabels[position] || ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Equals sign */}
                <div className="text-4xl font-bold text-black mx-2">=</div>
                
                {/* Result */}
                <div className="flex flex-col items-center">
                  <div className="flex gap-1">
                    {difference.toString().split('').map((digit, index) => (
                      <div 
                        key={index}
                        className="w-16 h-16 border-2 border-green-500 bg-green-50 rounded-lg flex items-center justify-center text-3xl font-bold text-black shadow-md"
                      >
                        {digit}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {difference.toString().split('').map((_, index) => {
                      const position = difference.toString().length - 1 - index;
                      const placeLabels = [translations.units, translations.tens, translations.hundreds, translations.thousands];
                      return (
                        <div key={index} className="text-xs font-medium text-gray-600 text-center w-16">
                          {placeLabels[position] || ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Addition proof */}
              {showAdditionProof && (
                <div className="flex items-center gap-2 animate-fade-in">
                  <div className="text-lg font-medium text-blue-600 mr-4">Proof:</div>
                  
                  {/* Smaller number */}
                  <div className="flex flex-col items-center">
                    <div className="flex gap-1">
                      {Math.min(leftDisplayValue, rightDisplayValue).toString().split('').map((digit, index) => (
                        <div 
                          key={index}
                          className="w-12 h-12 border-2 border-blue-500 bg-white rounded-lg flex items-center justify-center text-xl font-bold text-black shadow-md"
                        >
                          {digit}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1 mt-1">
                      {Math.min(leftDisplayValue, rightDisplayValue).toString().split('').map((_, index) => {
                        const position = Math.min(leftDisplayValue, rightDisplayValue).toString().length - 1 - index;
                        const placeLabels = [translations.units, translations.tens, translations.hundreds, translations.thousands];
                        return (
                          <div key={index} className="text-xs font-medium text-gray-600 text-center w-12">
                            {placeLabels[position] || ''}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Plus sign */}
                  <div className="text-3xl font-bold text-black mx-2">+</div>
                  
                  {/* Difference */}
                  <div className="flex flex-col items-center">
                    <div className="flex gap-1">
                      {difference.toString().split('').map((digit, index) => (
                        <div 
                          key={index}
                          className="w-12 h-12 border-2 border-green-500 bg-green-50 rounded-lg flex items-center justify-center text-xl font-bold text-black shadow-md"
                        >
                          {digit}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1 mt-1">
                      {difference.toString().split('').map((_, index) => {
                        const position = difference.toString().length - 1 - index;
                        const placeLabels = [translations.units, translations.tens, translations.hundreds, translations.thousands];
                        return (
                          <div key={index} className="text-xs font-medium text-gray-600 text-center w-12">
                            {placeLabels[position] || ''}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Equals sign */}
                  <div className="text-3xl font-bold text-black mx-2">=</div>
                  
                  {/* Result */}
                  <div className="flex flex-col items-center">
                    <div className="flex gap-1">
                      {Math.max(leftDisplayValue, rightDisplayValue).toString().split('').map((digit, index) => (
                        <div 
                          key={index}
                          className="w-12 h-12 border-2 border-blue-500 bg-white rounded-lg flex items-center justify-center text-xl font-bold text-black shadow-md"
                        >
                          {digit}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1 mt-1">
                      {Math.max(leftDisplayValue, rightDisplayValue).toString().split('').map((_, index) => {
                        const position = Math.max(leftDisplayValue, rightDisplayValue).toString().length - 1 - index;
                        const placeLabels = [translations.units, translations.tens, translations.hundreds, translations.thousands];
                        return (
                          <div key={index} className="text-xs font-medium text-gray-600 text-center w-12">
                            {placeLabels[position] || ''}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Restart button */}
              <Button 
                onClick={restartGame}
                variant="outline"
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
              >
                Continue Game
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Central support structure */}
      <div className={cn(
        "flex flex-col items-center mb-6 transition-all duration-1000",
        gameLevel === 2 && isValidating && "scale-120 drop-shadow-2xl",
        gameLevel === 2 && isValidating && "animate-pulse"
      )}>
        <div className={cn(
          "w-24 h-8 bg-gradient-to-b from-slate-400 to-slate-600 rounded-xl shadow-lg transition-all duration-1000",
          gameLevel === 2 && isValidating && "shadow-2xl shadow-green-500/50"
        )}></div>
        <div className={cn(
          "w-4 h-32 bg-gradient-to-r from-slate-300 to-slate-400 relative shadow-md transition-all duration-1000",
          gameLevel === 2 && isValidating && "shadow-xl shadow-green-500/30"
        )}>
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-slate-200 to-slate-400 rounded-full shadow-lg"></div>
        </div>
      </div>

      {/* Balance arm with animation */}
      <div className={`relative transition-transform duration-700 ease-in-out ${getBalanceRotation()}`}>
        <div className="w-[500px] h-2 bg-gradient-to-r from-slate-300 to-slate-400 shadow-lg">
          
          {/* Left tray */}
          <div className="absolute -left-20 -top-8">
            {/* Content above left tray */}
            <div className="mb-3 min-h-[80px] flex flex-col items-center justify-end">
              {/* Display numbers in squares format exactly like in image */}
              {leftDisplayValue > 0 && (
                <div className="flex flex-col items-center mb-2">
                  {/* Number squares display */}
                  <div className="flex gap-1 mb-2">
                    {leftDisplayValue.toString().padStart(digits, '0').split('').map((digit, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "w-12 h-12 border-2 border-gray-400 bg-white rounded-lg flex items-center justify-center text-2xl font-bold text-black shadow-sm transition-all duration-500",
                          gameLevel === 3 && numbersHighlighted && "scale-125 bg-yellow-200 border-yellow-400 shadow-yellow-500/50 shadow-xl"
                        )}
                      >
                        {digit}
                      </div>
                    ))}
                  </div>
                  
                  {/* Place value labels under numbers - always show for Level 3 */}
                  {gameLevel === 3 && (
                    <div className="flex gap-1 mt-1">
                      {leftDisplayValue.toString().padStart(digits, '0').split('').map((_, index) => {
                        const position = digits - 1 - index;
                        const placeLabels = [translations.units, translations.tens, translations.hundreds, translations.thousands, translations.tenThousands, translations.hundredThousands];
                        const colors = ['bg-blue-500', 'bg-orange-500', 'bg-red-500', 'bg-black'];
                        
                        return (
                          <div key={index} className="flex flex-col items-center">
                            <div className={`w-6 h-6 ${colors[position] || 'bg-gray-500'} text-white text-xs font-bold rounded flex items-center justify-center`}>
                              {placeLabels[position] || 'X'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                   {/* Drop zones with place value labels - NOT for Level 3 */}
                   {gameLevel !== 3 && (
                    <div className="flex gap-1">
                      {leftDisplayValue.toString().padStart(digits, '0').split('').map((_, index) => {
                        const position = digits - 1 - index;
                        const placeLabels = [translations.units, translations.tens, translations.hundreds, translations.thousands, translations.tenThousands, translations.hundredThousands];
                        const colors = ['bg-blue-500', 'bg-orange-500', 'bg-red-500', 'bg-black'];
                        
                        // Hide first 3 positions for level 1 (digits 4-6)
                        if (digits === 6 && index < 3) {
                          return null;
                        }
                       
                       return (
                         <div key={index} className="flex flex-col items-center">
                           <div className="w-12 h-8 border-2 border-dashed border-gray-400 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-500">
                             {translations.drop}
                           </div>
                           <div className={`w-6 h-6 ${colors[position] || 'bg-gray-500'} text-white text-xs font-bold rounded flex items-center justify-center mt-1`}>
                             {placeLabels[position] || 'X'}
                           </div>
                         </div>
                       );
                     })}
                   </div>
                   )}
                </div>
              )}
              
              {/* Display rigleta only when explicitly needed - removed for clean display */}
              
              {/* Display left items */}
              {leftItems.map((item) => (
                <div 
                  key={item.id} 
                  className="mb-1 cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => removeItem(item.id, 'left')}
                >
                  {item.type === 'rigleta' ? (
                    <RigletaNumLit 
                      number={item.value}
                      translations={{ tens: "Z", units: "U", hundreds: "S", thousands: "M" }}
                      className="scale-75"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-slate-800 drop-shadow-lg bg-white/90 px-2 py-1 rounded-lg">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
            
            {/* Left tray plate */}
            <div 
              className={cn(
                "w-40 h-20 cursor-pointer transition-all duration-300",
                gameLevel === 3 ? "border-2 border-dashed border-purple-400 bg-purple-50/50 rounded-lg flex items-center justify-center" : "bg-transparent border-transparent"
              )}
              onDrop={(e) => handleDrop(e, 'left')}
              onDragOver={handleDragOver}
            >
              <div className="relative z-10 flex flex-col items-center justify-center h-full w-full p-2">
                {gameLevel === 3 ? (
                  <div className="text-sm text-purple-600 text-center font-medium">
                    📍 {translations.dropZoneFor}
                  </div>
                ) : (
                  <div className="text-transparent invisible">
                    {/* Completely hidden drag area */}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right tray */}
          <div className="absolute -right-20 -top-8">
            {/* Content above right tray */}
            <div className="mb-3 min-h-[80px] flex flex-col items-center justify-end">
              
              {/* Display place value containers for Level 1 multi-digit mode */}
              {gameLevel === 1 && digits >= 2 && placeValueContainers.length > 0 && (
                <div className="flex gap-2 mb-2">
                  {placeValueContainers.map((container) => (
                    <div
                      key={`container-${container.position}`}
                      onDoubleClick={() =>
                        setPlaceValueContainers(prev => prev.map(c =>
                          c.position === container.position ? { ...c, rigletaValue: null, isCorrect: null } : c
                        ))
                      }
                    >
                      <PlaceValueContainer
                        digit={container.rigletaValue ?? 0}
                        position={container.position}
                        placeValue={container.position.toString()}
                        onDrop={(e) => handleDropOnPlaceValue(e, container.position)}
                        onDragOver={handleDragOver}
                        translations={translations}
                        className={cn(
                          "transition-all duration-200",
                          container.rigletaValue !== null && container.isCorrect === true && "scale-105 border-green-500",
                          container.rigletaValue !== null && container.isCorrect === false && "animate-shake border-red-500"
                        )}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Display current right value in squares format for Level 1 single-digit mode */}
              {gameLevel === 1 && digits === 1 && (
                <div className="flex flex-col items-center mb-2">
                  {/* Number squares display - shows sum of right items */}
                  <div className="flex gap-1 mb-2">
                    {rightTotal.toString().padStart(digits, '0').split('').map((digit, index) => (
                      <div 
                        key={index}
                        className="w-12 h-12 border-2 border-gray-400 bg-white rounded-lg flex items-center justify-center text-2xl font-bold text-black shadow-sm"
                      >
                        {digit}
                      </div>
                    ))}
                  </div>
                  
                   {/* Drop zones with place value labels */}
                   <div className="flex gap-1">
                     {rightTotal.toString().padStart(digits, '0').split('').map((_, index) => {
                       const position = digits - 1 - index;
                       const placeLabels = [translations.units, translations.tens, translations.hundreds, translations.thousands, translations.tenThousands, translations.hundredThousands];
                       const colors = ['bg-blue-500', 'bg-orange-500', 'bg-red-500', 'bg-black'];
                       
                       // Check if this position has rigletas
                       const hasRigletas = rightItems.length > 0;
                       
                       return (
                         <div key={index} className="flex flex-col items-center">
                           <div 
                             className={cn(
                               "w-12 h-8 border-2 border-dashed rounded flex items-center justify-center text-xs transition-colors cursor-pointer",
                               hasRigletas 
                                 ? "border-green-400 bg-green-50 text-green-600" 
                                 : "border-blue-400 bg-blue-50 text-blue-600 hover:bg-blue-100"
                             )}
                             onDrop={(e) => handleDrop(e, 'right')}
                             onDragOver={handleDragOver}
                             title="Trage rigletas aici"
                           >
                             {hasRigletas ? (
                               <span className="text-green-600 font-bold">✓</span>
                             ) : (
                               <span>{translations.drop}</span>
                             )}
                           </div>
                           <div className={`w-6 h-6 ${colors[position] || 'bg-gray-500'} text-white text-xs font-bold rounded flex items-center justify-center mt-1`}>
                             {placeLabels[position] || 'X'}
                           </div>
                         </div>
                       );
                     })}
                   </div>
                </div>
              )}
              
              {/* Input area for level 1 only when rigleta is on the left */}
              {gameLevel === 1 && showRigletaLeft && (
                <div className="flex flex-col items-center">
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: 3 }, (_, i) => (
                      <div 
                        key={i} 
                        className="w-12 h-12 border-2 border-blue-400 bg-white rounded-lg flex items-center justify-center text-2xl font-bold text-blue-600"
                      >
                        {inputValue[i] || ''}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Display right value for level 2 and 3 */}
              {(gameLevel === 2 || gameLevel === 3) && rightDisplayValue > 0 && (
                <div className="flex flex-col items-center mb-2">
                  {/* Number squares display for right side */}
                  <div className="flex gap-1 mb-2">
                    {rightDisplayValue.toString().padStart(digits, '0').split('').map((digit, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "w-12 h-12 border-2 border-gray-400 bg-white rounded-lg flex items-center justify-center text-2xl font-bold text-black shadow-sm transition-all duration-500",
                          gameLevel === 3 && numbersHighlighted && "scale-125 bg-yellow-200 border-yellow-400 shadow-yellow-500/50 shadow-xl"
                        )}
                      >
                        {digit}
                      </div>
                    ))}
                  </div>
                  
                  {/* Place value labels under numbers - always show for Level 3 */}
                  {gameLevel === 3 && (
                    <div className="flex gap-1 mt-1">
                      {rightDisplayValue.toString().padStart(digits, '0').split('').map((_, index) => {
                        const position = digits - 1 - index;
                        const placeLabels = [translations.units, translations.tens, translations.hundreds, translations.thousands, translations.tenThousands, translations.hundredThousands];
                        const colors = ['bg-blue-500', 'bg-orange-500', 'bg-red-500', 'bg-black'];
                        
                        return (
                          <div key={index} className="flex flex-col items-center">
                            <div className={`w-6 h-6 ${colors[position] || 'bg-gray-500'} text-white text-xs font-bold rounded flex items-center justify-center`}>
                              {placeLabels[position] || 'X'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              
            </div>
            
            {/* Right tray plate */}
            <div 
              className={cn(
                "w-40 h-20 cursor-pointer transition-all duration-300",
                gameLevel === 3 ? "border-2 border-dashed border-purple-400 bg-purple-50/50 rounded-lg flex items-center justify-center" : "bg-transparent border-transparent"
              )}
              onDrop={(e) => handleDrop(e, 'right')}
              onDragOver={handleDragOver}
            >
              <div className="relative z-10 flex flex-col items-center justify-center h-full w-full p-2">
                {gameLevel === 3 ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-sm text-purple-600 text-center font-medium">
                      📍 {translations.dropZoneFor}
                    </div>
                    {/* Keyboard button for Level 3 - next to drop zone */}
                    <Button 
                      onClick={onShowKeyboard}
                      variant="outline" 
                      size="sm"
                      className="w-12 h-12 p-0 text-2xl bg-white/90 hover:bg-white border-2 border-blue-400 shadow-lg ml-2"
                    >
                      ⌨️
                    </Button>
                  </div>
                ) : (gameLevel === 1 && !showRigletaLeft) || gameLevel === 4 ? (
                  <div className="w-32 h-16 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50/50 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-200 hover:border-blue-500 hover:bg-blue-100/50">
                    {rightItems.length > 0 ? (
                      <div className="flex flex-col items-center">
                        <div className="text-lg font-bold text-blue-600">
                          {rightItems.slice(0, 3).map(item => item.value).join(' + ')}
                          {rightItems.length > 3 && '...'}
                        </div>
                        <button 
                          onClick={() => setRightItems([])}
                          className="text-xs text-red-500 hover:text-red-700 mt-1"
                        >
                          {translations.delete}
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-blue-500 text-center">
                        {translations.dragRigleta}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison buttons for Level 2 */}
      {gameLevel === 2 && (
        <div className="mt-6 flex gap-4">
          {(['<', '=', '>'] as const).map((symbol) => (
            <Button
              key={symbol}
              onClick={() => handleComparisonClick(symbol)}
              variant={selectedComparison === symbol ? "default" : "outline"}
              className="w-16 h-16 text-2xl font-bold"
            >
              {symbol}
            </Button>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-6 flex gap-4">
        {/* Validation button - not needed for Level 3 (auto-validation on drop) */}
        {(gameLevel === 1 || gameLevel === 4) && (
          <Button 
            onClick={validateAnswer}
            disabled={
              (gameLevel === 1 && digits >= 2 && placeValueContainers.some(c => c.rigletaValue === null)) ||
              (gameLevel === 1 && digits === 1 && showRigletaLeft && !inputValue) ||
              (gameLevel === 1 && digits === 1 && !showRigletaLeft && rightItems.length === 0)
            }
            variant="outline"
            className={`w-16 h-16 p-0 transition-all duration-300 border-2 border-blue-400 bg-white/90 hover:bg-white ${
              showSuccess ? 'bg-green-500 hover:bg-green-600 scale-110' : ''
            }`}
          >
            <CheckCircle className="w-8 h-8 text-green-500" />
          </Button>
        )}

        {/* Reset button */}
        <Button 
          onClick={resetGame}
          variant="outline"
          className="w-16 h-16 p-0"
        >
          <RotateCcw className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
};

export default BalantaInteractiva;