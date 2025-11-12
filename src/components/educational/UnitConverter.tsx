import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import UnitTable from "./UnitTable";
import UnitCascade from "./UnitCascade";
import { unitTypes, UnitType } from "@/lib/unitMeasurementData";
import { toast } from "sonner";

interface Exercise {
  fromValue: number;
  fromUnit: string;
  toUnit: string;
  correctAnswer: number;
  operation: 'multiply' | 'divide';
  factor: number;
}

interface UnitConverterProps {
  unitType: UnitType;
  lang: string;
  onCorrectAnswer: () => void;
  translations: any;
}

export default function UnitConverter({ 
  unitType, 
  lang, 
  onCorrectAnswer,
  translations 
}: UnitConverterProps) {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [answered, setAnswered] = useState(false);

  const unitData = unitTypes[unitType];

  const generateExercise = (): Exercise => {
    const units = unitData.units;
    // Level 1: Only convert to the next immediate subunit
    const fromIndex = Math.floor(Math.random() * (units.length - 1));
    const toIndex = fromIndex + 1;
    
    const fromValue = Math.floor(Math.random() * 9) + 1; // 1-9
    const factor = 10;
    
    return {
      fromValue,
      fromUnit: units[fromIndex],
      toUnit: units[toIndex],
      correctAnswer: fromValue * factor,
      operation: 'multiply',
      factor
    };
  };

  useEffect(() => {
    setExercise(generateExercise());
  }, [unitType]);

  const handleValidate = () => {
    if (!exercise || userAnswer === '') return;
    
    setAnswered(true);
    const numAnswer = parseFloat(userAnswer);
    
    if (numAnswer === exercise.correctAnswer) {
      toast.success(translations.correct);
      setTimeout(() => {
        onCorrectAnswer();
        setExercise(generateExercise());
        setUserAnswer('');
        setAnswered(false);
      }, 1500);
    } else {
      toast.error(translations.tryAgain);
      setTimeout(() => {
        setAnswered(false);
      }, 1500);
    }
  };

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setUserAnswer(prev => prev.slice(0, -1));
    } else if (key === 'validate') {
      handleValidate();
    } else if (!isNaN(Number(key))) {
      setUserAnswer(prev => prev + key);
    }
  };

  if (!exercise) return null;

  return (
    <div className="space-y-6">
      {/* Exercise question */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="text-center">
          <p className="text-xl font-bold mb-2">
            {translations.transform} <span className="text-3xl text-primary mx-2">{exercise.fromValue} {exercise.fromUnit}</span> {translations.in} <span className="text-2xl text-primary">{exercise.toUnit}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {unitData.icon} {translations.unitTypes[unitType]}
          </p>
        </div>
      </Card>

      {/* Visual explanation area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Unit table */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-center">
            {lang === 'ro' ? 'Tabel Conversie' : 'Conversion Table'}
          </h3>
          <UnitTable
            units={unitData.units}
            color={unitData.color}
            bgColor={unitData.bgColor}
            borderColor={unitData.borderColor}
            fromUnit={exercise.fromUnit}
            toUnit={exercise.toUnit}
            lang={lang}
          />
        </div>

        {/* Right: Cascade visualization */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-center">
            {lang === 'ro' ? 'Cascadă Vizuală' : 'Visual Cascade'}
          </h3>
          <UnitCascade
            units={unitData.units}
            color={unitData.color}
            bgColor={unitData.bgColor}
            borderColor={unitData.borderColor}
            cascadeColors={unitData.cascadeColors}
            fromUnit={exercise.fromUnit}
            toUnit={exercise.toUnit}
          />
        </div>
      </div>

      {/* Answer input */}
      <Card className="p-6">
        <div className="flex flex-col items-center gap-4">
          <label className="text-lg font-bold">{translations.yourAnswer}:</label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleValidate()}
              className="text-2xl font-bold text-center w-32"
              placeholder="?"
              disabled={answered}
            />
            <span className="text-2xl font-bold">{exercise.toUnit}</span>
          </div>
          <Button
            onClick={handleValidate}
            size="lg"
            className="w-full max-w-md"
            disabled={answered || userAnswer === ''}
          >
            {translations.validateAnswer}
          </Button>
        </div>
      </Card>
    </div>
  );
}
