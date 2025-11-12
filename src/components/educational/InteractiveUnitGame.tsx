import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import UnitTransformationTable, { TransformationType, GameMode } from './UnitTransformationTable';
import UnitCascade from './UnitCascade';
import AnimatedCharacter from './AnimatedCharacter';
import { unitTypes, UnitType } from '@/lib/unitMeasurementData';

interface Exercise {
  fromUnit: string;
  toUnit: string;
  fromValue: number;
  fromIndex: number;
  toIndex: number;
}

interface InteractiveUnitGameProps {
  unitType: UnitType;
  lang: string;
  gameMode: GameMode;
  transformationType: TransformationType;
  onCorrectAnswer: () => void;
  translations: any;
}

export default function InteractiveUnitGame({
  unitType,
  lang,
  gameMode,
  transformationType,
  onCorrectAnswer,
  translations
}: InteractiveUnitGameProps) {
  const unitData = unitTypes[unitType];
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [characterPosition, setCharacterPosition] = useState(0);
  const [tableData, setTableData] = useState<(number | null)[][]>(
    Array(4).fill(null).map(() => Array(4).fill(null))
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down'>('down');

  // Utilitar: detectare număr întreg cu toleranță
  const isInteger = (n: number) => Math.abs(n - Math.round(n)) < 1e-9;

  // Mesaje de feedback variate
  const praise = ["Excelent!", "Bravo!", "Foarte bine!", "Senzațional!", "Minunat!", "Super!", "Perfect!"];
  const encourage = ["Ești aproape!", "Nu-i nimic, mai încearcă!", "Încearcă din nou!", "Poți reuși!", "Mai ai puțin!"];
  
  const getRandomPraise = () => praise[Math.floor(Math.random() * praise.length)];
  const getRandomEncouragement = () => encourage[Math.floor(Math.random() * encourage.length)];

  // Generare exercițiu
  const generateExercise = () => {
    const units = unitData.units;
    let fromIndex, toIndex, initialValue;

    if (transformationType === 'random') {
      const isDownward = Math.random() > 0.5;
      if (isDownward) {
        // Multipli -> Submultipli (ex: m -> mm)
        fromIndex = Math.floor(Math.random() * (units.length - 1));
        toIndex = units.length - 1;
        initialValue = Math.floor(Math.random() * 9) + 1; // 1-9 OK
      } else {
        // Submultipli -> Multipli (ex: mm -> m)
        fromIndex = units.length - 1;
        toIndex = 0;
        const steps = Math.abs(toIndex - fromIndex);
        const minValue = Math.pow(10, steps);
        initialValue = (Math.floor(Math.random() * 9) + 1) * minValue; // ex: 9000 mm
      }
    } else if (transformationType === 'multipli_to_submultipli') {
      // De la unitate mare la unitate mică (ex: m → mm)
      fromIndex = 0;
      toIndex = units.length - 1;
      initialValue = Math.floor(Math.random() * 9) + 1; // 1-9 OK
    } else {
      // Submultipli -> Multipli (ex: mm → m)
      fromIndex = units.length - 1;
      toIndex = 0;
      const steps = Math.abs(toIndex - fromIndex);
      const minValue = Math.pow(10, steps);
      initialValue = (Math.floor(Math.random() * 9) + 1) * minValue; // ex: 9000 mm
    }

    const newExercise: Exercise = {
      fromUnit: units[fromIndex],
      toUnit: units[toIndex],
      fromValue: initialValue,
      fromIndex,
      toIndex
    };

    setExercise(newExercise);
    setCharacterPosition(fromIndex);
    setDirection(toIndex > fromIndex ? 'down' : 'up');

    // Inițializare tabel cu valoarea din unitatea de start
    const newTableData = Array(4).fill(null).map(() => Array(4).fill(null));
    newTableData[fromIndex] = valueToGridDigits(initialValue, fromIndex);
    setTableData(newTableData);
  };

  useEffect(() => {
    generateExercise();
  }, [unitType, transformationType, gameMode]);

  // Calculează valoarea așteptată pentru o celulă
  const calculateExpectedAnswer = (rowIndex: number): number => {
    if (!exercise) return 0;
    
    // Convertește valoarea inițială la cea mai mică unitate
    const stepsToSmallest = unitData.units.length - 1 - exercise.fromIndex;
    const valueInSmallestUnit = exercise.fromValue * Math.pow(10, stepsToSmallest);
    
    // Calculează valoarea pentru rândul curent
    const stepsFromSmallest = unitData.units.length - 1 - rowIndex;
    const divisor = Math.pow(10, stepsFromSmallest);
    
    return valueInSmallestUnit / divisor;
  };

  // Descompune valoarea în cifre și le aliniază la dreapta față de ancora rândului
  const valueToGridDigits = (valueInCurrentUnit: number, anchorCol: number): (number | null)[] => {
    // Dacă nu e număr întreg, returnează rând gol
    if (!isInteger(valueInCurrentUnit)) {
      return Array(4).fill(null);
    }

    const str = Math.round(valueInCurrentUnit).toString();
    const digits = str.split('').map(c => parseInt(c));
    
    // Crează array de 4 poziții cu null
    const result: (number | null)[] = [null, null, null, null];
    
    // Plasează cifrele de la dreapta la stânga, ultima cifră pe anchorCol
    for (let i = digits.length - 1; i >= 0; i--) {
      const colIndex = anchorCol - (digits.length - 1 - i);
      if (colIndex >= 0 && colIndex < 4) {
        result[colIndex] = digits[i];
      }
    }
    
    return result;
  };

  // Handle click pe scară (Modul Ușor)
  const handleStepClick = (stepIndex: number) => {
    if (gameMode !== 'easy' || isAnimating) return;

    // Verifică dacă e următorul pas valid
    const isValidNext = direction === 'down' 
      ? stepIndex === characterPosition + 1 
      : stepIndex === characterPosition - 1;

    if (!isValidNext) {
      toast.error(translations.selectNextStep || 'Selectează următorul pas!');
      return;
    }

    setIsAnimating(true);
    setCharacterPosition(stepIndex);

    // Auto-fill tabel doar pentru valori întregi
    const expectedValue = calculateExpectedAnswer(stepIndex);
    const newTableData = [...tableData];
    
    if (isInteger(expectedValue)) {
      const digits = valueToGridDigits(expectedValue, stepIndex);
      newTableData[stepIndex] = digits;
    } else {
      newTableData[stepIndex] = Array(4).fill(null);
    }
    
    setTableData(newTableData);

    setTimeout(() => {
      setIsAnimating(false);
      
      // Verifică dacă a ajuns la destinație
      if (stepIndex === exercise!.toIndex) {
        toast.success(`${getRandomPraise()} ${exercise!.fromValue} ${exercise!.fromUnit} = ${Math.round(expectedValue)} ${exercise!.toUnit}`);
        onCorrectAnswer();
        setTimeout(() => generateExercise(), 1500);
      }
    }, 600);
  };

  // Sincronizare date tabel
  const handleTableDataChange = (data: (number | null)[][]) => {
    setTableData(data);
  };

  // Handle completare rând (Modul PRO)
  const handleRowComplete = (rowIndex: number, rowDigits: (number | null)[]) => {
    if (gameMode !== 'pro' || isAnimating) return;

    // Calculăm rândurile cu valori întregi (editabile)
    const integerRows = unitData.units
      .map((_, i) => i)
      .filter(i => isInteger(calculateExpectedAnswer(i)));

    // Verifică dacă rândul este editabil
    if (!integerRows.includes(rowIndex)) {
      return; // Nu mai afișăm mesaj, doar ignorăm
    }

    // Calculează valoarea completă a rândului din cifrele introduse
    const digits = rowDigits.filter(d => d !== null);
    if (digits.length === 0) return; // Rând gol, nu validăm

    const rowValue = parseInt(digits.join(''), 10);
    const expectedValue = Math.round(calculateExpectedAnswer(rowIndex));

    // Verifică dacă valoarea introdusă este corectă
    if (rowValue === expectedValue) {
      toast.success(`${getRandomPraise()} ${rowValue} ${unitData.units[rowIndex]}`);
      
      // Mută personajul automat
      setIsAnimating(true);
      setCharacterPosition(rowIndex);

      setTimeout(() => {
        setIsAnimating(false);
        
        // Verifică dacă a ajuns la destinație (rândul țintă)
        if (rowIndex === exercise!.toIndex) {
          toast.success(`${getRandomPraise()} ${exercise!.fromValue} ${exercise!.fromUnit} = ${expectedValue} ${exercise!.toUnit}`, {
            duration: 2000
          });
          onCorrectAnswer();
          setTimeout(() => generateExercise(), 1500);
        }
      }, 600);
    } else {
      // Validare incorectă - afișează mesaj doar dacă valoarea are numărul corect de cifre
      const expectedDigits = expectedValue.toString().length;
      if (digits.length >= expectedDigits) {
        toast.error(`${getRandomEncouragement()} Răspunsul corect: ${expectedValue}`);
        // Reset rând după un delay
        setTimeout(() => {
          const newTableData = [...tableData];
          newTableData[rowIndex] = Array(4).fill(null);
          setTableData(newTableData);
        }, 1500);
      }
    }
  };

  // Handle completare celulă (legacy pentru compatibilitate)
  const handleTableCellComplete = (rowIndex: number, colIndex: number, value: number) => {
    // Nu mai folosim pentru validare, doar pentru compatibilitate
  };

  if (!exercise) return null;

  const classLabels = {
    units: translations.units || 'UNITĂȚI',
    tens: translations.tens || 'ZECI',
    hundreds: translations.hundreds || 'SUTE',
    thousands: translations.thousands || 'MII',
    thousandsClass: translations.thousandsClass || 'CLASA MIILOR',
    unitsClass: translations.unitsClass || 'CLASA UNITĂȚILOR'
  };

  return (
    <div className="space-y-4">
      {/* Cerință */}
      <div className="text-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
        <p className="text-2xl font-black">
          🎯 {translations.requirement || 'CERINȚĂ'}: {translations.transform} {exercise.fromValue} {exercise.fromUnit} {translations.in} {exercise.toUnit}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {gameMode === 'easy' 
            ? translations.gameMode?.easyDesc || 'Mută personajul pe scară' 
            : translations.gameMode?.proDesc || 'Completează tabelul'}
        </p>
      </div>

      {/* Grid layout: Tabel + Cascadă */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabel */}
        <div className="order-1">
          <UnitTransformationTable
            units={unitData.units}
            initialValue={exercise.fromValue}
            initialUnit={exercise.fromUnit}
            targetUnit={exercise.toUnit}
            transformationType={transformationType}
            gameMode={gameMode}
            onCellComplete={handleTableCellComplete}
            onTableDataChange={handleTableDataChange}
            onRowComplete={handleRowComplete}
            tableData={tableData}
            lang={lang}
            color={unitData.color}
            bgColor={unitData.bgColor}
            borderColor={unitData.borderColor}
            rowColors={unitData.rowColors || []}
            classLabels={classLabels}
            editableRows={unitData.units
              .map((_, i) => i)
              .filter(i => isInteger(calculateExpectedAnswer(i)))}
          />
        </div>

        {/* Cascadă cu Personaj */}
        <div className="order-2 relative">
          <UnitCascade
            units={unitData.units}
            color={unitData.color}
            bgColor={unitData.bgColor}
            borderColor={unitData.borderColor}
            cascadeColors={unitData.cascadeColors || []}
            fromUnit={exercise.fromUnit}
            toUnit={exercise.toUnit}
            onStepClick={handleStepClick}
            characterPosition={characterPosition}
            gameMode={gameMode}
            isAnimating={isAnimating}
            displayValues={unitData.units.map((_, index) => {
              const v = calculateExpectedAnswer(index);
              return isInteger(v) ? Math.round(v) : null;
            })}
          />
          
          <AnimatedCharacter
            position={characterPosition}
            direction={direction}
            isAnimating={isAnimating}
            onAnimationEnd={() => {}}
            totalSteps={unitData.units.length}
          />
        </div>
      </div>
    </div>
  );
}
