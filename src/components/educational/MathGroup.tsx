import React from 'react';
import { cn } from "@/lib/utils";

interface MathGroupProps {
  type: 'units' | 'tens' | 'hundreds';
  value: number;
  emoji: string;
  color: string;
  groupIndex: number;
  objectName: string;
  className?: string;
}

export default function MathGroup({ 
  type, 
  value, 
  emoji, 
  color, 
  groupIndex, 
  objectName,
  className 
}: MathGroupProps) {
  // For units, we return individual draggable elements
  if (type === 'units') {
    return (
      <div className="flex flex-wrap gap-1 p-2">
        {Array.from({ length: value }, (_, i) => (
          <div
            key={i}
            className={cn("text-2xl w-8 h-8 rounded-full bg-green-100 border-2 border-green-400 flex items-center justify-center cursor-move hover:scale-105 transition-transform select-none", color)}
            draggable={true}
            onDragStart={(e) => {
              const dragData = {
                id: `unit-${groupIndex}-${i}`,
                emoji: emoji,
                color: color,
                objectName: objectName,
                groupType: 'units',
                value: 1
              };
              e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
              e.dataTransfer.effectAllowed = 'move';
            }}
          >
            {emoji}
          </div>
        ))}
      </div>
    );
  }

  const getGroupDisplay = () => {
    switch (type) {
      case 'tens':
        return (
          <div className="p-2">
            <div className="grid grid-cols-5 gap-1 bg-blue-100 border-2 border-blue-400 rounded-lg p-2">
              {Array.from({ length: 10 }, (_, i) => (
                <div 
                  key={i} 
                  className={cn("text-lg w-6 h-6 bg-blue-200 border border-blue-300 rounded flex items-center justify-center", color)}
                >
                  {emoji}
                </div>
              ))}
            </div>
            <div className="text-xs font-bold text-center mt-1 text-blue-600">10</div>
          </div>
        );
      
      case 'hundreds':
        return (
          <div className="p-2">
            <div className="grid grid-cols-10 gap-0 bg-purple-100 border-2 border-purple-400 rounded-lg p-2">
              {Array.from({ length: 100 }, (_, i) => (
                <div 
                  key={i} 
                  className="w-1 h-1 bg-purple-300 rounded-full"
                />
              ))}
            </div>
            <div className="text-xs font-bold text-center mt-1 text-purple-600">100</div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const getGroupValue = () => {
    switch (type) {
      case 'tens': return 10;
      case 'hundreds': return 100;
      default: return 0;
    }
  };

  // For tens and hundreds, the entire group is draggable
  return (
    <div
      className={cn(
        "cursor-move hover:scale-105 transition-transform select-none bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:shadow-md",
        className
      )}
      draggable={true}
      onDragStart={(e) => {
        const dragData = {
          id: `${type}-${groupIndex}`,
          emoji: emoji,
          color: color,
          objectName: objectName,
          groupType: type,
          value: getGroupValue()
        };
        e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
        e.dataTransfer.effectAllowed = 'move';
      }}
    >
      {getGroupDisplay()}
    </div>
  );
}