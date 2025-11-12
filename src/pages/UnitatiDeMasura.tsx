import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NumLitKeyboard from "@/components/educational/NumLitKeyboard";
import ShopPromoBox from "@/components/educational/ShopPromoBox";
import ProgressBar from "@/components/educational/ProgressBar";
import ZoomControls from "@/components/educational/ZoomControls";
import Timer from "@/components/educational/Timer";
import InteractiveUnitGame from "@/components/educational/InteractiveUnitGame";
import { TransformationType, GameMode } from "@/components/educational/UnitTransformationTable";
import { gameTranslations, UnitType } from "@/lib/unitMeasurementData";
import numLitLogo from "@/assets/numlit-logo.png";
import { Home, Info, Keyboard, ChevronLeft } from "lucide-react";

const TOTAL_EXERCISES = 10;

export default function UnitatiDeMasura() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<string>('ro');
  const [level, setLevel] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<UnitType>('length');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [progress, setProgress] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [transformationType, setTransformationType] = useState<TransformationType>('multipli_to_submultipli');
  const [gameMode, setGameMode] = useState<GameMode>('easy');

  const translations = gameTranslations[lang as keyof typeof gameTranslations] || gameTranslations.ro;

  const handleCorrectAnswer = () => {
    setProgress(prev => {
      const newProgress = prev + 1;
      if (newProgress >= TOTAL_EXERCISES) {
        setIsTimerRunning(false);
        setTimeout(() => {
          setProgress(0);
        }, 2000);
      }
      return newProgress;
    });
  };

  const handleStartTimer = () => {
    setIsTimerRunning(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <Sidebar className="border-r w-48">
          <SidebarContent>
            <SidebarGroup className="py-2">
              <SidebarGroupLabel className="text-xs font-semibold">
                {translations.language}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Select value={lang} onValueChange={setLang}>
                      <SelectTrigger className="w-full h-8 text-sm border-2 border-blue-400 hover:border-blue-500 focus:border-blue-600 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="ro">🇷🇴 Română</SelectItem>
                        <SelectItem value="en">🇬🇧 English</SelectItem>
                        <SelectItem value="fr">🇫🇷 Français</SelectItem>
                        <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                        <SelectItem value="es">🇪🇸 Español</SelectItem>
                        <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                        <SelectItem value="pt">🇵🇹 Português</SelectItem>
                        <SelectItem value="cz">🇨🇿 Čeština</SelectItem>
                        <SelectItem value="pl">🇵🇱 Polski</SelectItem>
                        <SelectItem value="hu">🇭🇺 Magyar</SelectItem>
                        <SelectItem value="bg">🇧🇬 Български</SelectItem>
                        <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                        <SelectItem value="ar">🇸🇦 العربية</SelectItem>
                        <SelectItem value="tr">🇹🇷 Türkçe</SelectItem>
                        <SelectItem value="nl">🇳🇱 Nederlands</SelectItem>
                      </SelectContent>
                    </Select>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="py-2">
              <SidebarGroupLabel className="text-xs font-semibold">
                {translations.level}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Select value={level} onValueChange={setLevel}>
                      <SelectTrigger className="w-full h-8 text-sm border-2 border-purple-400 hover:border-purple-500 focus:border-purple-600 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="1">Nivel 1</SelectItem>
                        <SelectItem value="2" disabled>Nivel 2</SelectItem>
                        <SelectItem value="3" disabled>Nivel 3</SelectItem>
                        <SelectItem value="4" disabled>Nivel 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* NOU: Selector Transformare + Modul Joc */}
            <SidebarGroup className="py-2">
              <SidebarGroupLabel className="text-xs font-semibold">
                📊 {translations.transformationSelector || 'Tip Transformare'}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Select value={transformationType} onValueChange={(value) => setTransformationType(value as TransformationType)}>
                      <SelectTrigger className="w-full h-8 text-sm border-2 border-cyan-400 hover:border-cyan-500 focus:border-cyan-600 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="multipli_to_submultipli">
                          ⬇️ {translations.transformationType?.multipliToSubmultipli || 'Multipli în Submultipli'}
                        </SelectItem>
                        <SelectItem value="submultipli_to_multipli">
                          ⬆️ {translations.transformationType?.submultipliToMultipli || 'Submultipli în Multipli'}
                        </SelectItem>
                        <SelectItem value="random">
                          🎲 {translations.transformationType?.random || 'Aleator'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </SidebarMenuItem>
                </SidebarMenu>
                
                {/* Toggle Modul */}
                <div className="flex gap-2 mt-3 px-2">
                  <Button 
                    variant={gameMode === 'easy' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setGameMode('easy')}
                    className="flex-1 h-8 text-xs"
                  >
                    🟢 {translations.gameMode?.easy || 'Ușor'}
                  </Button>
                  <Button 
                    variant={gameMode === 'pro' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setGameMode('pro')}
                    className="flex-1 h-8 text-xs"
                  >
                    🔴 {translations.gameMode?.pro || 'PRO'}
                  </Button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="py-2">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setShowKeyboard(!showKeyboard)}
                      className="h-8 text-sm border border-green-400 hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                      <Keyboard className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">
                        {showKeyboard ? translations.hideKeyboard : translations.showKeyboard}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate('/')}
                      className="h-8 text-sm border border-orange-400 hover:border-orange-500 hover:bg-orange-50 transition-colors"
                    >
                      <ChevronLeft className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{translations.back}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="py-2">
              <ShopPromoBox language={lang} />
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm">
            <div className="flex items-center justify-between px-4 py-2 gap-4">
              {/* Left: Logo + Title */}
              <div className="flex items-center gap-3 min-w-0">
                <img src={numLitLogo} alt="NumLit" className="h-8 flex-shrink-0" />
                <h1 className="text-xl font-black text-primary truncate">{translations.title}</h1>
              </div>

              {/* Center: Progress Bar */}
              <div className="flex-1 max-w-xs mx-4">
                <ProgressBar current={progress} total={TOTAL_EXERCISES} showCelebration={false} />
              </div>

              {/* Right: Controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Info className="h-4 w-4 mr-2" />
                      {translations.instructions}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{translations.instructionsTitle}</DialogTitle>
                      <DialogDescription>
                        {translations.instructionsContent}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                <ZoomControls zoom={zoom} onZoomChange={setZoom} />
                
                <Timer 
                  isRunning={isTimerRunning}
                  onTimeUpdate={() => {}}
                />

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/')}
                >
                  <Home className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Game area */}
          <div 
            className="flex-1 overflow-auto p-6"
            style={{ zoom: `${zoom}%` }}
          >
            <div className="max-w-7xl mx-auto">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as UnitType)}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="length" className="text-lg font-bold">
                    📏 {translations.unitTypes.length}
                  </TabsTrigger>
                  <TabsTrigger value="volume" className="text-lg font-bold">
                    🥤 {translations.unitTypes.volume}
                  </TabsTrigger>
                  <TabsTrigger value="weight" className="text-lg font-bold">
                    ⚖️ {translations.unitTypes.weight}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="length">
                  <InteractiveUnitGame
                    unitType="length"
                    lang={lang}
                    gameMode={gameMode}
                    transformationType={transformationType}
                    onCorrectAnswer={handleCorrectAnswer}
                    translations={translations}
                  />
                </TabsContent>

                <TabsContent value="volume">
                  <InteractiveUnitGame
                    unitType="volume"
                    lang={lang}
                    gameMode={gameMode}
                    transformationType={transformationType}
                    onCorrectAnswer={handleCorrectAnswer}
                    translations={translations}
                  />
                </TabsContent>

                <TabsContent value="weight">
                  <InteractiveUnitGame
                    unitType="weight"
                    lang={lang}
                    gameMode={gameMode}
                    transformationType={transformationType}
                    onCorrectAnswer={handleCorrectAnswer}
                    translations={translations}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* NumLit Keyboard */}
          {showKeyboard && (
            <div className="border-t bg-card p-4">
              <NumLitKeyboard
                onKeyPress={() => {}}
                onClose={() => setShowKeyboard(false)}
                concentration="0-10"
                includeOperators={false}
                inline={true}
                selectedLanguage={lang}
              />
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}
