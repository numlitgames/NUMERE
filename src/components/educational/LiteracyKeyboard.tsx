import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Move, X, Minimize2, Maximize2, ZoomIn, ZoomOut, Settings } from "lucide-react";
import VerticalSelector from './VerticalSelector';
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar";
import { svgLetterComponents } from "@/components/educational/svg-letters";

// Import letter tracing images
import AImage from "@/assets/letters/A.png";
import ĂImage from "@/assets/letters/Ă.png";
import ÂImage from "@/assets/letters/Â.png";
import BImage from "@/assets/letters/B.png";
import CImage from "@/assets/letters/C.png";
import DImage from "@/assets/letters/D.png";
import EImage from "@/assets/letters/E.png";
import FImage from "@/assets/letters/F.png";
import GImage from "@/assets/letters/G.png";
import HImage from "@/assets/letters/H.png";

interface LiteracyKeyboardProps {
  onKeyPress: (key: string) => void;
  onClose?: () => void;
  className?: string;
  selectedLanguage?: string;
  onLanguageChange?: (language: string) => void;
}

// Language alphabets and vowels
const languageData = {
  ro: { 
    alphabet: ['A', 'Ă', 'Â', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'Î', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'Ș', 'T', 'Ț', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    vowels: ['A', 'Ă', 'Â', 'E', 'I', 'Î', 'O', 'U']
  },
  en: { 
    alphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    vowels: ['A', 'E', 'I', 'O', 'U']
  },
  fr: { 
    alphabet: ['A', 'À', 'Á', 'Â', 'Ä', 'B', 'C', 'Ç', 'D', 'E', 'È', 'É', 'Ê', 'Ë', 'F', 'G', 'H', 'I', 'Î', 'Ï', 'J', 'K', 'L', 'M', 'N', 'O', 'Ô', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ù', 'Û', 'Ü', 'V', 'W', 'X', 'Y', 'Z'],
    vowels: ['A', 'À', 'Á', 'Â', 'Ä', 'E', 'È', 'É', 'Ê', 'Ë', 'I', 'Î', 'Ï', 'O', 'Ô', 'U', 'Ù', 'Û', 'Ü']
  },
  de: { 
    alphabet: ['A', 'Ä', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 'Q', 'R', 'S', 'ß', 'T', 'U', 'Ü', 'V', 'W', 'X', 'Y', 'Z'],
    vowels: ['A', 'Ä', 'E', 'I', 'O', 'Ö', 'U', 'Ü']
  },
  es: { 
    alphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    vowels: ['A', 'E', 'I', 'O', 'U']
  },
  it: { 
    alphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    vowels: ['A', 'E', 'I', 'O', 'U']
  },
  pl: { 
    alphabet: ['A', 'Ą', 'B', 'C', 'Ć', 'D', 'E', 'Ę', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'Ł', 'M', 'N', 'Ń', 'O', 'Ó', 'P', 'Q', 'R', 'S', 'Ś', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Ź', 'Ż'],
    vowels: ['A', 'Ą', 'E', 'Ę', 'I', 'O', 'Ó', 'U', 'Y']
  },
  cs: { 
    alphabet: ['A', 'Á', 'B', 'C', 'Č', 'D', 'Ď', 'E', 'É', 'Ě', 'F', 'G', 'H', 'CH', 'I', 'Í', 'J', 'K', 'L', 'M', 'N', 'Ň', 'O', 'Ó', 'P', 'Q', 'R', 'Ř', 'S', 'Š', 'T', 'Ť', 'U', 'Ú', 'Ů', 'V', 'W', 'X', 'Y', 'Ý', 'Z', 'Ž'],
    vowels: ['A', 'Á', 'E', 'É', 'Ě', 'I', 'Í', 'O', 'Ó', 'U', 'Ú', 'Ů', 'Y', 'Ý']
  },
  hu: { 
    alphabet: ['A', 'Á', 'B', 'C', 'CS', 'D', 'DZ', 'DZS', 'E', 'É', 'F', 'G', 'GY', 'H', 'I', 'Í', 'J', 'K', 'L', 'LY', 'M', 'N', 'NY', 'O', 'Ó', 'Ö', 'Ő', 'P', 'Q', 'R', 'S', 'SZ', 'T', 'TY', 'U', 'Ú', 'Ü', 'Ű', 'V', 'W', 'X', 'Y', 'Z', 'ZS'],
    vowels: ['A', 'Á', 'E', 'É', 'I', 'Í', 'O', 'Ó', 'Ö', 'Ő', 'U', 'Ú', 'Ü', 'Ű']
  },
  bg: { 
    alphabet: ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ь', 'Ю', 'Я'],
    vowels: ['А', 'Е', 'И', 'О', 'У', 'Ъ', 'Ю', 'Я']
  },
  ru: { 
    alphabet: ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'],
    vowels: ['А', 'Е', 'Ё', 'И', 'О', 'У', 'Ы', 'Э', 'Ю', 'Я']
  },
  ar: { 
    alphabet: ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'],
    vowels: ['ا', 'و', 'ي']
  },
  el: { 
    alphabet: ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'],
    vowels: ['Α', 'Ε', 'Η', 'Ι', 'Ο', 'Υ', 'Ω']
  },
  hi: { 
    alphabet: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ', 'क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ', 'ड', 'ढ', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह'],
    vowels: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ']
  },
  ja: { 
    alphabet: ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ', 'ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'ん'],
    vowels: ['あ', 'い', 'う', 'え', 'お']
  },
  tr: { 
    alphabet: ['A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H', 'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'],
    vowels: ['A', 'E', 'I', 'İ', 'O', 'Ö', 'U', 'Ü']
  },
  zh: { 
    alphabet: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '亿', '东', '南', '西', '北', '上', '下', '左', '右', '大', '小', '多', '少', '长', '短', '高', '低', '好', '坏', '新', '旧'],
    vowels: []
  }
};

// Language options
const languageOptions = [
  { value: 'ro', label: 'Română' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' },
  { value: 'it', label: 'Italiano' },
  { value: 'pl', label: 'Polski' },
  { value: 'cs', label: 'Čeština' },
  { value: 'hu', label: 'Magyar' },
  { value: 'bg', label: 'Български' },
  { value: 'ru', label: 'Русский' },
  { value: 'ar', label: 'العربية' },
  { value: 'el', label: 'Ελληνικά' },
  { value: 'hi', label: 'हिंदी' },
  { value: 'ja', label: '日本語' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'zh', label: '中文' }
];

// Font type options with international symbols
const fontTypes = [
  { value: 'uppercase-print', label: 'ABC', symbol: '🔤', color: 'bg-blue-500' },
  { value: 'lowercase-print', label: 'abc', symbol: '🔤', color: 'bg-green-500' },
  { value: 'uppercase-cursive', label: '𝒜ℬ𝒞', symbol: '✍️', color: 'bg-purple-500' },
  { value: 'lowercase-cursive', label: '𝒶𝒷𝒸', symbol: '✍️', color: 'bg-orange-500' }
];

// Punctuation marks
const punctuationMarks = ['.', ',', '?', '!', '_', '-', ';', ':', '"'];

// Letter images mapping - using uppercase letters as keys for universal mapping
const letterImages: Record<string, string> = {
  'A': AImage,
  'Ă': ĂImage,
  'Â': ÂImage,
  'B': BImage,
  'C': CImage,
  'D': DImage,
  'E': EImage,
  'F': FImage,
  'G': GImage,
  'H': HImage
};

// Function to get image or SVG component for a letter (case-insensitive, works across languages)
const getLetterImage = (letter: string): string | null => {
  const upperLetter = letter.toUpperCase();
  return letterImages[upperLetter] || null;
};

// Function to get SVG component for a letter
const getSVGComponent = (letter: string) => {
  return svgLetterComponents[letter as keyof typeof svgLetterComponents] || null;
};

export default function LiteracyKeyboard({ 
  onKeyPress, 
  onClose,
  className,
  selectedLanguage = 'ro',
  onLanguageChange
}: LiteracyKeyboardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isCompact, setIsCompact] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0.75);
  const [fontType, setFontType] = useState('uppercase-print');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const keyboardRef = useRef<HTMLDivElement>(null);

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

  // Get current language data and filter alphabet based on font type
  const currentLangData = languageData[selectedLanguage as keyof typeof languageData] || languageData.ro;
  
  // Filter alphabet based on font type (uppercase/lowercase)
  const getFilteredAlphabet = () => {
    const baseAlphabet = currentLangData.alphabet;
    
    // For languages that don't distinguish case (like Arabic, Hindi, Japanese, Chinese), show all
    if (['ar', 'hi', 'ja', 'zh'].includes(selectedLanguage)) {
      return baseAlphabet;
    }
    
    // For European languages, filter based on font type
    if (fontType.includes('uppercase')) {
      return baseAlphabet.map(letter => letter.toUpperCase());
    } else if (fontType.includes('lowercase')) {
      return baseAlphabet.map(letter => letter.toLowerCase());
    }
    
    return baseAlphabet;
  };
  
  const alphabet = getFilteredAlphabet();
  
  // Check if letter is vowel (check both original and transformed)
  const isVowel = (letter: string) => {
    const upperLetter = letter.toUpperCase();
    return currentLangData.vowels.includes(upperLetter) || currentLangData.vowels.includes(letter);
  };

  // Transform letter based on font type
  const transformLetter = (letter: string) => {
    switch (fontType) {
      case 'lowercase-print':
      case 'lowercase-cursive':
        return letter.toLowerCase();
      case 'uppercase-print':
      case 'uppercase-cursive':
      default:
        return letter.toUpperCase();
    }
  };

  // Render keyboard grid with proper filtering
  const renderKeyboardGrid = () => {
    const rows = [];
    let letterIndex = 0;

    // Calculate number of rows needed (considering empty cell and 10 cells per row)
    const totalCells = alphabet.length + 1; // +1 for the empty gray cell
    const numRows = Math.ceil(totalCells / 10);

    for (let row = 0; row < numRows; row++) {
      const rowCells = [];
      
      for (let col = 0; col < 10; col++) {
        const cellIndex = row * 10 + col;
        
        // First cell (position 0) is always gray and empty
        if (cellIndex === 0) {
          const isSelected = selectedLetter === null;
          rowCells.push(
            <div
              key="empty-cell"
              className={cn(
                'w-12 h-12 bg-gray-300 border-2 border-gray-400 rounded-lg flex items-center justify-center opacity-50 transition-all duration-200 cursor-pointer',
                isSelected && 'scale-115 shadow-lg shadow-gray-400/50'
              )}
              onClick={() => setSelectedLetter(null)}
            >
              <span className="text-gray-600 font-bold text-sm">0</span>
            </div>
          );
        } else {
          // Letter cells start from position 1
          if (letterIndex < alphabet.length) {
            const letter = alphabet[letterIndex];
            const displayLetter = letter; // Already filtered by getFilteredAlphabet
            const vowel = isVowel(letter);
            const letterImage = getLetterImage(letter);
            const svgComponent = getSVGComponent(letter);
            const isSelected = selectedLetter === letter;
            
            rowCells.push(
              <Button
                key={letter}
                variant="outline"
                className={cn(
                  'w-12 h-12 border-3 rounded-lg transition-all duration-200 hover:scale-105 p-1',
                  vowel 
                    ? 'border-blue-600 bg-blue-50 hover:bg-blue-100 shadow-sm shadow-blue-200' 
                    : 'border-red-600 bg-red-50 hover:bg-red-100 shadow-sm shadow-red-200',
                  isSelected && 'scale-115 shadow-lg',
                  isSelected && vowel && 'shadow-blue-500/50 bg-blue-100',
                  isSelected && !vowel && 'shadow-red-500/50 bg-red-100'
                )}
                onClick={() => {
                  setSelectedLetter(letter);
                  console.log('LiteracyKeyboard: Sending letter to canvas:', displayLetter);
                  onKeyPress(displayLetter);
                }}
              >
                {svgComponent ? (
                  React.createElement(svgComponent, { 
                    className: "w-full h-full object-contain",
                    size: 40
                  })
                ) : letterImage ? (
                  <img 
                    src={letterImage} 
                    alt={displayLetter}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className={cn(
                    'text-lg font-bold',
                    vowel ? 'text-blue-800' : 'text-red-800'
                  )}>
                    {displayLetter}
                  </span>
                )}
              </Button>
            );
            letterIndex++;
          } else {
            // Empty cell if we've run out of letters
            rowCells.push(
              <div key={`empty-${cellIndex}`} className="w-12 h-12" />
            );
          }
        }
      }
      
      rows.push(
        <div key={`row-${row}`} className="flex gap-1 justify-center">
          {rowCells}
        </div>
      );
    }
    
    // Add punctuation row
    const punctuationRow = (
      <div key="punctuation-row" className="flex gap-1 justify-center mt-2">
        {punctuationMarks.map((mark) => (
          <Button
            key={mark}
            variant="outline"
            className="w-12 h-12 border-2 border-gray-400 rounded-lg transition-all duration-200 hover:scale-105 bg-white hover:bg-gray-50"
            onClick={() => onKeyPress(mark)}
          >
            <span className="text-lg font-bold text-gray-600">
              {mark}
            </span>
          </Button>
        ))}
        {/* Space button */}
        <Button
          variant="outline"
          className="w-24 h-12 border-2 border-gray-400 rounded-lg transition-all duration-200 hover:scale-105 bg-white hover:bg-gray-50"
          onClick={() => onKeyPress(' ')}
        >
          <span className="text-sm font-medium text-gray-600">
            SPACE
          </span>
        </Button>
      </div>
    );
    
    rows.push(punctuationRow);
    
    return rows;
  };

  // Zoom functions
  const zoomLevels = [0.4, 0.6, 0.75, 1, 1.25, 1.5];
  const currentZoomIndex = zoomLevels.indexOf(zoomLevel);
  
  const handleZoomIn = () => {
    if (currentZoomIndex < zoomLevels.length - 1) {
      setZoomLevel(zoomLevels[currentZoomIndex + 1]);
    }
  };
  
  const handleZoomOut = () => {
    if (currentZoomIndex > 0) {
      setZoomLevel(zoomLevels[currentZoomIndex - 1]);
    }
  };

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div 
        ref={keyboardRef}
        className={cn(
          'bg-white rounded-lg shadow-lg select-none flex',
          isDragging ? 'cursor-grabbing' : 'cursor-grab',
          className
        )}
        style={{
          position: 'fixed',
          right: `${20 - position.x}px`,
          bottom: `${20 - position.y}px`,
          zIndex: 1000,
          width: 'auto',
          maxWidth: '900px',
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'bottom right'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Left Sidebar for Controls */}
        <Sidebar className="w-60 border-r-2 border-primary bg-muted/30" collapsible="none">
          <SidebarContent>
            <div className="flex flex-col gap-3 p-3 h-full">
              {/* Header Controls - Single Row */}
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="p-2 h-8 w-8"
                  title="Mutare tastatură"
                  onMouseDown={handleMouseDown}
                >
                  <Move className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCompact(!isCompact)}
                  className="p-2 h-8 w-8"
                  title={isCompact ? "Extinde tastatura" : "Compactează tastatura"}
                >
                  {isCompact ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>

                {onClose && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                    className="p-2 h-8 w-8"
                    title="Închide tastatura"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Font Type Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tip Font:</label>
                <div className="grid grid-cols-2 gap-2">
                  {fontTypes.map((font) => (
                    <Button
                      key={font.value}
                      variant={fontType === font.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFontType(font.value)}
                      className={cn(
                        "h-8 p-2 flex items-center justify-center gap-1",
                        fontType === font.value ? font.color + " text-white" : "hover:bg-muted"
                      )}
                      title={`Tip font: ${font.label}`}
                    >
                      <span className="text-xs">{font.symbol}</span>
                      <span className="text-xs">{font.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Zoom:</label>
                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={currentZoomIndex === 0}
                    className="h-8 w-8 p-0"
                    title="Micșorează tastatura"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[4ch] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={currentZoomIndex === zoomLevels.length - 1}
                    className="h-8 w-8 p-0"
                    title="Mărește tastatura"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Close Button */}
              {onClose && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onClose}
                  className="w-full mt-auto"
                  title="Închide tastatura"
                >
                  <X className="w-4 h-4 mr-2" />
                  Închide Tastatura
                </Button>
              )}
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Keyboard Content */}
        <div className="flex-1 p-2" onMouseDown={(e) => e.stopPropagation()}>
          {/* Compact header with close button */}
          <div className="flex justify-end mb-2">
            {onClose && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="p-1 h-6 w-6"
                title="Închide tastatura"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>

          {!isCompact && (
            <div className="flex gap-4">
              {/* Keyboard Grid */}
              <div className="flex flex-col gap-1 flex-1">
                {renderKeyboardGrid()}
              </div>

              {/* Right Selectors */}
              <div className="flex flex-col items-center gap-4 ml-4 pt-4">
                <div className="flex flex-col items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium text-primary">Poziție:</span>
                  <VerticalSelector
                    value={selectedLetter ? currentLangData.alphabet.indexOf(selectedLetter) + 1 : 0}
                    min={0}
                    max={currentLangData.alphabet.length}
                    onChange={(value) => {
                      if (value === 0) {
                        setSelectedLetter(null);
                      } else {
                        const letter = currentLangData.alphabet[value - 1];
                        setSelectedLetter(letter);
                      }
                    }}
                    outlineColor={selectedLetter ? (isVowel(selectedLetter) ? '#3b82f6' : '#ef4444') : '#000000'}
                    className="flex-shrink-0"
                  />
                  <div className="w-12 h-10 rounded border-2 bg-white flex items-center justify-center font-bold text-2xl" 
                       style={{ 
                         borderColor: selectedLetter ? (isVowel(selectedLetter) ? '#3b82f6' : '#ef4444') : '#9ca3af',
                         color: selectedLetter ? (isVowel(selectedLetter) ? '#3b82f6' : '#ef4444') : '#9ca3af'
                       }}>
                    {selectedLetter ? transformLetter(selectedLetter) : '?'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}