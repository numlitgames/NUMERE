import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { getTranslation, Season } from "@/lib/timeData";
import { useToast } from "@/hooks/use-toast";
import { Cloud } from "lucide-react";

interface WeatherSymbolsQuizProps {
  season: Season;
  lang: string;
  onComplete?: () => void;
}

const WEATHER_SYMBOLS = {
  sunny: "☀️",
  rainy: "🌧️",
  snow: "❄️",
  cloudy: "☁️",
  hot: "🌡️",
  cold: "🥶",
  windy: "🌬️"
};

const WEATHER_NAMES: Record<string, Record<string, string>> = {
  sunny: { ro: "Însorit", en: "Sunny", de: "Sonnig" },
  rainy: { ro: "Ploios", en: "Rainy", de: "Regnerisch" },
  snow: { ro: "Zăpadă", en: "Snow", de: "Schnee" },
  cloudy: { ro: "Înnorat", en: "Cloudy", de: "Bewölkt" },
  hot: { ro: "Cald", en: "Hot", de: "Heiß" },
  cold: { ro: "Rece", en: "Cold", de: "Kalt" },
  windy: { ro: "Vântos", en: "Windy", de: "Windig" }
};

export default function WeatherSymbolsQuiz({ season, lang, onComplete }: WeatherSymbolsQuizProps) {
  const { toast } = useToast();
  const [selected, setSelected] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const correctWeathers = season.weather;
  
  const t = {
    title: getTranslation('ui', 'weather_symbols_title', lang),
    correct: getTranslation('ui', 'correct', lang),
    incorrect: getTranslation('ui', 'incorrect', lang),
  };

  const handleToggle = (weather: string) => {
    if (isCompleted) return;
    
    const newSelected = selected.includes(weather)
      ? selected.filter(w => w !== weather)
      : [...selected, weather];
    
    setSelected(newSelected);
    
    // Check if all correct weathers are selected
    const allCorrect = correctWeathers.every(w => newSelected.includes(w));
    const noIncorrect = newSelected.every(w => correctWeathers.includes(w));
    
    if (allCorrect && noIncorrect && newSelected.length === correctWeathers.length) {
      toast({
        title: t.correct,
        variant: "default",
      });
      setIsCompleted(true);
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(WEATHER_SYMBOLS).map(([key, symbol]) => {
          const isSelected = selected.includes(key);
          const isCorrect = correctWeathers.includes(key);
          const showCorrect = isCompleted && isCorrect;
          
          return (
            <Button
              key={key}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => handleToggle(key)}
              disabled={isCompleted}
              className={`h-16 text-base font-bold flex flex-col gap-1 ${
                showCorrect ? 'bg-green-500 hover:bg-green-600' : ''
              }`}
            >
              <span className="text-3xl">{symbol}</span>
              <span className="text-xs text-center leading-tight">{WEATHER_NAMES[key]?.[lang] || WEATHER_NAMES[key]?.ro}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}