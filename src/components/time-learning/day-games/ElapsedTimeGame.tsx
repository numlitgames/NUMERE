import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ElapsedTimeGameProps {
  lang: string;
}

export default function ElapsedTimeGame({ lang }: ElapsedTimeGameProps) {
  const [question] = useState(generateQuestion());
  const [userAnswer, setUserAnswer] = useState({ hours: 0, minutes: 0 });
  const [score, setScore] = useState(0);

  function generateQuestion() {
    const startHour = Math.floor(Math.random() * 20) + 1;
    const startMinute = Math.floor(Math.random() * 12) * 5;
    const elapsedMinutes = (Math.floor(Math.random() * 6) + 1) * 5;
    const elapsedHours = Math.floor(Math.random() * 3);
    
    const endTotalMinutes = (startHour * 60 + startMinute + elapsedHours * 60 + elapsedMinutes);
    const endHour = Math.floor(endTotalMinutes / 60) % 24;
    const endMinute = endTotalMinutes % 60;
    
    return {
      start: { hours: startHour, minutes: startMinute },
      end: { hours: endHour, minutes: endMinute },
      elapsed: { hours: elapsedHours, minutes: elapsedMinutes }
    };
  }

  const checkAnswer = () => {
    if (userAnswer.hours === question.elapsed.hours && userAnswer.minutes === question.elapsed.minutes) {
      setScore(score + 1);
      toast.success(lang === 'ro' ? 'Corect! ✓' : 'Correct! ✓');
    } else {
      toast.error(
        lang === 'ro'
          ? `Răspuns: ${question.elapsed.hours}h ${question.elapsed.minutes}min`
          : `Answer: ${question.elapsed.hours}h ${question.elapsed.minutes}min`
      );
    }
  };

  const formatTime = (hours: number, minutes: number) => {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold">
          {lang === 'ro' ? 'Timp Scurs' : 'Elapsed Time'}
        </h3>
        <p className="text-lg mt-2">
          {lang === 'ro' ? 'Scor' : 'Score'}: <span className="font-bold text-primary">{score}</span>
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <span className="font-medium">{lang === 'ro' ? 'Start' : 'Start'}:</span>
          <span className="text-2xl font-bold font-mono text-primary">
            {formatTime(question.start.hours, question.start.minutes)}
          </span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
          <span className="font-medium">{lang === 'ro' ? 'Sfârșit' : 'End'}:</span>
          <span className="text-2xl font-bold font-mono text-primary">
            {formatTime(question.end.hours, question.end.minutes)}
          </span>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg mb-4">
        <p className="text-center font-medium mb-3">
          {lang === 'ro' ? 'Cât timp a trecut?' : 'How much time passed?'}
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {lang === 'ro' ? 'Ore' : 'Hours'}
            </label>
            <Input
              type="number"
              min="0"
              max="23"
              value={userAnswer.hours}
              onChange={(e) => setUserAnswer({ ...userAnswer, hours: parseInt(e.target.value) || 0 })}
              className="text-center text-lg"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              {lang === 'ro' ? 'Minute' : 'Minutes'}
            </label>
            <Input
              type="number"
              min="0"
              max="59"
              value={userAnswer.minutes}
              onChange={(e) => setUserAnswer({ ...userAnswer, minutes: parseInt(e.target.value) || 0 })}
              className="text-center text-lg"
            />
          </div>
        </div>
      </div>

      <Button onClick={checkAnswer} className="w-full">
        {lang === 'ro' ? 'Verifică' : 'Check'}
      </Button>
    </Card>
  );
}
