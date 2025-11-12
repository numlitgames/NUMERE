import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AnalogClockColored from "../AnalogClockColored";

interface ClockMatchingGameProps {
  lang: string;
}

type Difficulty = 'easy' | 'medium' | 'advanced';

export default function ClockMatchingGame({ lang }: ClockMatchingGameProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [targetTime, setTargetTime] = useState({ hours: 3, minutes: 0 });
  const [userSetTime, setUserSetTime] = useState({ hours: 12, minutes: 0 });
  const [score, setScore] = useState(0);

  const generateTimeByDifficulty = (diff: Difficulty) => {
    const hours = Math.floor(Math.random() * 12) + 1;
    let minutes = 0;

    switch (diff) {
      case 'easy':
        minutes = 0;
        break;
      case 'medium':
        minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
        break;
      case 'advanced':
        minutes = Math.floor(Math.random() * 60);
        break;
    }

    return { hours, minutes };
  };

  useEffect(() => {
    setTargetTime(generateTimeByDifficulty(difficulty));
    setUserSetTime({ hours: 12, minutes: 0 });
  }, [difficulty]);

  const generateNewTime = () => {
    setTargetTime(generateTimeByDifficulty(difficulty));
    setUserSetTime({ hours: 12, minutes: 0 });
  };

  const formatTime = (hours: number, minutes: number) => {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const getTimeDescription = (hours: number, minutes: number): string => {
    if (difficulty !== 'medium') return '';
    
    if (minutes === 0) return lang === 'ro' ? `${hours} fix` : `${hours} o'clock`;
    if (minutes === 15) return lang === 'ro' ? `${hours} și un sfert` : `quarter past ${hours}`;
    if (minutes === 30) return lang === 'ro' ? `${hours} și jumătate` : `half past ${hours}`;
    if (minutes === 45) {
      const nextHour = hours === 12 ? 1 : hours + 1;
      return lang === 'ro' ? `${nextHour} fără un sfert` : `quarter to ${nextHour}`;
    }
    return '';
  };

  const generateEasyOptions = (): number[] => {
    const correct = targetTime.hours;
    const options = [correct];
    
    while (options.length < 3) {
      const distractor = Math.floor(Math.random() * 12) + 1;
      if (!options.includes(distractor)) {
        options.push(distractor);
      }
    }
    
    return options.sort(() => Math.random() - 0.5);
  };

  const checkEasyAnswer = (selectedHour: number) => {
    if (selectedHour === targetTime.hours) {
      setScore(score + 1);
      toast.success(lang === 'ro' ? 'Corect! Bravo! ✓' : 'Correct! Well done! ✓');
      generateNewTime();
    } else {
      toast.error(lang === 'ro' ? 'Nu e corect. Încearcă din nou!' : 'Not correct. Try again!');
    }
  };

  const checkAnswer = () => {
    if (userSetTime.hours === targetTime.hours && userSetTime.minutes === targetTime.minutes) {
      setScore(score + 1);
      toast.success(lang === 'ro' ? 'Corect! Bravo! ✓' : 'Correct! Well done! ✓');
      generateNewTime();
    } else {
      toast.error(lang === 'ro' ? 'Nu e corect. Încearcă din nou!' : 'Not correct. Try again!');
    }
  };

  return (
    <div className="grid grid-cols-[80px_1fr] gap-4">
      {/* Stânga: Butoane Dificultate */}
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          onClick={() => setDifficulty('easy')}
          className={`h-16 flex flex-col text-xs p-2 bg-background border-2 ${
            difficulty === 'easy' 
              ? 'border-green-500 text-green-700 shadow-md' 
              : 'border-border text-muted-foreground'
          }`}
        >
          <span className="font-bold">{lang === 'ro' ? 'UȘOR' : 'EASY'}</span>
          <span className="text-[9px] mt-0.5">
            {lang === 'ro' ? 'ore întregi' : 'full hours'}
          </span>
        </Button>
        <Button
          variant="outline"
          onClick={() => setDifficulty('medium')}
          className={`h-16 flex flex-col text-xs p-2 bg-background border-2 ${
            difficulty === 'medium' 
              ? 'border-blue-500 text-blue-700 shadow-md' 
              : 'border-border text-muted-foreground'
          }`}
        >
          <span className="font-bold">{lang === 'ro' ? 'MEDIU' : 'MEDIUM'}</span>
          <span className="text-[9px] mt-0.5">
            {lang === 'ro' ? 'sfert/jumătate' : 'quarter/half'}
          </span>
        </Button>
        <Button
          variant="outline"
          onClick={() => setDifficulty('advanced')}
          className={`h-16 flex flex-col text-xs p-2 bg-background border-2 ${
            difficulty === 'advanced' 
              ? 'border-purple-500 text-purple-700 shadow-md' 
              : 'border-border text-muted-foreground'
          }`}
        >
          <span className="font-bold">{lang === 'ro' ? 'AVANSAT' : 'ADVANCED'}</span>
          <span className="text-[9px] mt-0.5">
            {lang === 'ro' ? 'orice minut' : 'any minute'}
          </span>
        </Button>
      </div>

      {/* Dreapta: Zona de Joc */}
      <div>
        {difficulty === 'easy' && (
          <div className="space-y-4">
            {/* Header */}
            <div className="text-center">
              <h3 className="text-xl font-bold">
                {lang === 'ro' ? 'Ce oră este?' : 'What time is it?'}
              </h3>
              <p className="text-lg mt-1">
                {lang === 'ro' ? 'Scor' : 'Score'}: <span className="font-bold text-green-600">{score}</span>
              </p>
            </div>

            {/* Ceas Analog Colorat (Static) */}
            <div className="flex justify-center">
              <AnalogClockColored
                hours={targetTime.hours}
                minutes={0}
                size={280}
                show24Hour={true}
                showSeconds={false}
                interactive={false}
              />
            </div>

            {/* Instrucțiuni */}
            <p className="text-center text-sm text-muted-foreground">
              {lang === 'ro' 
                ? '💡 Selectează ora corectă de mai jos' 
                : '💡 Select the correct time below'}
            </p>

            {/* 3 Butoane cu Opțiuni de Ore */}
            <div className="grid grid-cols-3 gap-3">
              {generateEasyOptions().map((option, idx) => (
                <Button
                  key={idx}
                  onClick={() => checkEasyAnswer(option)}
                  variant="outline"
                  size="lg"
                  className="h-16 text-2xl font-mono font-bold hover:bg-green-50 hover:border-green-500 dark:hover:bg-green-950/30"
                >
                  {formatTime(option, 0)}
                </Button>
              ))}
            </div>
          </div>
        )}

        {(difficulty === 'medium' || difficulty === 'advanced') && (
          <div className="space-y-4">
            {/* Header cu Scor */}
            <div className="text-center">
              <h3 className="text-xl font-bold">
                {lang === 'ro' ? 'Potrivire Analog ↔ Digital' : 'Analog ↔ Digital Match'}
              </h3>
              <p className="text-lg mt-1">
                {lang === 'ro' ? 'Scor' : 'Score'}: <span className="font-bold text-primary">{score}</span>
              </p>
            </div>

            {/* Ora Digitală Țintă */}
            <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 rounded-lg border-2 border-primary/30">
              <p className="text-sm text-muted-foreground mb-1">
                {lang === 'ro' ? 'Setează ceasul la ora:' : 'Set the clock to:'}
              </p>
              <div className="text-5xl font-mono font-bold text-primary">
                {formatTime(targetTime.hours, targetTime.minutes)}
              </div>
              {difficulty === 'medium' && (
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  {getTimeDescription(targetTime.hours, targetTime.minutes)}
                </p>
              )}
            </div>

            {/* Ceas Analog Interactiv */}
            <div className="flex justify-center">
              <AnalogClockColored
                hours={userSetTime.hours}
                minutes={userSetTime.minutes}
                onTimeChange={(h, m) => setUserSetTime({ hours: h, minutes: m })}
                size={280}
                show24Hour={true}
                showSeconds={false}
                interactive={true}
                difficulty={difficulty}
              />
            </div>

            {/* Instrucțiuni */}
            <p className="text-center text-sm text-muted-foreground">
              {lang === 'ro' 
                ? '💡 Trage limbile ceasului pentru a seta ora corectă' 
                : '💡 Drag the clock hands to set the correct time'}
            </p>

            {/* Butoane Acțiune */}
            <div className="flex gap-3">
              <Button 
                onClick={checkAnswer} 
                className="flex-1"
                size="lg"
              >
                {lang === 'ro' ? '✓ Verifică' : '✓ Check'}
              </Button>
              <Button 
                onClick={generateNewTime} 
                variant="secondary"
                className="flex-1"
                size="lg"
              >
                {lang === 'ro' ? 'Următorul ›' : 'Next ›'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
