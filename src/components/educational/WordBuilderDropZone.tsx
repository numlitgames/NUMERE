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

interface WordBuilderDropZoneProps {
  title: string;
  onWordFormation: (completedWords: DroppedObject[][], currentWord: DroppedObject[]) => void;
  completedWords: DroppedObject[][];
  currentWordTokens: DroppedObject[];
  syllableSize: number;
  resetTrigger?: number;
  onLetterDropped?: (letter: string) => void;
}

export default function WordBuilderDropZone({
  title,
  onWordFormation,
  completedWords,
  currentWordTokens,
  syllableSize,
  resetTrigger = 0,
  onLetterDropped
}: WordBuilderDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragRejected, setDragRejected] = useState(false);

  // Reset when resetTrigger changes
  React.useEffect(() => {
    if (resetTrigger > 0) {
      onWordFormation([], []);
    }
  }, [resetTrigger]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    
    // Only allow syllable tokens and check current word limit
    try {
      const dragData = e.dataTransfer.getData('text/plain');
      if (dragData) {
        const data = JSON.parse(dragData);
        const isSyllableToken = data.isSyllableToken || data.objectName;
        const wouldExceedLimit = currentWordTokens.length >= syllableSize;
        const canDrop = isSyllableToken && !wouldExceedLimit;
        e.dataTransfer.dropEffect = canDrop ? 'move' : 'none';
        setIsDragOver(canDrop);
        setDragRejected(!canDrop);
        return;
      }
    } catch (error) {
      console.error('Error checking drop validity:', error);
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
      
      // Only accept syllable tokens
      if (!data.isSyllableToken && !data.objectName) {
        console.log('Drop rejected - only syllable tokens allowed');
        return;
      }
      
      // Check current word syllable limit
      if (currentWordTokens.length >= syllableSize) {
        console.log(`Drop rejected - maximum ${syllableSize} syllables per word`);
        return;
      }
      
      // Add syllable token to current word
      const newCurrentTokens = [...currentWordTokens, data];
      
      // Check if word is complete
      if (newCurrentTokens.length === syllableSize) {
        // Complete the word - add to completed words and reset current
        const newCompletedWords = [...completedWords, newCurrentTokens];
        onWordFormation(newCompletedWords, []);
      } else {
        // Continue building current word
        onWordFormation(completedWords, newCurrentTokens);
      }
      
      // Notify parent about syllable being dropped
      if (onLetterDropped) {
        onLetterDropped(data.emoji);
      }
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };

  const removeSyllableFromCurrentWord = (index: number) => {
    const newTokens = currentWordTokens.filter((_, i) => i !== index);
    onWordFormation(completedWords, newTokens);
  };

  const removeCompletedWord = (wordIndex: number) => {
    const newCompletedWords = completedWords.filter((_, i) => i !== wordIndex);
    onWordFormation(newCompletedWords, currentWordTokens);
  };

  // Function to format word with hyphens between syllables
  const formatWordWithHyphens = (tokens: DroppedObject[]) => {
    return tokens.map(token => token.emoji).join('-');
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-black text-center text-green-600">{title}</h3>
      
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 transition-all duration-200 min-h-64",
          isDragOver 
            ? "border-primary bg-primary/10 scale-105" 
            : dragRejected
            ? "border-red-500 bg-red-50 scale-100"
            : "border-green-300 bg-gray-50"
        )}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {completedWords.length > 0 || currentWordTokens.length > 0 ? (
          <div className="space-y-4">
            {/* Completed words */}
            {completedWords.map((word, wordIndex) => (
              <div key={`word-${wordIndex}`} className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-green-700 font-medium">
                    Cuvânt {wordIndex + 1} ({word.length} silabe):
                  </p>
                  <button
                    onClick={() => removeCompletedWord(wordIndex)}
                    className="text-red-500 hover:text-red-700 text-xs"
                    title="Șterge cuvântul"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800 mb-1">
                    {formatWordWithHyphens(word)}
                  </div>
                  <div className="text-xl font-bold text-green-700">
                    {word.map(token => token.emoji).join('')}
                  </div>
                </div>
              </div>
            ))}

            {/* Current word being built */}
            {currentWordTokens.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-blue-700 font-medium mb-3 text-center">
                  Cuvânt în construcție ({currentWordTokens.length}/{syllableSize} silabe):
                </p>
                <div className="flex justify-center items-center space-x-2 mb-4">
                  {currentWordTokens.map((token, index) => (
                    <React.Fragment key={`current-syllable-${index}`}>
                      <div
                        className="bg-blue-100 border-2 border-blue-300 rounded-lg p-2 text-center cursor-pointer hover:scale-105 transition-all"
                        onClick={() => removeSyllableFromCurrentWord(index)}
                        title="Click pentru a șterge din cuvânt"
                      >
                        <div className="text-xl font-bold text-blue-700">
                          {token.emoji}
                        </div>
                      </div>
                      {index < currentWordTokens.length - 1 && (
                        <div className="text-xl font-bold text-blue-600">-</div>
                      )}
                    </React.Fragment>
                  ))}
                  {/* Show empty slots for remaining syllables */}
                  {[...Array(syllableSize - currentWordTokens.length)].map((_, index) => (
                    <React.Fragment key={`empty-${index}`}>
                      {currentWordTokens.length > 0 && index === 0 && (
                        <div className="text-xl font-bold text-blue-600">-</div>
                      )}
                      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-2 text-center">
                        <div className="text-xl font-bold text-gray-400">_</div>
                      </div>
                      {index < syllableSize - currentWordTokens.length - 1 && (
                        <div className="text-xl font-bold text-gray-400">-</div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-48">
            <div className="text-center">
              <p className="text-gray-500 font-medium text-lg mb-2">
                Trage silabele aici pentru a forma cuvinte
              </p>
              <p className="text-xs text-gray-400">
                Fiecare cuvânt va avea {syllableSize} silabe separate cu cratima (-)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}