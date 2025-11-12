import React from 'react';
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface UnitTableProps {
  units: string[];
  color: string;
  bgColor: string;
  borderColor: string;
  fromUnit?: string;
  toUnit?: string;
  lang: string;
}

export default function UnitTable({ 
  units, 
  color, 
  bgColor, 
  borderColor,
  fromUnit,
  toUnit,
  lang 
}: UnitTableProps) {
  return (
    <div className="space-y-4">
      {/* Top conversion row with arrows */}
      <div className="flex items-center justify-center gap-2 p-4 bg-card rounded-lg border-2">
        {units.map((unit, index) => (
          <React.Fragment key={unit}>
            <div 
              className={cn(
                "px-6 py-3 text-center font-black text-2xl rounded-lg border-4 transition-all",
                fromUnit === unit && "ring-4 ring-green-400 scale-110",
                toUnit === unit && "ring-4 ring-blue-400 scale-110",
                `${bgColor} ${borderColor}`
              )}
            >
              {unit}
            </div>
            {index < units.length - 1 && (
              <div className="flex flex-col items-center">
                <ArrowRight className={cn("w-6 h-6", `text-${color}-600`)} />
                <span className="text-sm font-bold text-destructive">×10</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Bottom class labels */}
      <div className="grid grid-cols-4 gap-2">
        {units.map((unit) => (
          <div 
            key={unit}
            className={cn(
              "p-3 text-center font-bold text-lg rounded border-2",
              `${bgColor} ${borderColor}`
            )}
          >
            {unit}
          </div>
        ))}
      </div>

      {/* Class sections */}
      <div className="flex justify-between text-sm font-bold text-muted-foreground px-2">
        <span>{lang === 'ro' ? 'CLASA MIILOR' : 'THOUSANDS CLASS'}</span>
        <span>{lang === 'ro' ? 'CLASA UNITĂȚILOR' : 'UNITS CLASS'}</span>
      </div>
    </div>
  );
}
