import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { getTranslation } from "@/lib/timeData";
import { toast } from "sonner";
import { Check } from "lucide-react";

interface MonthQuestionsQuizProps {
  monthId: number;
  monthName: string;
  lang: string;
  onComplete?: () => void;
}

export default function MonthQuestionsQuiz({ monthId, monthName, lang, onComplete }: MonthQuestionsQuizProps) {
  const [selectedWeeks, setSelectedWeeks] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const correctWeeks = "4-5"; // Most months have 4-5 weeks
  
  const t = {
    question: getTranslation('ui', 'weeks_in_month_question', lang),
    correct: getTranslation('ui', 'correct', lang),
    incorrect: getTranslation('ui', 'incorrect', lang),
  };

  const weekOptions = ["3", "4", "4-5", "5", "6"];

  const handleValidate = () => {
    if (!selectedWeeks) {
      toast.error('Alege un număr de săptămâni');
      return;
    }
    
    const isCorrect = selectedWeeks === correctWeeks;
    
    if (isCorrect) {
      toast.success(t.correct);
      setIsCompleted(true);
      if (onComplete) onComplete();
    } else {
      toast.error(t.incorrect);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{t.question}</p>
      
      <div className="grid grid-cols-6 gap-2">
        {weekOptions.map((weeks) => {
          const isSelected = selectedWeeks === weeks;
          
          return (
            <Button
              key={weeks}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedWeeks(weeks)}
              disabled={isCompleted}
              className="h-10 text-base font-bold"
            >
              {weeks}
            </Button>
          );
        })}
        
        {/* Validation button */}
        <Button
          onClick={handleValidate}
          variant="default"
          size="sm"
          className="h-10 bg-green-500 hover:bg-green-600"
          disabled={selectedWeeks === null || isCompleted}
        >
          <Check className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}