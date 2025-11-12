import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type TransformationType = 'multipli_to_submultipli' | 'submultipli_to_multipli' | 'random';
export type GameMode = 'easy' | 'pro';

interface UnitTransformationTableProps {
  units: string[];
  initialValue: number;
  initialUnit: string;
  targetUnit: string;
  transformationType: TransformationType;
  gameMode: GameMode;
  onCellComplete?: (rowIndex: number, colIndex: number, value: number) => void;
  onTableDataChange?: (data: (number | null)[][]) => void;
  onRowComplete?: (rowIndex: number, rowDigits: (number | null)[]) => void;
  tableData?: number[][];
  lang: string;
  color: string;
  bgColor: string;
  borderColor: string;
  rowColors: string[];
  classLabels: {
    units: string;
    tens: string;
    hundreds: string;
    thousands: string;
    thousandsClass: string;
    unitsClass: string;
  };
  editableRows?: number[];
}

export default function UnitTransformationTable({ 
  units, 
  initialValue,
  initialUnit,
  targetUnit,
  transformationType,
  gameMode,
  onCellComplete,
  onTableDataChange,
  onRowComplete,
  tableData,
  lang,
  color,
  bgColor,
  borderColor,
  rowColors,
  classLabels,
  editableRows
}: UnitTransformationTableProps) {
  const [localData, setLocalData] = useState<(number | null)[][]>(
    tableData || Array(4).fill(null).map(() => Array(4).fill(null))
  );
  const [activeCell, setActiveCell] = useState<{row: number, col: number} | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    if (tableData) {
      setLocalData(tableData);
    }
  }, [tableData]);

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    if (gameMode !== 'pro') return;

    // Verifică dacă rândul este editabil
    if (editableRows && !editableRows.includes(rowIndex)) return;

    const numValue = parseInt(value, 10);
    if (value === '' || (!isNaN(numValue) && numValue >= 0 && numValue <= 9)) {
      const newData = [...localData];
      newData[rowIndex] = [...newData[rowIndex]];
      newData[rowIndex][colIndex] = value === '' ? null : numValue;
      setLocalData(newData);

      // Sincronizare cu părinte
      if (onTableDataChange) {
        onTableDataChange(newData);
      }

      // Validare inteligentă: verifică după un mic delay dacă valoarea este completă
      if (value !== '' && onRowComplete) {
        setTimeout(() => {
          // Verifică dacă rândul are cifre și dacă valoarea se potrivește
          const digits = newData[rowIndex].filter(d => d !== null);
          if (digits.length > 0) {
            // Declanșează validarea - handleRowComplete va decide dacă e corect
            onRowComplete(rowIndex, newData[rowIndex]);
          }
        }, 300);
      }

      // Callback legacy pentru compatibilitate
      if (value !== '' && onCellComplete) {
        onCellComplete(rowIndex, colIndex, numValue);
      }
    }
  };

  const scrollLeft = () => {
    setScrollOffset(Math.max(0, scrollOffset - 1));
  };

  const scrollRight = () => {
    setScrollOffset(Math.min(units.length - 4, scrollOffset + 1));
  };

  const visibleUnits = units.slice(scrollOffset, scrollOffset + 4);
  const visibleData = localData.map(row => row.slice(scrollOffset, scrollOffset + 4));

  return (
    <div className="w-full space-y-2">
      {/* Header cu săgeți de navigare */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={scrollLeft}
          disabled={scrollOffset === 0}
          className="h-12 w-12 border-2 border-red-500 hover:bg-red-50 flex-shrink-0"
        >
          <ChevronLeft className="h-6 w-6 text-red-500" />
        </Button>

        {/* Spațiu gol pentru aliniere cu label lateral */}
        <div className="w-12 flex-shrink-0"></div>

        <div className="flex-1 grid grid-cols-4 gap-2">
          {visibleUnits.map((unit, index) => (
            <div
              key={`header-${index}`}
              className={cn(
                "flex items-center justify-center h-12 border-2 rounded font-black text-xl",
                borderColor,
                "bg-background"
              )}
            >
              {unit}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={scrollRight}
          disabled={scrollOffset >= units.length - 4}
          className="h-12 w-12 border-2 border-red-500 hover:bg-red-50 flex-shrink-0"
        >
          <ChevronRight className="h-6 w-6 text-red-500" />
        </Button>
      </div>

      {/* Grid 4×4 cu rânduri colorate */}
      <div className="space-y-1">
        {visibleData.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex items-center gap-2">
            {/* Label lateral */}
            <div
              className={cn(
                "flex items-center justify-center h-14 w-12 rounded font-black text-lg border-2",
                borderColor,
                rowColors[rowIndex]
              )}
            >
              {units[rowIndex]}
            </div>

            {/* Celule input */}
            <div className="flex-1 grid grid-cols-4 gap-2">
              {row.map((cell, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={cn(
                    "h-14 border-2 rounded flex items-center justify-center",
                    borderColor,
                    rowColors[rowIndex],
                    gameMode === 'pro' && "cursor-text"
                  )}
                >
                  {gameMode === 'pro' ? (
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={cell === null ? '' : cell}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      onFocus={() => setActiveCell({row: rowIndex, col: colIndex})}
                      onBlur={() => setActiveCell(null)}
                      className={cn(
                        "w-full h-full text-center text-2xl font-black bg-transparent border-none outline-none",
                        activeCell?.row === rowIndex && activeCell?.col === colIndex && "ring-2 ring-primary",
                        editableRows && !editableRows.includes(rowIndex) && "opacity-30 cursor-not-allowed"
                      )}
                      disabled={gameMode !== 'pro' || (editableRows && !editableRows.includes(rowIndex))}
                      readOnly={editableRows && !editableRows.includes(rowIndex)}
                    />
                  ) : (
                    <span className="text-2xl font-black">
                      {cell === null ? '' : cell}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer cu clase - primul rând */}
      <div className="flex items-center gap-2 mt-2">
        {/* Spațiu gol pentru aliniere cu label lateral */}
        <div className="w-12 flex-shrink-0"></div>
        
        <div className="flex-1 grid grid-cols-4 gap-2">
          <div className="flex items-center justify-center h-10 bg-red-500 text-white font-bold text-xs uppercase rounded">
            {classLabels.thousands}
          </div>
          <div className="flex items-center justify-center h-10 bg-blue-400 text-white font-bold text-xs uppercase rounded">
            {classLabels.hundreds}
          </div>
          <div className="flex items-center justify-center h-10 bg-blue-300 text-white font-bold text-xs uppercase rounded">
            {classLabels.tens}
          </div>
          <div className="flex items-center justify-center h-10 bg-blue-200 text-white font-bold text-xs uppercase rounded">
            {classLabels.units}
          </div>
        </div>
      </div>

      {/* Sub-footer cu clase mari */}
      <div className="flex items-center gap-2">
        {/* Spațiu gol pentru aliniere cu label lateral */}
        <div className="w-12 flex-shrink-0"></div>
        
        <div className="flex-1 grid grid-cols-4 gap-2">
          <div className="flex items-center justify-center h-8 bg-red-600 text-white font-bold text-xs uppercase rounded">
            {classLabels.thousandsClass}
          </div>
          <div className="col-span-3 flex items-center justify-center h-8 bg-blue-500 text-white font-bold text-xs uppercase rounded">
            {classLabels.unitsClass}
          </div>
        </div>
      </div>
    </div>
  );
}
