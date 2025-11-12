import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getTranslation, getDayOfWeekName, addDaysToWeekday } from "@/lib/timeData";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays } from "lucide-react";

interface WeekDayExercisesProps {
  lang: string;
  onComplete?: () => void;
}

const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function WeekDayExercises({ lang, onComplete }: WeekDayExercisesProps) {
  const { toast } = useToast();
  const [currentDay, setCurrentDay] = useState('monday');
  const [daysToAdd, setDaysToAdd] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  const t = {
    todayIs: getTranslation('ui', 'today_is', lang),
    correct: getTranslation('ui', 'correct', lang),
    incorrect: getTranslation('ui', 'incorrect', lang),
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const randomDay = WEEKDAYS[Math.floor(Math.random() * WEEKDAYS.length)];
    const randomDays = Math.floor(Math.random() * 5) + 1; // 1-5 days
    
    setCurrentDay(randomDay);
    setDaysToAdd(randomDays);
    setSelectedAnswer(null);
    setIsCompleted(false);
    
    // Generate options
    const correctAnswer = addDaysToWeekday(randomDay, randomDays);
    const allOptions = [correctAnswer];
    
    // Add 2 wrong options
    while (allOptions.length < 3) {
      const wrongDay = WEEKDAYS[Math.floor(Math.random() * WEEKDAYS.length)];
      if (!allOptions.includes(wrongDay)) {
        allOptions.push(wrongDay);
      }
    }
    
    setOptions(allOptions.sort(() => Math.random() - 0.5));
  };

  const correctAnswer = addDaysToWeekday(currentDay, daysToAdd);

  const handleSelect = (day: string) => {
    if (isCompleted) return;
    
    setSelectedAnswer(day);
    const isCorrect = day === correctAnswer;
    
    if (isCorrect) {
      toast({
        title: t.correct,
        variant: "default",
      });
      setIsCompleted(true);
      setTimeout(() => {
        generateQuestion();
      }, 1500);
      if (onComplete) onComplete();
    } else {
      toast({
        title: t.incorrect,
        variant: "destructive",
      });
    }
  };

  const getDayName = (day: string) => getDayOfWeekName(day, lang);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <CalendarDays className="h-6 w-6 text-blue-500" />
        <h3 className="text-xl font-bold text-center">Zilele Săptămânii</h3>
      </div>
      
      <Card className="p-6 bg-blue-50">
        <p className="text-lg text-center font-medium">
          {t.todayIs}: <span className="font-bold text-blue-600">{getDayName(currentDay)}</span>
        </p>
        <p className="text-xl text-center font-bold mt-2">
          Ce zi va fi peste <span className="text-blue-600">{daysToAdd}</span> zile?
        </p>
      </Card>
      
      <div className="grid grid-cols-1 gap-3">
        {options.map((day) => {
          const isSelected = selectedAnswer === day;
          const isCorrect = isSelected && day === correctAnswer;
          const isWrong = isSelected && !isCorrect;
          
          return (
            <Button
              key={day}
              variant={isSelected ? (isCorrect ? "default" : "destructive") : "outline"}
              size="lg"
              onClick={() => handleSelect(day)}
              disabled={isCompleted}
              className={`h-16 text-lg font-bold ${
                isCorrect ? 'bg-green-500 hover:bg-green-600' : ''
              } ${isWrong ? 'bg-red-500 hover:bg-red-600' : ''}`}
            >
              {getDayName(day)}
            </Button>
          );
        })}
      </div>
    </div>
  );
}