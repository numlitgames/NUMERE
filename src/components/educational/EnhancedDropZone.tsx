import React, { useState } from 'react';
import { cn } from "@/lib/utils";

interface DroppedObject {
  id: string;
  emoji: string;
  color: string;
  objectName: string;
  value?: number;
}

interface EnhancedDropZoneProps {
  title: string;
  onObjectsChange: (count: number, objects?: DroppedObject[]) => void;
  objectName: string;
  maxObjects?: number;
  className?: string;
  borderColor?: string;
  titleColor?: string;
  resetTrigger?: number;
  containerType?: 'vowels' | 'consonants' | 'syllables' | 'words';
  canDropFunction?: (letter: string, containerType: 'vowels' | 'consonants' | 'syllables' | 'words') => boolean;
  onLetterDropped?: (letter: string) => void;
  isVowelConsonantMode?: boolean;
}

export default function EnhancedDropZone({ 
  title, 
  onObjectsChange, 
  objectName, 
  maxObjects = 10,
  className,
  borderColor = "border-gray-300",
  titleColor = "text-primary",
  resetTrigger = 0,
  containerType,
  canDropFunction,
  onLetterDropped,
  isVowelConsonantMode = false
}: EnhancedDropZoneProps) {
  const [droppedObjects, setDroppedObjects] = useState<DroppedObject[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragRejected, setDragRejected] = useState(false);

  // Reset when resetTrigger changes
  React.useEffect(() => {
    if (resetTrigger > 0) {
      setDroppedObjects([]);
      onObjectsChange(0, []);
    }
  }, [resetTrigger]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (isVowelConsonantMode && containerType && canDropFunction) {
      try {
        const dragData = e.dataTransfer.getData('text/plain');
        if (dragData) {
          const data = JSON.parse(dragData);
          const canDrop = canDropFunction(data.emoji, containerType);
          e.dataTransfer.dropEffect = canDrop ? 'move' : 'none';
          setIsDragOver(canDrop);
          setDragRejected(!canDrop);
          return;
        }
      } catch (error) {
        console.error('Error checking drop validity:', error);
      }
    }
    
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
    setDragRejected(false);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setDragRejected(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setDragRejected(false);
    
    try {
      const dragData = e.dataTransfer.getData('text/plain');
      
      if (!dragData) {
        console.error('No drag data received');
        return;
      }
      
      const data = JSON.parse(dragData);
      
      // Check if drop is allowed for vowel-consonant mode
      if (isVowelConsonantMode && containerType && canDropFunction) {
        if (!canDropFunction(data.emoji, containerType)) {
          console.log('Drop rejected - wrong container type');
          return;
        }
      }
      
      // Apply container-specific colors for vowel-consonant mode
      if (isVowelConsonantMode) {
        data.color = containerType === 'vowels' ? 'text-blue-600' : 'text-red-600';
      }
      
      const newObjects = [...droppedObjects, data];
      setDroppedObjects(newObjects);
      
      const totalValue = newObjects.reduce((sum, obj) => sum + (obj.value || 1), 0);
      onObjectsChange(totalValue, newObjects);
      
      // Notify parent about letter being dropped
      if (onLetterDropped) {
        onLetterDropped(data.emoji);
      }
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };

  const removeObject = (index: number) => {
    const newObjects = droppedObjects.filter((_, i) => i !== index);
    setDroppedObjects(newObjects);
    
    const totalValue = newObjects.reduce((sum, obj) => sum + (obj.value || 1), 0);
    onObjectsChange(totalValue, newObjects);
  };

  return (
    <div className="space-y-2">
      <h3 className={cn("text-lg font-black text-center", titleColor)}>{title}</h3>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 transition-all duration-200",
          isDragOver 
            ? "border-primary bg-primary/10 scale-105" 
            : dragRejected
            ? "border-red-500 bg-red-50 scale-100"
            : `${borderColor} bg-gray-50`,
          className
        )}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {droppedObjects.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-48">
            <p className="text-gray-500 font-medium text-center text-lg">
              Trage {objectName} aici
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 p-4">
            {droppedObjects.map((obj, index) => (
              <div
                key={`${obj.id}-${index}`}
                className={cn(
                  "text-5xl cursor-pointer hover:scale-110 transition-transform text-center p-4 rounded bg-white border-2 shadow-md",
                  obj.color
                )}
                onClick={() => removeObject(index)}
                title="Click pentru a șterge"
              >
                {obj.emoji}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {droppedObjects.length >= maxObjects && (
        <p className="text-xs text-orange-600 text-center font-medium">
          Maxim {maxObjects} obiecte permise
        </p>
      )}
    </div>
  );
}