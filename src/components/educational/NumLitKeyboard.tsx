import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { GripVertical, X, Minimize2, Maximize2, ChevronDown, ChevronUp, ZoomIn, ZoomOut, Move } from "lucide-react";
import NumLitScale from "./NumLitScale";
import Rigleta from "./Rigleta";
import VerticalSelector from "./VerticalSelector";

interface NumLitKeyboardProps {
  onKeyPress: (key: string) => void;
  onClose?: () => void;
  maxNumber?: number;
  includeOperators?: boolean;
  className?: string;
  concentration?: '0-10' | '0-letters' | '0-100' | '>';
  selectedLanguage?: string;
  onConcentrationChange?: (concentration: '0-10' | '0-letters' | '0-100' | '>') => void;
  onLanguageChange?: (language: string) => void;
  inline?: boolean;
}

// Rigleta colors for numbers 0-9 (exact colors from design system)
const rigletaColors = {
  0: 'bg-black text-white',
  1: 'bg-rigleta-1 text-white',
  2: 'bg-rigleta-2 text-white', 
  3: 'bg-rigleta-3 text-white',
  4: 'bg-rigleta-4 text-white',
  5: 'bg-rigleta-5 text-black',
  6: 'bg-rigleta-6 text-black',
  7: 'bg-rigleta-7 text-white',
  8: 'bg-rigleta-8 text-white',
  9: 'bg-rigleta-9 text-white',
} as const;

export default function NumLitKeyboard({ 
  onKeyPress, 
  onClose,
  maxNumber = 100, 
  includeOperators = true,
  className,
  concentration = '0-10',
  selectedLanguage = 'ro',
  onConcentrationChange,
  onLanguageChange,
  inline = false
}: NumLitKeyboardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [letterPosition, setLetterPosition] = useState(0);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isCompact, setIsCompact] = useState(false);
  const [showAllKeys, setShowAllKeys] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0.52);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const keyboardRef = useRef<HTMLDivElement>(null);

  // Language options with letter counts
  const languageOptions = [
    { value: 'ro', label: 'Română (31)', letters: 31 },
    { value: 'en', label: 'English (26)', letters: 26 },
    { value: 'fr', label: 'Français (32)', letters: 32 },
    { value: 'cz', label: 'Čeština (42)', letters: 42 },
    { value: 'de', label: 'Deutsch (30)', letters: 30 },
    { value: 'es', label: 'Español (27)', letters: 27 },
    { value: 'it', label: 'Italiano (26)', letters: 26 },
    { value: 'hu', label: 'Magyar (44)', letters: 44 },
    { value: 'pl', label: 'Polski (32)', letters: 32 },
    { value: 'bg', label: 'Български (30)', letters: 30 },
    { value: 'ru', label: 'Русский (33)', letters: 33 },
    { value: 'ar', label: 'العربية (28)', letters: 28 },
    { value: 'el', label: 'Ελληνικά (24)', letters: 24 }
  ];
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  // Get the max number for current language in 0-letters mode
  const getMaxLetters = () => {
    const lang = languageOptions.find(l => l.value === selectedLanguage);
    return lang ? lang.letters : 31;
  };

  // Get letters array for current language
  const getLanguageLetters = () => {
    const languageLetters = {
      'ro': 'AĂÂBCDEFGHIÎJKLMNOPQRSȘTȚUVWXYZ',
      'en': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      'fr': 'ABCDEFGHIJKLMNOPQRSTUVWXYZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ',
      'cz': 'AÁBCČDĎEÉĚFGHIJKLMNŇOÓPQRŘSŠTŤUÚŮVWXYŽZÁÍÝĆĐ',
      'de': 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜß',
      'es': 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚÜ',
      'it': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      'hu': 'AÁBCDEFGHIJKLMNOOÖPQRSTUVWXYZÜÁÉÍÓÚŐŰ',
      'pl': 'AĄBCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWYZŹŻ',
      'bg': 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЮЯ',
      'ru': 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ',
      'ar': 'أبتثجحخدذرزسشصضطظعغفقكلمنهوي',
      'el': 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'
    };
    return languageLetters[selectedLanguage] || languageLetters['ro'];
  };

  // Get vowels for current language
  const getLanguageVowels = () => {
    const vowels = {
      'ro': 'AĂÂEIÎOU',
      'en': 'AEIOU',
      'fr': 'AEIOUÀÂÄÉÈÊËÏÎÔÖÙÛÜŸ',
      'cz': 'AÁEÉĚIÍOÓUÚŮYÝ',
      'de': 'AEIOUÄÖÜ',
      'es': 'AEIOUÁÉÍÓÚ',
      'it': 'AEIOU',
      'hu': 'AÁEÉIÍOÓÖŐUÚÜŰ',
      'pl': 'AĄEĘIOÓUY',
      'bg': 'АЕИОУЮЯ',
      'ru': 'АЕЁИОУЫЭЮЯ',
      'ar': 'أاوي',
      'el': 'ΑΕΙΟΥ'
    };
    return vowels[selectedLanguage] || vowels['ro'];
  };

  // Check if a letter is a vowel
  const isVowel = (letter: string) => {
    const vowels = getLanguageVowels();
    return vowels.includes(letter.toUpperCase());
  };

  // Render number grids based on concentration - corrected functionality
  const renderNumberGrid = () => {
    console.log('NumLitKeyboard renderNumberGrid called with concentration:', concentration);
    const numbers = [];
    
    switch (concentration) {
      case '0-10':
        // Single row: 0-9 with 10 at the end, plus integrated scale
        numbers.push(
          <div key="row-0-10" className="flex gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <Button
                key={i}
                variant="outline"
                className={cn(
                  'w-12 h-12 text-2xl font-bold border-2 rounded-lg transition-all duration-200 hover:scale-105',
                  rigletaColors[i as keyof typeof rigletaColors]
                )}
                onClick={() => onKeyPress(i.toString())}
              >
                {i}
              </Button>
            ))}
            {/* Number 10 positioned at the end of the same line */}
            <Button
              variant="outline"
              className="w-12 h-12 text-2xl font-bold border-2 rounded-lg transition-all duration-200 hover:scale-105 bg-red-500 text-white ml-2"
              onClick={() => onKeyPress('10')}
            >
              10
            </Button>
          </div>
        );
        
        // Add rigletas immediately after buttons for 0-10 concentration
        numbers.push(
          <div key="rigletas-0-10" className="mt-4 w-full flex justify-center">
            <div className="w-full max-w-md">
              <NumLitScale
                maxValue={10}
                size="small"
                showLabels={true}
                orientation="horizontal"
                className="bg-white/90 backdrop-blur-sm border-gray-200 rounded-lg p-2"
                onValueClick={onKeyPress}
                interactive={true}
                onDragStart={(value) => {
                  console.log('Started dragging rigleta with value:', value);
                }}
                onDragEnd={() => {
                  console.log('Finished dragging rigleta');
                }}
              />
            </div>
          </div>
        );
        
        break;

      case '0-letters':
        const letters = getLanguageLetters();
        const currentLetter = letterPosition === 0 ? '' : letters[letterPosition - 1] || '';
        
        // Create a single row of 10 cells, all showing the same letter
        const letterCells = [];
        for (let i = 0; i < 10; i++) {
          const borderColor = currentLetter && isVowel(currentLetter) ? 'border-blue-500' : 'border-red-500';
          const cellBorder = currentLetter ? borderColor : 'border-gray-300';
          
          letterCells.push(
            <Button
              key={i}
              variant="outline"
              className={cn(
                'w-12 h-12 text-2xl font-bold border-2 rounded-lg transition-all duration-200 hover:scale-105',
                cellBorder,
                currentLetter ? 'bg-white text-black hover:bg-gray-50' : 'bg-gray-100 text-gray-400'
              )}
              onClick={() => currentLetter && onKeyPress(currentLetter)}
              disabled={!currentLetter}
            >
              {currentLetter}
            </Button>
          );
        }
        
        numbers.push(
          <div key="letters-layout" className="flex flex-col items-center gap-4">
            <VerticalSelector
              value={letterPosition}
              min={0}
              max={letters.length}
              onChange={setLetterPosition}
              className="mb-2"
            />
            <div className="flex gap-2">
              {letterCells}
            </div>
          </div>
        );
        break;

      case '0-100':
        // Generate all numbers from 0 to 100
        const hundredRows = [];
        for (let row = 0; row <= 10; row++) {
          const rowNumbers = [];
          for (let col = 0; col < 10; col++) {
            const num = row * 10 + col;
            if (num > 100) break;
            
            rowNumbers.push(
              <Button
                key={num}
                variant="outline"
                className={cn(
                  'w-12 h-12 text-2xl font-bold border-2 rounded-lg transition-all duration-200 hover:scale-105',
                  num <= 9 ? rigletaColors[num as keyof typeof rigletaColors] : 
                  num % 2 === 0 ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                )}
                onClick={() => onKeyPress(num.toString())}
              >
                {num}
              </Button>
            );
          }
          
          if (rowNumbers.length > 0) {
            hundredRows.push(
              <div key={`hundred-row-${row}`} className="flex gap-1">
                {rowNumbers}
              </div>
            );
          }
        }
        numbers.push(...hundredRows);
        break;

      case '>':
        // Full grid: rows 0-9 (0-99) + 100
        const rows = [];
        for (let row = 0; row < 10; row++) {
          const rowNumbers = [];
          for (let col = 0; col < 10; col++) {
            const num = row * 10 + col;
            const isEven = num % 2 === 0;
            
            rowNumbers.push(
              <Button
                key={num}
                variant="outline"
                className={cn(
                  'w-12 h-12 text-2xl font-bold border-2 rounded-lg transition-all duration-200 hover:scale-105',
                  num <= 9 ? rigletaColors[num as keyof typeof rigletaColors] : 
                  isEven ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                )}
                onClick={() => onKeyPress(num.toString())}
              >
                {num}
              </Button>
            );
          }
          rows.push(
            <div key={`row-${row}`} className="flex gap-1">
              {rowNumbers}
            </div>
          );
        }
        numbers.push(...rows);
        
        // Add 100
        numbers.push(
          <div key="row-100" className="flex gap-1 justify-center">
            <Button
              variant="outline"
              className="w-12 h-12 text-2xl font-bold border-2 rounded-lg transition-all duration-200 hover:scale-105 bg-red-500 text-white"
              onClick={() => onKeyPress('100')}
            >
              100
            </Button>
          </div>
        );
        break;
    }
    
    console.log('NumLitKeyboard returning', numbers.length, 'number rows for concentration:', concentration);
    return numbers;
  };

  // Special operators based on concentration - corrected
  const getOperators = () => {
    switch (concentration) {
      case '0-10':
      case '0-letters':
        return [
          { symbols: ['+', '-', '='], color: 'border-gray-400 bg-gray-100 hover:bg-gray-200' },
          { symbols: ['<', '>'], color: 'border-gray-400 bg-gray-100 hover:bg-gray-200' }
        ];
      case '0-100':
        return [
          { symbols: ['+', '-', ':', 'x'], color: 'border-gray-400 bg-gray-100 hover:bg-gray-200' },
          { symbols: ['=', '(', ')', '/'], color: 'border-gray-400 bg-gray-100 hover:bg-gray-200' }
        ];
      case '>':
        return [
          { symbols: ['+', '-', '×', '÷', '='], color: 'border-gray-400 bg-gray-100 hover:bg-gray-200' },
          { symbols: ['<', '>', ':', '/', '*'], color: 'border-gray-400 bg-gray-100 hover:bg-gray-200' },
          { symbols: ['(', ')', '{', '}', '['], color: 'border-gray-400 bg-gray-100 hover:bg-gray-200' },
          { symbols: [']', '√', '^', '!', '%'], color: 'border-gray-400 bg-gray-100 hover:bg-gray-200' }
        ];
      default:
        return [];
    }
  };

  const getBrackets = () => {
    return ['(', ')', '{', '}', '[', ']'];
  };

  const getSpecialKeys = () => {
    return [
      { key: '∞', display: '∞', color: 'border-green-400 bg-green-100 hover:bg-green-200' },
      { key: '⌫', display: '⌫', color: 'border-blue-400 bg-blue-100 hover:bg-blue-200' },
      { key: 'validate', display: '✓', color: 'border-green-400 bg-green-100 hover:bg-green-200' }
    ];
  };

  const getVariables = () => {
    return ['a', 'b', 'c', 'd', 'x', 'y', 'z'];
  };

  const handleSpecialKey = (key: string) => {
    switch (key) {
      case '⌫':
        onKeyPress('backspace');
        break;
      case '✓':
        onKeyPress('validate');
        break;
      default:
        onKeyPress(key);
    }
  };

  // Zoom functions
  const zoomLevels = [0.4, 0.52, 0.75, 1, 1.25, 1.5];
  const currentZoomIndex = zoomLevels.indexOf(zoomLevel);
  
  const handleZoomIn = () => {
    console.log('handleZoomIn called, currentZoomIndex:', currentZoomIndex, 'zoomLevels.length:', zoomLevels.length);
    if (currentZoomIndex < zoomLevels.length - 1) {
      const newZoomLevel = zoomLevels[currentZoomIndex + 1];
      console.log('Setting new zoom level to:', newZoomLevel);
      setZoomLevel(newZoomLevel);
    }
  };
  
  const handleZoomOut = () => {
    console.log('handleZoomOut called, currentZoomIndex:', currentZoomIndex);
    if (currentZoomIndex > 0) {
      const newZoomLevel = zoomLevels[currentZoomIndex - 1];
      console.log('Setting new zoom level to:', newZoomLevel);
      setZoomLevel(newZoomLevel);
    }
  };

  return (
    <div 
      ref={keyboardRef}
      className={cn(
        'bg-white rounded-lg border-2 border-gray-300 shadow-lg select-none',
        isDragging ? 'cursor-grabbing' : 'cursor-grab',
        className
      )}
      style={inline ? {
        position: 'relative',
        width: '100%',
        maxWidth: '1200px',
        transform: `scale(${zoomLevel})`,
        transformOrigin: 'top left',
        zIndex: 1
      } : {
        position: 'fixed',
        right: `${20 - position.x}px`,
        bottom: `${20 - position.y}px`,
        zIndex: 1000,
        width: '1200px',
        transform: `scale(${zoomLevel})`,
        transformOrigin: 'bottom right'
      }}
      onMouseDown={inline ? undefined : handleMouseDown}
    >
      <div className="p-4" onMouseDown={inline ? undefined : (e) => e.stopPropagation()}>
        {/* Header with controls */}
        <div className="flex items-center justify-between mb-2 p-1 bg-gray-100 rounded">
          <div className="flex items-center gap-1">
            <div 
              className="flex items-center justify-center cursor-grab hover:bg-blue-200 px-2 py-1 rounded bg-blue-100 border-2 border-blue-300"
              onMouseDown={handleMouseDown}
              title="Mutare tastatură"
            >
              <Move className="w-6 h-6 text-blue-700" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCompact(!isCompact)}
              className="h-8 w-8 p-0 hover:bg-green-200 bg-green-100 border-2 border-green-300 rounded"
              title={isCompact ? "Extinde tastatura" : "Compactează tastatura"}
            >
              {isCompact ? <Maximize2 className="w-5 h-5 text-green-700" /> : <Minimize2 className="w-5 h-5 text-green-700" />}
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            {/* Zoom controls */}
            <div className="flex items-center gap-2 bg-purple-100 rounded-lg p-2 border-2 border-purple-300 min-w-[250px]">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={currentZoomIndex === 0}
                className="h-8 w-8 p-0 hover:bg-purple-200 disabled:opacity-50 bg-purple-50"
                title="Micșorează tastatura"
              >
                <ZoomOut className="w-10 h-10 text-purple-700" />
              </Button>
              <div className="flex-1">
                <Slider
                  value={[zoomLevel * 100]}
                  onValueChange={(value) => {
                    const newZoomLevel = value[0] / 100;
                    const closestLevel = zoomLevels.reduce((prev, curr) => 
                      Math.abs(curr - newZoomLevel) < Math.abs(prev - newZoomLevel) ? curr : prev
                    );
                    setZoomLevel(closestLevel);
                  }}
                  min={40}
                  max={150}
                  step={1}
                  className="w-full"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={currentZoomIndex === zoomLevels.length - 1}
                className="h-8 w-8 p-0 hover:bg-purple-200 disabled:opacity-50 bg-purple-50"
                title="Mărește tastatura"
              >
                <ZoomIn className="w-10 h-10 text-purple-700" />
              </Button>
              <span className="text-sm text-purple-700 font-bold min-w-[3ch]">
                {Math.round(zoomLevel * 100)}%
              </span>
            </div>
            
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-red-200 bg-red-100 border-2 border-red-300 rounded"
                title="Închide tastatura"
              >
                <X className="w-5 h-5 text-red-700" />
              </Button>
            )}
          </div>
        </div>

        {/* Concentration selector */}
        <div className="flex items-center justify-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg border">
          <span className="text-xl font-medium text-gray-600">Concentru:</span>
          <div className="flex gap-1">
            {['0-10', '0-letters', '0-100', '>'].map((conc) => (
              <Button
                key={conc}
                variant={concentration === conc ? "default" : "outline"}
                size="sm"
                className={cn(
                  "text-xl px-4 py-2 h-12 transition-all font-bold",
                  concentration === conc 
                    ? "bg-blue-500 text-white border-blue-600" 
                    : "bg-white hover:bg-blue-50 text-gray-700 border-gray-300"
                )}
                onClick={() => onConcentrationChange?.(conc as any)}
              >
                {conc}
              </Button>
            ))}
          </div>
          {concentration === '0-letters' && (
            <>
              <span className="text-xl font-medium text-gray-600 ml-2">Limbă:</span>
              <Select value={selectedLanguage} onValueChange={onLanguageChange}>
                <SelectTrigger className="w-32 h-12 text-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg max-h-40 overflow-y-auto z-[1001]">
                  {languageOptions.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value} className="text-xl">
                      {lang.value.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>

        {/* Main keyboard layout */}
        <div className="flex gap-6">
          {/* Left side - Numbers */}
          <div className="flex-1">
            <div className="space-y-2">
              {/* Check if we need to show expand/collapse for numbers */}
              {(() => {
                const numberRows = renderNumberGrid();
                const shouldShowToggle = numberRows.length > 5;
                
                if (shouldShowToggle && !isExpanded) {
                  // Show only first 5 rows with expand button
                  return (
                    <>
                      {numberRows.slice(0, 5)}
                      <div className="flex justify-center mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsExpanded(true)}
                          className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 border-blue-300"
                        >
                          <ChevronDown className="w-4 h-4" />
                          Extinde în jos
                        </Button>
                      </div>
                    </>
                  );
                } else if (shouldShowToggle && isExpanded) {
                  // Show all rows with collapse button
                  return (
                    <>
                      {numberRows}
                      <div className="flex justify-center mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsExpanded(false)}
                          className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 border-blue-300"
                        >
                          <ChevronUp className="w-4 h-4" />
                          Comprimă
                        </Button>
                      </div>
                    </>
                  );
                } else {
                  // Show all rows (5 or fewer)
                  return numberRows;
                }
              })()}
            </div>
          </div>
          
          {/* Right side - Operators and symbols */}
          {includeOperators && (
            <div className="flex-1">
              <div className="space-y-3">
                {/* Operators rows */}
                {getOperators().map((operatorRow, rowIndex) => (
                  <div key={`operators-${rowIndex}`} className="flex gap-1">
                    {operatorRow.symbols.map((symbol) => (
                      <Button
                        key={symbol}
                        variant="outline"
                        className={cn(
                          'w-12 h-12 text-2xl font-bold border-2 rounded-lg transition-all duration-200 hover:scale-105',
                          operatorRow.color
                        )}
                        onClick={() => onKeyPress(symbol)}
                      >
                        {symbol}
                      </Button>
                    ))}
                  </div>
                ))}
                
                {/* Brackets row */}
                <div className="flex gap-1">
                  {getBrackets().map((bracket) => (
                    <Button
                      key={bracket}
                      variant="outline"
                      className="w-12 h-12 text-2xl font-bold border-2 border-orange-400 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg transition-all duration-200 hover:scale-105"
                      onClick={() => onKeyPress(bracket)}
                    >
                      {bracket}
                    </Button>
                  ))}
                </div>
                
                {/* Special keys row */}
                <div className="flex gap-1">
                  {getSpecialKeys().map((specialKey) => (
                    <Button
                      key={specialKey.key}
                      variant="outline"
                      className={cn(
                        'w-12 h-12 text-xl font-bold border-2 rounded-lg transition-all duration-200 hover:scale-105',
                        specialKey.color
                      )}
                      onClick={() => handleSpecialKey(specialKey.key)}
                    >
                      {specialKey.display}
                    </Button>
                  ))}
                </div>
                
                {/* Variables row */}
                <div className="flex gap-1">
                  {getVariables().map((variable) => (
                    <Button
                      key={variable}
                      variant="outline"
                      className="w-12 h-12 text-xl font-bold border-2 border-purple-400 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg transition-all duration-200 hover:scale-105"
                      onClick={() => onKeyPress(variable)}
                    >
                      {variable}
                    </Button>
                  ))}
                </div>
                
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}