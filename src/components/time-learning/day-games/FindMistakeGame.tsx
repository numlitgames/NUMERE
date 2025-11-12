import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import AnalogClockColored from "../AnalogClockColored";

interface FindMistakeGameProps {
  lang: string;
}

export default function FindMistakeGame({ lang }: FindMistakeGameProps) {
  const [question, setQuestion] = useState(generateQuestion());
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  function generateQuestion() {
    // 1. Generăm TIMPUL CORECT (referința pentru TEXT)
    const correctHour = Math.floor(Math.random() * 12) + 1;
    
    const minuteOptions = [0, 15, 30, 45];
    const useSpecialMinute = Math.random() > 0.3;
    const correctMinute = useSpecialMinute 
      ? minuteOptions[Math.floor(Math.random() * minuteOptions.length)]
      : Math.floor(Math.random() * 60);
    
    // 2. Alegem ALEATOR care ceas e greșit: 'analog' sau 'digital'
    const wrongClock = Math.random() > 0.5 ? 'analog' : 'digital';
    
    // 3. Generăm timpul GREȘIT
    let wrongHour = (correctHour + Math.floor(Math.random() * 3) + 1) % 12 || 12;
    let wrongMinute = (correctMinute + 15 + Math.floor(Math.random() * 30)) % 60;
    
    // 4. Returnăm configurația
    if (wrongClock === 'analog') {
      return {
        correctTime: { hours: correctHour, minutes: correctMinute }, // TEXTUL
        analogTime: { hours: wrongHour, minutes: wrongMinute },      // GREȘIT
        digitalTime: { hours: correctHour, minutes: correctMinute }, // CORECT
        correctAnswer: 'digital' as const // Digitalul e corect, deci analogul e greșit
      };
    } else {
      return {
        correctTime: { hours: correctHour, minutes: correctMinute }, // TEXTUL
        analogTime: { hours: correctHour, minutes: correctMinute },  // CORECT
        digitalTime: { hours: wrongHour, minutes: wrongMinute },     // GREȘIT
        correctAnswer: 'analog' as const // Analogul e corect, deci digitalul e greșit
      };
    }
  }

  const timeToWords = (hours: number, minutes: number): string => {
    const hoursRO = [
      'zero', 'unu', 'doi', 'trei', 'patru', 'cinci', 'șase', 'șapte',
      'opt', 'nouă', 'zece', 'unsprezece', 'doisprezece', 'treisprezece',
      'paisprezece', 'cincisprezece', 'șaisprezece', 'șaptesprezece',
      'optsprezece', 'nouăsprezece', 'douăzeci', 'douăzeci și unu',
      'douăzeci și doi', 'douăzeci și trei'
    ];

    const hoursEN = [
      'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
      'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
      'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
      'twenty-one', 'twenty-two', 'twenty-three'
    ];

    const hourWords = lang === 'ro' ? hoursRO : hoursEN;

    if (minutes === 0) {
      return lang === 'ro' 
        ? `${hourWords[hours]} fix` 
        : `${hourWords[hours]} o'clock`;
    }
    
    if (minutes === 15) {
      return lang === 'ro' 
        ? `${hourWords[hours]} și un sfert` 
        : `quarter past ${hourWords[hours]}`;
    }
    
    if (minutes === 30) {
      return lang === 'ro' 
        ? `${hourWords[hours]} și jumătate` 
        : `half past ${hourWords[hours]}`;
    }
    
    if (minutes === 45) {
      const nextHour = (hours + 1) % 24;
      return lang === 'ro' 
        ? `${hourWords[nextHour]} fără un sfert` 
        : `quarter to ${hourWords[nextHour]}`;
    }

    if (lang === 'ro') {
      return `${hourWords[hours]} și ${minutes} ${minutes === 1 ? 'minut' : 'minute'}`;
    } else {
      return `${hourWords[hours]} and ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    }
  };


  const formatTime = (hours: number, minutes: number) => {
    return `${hours}:${String(minutes).padStart(2, '0')}`;
  };

  const checkAnswer = (answer: 'analog' | 'digital') => {
    if (answered) return;
    
    setAnswered(true);
    
    // Răspunsul corect = identificăm ceasul GREȘIT
    // Dacă 'correctAnswer' e 'analog', înseamnă că digitalul e GREȘIT
    // Dacă 'correctAnswer' e 'digital', înseamnă că analogul e GREȘIT
    const wrongClock = question.correctAnswer === 'analog' ? 'digital' : 'analog';
    
    if (answer === wrongClock) {
      setScore(score + 1);
      toast.success(
        lang === 'ro'
          ? `Corect! Ceasul ${answer === 'analog' ? 'analog' : 'digital'} era greșit!`
          : `Correct! The ${answer === 'analog' ? 'analog' : 'digital'} clock was wrong!`
      );
    } else {
      toast.error(
        lang === 'ro' 
          ? 'Nu e corect. Apasă "Următorul" pentru a continua.' 
          : 'Incorrect. Press "Next" to continue.'
      );
    }
  };

  const handleNext = () => {
    setQuestion(generateQuestion());
    setAnswered(false);
  };

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold flex items-center justify-center gap-2">
          <AlertCircle className="h-6 w-6 text-red-500" />
          {lang === 'ro' ? 'Găsește Greșeala' : 'Find the Mistake'}
        </h3>
        <p className="text-lg mt-2">
          {lang === 'ro' ? 'Scor' : 'Score'}: <span className="font-bold text-primary">{score}</span>
        </p>
      </div>

      {/* TEXTUL CORECT - Deasupra celor 2 ceasuri */}
      <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-300">
        <p className="text-center text-sm font-semibold text-muted-foreground mb-2">
          {lang === 'ro' ? '📝 Ora corectă este:' : '📝 The correct time is:'}
        </p>
        <p className="text-center text-3xl font-bold text-green-700 mb-1">
          {timeToWords(question.correctTime.hours, question.correctTime.minutes)}
        </p>
        <p className="text-center text-xl font-mono text-green-600">
          ({formatTime(question.correctTime.hours, question.correctTime.minutes)})
        </p>
      </div>

      <p className="text-center text-muted-foreground mb-6">
        {lang === 'ro' 
          ? 'Unul dintre ceasuri este greșit. Care?'
          : 'One of the clocks is wrong. Which one?'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Ceas Analog */}
        <div className="flex flex-col items-center">
          <p className="font-bold mb-3">{lang === 'ro' ? 'Ceas Analog' : 'Analog Clock'}</p>
          <AnalogClockColored
            hours={question.analogTime.hours}
            minutes={question.analogTime.minutes}
            seconds={0}
            size={240}
            show24Hour={false}
            showSeconds={false}
          />
        </div>

        {/* Ceas Digital */}
        <div className="flex flex-col items-center justify-center">
          <p className="font-bold mb-3">{lang === 'ro' ? 'Ceas Digital' : 'Digital Clock'}</p>
          <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
            <p className="text-4xl font-bold font-mono text-primary">
              {formatTime(question.digitalTime.hours, question.digitalTime.minutes)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Button
          variant={answered && question.correctAnswer === 'digital' ? 'destructive' : 'outline'}
          className="h-16"
          onClick={() => checkAnswer('analog')}
          disabled={answered}
        >
          {lang === 'ro' ? 'Analogul e greșit' : 'Analog is wrong'}
        </Button>
        <Button
          variant={answered && question.correctAnswer === 'analog' ? 'destructive' : 'outline'}
          className="h-16"
          onClick={() => checkAnswer('digital')}
          disabled={answered}
        >
          {lang === 'ro' ? 'Digitalul e greșit' : 'Digital is wrong'}
        </Button>
      </div>

      <Button
        onClick={handleNext}
        className="w-full h-12"
        size="lg"
        disabled={!answered}
      >
        {lang === 'ro' ? '→ Următorul' : '→ Next'}
      </Button>
    </Card>
  );
}
