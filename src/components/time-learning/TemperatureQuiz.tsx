import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getTranslation, Season } from "@/lib/timeData";
import { useToast } from "@/hooks/use-toast";
import { Thermometer } from "lucide-react";

interface TemperatureQuizProps {
  season: Season;
  lang: string;
  onComplete?: () => void;
}

export default function TemperatureQuiz({ season, lang, onComplete }: TemperatureQuizProps) {
  const { toast } = useToast();
  const [options, setOptions] = useState<number[][]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const correctRange = season.temperature_range;
  
  const t = {
    title: getTranslation('ui', 'temperature_quiz_title', lang),
    correct: getTranslation('ui', 'correct', lang),
    incorrect: getTranslation('ui', 'incorrect', lang),
  };

  useEffect(() => {
    generateOptions();
  }, [season]);

  const generateOptions = () => {
    const [min, max] = correctRange;
    const newOptions: number[][] = [[min, max]];
    
    // Generate 2 false options
    const falseOption1 = [min - 10, max - 10];
    const falseOption2 = [min + 10, max + 10];
    
    newOptions.push(falseOption1, falseOption2);
    
    // Shuffle options
    const shuffled = newOptions.sort(() => Math.random() - 0.5);
    setOptions(shuffled);
    setSelectedIndex(null);
    setIsCompleted(false);
  };

  const handleSelect = (index: number) => {
    if (isCompleted) return;
    
    setSelectedIndex(index);
    const selected = options[index];
    const isCorrect = selected[0] === correctRange[0] && selected[1] === correctRange[1];
    
    if (isCorrect) {
      toast({
        title: t.correct,
        description: `${correctRange[0]}°C - ${correctRange[1]}°C`,
        variant: "default",
      });
      setIsCompleted(true);
      if (onComplete) onComplete();
    } else {
      toast({
        title: t.incorrect,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2">
        {options.map((range, index) => {
          const isSelected = selectedIndex === index;
          const isCorrect = isSelected && range[0] === correctRange[0] && range[1] === correctRange[1];
          const isWrong = isSelected && !isCorrect;
          
          return (
            <Button
              key={index}
              variant={isSelected ? (isCorrect ? "default" : "destructive") : "outline"}
              size="sm"
              onClick={() => handleSelect(index)}
              disabled={isCompleted}
              className={`h-14 text-sm font-semibold flex items-center justify-center gap-2 ${
                isCorrect ? 'bg-green-500 hover:bg-green-600' : ''
              } ${isWrong ? 'bg-red-500 hover:bg-red-600' : ''}`}
            >
              <Thermometer className="h-4 w-4" />
              <span>{range[0]}°C - {range[1]}°C</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}