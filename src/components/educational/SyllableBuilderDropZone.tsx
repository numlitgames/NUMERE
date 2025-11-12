import React, { useState } from 'react';
import { cn } from "@/lib/utils";

interface DroppedObject {
  id: string;
  emoji: string;
  color: string;
  objectName: string;
  value?: number;
  isSyllableToken?: boolean;
}

interface SyllableBuilderDropZoneProps {
  title: string;
  onSyllableBuilding: (count: number, objects?: DroppedObject[]) => void;
  onSyllableTokensChange: (count: number, objects?: DroppedObject[]) => void;
  syllableSize: number;
  syllablesInBuilder: DroppedObject[];
  syllableTokens: DroppedObject[];
  resetTrigger?: number;
  onLetterDropped?: (letter: string) => void;
}

export default function SyllableBuilderDropZone({
  title,
  onSyllableBuilding,
  onSyllableTokensChange,
  syllableSize,
  syllablesInBuilder,
  syllableTokens,
  resetTrigger = 0,
  onLetterDropped
}: SyllableBuilderDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragRejected, setDragRejected] = useState(false);

  // Reset when resetTrigger changes
  React.useEffect(() => {
    if (resetTrigger > 0) {
      // Clear both building area and tokens
      onSyllableBuilding(0, []);
      onSyllableTokensChange(0, []);
    }
  }, [resetTrigger]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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
      
      // Check if it's a syllable token being moved
      if (data.isSyllableToken) {
        // Handle syllable token placement/rearrangement
        const newTokens = [...syllableTokens, data];
        onSyllableTokensChange(newTokens.length, newTokens);
        return;
      }
      
      // Handle individual letter drops for syllable building
      if (syllablesInBuilder.length < syllableSize) {
        // Add letter to syllable being built
        const newLetters = [...syllablesInBuilder, data];
        onSyllableBuilding(newLetters.length, newLetters);
        
        // Notify parent about letter being dropped
        if (onLetterDropped) {
          onLetterDropped(data.emoji);
        }
      }
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };

  const removeLetterFromBuilder = (index: number) => {
    const newLetters = syllablesInBuilder.filter((_, i) => i !== index);
    onSyllableBuilding(newLetters.length, newLetters);
  };

  const removeSyllableToken = (index: number) => {
    const newTokens = syllableTokens.filter((_, i) => i !== index);
    onSyllableTokensChange(newTokens.length, newTokens);
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-black text-center text-purple-600">{title}</h3>
      
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 transition-all duration-200 min-h-64",
          isDragOver 
            ? "border-primary bg-primary/10 scale-105" 
            : dragRejected
            ? "border-red-500 bg-red-50 scale-100"
            : "border-purple-300 bg-gray-50"
        )}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Syllable Building Area */}
        {syllablesInBuilder.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-purple-700 font-medium mb-2 text-center">
              Silaba în construcție ({syllablesInBuilder.length}/{syllableSize}):
            </p>
            <div className="flex justify-center items-center space-x-2 mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              {syllablesInBuilder.map((letterObj, index) => (
                <div
                  key={index}
                  className="text-3xl font-bold text-purple-600 cursor-pointer hover:scale-110 transition-transform bg-white p-2 rounded border"
                  onClick={() => removeLetterFromBuilder(index)}
                  title="Click pentru a șterge"
                >
                  {letterObj.emoji}
                </div>
              ))}
              {[...Array(syllableSize - syllablesInBuilder.length)].map((_, index) => (
                <div key={`empty-${index}`} className="text-3xl font-bold text-gray-300 p-2">
                  _
                </div>
              ))}
            </div>
            <p className="text-xs text-purple-600 text-center">
              Mai adaugă {syllableSize - syllablesInBuilder.length} litere
            </p>
          </div>
        )}

        {/* Formed Syllable Tokens */}
        {syllableTokens.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-purple-700 font-medium text-center">
              Silabe formate:
            </p>
            <div className="grid grid-cols-3 gap-4 p-4">
              {syllableTokens.map((token, index) => (
                <div
                  key={`${token.id}-${index}`}
                  className="bg-purple-100 border-2 border-purple-300 rounded-lg p-3 text-center cursor-move hover:scale-105 transition-all shadow-md"
                  draggable={true}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', JSON.stringify({
                      ...token,
                      isSyllableToken: true
                    }));
                  }}
                  onClick={() => removeSyllableToken(index)}
                  title="Drag pentru a muta la cuvinte sau click pentru a șterge"
                >
                  <div className="text-2xl font-bold text-purple-700 mb-1">
                    {token.emoji}
                  </div>
                  <div className="text-xs text-purple-600">
                    silabă
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : syllablesInBuilder.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-48">
            <div className="text-center">
              <p className="text-gray-500 font-medium text-lg mb-2">
                Trage literele aici pentru a forma silabe
              </p>
              <p className="text-xs text-gray-400">
                Silabele de {syllableSize} {syllableSize === 1 ? 'literă' : 'litere'} se vor forma automat
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}