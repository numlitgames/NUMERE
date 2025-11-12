import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, Tablet, Monitor } from "lucide-react";
import Rigleta from "@/components/educational/Rigleta";
import LifeSystem from "@/components/educational/LifeSystem";
import ProgressBar from "@/components/educational/ProgressBar";
import GameControls from "@/components/educational/GameControls";
import NumberSelector from "@/components/educational/NumberSelector";
import Timer from "@/components/educational/Timer";
import ZoomControls from "@/components/educational/ZoomControls";

// Translations for the demo game
const demoTranslations = {
  ro: {
    gameTitle: "Jocul Rigletelor Magice",
    level: "Nivel",
    coloredRigleta: "Rigletele Colorate",
    rigletaDescription: "Fiecare rigletă reprezintă un număr. Apasă pe ele pentru a învăța!",
    digitSelector: "Selectorul de Cifre",
    selectedDigits: "Cifre selectate",
    selectedRigleta: "Rigleta Selectată",
    horizontalOrientation: "Orientare orizontală",
    gameActions: "Acțiuni de Joc",
    correctAnswer: "✅ Răspuns Corect (+1 progres)",
    wrongAnswer: "❌ Răspuns Greșit (-1 viață)",
    resetGame: "🔄 Resetează Jocul",
    gameRules: "Regulile Jocului",
    rulesText: "🎯 Obiectiv: Completează bara de progres cu 10 răspunsuri corecte consecutive\n❤️ Vieți: Ai 3 vieți la început. La fiecare greșeală pierzi o viață\n🏆 Recompensă: La 10 răspunsuri corecte fără greșeală recuperezi o inimă\n🎉 Progres: După completarea barei, jocul se resetează automat",
    backToMenu: "← Înapoi la Meniu Principal"
  },
  en: {
    gameTitle: "Magic Rods Game",
    level: "Level",
    coloredRigleta: "Colored Rods",
    rigletaDescription: "Each rod represents a number. Press on them to learn!",
    digitSelector: "Digit Selector",
    selectedDigits: "Selected digits",
    selectedRigleta: "Selected Rod",
    horizontalOrientation: "Horizontal orientation",
    gameActions: "Game Actions",
    correctAnswer: "✅ Correct Answer (+1 progress)",
    wrongAnswer: "❌ Wrong Answer (-1 life)",
    resetGame: "🔄 Reset Game",
    gameRules: "Game Rules",
    rulesText: "🎯 Objective: Complete the progress bar with 10 consecutive correct answers\n❤️ Lives: You start with 3 lives. Each mistake costs a life\n🏆 Reward: At 10 correct answers without mistake you recover a heart\n🎉 Progress: After completing the bar, the game resets automatically",
    backToMenu: "← Back to Main Menu"
  },
  fr: {
    gameTitle: "Jeu des Baguettes Magiques",
    level: "Niveau",
    coloredRigleta: "Baguettes Colorées",
    rigletaDescription: "Chaque baguette représente un nombre. Appuie dessus pour apprendre!",
    digitSelector: "Sélecteur de Chiffres",
    selectedDigits: "Chiffres sélectionnés",
    selectedRigleta: "Baguette Sélectionnée",
    horizontalOrientation: "Orientation horizontale",
    gameActions: "Actions du Jeu",
    correctAnswer: "✅ Bonne Réponse (+1 progrès)",
    wrongAnswer: "❌ Mauvaise Réponse (-1 vie)",
    resetGame: "🔄 Remettre à Zéro",
    gameRules: "Règles du Jeu",
    rulesText: "🎯 Objectif: Complète la barre de progression avec 10 bonnes réponses consécutives\n❤️ Vies: Tu commences avec 3 vies. Chaque erreur coûte une vie\n🏆 Récompense: À 10 bonnes réponses sans erreur tu récupères un cœur\n🎉 Progrès: Après avoir complété la barre, le jeu se remet à zéro automatiquement",
    backToMenu: "← Retour au Menu Principal"
  }
};

export default function GameDemo() {
  const [lives, setLives] = useState(3);
  const [progress, setProgress] = useState(3);
  const [selectedNumber, setSelectedNumber] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof demoTranslations>('ro');
  const [deviceMode, setDeviceMode] = useState<'phone' | 'tablet' | 'desktop'>('desktop');
  const [zoom, setZoom] = useState(80);
  const [gameTime, setGameTime] = useState(0);

  const t = demoTranslations[selectedLanguage];

  const handleRigletaClick = (number: number) => {
    if (progress < 10) {
      setProgress(prev => prev + 1);
    }
  };

  const handleProgressComplete = () => {
    setTimeout(() => {
      setProgress(0);
      setShowCelebration(false);
    }, 2000);
  };

  const handleWrongAnswer = () => {
    if (lives > 0) {
      setLives(prev => prev - 1);
    }
  };

  const resetGame = () => {
    setLives(3);
    setProgress(0);
    setShowCelebration(false);
    setGameTime(0);
    setIsPlaying(false);
  };

  const getDeviceStyles = () => {
    const scaleValue = zoom / 100;
    
    switch (deviceMode) {
      case 'phone':
        return {
          transform: `scale(${scaleValue})`,
          maxWidth: '375px',
          margin: '0 auto'
        };
      case 'tablet':
        return {
          transform: `scale(${scaleValue})`,
          maxWidth: '768px',
          margin: '0 auto'
        };
      default:
        return {
          transform: `scale(${scaleValue})`,
          maxWidth: '1200px',
          margin: '0 auto'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 sm:p-4">
      {/* Header with Logo and Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4 p-3 bg-background/80 backdrop-blur-sm rounded-lg shadow-sm">
        {/* Logo */}
        <div className="flex justify-center sm:justify-start">
          <img 
            src="/lovable-uploads/b3fba488-faeb-4081-a5a6-bf161bfa2928.png" 
            alt="NumLit Logo" 
            className="h-6 sm:h-8 lg:h-10 w-auto object-contain"
            draggable={false}
          />
        </div>

        {/* Language Selector */}
        <div className="flex justify-center">
          <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as keyof typeof demoTranslations)}>
            <SelectTrigger className="w-32 sm:w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ro">🇷🇴 Română</SelectItem>
              <SelectItem value="en">🇬🇧 English</SelectItem>
              <SelectItem value="fr">🇫🇷 Français</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Device Mode Selector */}
        <div className="flex justify-center items-center gap-1 sm:gap-2">
          <Button
            variant={deviceMode === 'phone' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDeviceMode('phone')}
            className="p-1.5 sm:p-2 h-8 sm:h-9"
          >
            <Smartphone className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant={deviceMode === 'tablet' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDeviceMode('tablet')}
            className="p-1.5 sm:p-2 h-8 sm:h-9"
          >
            <Tablet className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant={deviceMode === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDeviceMode('desktop')}
            className="p-1.5 sm:p-2 h-8 sm:h-9"
          >
            <Monitor className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {/* Zoom Controls */}
        <ZoomControls 
          zoom={zoom} 
          onZoomChange={setZoom}
          className="ml-2"
        />
      </div>

      <div className="transition-all duration-300 origin-top" style={getDeviceStyles()}>
        <div className="max-w-6xl mx-auto">
          {/* Header with Game Controls */}
          <Card className="mb-8 border-2 border-rigleta-7">
            <CardHeader className="text-center">
              <div className="flex justify-between items-center">
                <Badge variant="outline">{t.level} 1</Badge>
                <div className="flex items-center gap-4">
                  <CardTitle className="text-2xl">{t.gameTitle}</CardTitle>
                  <NumberSelector
                    value={selectedNumber}
                    min={1}
                    max={10}
                    onChange={setSelectedNumber}
                    label={t.selectedDigits}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <LifeSystem totalLives={3} currentLives={lives} />
                  <GameControls
                    isPlaying={isPlaying}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onRepeat={resetGame}
                    onShuffle={() => setProgress(Math.floor(Math.random() * 10))}
                  />
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="flex justify-center mb-4">
                <ProgressBar 
                  current={progress} 
                  total={10} 
                  onComplete={handleProgressComplete}
                />
              </div>
              
              {/* Timer */}
              <div className="flex justify-center">
                <Timer 
                  isRunning={isPlaying}
                  onTimeUpdate={setGameTime}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <GameControls
                  isPlaying={isPlaying}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onRepeat={resetGame}
                  onShuffle={() => setProgress(Math.floor(Math.random() * 10))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Main Game Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rigleta Display */}
            <Card className="border-2 border-success">
              <CardHeader>
                <CardTitle className="text-center">{t.coloredRigleta}</CardTitle>
                <p className="text-center text-sm text-muted-foreground">
                  {t.rigletaDescription}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 justify-items-center">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(number => (
                    <div key={number} className="flex flex-col items-center gap-2">
                      <span className="text-lg font-bold text-primary">{number}</span>
                      <Rigleta
                        number={number}
                        orientation="vertical"
                        onClick={() => handleRigletaClick(number)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interactive Controls */}
            <div className="space-y-6">
              {/* Number Selector - removed from here */}
              <Card className="border-2 border-rigleta-4">
                <CardHeader>
                  <CardTitle className="text-center">{t.digitSelector}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="text-center text-muted-foreground">
                    {t.selectedDigits}: {selectedNumber}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Rigleta Display */}
              <Card className="border-2 border-odd-number">
                <CardHeader>
                  <CardTitle className="text-center">{t.selectedRigleta}: {selectedNumber}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center p-8">
                  <div className="flex flex-col items-center gap-4">
                    <Rigleta
                      number={selectedNumber}
                      orientation="horizontal"
                      onClick={() => handleRigletaClick(selectedNumber)}
                    />
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        {t.horizontalOrientation}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="border-2 border-rigleta-10">
                <CardHeader>
                  <CardTitle className="text-center">{t.gameActions}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Button 
                    onClick={() => handleRigletaClick(selectedNumber)}
                    className="w-full"
                    variant="default"
                  >
                    {t.correctAnswer}
                  </Button>
                  <Button 
                    onClick={handleWrongAnswer}
                    className="w-full"
                    variant="destructive"
                  >
                    {t.wrongAnswer}
                  </Button>
                  <Button 
                    onClick={resetGame}
                    className="w-full"
                    variant="outline"
                  >
                    {t.resetGame}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Game Rules */}
          <Card className="mt-8 border-2 border-success">
            <CardHeader>
              <CardTitle className="text-center">{t.gameRules}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-800 whitespace-pre-line">
                  {t.rulesText}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center mt-8">
            <Button variant="outline" onClick={() => window.history.back()}>
              {t.backToMenu}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}