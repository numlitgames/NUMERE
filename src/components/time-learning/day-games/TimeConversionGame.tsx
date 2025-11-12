import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TimeConversionGameProps {
  lang: string;
}

export default function TimeConversionGame({ lang }: TimeConversionGameProps) {
  const [question, setQuestion] = useState(generateQuestion());
  const [score, setScore] = useState(0);

  function generateQuestion() {
    const hour24 = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 12) * 5;
    const showAMPM = Math.random() > 0.5;
    
    return {
      hour24,
      minutes,
      showAMPM,
      text: showAMPM 
        ? formatAMPM(hour24, minutes)
        : `${String(hour24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    };
  }

  function formatAMPM(hour: number, minutes: number) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
  }

  function format24h(hour: number, minutes: number) {
    return `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  const checkAnswer = (selectedHour24: number) => {
    if (selectedHour24 === question.hour24) {
      setScore(score + 1);
      toast.success(lang === 'ro' ? 'Corect! ✓' : 'Correct! ✓');
      setQuestion(generateQuestion());
    } else {
      toast.error(lang === 'ro' ? 'Încearcă din nou!' : 'Try again!');
    }
  };

  // Generate 3 options
  const options = [
    question.hour24,
    (question.hour24 + 12) % 24,
    (question.hour24 + 1) % 24
  ].sort(() => Math.random() - 0.5);

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">
          {lang === 'ro' ? 'AM/PM vs. 24h' : 'AM/PM vs. 24h'}
        </h3>
        <p className="text-lg">
          {lang === 'ro' ? 'Scor' : 'Score'}: <span className="font-bold text-primary">{score}</span>
        </p>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg mb-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          {question.showAMPM 
            ? (lang === 'ro' ? 'Convertește la format 24h:' : 'Convert to 24h format:')
            : (lang === 'ro' ? 'Convertește la format AM/PM:' : 'Convert to AM/PM format:')}
        </p>
        <p className="text-4xl font-bold text-primary font-mono">
          {question.text}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {options.map((hour, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-20 text-xl font-mono"
            onClick={() => checkAnswer(hour)}
          >
            {question.showAMPM 
              ? format24h(hour, question.minutes)
              : formatAMPM(hour, question.minutes)}
          </Button>
        ))}
      </div>

      <Button 
        onClick={() => setQuestion(generateQuestion())} 
        className="w-full mt-4" 
        variant="secondary"
      >
        {lang === 'ro' ? 'Următorul' : 'Next'}
      </Button>
    </Card>
  );
}
