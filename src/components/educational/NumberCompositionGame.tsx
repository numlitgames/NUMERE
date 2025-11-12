import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import DropZone from './DropZone';
import CountingDots from './CountingDots';
import MultiDigitDisplay from './MultiDigitDisplay';
import MathGroup from './MathGroup';
import { toast } from "sonner";

// Visual objects that rotate randomly
const visualObjects = [
  { id: 'apples', name: 'mere', emoji: '🍎', color: 'text-red-500' },
  { id: 'oranges', name: 'portocale', emoji: '🍊', color: 'text-orange-500' },
  { id: 'bananas', name: 'banane', emoji: '🍌', color: 'text-yellow-500' },
  { id: 'grapes', name: 'struguri', emoji: '🍇', color: 'text-purple-500' },
  { id: 'strawberries', name: 'căpșuni', emoji: '🍓', color: 'text-red-400' },
  { id: 'cats', name: 'pisici', emoji: '🐱', color: 'text-gray-600' },
  { id: 'dogs', name: 'câini', emoji: '🐶', color: 'text-amber-600' },
  { id: 'bears', name: 'ursuleți', emoji: '🧸', color: 'text-amber-500' },
  { id: 'cars', name: 'mașinuțe', emoji: '🚗', color: 'text-blue-500' },
  { id: 'balls', name: 'mingii', emoji: '⚽', color: 'text-green-500' }
];

interface NumberCompositionGameProps {
  targetNumber?: number;
  mode: 'addition' | 'subtraction';
  numberOfDigits?: number;
  onCorrectAnswer?: () => void;
  translations?: {
    canYouForm: string;
    from: string;
    twoGroups: string;
    youPut: string;
    groupA: string;
    groupB: string;
    correct: string;
    tryAgain: string;
    hint: string;
  };
}

export default function NumberCompositionGame({
  targetNumber = 7,
  mode = 'addition',
  numberOfDigits = 1,
  onCorrectAnswer,
  translations = {
    canYouForm: 'Poți forma cifra',
    from: 'din',
    twoGroups: 'două grupe?',
    youPut: 'Ai pus',
    groupA: 'Grupa A',
    groupB: 'Grupa B',
    correct: 'Bravo! Răspuns corect!',
    tryAgain: 'Încearcă din nou!',
    hint: 'Sugestie'
  }
}: NumberCompositionGameProps) {
  const [currentObject, setCurrentObject] = useState(visualObjects[0]);
  const [operation, setOperation] = useState<'+' | '-'>(mode === 'addition' ? '+' : '-');
  const [groupACount, setGroupACount] = useState(0);
  const [groupBCount, setGroupBCount] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentTargetNumber, setCurrentTargetNumber] = useState(targetNumber);
  const [displayedObjects, setDisplayedObjects] = useState(targetNumber);
  const [totalAvailableObjects, setTotalAvailableObjects] = useState(targetNumber);
  const [resetTrigger, setResetTrigger] = useState(0);

  const generateNewExercise = () => {
    const newObject = visualObjects[Math.floor(Math.random() * visualObjects.length)];
    const newOperation = mode === 'addition' ? '+' : '-';
    
    // Generate number based on numberOfDigits
    let newTargetNumber;
    if (numberOfDigits === 1) {
      newTargetNumber = Math.floor(Math.random() * 9) + 1; // 1-9
    } else {
      const min = Math.pow(10, numberOfDigits - 1);
      const max = Math.pow(10, numberOfDigits) - 1;
      newTargetNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Calculate initial displayed elements
    let initialElements;
    if (newOperation === '+') {
      // For addition: show target + 1-3 extra elements
      initialElements = newTargetNumber + Math.floor(Math.random() * 3) + 1;
    } else {
      // For subtraction: show target + 5 + 1-3 extra (enough for any A+B combination)
      initialElements = newTargetNumber + 5 + Math.floor(Math.random() * 3) + 1;
    }
    
    setCurrentObject(newObject);
    setOperation(newOperation);
    setCurrentTargetNumber(newTargetNumber);
    setGroupACount(0);
    setGroupBCount(0);
    setIsCorrect(false);
    setShowAnimation(false);
    setDisplayedObjects(initialElements);
    setTotalAvailableObjects(initialElements);
    setResetTrigger(prev => prev + 1);
  };

  // Update operation when mode changes and generate new exercise when numberOfDigits changes
  useEffect(() => {
    setOperation(mode === 'addition' ? '+' : '-');
  }, [mode]);

  useEffect(() => {
    generateNewExercise();
  }, [numberOfDigits, mode]);

  // Validate answer
  useEffect(() => {
    let correct = false;
    if (operation === '+') {
      // For addition: A + B = target AND total objects used ≤ available
      correct = groupACount + groupBCount === currentTargetNumber && 
               groupACount + groupBCount <= totalAvailableObjects;
    } else {
      // For subtraction: |A - B| = target AND total objects used ≤ available
      correct = Math.abs(groupACount - groupBCount) === currentTargetNumber &&
               groupACount + groupBCount <= totalAvailableObjects;
    }

    if (correct && (groupACount > 0 || groupBCount > 0)) {
      setIsCorrect(true);
      setShowAnimation(true);
      toast.success(translations.correct);
      onCorrectAnswer?.();
    } else {
      setIsCorrect(false);
      setShowAnimation(false);
    }
  }, [groupACount, groupBCount, currentTargetNumber, operation, translations.correct, onCorrectAnswer, totalAvailableObjects]);

  // Handle when objects are added/removed from groups
  const handleGroupAChange = (count: number) => {
    setGroupACount(count);
  };

  const handleGroupBChange = (count: number) => {
    setGroupBCount(count);
  };

  // Create groups based on numberOfDigits
  const createMathGroups = () => {
    if (numberOfDigits === 1) {
      // For single digit, show individual objects
      return Array.from({ length: displayedObjects }, (_, i) => ({
        id: i,
        emoji: currentObject.emoji,
        color: currentObject.color,
        type: 'individual' as const
      }));
    }

    const groups = [];
    let remainingObjects = displayedObjects;
    let groupIndex = 0;

    // Create hundreds groups first
    if (numberOfDigits >= 3) {
      const hundredsCount = Math.floor(remainingObjects / 100);
      for (let i = 0; i < hundredsCount; i++) {
        groups.push({
          id: `hundreds-${groupIndex++}`,
          type: 'hundreds' as const,
          value: 100,
          emoji: currentObject.emoji,
          color: currentObject.color
        });
      }
      remainingObjects -= hundredsCount * 100;
    }

    // Create tens groups
    if (numberOfDigits >= 2) {
      const tensCount = Math.floor(remainingObjects / 10);
      for (let i = 0; i < tensCount; i++) {
        groups.push({
          id: `tens-${groupIndex++}`,
          type: 'tens' as const,
          value: 10,
          emoji: currentObject.emoji,
          color: currentObject.color
        });
      }
      remainingObjects -= tensCount * 10;
    }

    // Create units groups for remaining objects
    if (remainingObjects > 0) {
      groups.push({
        id: `units-${groupIndex++}`,
        type: 'units' as const,
        value: remainingObjects,
        emoji: currentObject.emoji,
        color: currentObject.color
      });
    }

    return groups;
  };

  const mathGroups = createMathGroups();

  // Debug logging
  console.log('Game state:', {
    displayedObjects,
    totalAvailableObjects,
    groupACount,
    groupBCount,
    currentTargetNumber,
    operation
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header with equation display */}
      <div className={cn(
        "bg-white rounded-lg border-2 border-primary/20 p-6 transition-all duration-500",
        showAnimation && "ring-4 ring-green-400 bg-green-50"
      )}>
        <div className="flex items-center justify-center space-x-4">
          {/* Equation: Number = A + B */}
          <div className="flex items-center space-x-4">
            <MultiDigitDisplay number={currentTargetNumber} numberOfDigits={numberOfDigits} />
            <span className="text-6xl font-black text-primary">=</span>
            <span className="text-6xl font-black text-orange-500">A</span>
            <span className="text-6xl font-black text-primary">{operation}</span>
            <span className="text-6xl font-black text-green-500">B</span>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="mt-4 text-center">
          <p className="text-lg font-medium text-gray-700">
            {translations.canYouForm} <span className="font-black text-primary">{currentTargetNumber}</span> {translations.from} {translations.twoGroups}
          </p>
        </div>

        {/* Math Groups display */}
        <div className="mt-4 flex justify-center">
          <div className="flex flex-wrap gap-4 justify-center">
            {mathGroups.map((group, index) => {
              if (group.type === 'individual') {
                // Individual objects for single digit
                return (
                  <div
                    key={index}
                    className={cn(
                      "text-3xl cursor-move hover:scale-110 transition-transform select-none p-2 rounded-lg bg-white/80 border-2 border-gray-200 shadow-sm",
                      group.color
                    )}
                    draggable={true}
                    onDragStart={(e) => {
                      const dragData = {
                        id: `${currentObject.id}-${index}`,
                        emoji: group.emoji,
                        color: group.color,
                        objectName: currentObject.name,
                        value: 1
                      };
                      e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                  >
                    {group.emoji}
                  </div>
                );
              } else {
                // Math groups for multi-digit
                return (
                  <MathGroup
                    key={group.id}
                    type={group.type}
                    value={group.value}
                    emoji={group.emoji}
                    color={group.color}
                    groupIndex={index}
                    objectName={currentObject.name}
                  />
                );
              }
            })}
          </div>
        </div>
      </div>

      {/* Drop zones with operation sign */}
      <div className="flex gap-6 items-center">
        {/* Group A - increased width by 50% towards right */}
        <div className="space-y-4 flex-[1.5]">
          <DropZone
            title={translations.groupA}
            onObjectsChange={handleGroupAChange}
            objectName={currentObject.name}
            maxObjects={99}
            className="min-h-40"
            borderColor="border-orange-500"
            titleColor="text-orange-500"
            resetTrigger={resetTrigger}
          />
          <CountingDots 
            count={groupACount} 
            message={`${translations.youPut} ${groupACount} ${currentObject.name}`}
          />
        </div>

        {/* Operation sign between groups */}
        <div className="flex justify-center flex-shrink-0">
          <div className="text-8xl font-black text-primary">
            {operation}
          </div>
        </div>

        {/* Group B - increased width by 50% towards left */}
        <div className="space-y-4 flex-[1.5]">
          <DropZone
            title={translations.groupB}
            onObjectsChange={handleGroupBChange}
            objectName={currentObject.name}
            maxObjects={99}
            className="min-h-40"
            borderColor="border-green-500"
            titleColor="text-green-500"
            resetTrigger={resetTrigger}
          />
          <CountingDots 
            count={groupBCount} 
            message={`${translations.youPut} ${groupBCount} ${currentObject.name}`}
          />
        </div>
      </div>

      {/* Result display */}
      {(groupACount > 0 || groupBCount > 0) && (
        <div className={cn(
          "bg-white rounded-lg border-2 p-4 text-center transition-all duration-500",
          isCorrect ? "border-green-400 bg-green-50" : "border-orange-400 bg-orange-50"
        )}>
          <p className="text-xl font-black">
            {groupACount} {operation} {groupBCount} = {operation === '+' ? groupACount + groupBCount : Math.abs(groupACount - groupBCount)}
          </p>
          {!isCorrect && (groupACount > 0 || groupBCount > 0) && (
            <p className="text-sm text-orange-600 mt-2">
              {translations.hint}: {operation === '+' ? 
                `Trebuie să ajungi la ${currentTargetNumber}` :
                `Diferența trebuie să fie ${currentTargetNumber}`
              }
            </p>
          )}
        </div>
      )}

      {/* Validation button */}
      <div className="flex justify-center">
        <Button
          onClick={isCorrect ? generateNewExercise : undefined}
          variant={isCorrect ? "default" : "outline"}
          className={cn(
            "w-16 h-16 rounded-full text-3xl font-black transition-all duration-300",
            isCorrect 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-gray-400 text-gray-600 cursor-default hover:bg-gray-400"
          )}
          disabled={!isCorrect}
        >
          <Check className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
}