import React, { useState } from 'react';
import { cn } from "@/lib/utils";

interface DroppedObject {
  id: string;
  emoji: string;
  color: string;
  objectName: string;
  value?: number; // Add value for math groups
}

interface DropZoneProps {
  title: string;
  onObjectsChange: (count: number, objects?: DroppedObject[]) => void;
  objectName: string;
  maxObjects?: number;
  className?: string;
  borderColor?: string;
  titleColor?: string;
  resetTrigger?: number;
}

export default function DropZone({ 
  title, 
  onObjectsChange, 
  objectName, 
  maxObjects = 10,
  className,
  borderColor = "border-gray-300",
  titleColor = "text-primary",
  resetTrigger = 0
}: DropZoneProps) {
  const [droppedObjects, setDroppedObjects] = useState<DroppedObject[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Reset when resetTrigger changes
  React.useEffect(() => {
    if (resetTrigger > 0) {
      setDroppedObjects([]);
      onObjectsChange(0, []);
    }
  }, [resetTrigger]); // Removed onObjectsChange dependency

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
    console.log('Drag over zone:', title);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set isDragOver to false if we're actually leaving the drop zone
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      console.log('Drag leave zone:', title);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    console.log('Drag enter zone:', title);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    console.log('Drop in zone:', title);
    
    try {
      const dragData = e.dataTransfer.getData('text/plain');
      console.log('Raw drag data:', dragData);
      
      if (!dragData) {
        console.error('No drag data received');
        return;
      }
      
      const data = JSON.parse(dragData);
      console.log('Parsed dropped object:', data);
      
      // Allow unlimited drops for this game - validation happens at game level
      const newObjects = [...droppedObjects, data];
      setDroppedObjects(newObjects);
      
      // Calculate total value considering group values
      const totalValue = newObjects.reduce((sum, obj) => sum + (obj.value || 1), 0);
      onObjectsChange(totalValue, newObjects);
      console.log('New objects in zone:', newObjects.length, 'Total value:', totalValue);
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };

  const removeObject = (index: number) => {
    const newObjects = droppedObjects.filter((_, i) => i !== index);
    setDroppedObjects(newObjects);
    
    // Calculate total value considering group values
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