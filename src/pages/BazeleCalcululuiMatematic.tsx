import React, { useState, useRef, useCallback } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RigletaNumLit from "@/components/educational/RigletaNumLit";
import Rigleta from "@/components/educational/Rigleta";
import NumLitKeyboard from "@/components/educational/NumLitKeyboard";
import ProgressBar from "@/components/educational/ProgressBar";
import ZoomControls from "@/components/educational/ZoomControls";
import Timer from "@/components/educational/Timer";
import NumberSelector from "@/components/educational/NumberSelector";
import NumberCompositionGame from "@/components/educational/NumberCompositionGame";
import { CheckCircle, RotateCcw, Volume2, VolumeX, Home, Info, Keyboard, Play, Pause, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import numLitLogo from "@/assets/numlit-logo.png";

// 15 languages as specified - arranged alphabetically
const languages = [
  { code: 'ar', flag: '🇸🇦', name: 'العربية' },
  { code: 'bg', flag: '🇧🇬', name: 'Български' },
  { code: 'cz', flag: '🇨🇿', name: 'Čeština' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano' },
  { code: 'hu', flag: '🇭🇺', name: 'Magyar' },
  { code: 'nl', flag: '🇳🇱', name: 'Nederlands' },
  { code: 'pl', flag: '🇵🇱', name: 'Polski' },
  { code: 'pt', flag: '🇵🇹', name: 'Português' },
  { code: 'ro', flag: '🇷🇴', name: 'Română' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'tr', flag: '🇹🇷', name: 'Türkçe' }
];

// Game translations
const gameTranslations = {
  ro: {
    title: "Bazele Calcului Matematic",
    back: "Înapoi",
    language: "Limbă",
    level: "Nivel",
    instructions: "Instrucțiuni de folosire",
    progress: "Progres",
    zoom: "Mărire/Micșorare",
    timer: "Cronometru",
    showKeyboard: "Afișează tastatura NumLit",
    hideKeyboard: "Ascunde tastatura NumLit",
    howToPlay: "Cum să joci",
    gameDescription: "Învață bazele calculului matematic folosind rigletele NumLit interactive. Acest joc te ajută să înțelegi conceptele fundamentale ale matematicii prin vizualizare și manipulare directă.",
    availableRods: "Riglete disponibile",
    calculationArea: "Zona de calcul",
    validateAnswer: "Validează răspunsul",
    reset: "Resetează"
  },
  en: {
    title: "Mathematical Calculation Basics",
    back: "Back",
    language: "Language",
    level: "Level",
    instructions: "Usage Instructions",
    progress: "Progress",
    zoom: "Zoom In/Out",
    timer: "Timer",
    showKeyboard: "Show NumLit keyboard",
    hideKeyboard: "Hide NumLit keyboard",
    howToPlay: "How to play",
    gameDescription: "Learn the basics of mathematical calculation using interactive NumLit rods. This game helps you understand fundamental math concepts through visualization and direct manipulation.",
    availableRods: "Available rods",
    calculationArea: "Calculation area",
    validateAnswer: "Validate answer",
    reset: "Reset"
  }
  // ... other languages would follow the same pattern
};

export default function BazeleCalcululuiMatematic() {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('ro');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [selectedRods, setSelectedRods] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [gameMode, setGameMode] = useState<'rods' | 'composition'>('composition');
  const [compositionMode, setCompositionMode] = useState<'addition' | 'subtraction'>('addition');
  const [numberOfDigits, setNumberOfDigits] = useState(1);

  const t = gameTranslations[currentLanguage as keyof typeof gameTranslations] || gameTranslations.ro;

  const levels = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" }
  ];

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode);
  };

  const handleLevelChange = (level: number) => {
    setCurrentLevel(level);
  };

  const handleRigletaClick = (number: number) => {
    setSelectedRods(prev => [...prev, number]);
    toast.success(`Rigleta ${number} selectată!`);
  };

  const handleTimerToggle = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleTimerReset = () => {
    setIsTimerRunning(false);
    setCurrentTime(0);
  };

  const handleValidateAnswer = () => {
    // Game validation logic would go here
    toast.success("Răspuns validat!");
    setProgress(prev => Math.min(prev + 1, 10));
  };

  const handleReset = () => {
    setSelectedRods([]);
    setProgress(0);
    setCurrentTime(0);
    setIsTimerRunning(false);
    toast.info("Jocul a fost resetat!");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Sidebar */}
        <Sidebar className="w-32 border-r-2 border-primary/20">
          <div className="p-1.5 border-b border-primary/20">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="w-full justify-start text-primary hover:bg-primary/10 font-black"
            >
              <Home className="w-4 h-4 mr-2" />
              {t.back}
            </Button>
          </div>

          <SidebarContent className="p-1.5 space-y-2">
            {/* Language Selector */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-black text-primary border border-green-400 rounded p-1 text-center bg-green-50">
                {t.language}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-full bg-white border-green-400 border font-black h-6 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-green-400 max-h-40 overflow-y-auto">
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code} className="font-black text-xs">
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Level Selector */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-black text-primary border border-purple-400 rounded p-1 text-center bg-purple-50">
                {t.level}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <Select value={currentLevel.toString()} onValueChange={(value) => handleLevelChange(parseInt(value))}>
                  <SelectTrigger className="w-full bg-white border-purple-400 border font-black h-6 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-purple-400">
                    {levels.map((level) => (
                      <SelectItem key={level.value} value={level.value.toString()} className="font-black text-xs">
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Number of Digits Selector */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-black text-primary border border-pink-400 rounded p-1 text-center bg-pink-50">
                Cifre
              </SidebarGroupLabel>
              <SidebarGroupContent className="flex justify-center">
                <NumberSelector
                  value={numberOfDigits}
                  min={1}
                  max={9}
                  onChange={setNumberOfDigits}
                  className="mt-1"
                />
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Concentration Settings */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-black text-primary border border-orange-400 rounded p-1 text-center bg-orange-50">
                Concentru
              </SidebarGroupLabel>
              <SidebarGroupContent className="mt-1">
                <div className="text-xs font-black text-center text-gray-600">
                  Arată
                </div>
                <div className="text-xs font-black text-center text-gray-500">
                  31≡max
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Game Mode Selection */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-black text-primary border border-indigo-400 rounded p-1 text-center bg-indigo-50">
                Mod Joc
              </SidebarGroupLabel>
              <SidebarGroupContent className="space-y-1">
                <Button
                  variant={gameMode === 'composition' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setGameMode('composition')}
                  className="w-full font-black h-6 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Compunere
                </Button>
                <Button
                  variant={gameMode === 'rods' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setGameMode('rods')}
                  className="w-full font-black h-6 text-xs"
                >
                  <Minus className="w-3 h-3 mr-1" />
                  Riglete
                </Button>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Composition Mode Selection (only show when in composition mode) */}
            {gameMode === 'composition' && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-black text-primary border border-emerald-400 rounded p-1 text-center bg-emerald-50">
                  Operație
                </SidebarGroupLabel>
                <SidebarGroupContent className="space-y-1">
                  <Button
                    variant={compositionMode === 'addition' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCompositionMode('addition')}
                    className="w-full font-black h-6 text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Adunare
                  </Button>
                  <Button
                    variant={compositionMode === 'subtraction' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCompositionMode('subtraction')}
                    className="w-full font-black h-6 text-xs"
                  >
                    <Minus className="w-3 h-3 mr-1" />
                    Scădere
                  </Button>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {/* Keyboard Control */}
            <SidebarGroup>
              <SidebarGroupContent>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowKeyboard(!showKeyboard)}
                  className="w-full font-black h-6 text-xs"
                >
                  <Keyboard className="w-3 h-3 mr-1" />
                  {showKeyboard ? 'Ascunde' : 'Tastatura'}
                </Button>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b-2 border-primary/20 p-3 -ml-32">
            <div className="flex items-center justify-between w-full">
              {/* Left side - NumLit Logo - moved to align with sidebar edge */}
              <div className="flex items-center gap-3 -ml-32 pl-32">
                <img src={numLitLogo} alt="NumLit" className="h-10 w-auto" />
                <div className="h-8 w-px bg-primary/30"></div>
                <h1 className="text-lg font-black text-primary">
                  {t.title}
                </h1>
              </div>

              {/* Center - Controls */}
              <div className="flex items-center gap-3">
                {/* Instructions */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="font-black h-8 text-xs">
                      <Info className="w-3 h-3 mr-1.5" />
                      {t.instructions}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="font-black">{t.howToPlay}</DialogTitle>
                      <DialogDescription className="font-black text-base">
                        {t.gameDescription}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                {/* Progress Bar */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black">Progres</span>
                  <ProgressBar current={progress} total={10} className="w-28" />
                  <span className="text-xs font-black">{progress}/10</span>
                </div>

                {/* Zoom Controls */}
                <ZoomControls
                  zoom={zoom}
                  onZoomChange={setZoom}
                  className="bg-white"
                />

                {/* Timer */}
                <Timer
                  isRunning={isTimerRunning}
                  onTimeUpdate={setCurrentTime}
                  className="bg-white"
                />
              </div>

              {/* Right side - Empty now */}
              <div className="flex items-center gap-2">
              </div>
            </div>
          </header>

          {/* Game Content */}
          <main className="flex-1 p-6" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}>
            <div className="max-w-6xl mx-auto space-y-6">
              {gameMode === 'composition' ? (
                /* Number Composition Game */
                <NumberCompositionGame
                  targetNumber={currentLevel + 6} // 7, 8, 9, 10 based on level
                  mode={compositionMode}
                  numberOfDigits={numberOfDigits}
                  onCorrectAnswer={() => {
                    setProgress(prev => Math.min(prev + 1, 10));
                  }}
                  translations={{
                    canYouForm: 'Poți forma cifra',
                    from: 'din',
                    twoGroups: 'două grupe?',
                    youPut: 'Ai pus',
                    groupA: 'Grupa A',
                    groupB: 'Grupa B',
                    correct: 'Bravo! Răspuns corect!',
                    tryAgain: 'Încearcă din nou!',
                    hint: 'Sugestie'
                  }}
                />
              ) : (
                /* Traditional Rods Game */
                <>
                  {/* Available Rods Section */}
                  <div className="bg-white rounded-lg border-2 border-primary/20 p-6">
                    <h2 className="text-xl font-black text-primary mb-4">{t.availableRods}</h2>
                    <div className="grid grid-cols-5 gap-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <div key={num} className="flex justify-center">
                          <Rigleta
                            number={num}
                            interactive={true}
                            onClick={() => handleRigletaClick(num)}
                            className="hover:scale-105 transition-transform cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Calculation Area */}
                  <div className="bg-white rounded-lg border-2 border-primary/20 p-6">
                    <h2 className="text-xl font-black text-primary mb-4">{t.calculationArea}</h2>
                    <div className="min-h-40 border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                      {selectedRods.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedRods.map((num, index) => (
                            <Rigleta key={index} number={num} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 font-black">Trage rigletele aici pentru a începe calculul</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={handleValidateAnswer}
                      className="bg-green-500 hover:bg-green-600 text-white font-black px-8"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {t.validateAnswer}
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50 font-black px-8"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      {t.reset}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </main>

          {/* NumLit Keyboard */}
          {showKeyboard && (
            <div className="border-t-2 border-primary/20 bg-white p-4">
              <NumLitKeyboard
                onKeyPress={(key) => console.log('Key pressed:', key)}
                selectedLanguage={currentLanguage}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}
