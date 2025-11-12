import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RotateCcw, Snowflake, Sun, CloudRain, Leaf, Shirt, Wind, Thermometer } from 'lucide-react';
import { months, getSeasonByMonth, type Season } from '@/lib/timeData';
import { getTranslation } from '@/lib/timeData';

interface GuessMonthGameProps {
  lang: string;
}

// Icon mapping for activities, weather, clothing
const activityIcons: Record<string, any> = {
  skiing: Snowflake,
  snowman: Snowflake,
  sledding: Snowflake,
  swimming: Sun,
  beach: Sun,
  camping: Sun,
  bicycle: Leaf,
  flowers: Leaf,
  gardening: Leaf,
  gathering_leaves: Leaf,
  grape_picking: Leaf,
  harvest: Leaf,
};

const weatherIcons: Record<string, any> = {
  snow: Snowflake,
  cold: Wind,
  sunny: Sun,
  hot: Sun,
  rainy: CloudRain,
  cloudy: CloudRain,
};

const clothingIcons: Record<string, any> = {
  winter_jacket: Snowflake,
  hat: Snowflake,
  gloves: Snowflake,
  tshirt: Sun,
  shorts: Sun,
  sandals: Sun,
  sweater: Leaf,
  light_jacket: Leaf,
  pants: Shirt,
  shirt: Shirt,
  shoes: Shirt,
};

export default function GuessMonthGame({ lang }: GuessMonthGameProps) {
  const { toast } = useToast();
  const [targetMonth, setTargetMonth] = useState<typeof months[0] | null>(null);
  const [targetSeason, setTargetSeason] = useState<Season | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const generateNewQuestion = () => {
    const randomMonth = months[Math.floor(Math.random() * months.length)];
    const season = getSeasonByMonth(randomMonth.id);
    
    setTargetMonth(randomMonth);
    setTargetSeason(season || null);
    setSelectedMonth(null);
    setIsCorrect(null);
    setShowNext(false);
  };

  const handleMonthSelect = (monthId: number) => {
    if (isCorrect !== null) return; // Already answered

    setSelectedMonth(monthId);
    const correct = monthId === targetMonth?.id;
    setIsCorrect(correct);

    if (correct) {
      toast({
        title: '🎉 ' + getTranslation('ui', 'correct', lang),
        description: getTranslation('ui', 'correctMonth', lang),
      });
      setShowNext(true);
    } else {
      toast({
        title: '❌ ' + getTranslation('ui', 'incorrect', lang),
        description: getTranslation('ui', 'tryAgain', lang),
        variant: 'destructive',
      });
      
      // Reset selection after a delay
      setTimeout(() => {
        setSelectedMonth(null);
        setIsCorrect(null);
      }, 1500);
    }
  };

  if (!targetMonth || !targetSeason) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">
          {getTranslation('ui', 'guessMonthGame', lang)}
        </h3>
        <Button variant="outline" size="sm" onClick={generateNewQuestion}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        {getTranslation('ui', 'guessWhichMonth', lang)}
      </p>

      {/* Characteristics Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Temperature */}
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="h-5 w-5 text-orange-600" />
            <h4 className="font-bold text-orange-900">
              {getTranslation('ui', 'temperature', lang)}
            </h4>
          </div>
          <p className="text-lg font-semibold text-orange-800">
            {targetSeason.temperature_range[0]}°C → {targetSeason.temperature_range[1]}°C
          </p>
        </Card>

        {/* Weather */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300">
          <div className="flex items-center gap-2 mb-2">
            <CloudRain className="h-5 w-5 text-blue-600" />
            <h4 className="font-bold text-blue-900">
              {getTranslation('ui', 'weather', lang)}
            </h4>
          </div>
          <div className="flex gap-2 flex-wrap">
            {targetSeason.weather.map((w, idx) => {
              const Icon = weatherIcons[w] || CloudRain;
              return (
                <div key={idx} className="flex items-center gap-1 text-sm text-blue-800">
                  <Icon className="h-4 w-4" />
                  <span>{getTranslation('weather', w, lang)}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Activities */}
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-300">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <h4 className="font-bold text-green-900">
              {getTranslation('ui', 'activities', lang)}
            </h4>
          </div>
          <div className="flex gap-2 flex-wrap">
            {targetSeason.activities.map((a, idx) => {
              const Icon = activityIcons[a] || Leaf;
              return (
                <div key={idx} className="flex items-center gap-1 text-sm text-green-800">
                  <Icon className="h-4 w-4" />
                  <span>{getTranslation('activities', a, lang)}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Clothing */}
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300">
          <div className="flex items-center gap-2 mb-2">
            <Shirt className="h-5 w-5 text-purple-600" />
            <h4 className="font-bold text-purple-900">
              {getTranslation('ui', 'clothing', lang)}
            </h4>
          </div>
          <div className="flex gap-2 flex-wrap">
            {targetSeason.clothing.map((c, idx) => {
              const Icon = clothingIcons[c] || Shirt;
              return (
                <div key={idx} className="flex items-center gap-1 text-sm text-purple-800">
                  <Icon className="h-4 w-4" />
                  <span>{getTranslation('clothing', c, lang)}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Month Selection Buttons */}
      <div>
        <p className="text-sm font-medium mb-2">
          {getTranslation('ui', 'selectMonth', lang)}:
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {months.map((month) => {
            const isSelected = selectedMonth === month.id;
            const isTarget = month.id === targetMonth.id;
            
            let buttonClass = 'h-auto py-2';
            if (isCorrect && isTarget) {
              buttonClass += ' bg-green-500 hover:bg-green-600 text-white';
            } else if (isSelected && !isCorrect) {
              buttonClass += ' bg-red-500 hover:bg-red-600 text-white animate-pulse';
            }

            return (
              <Button
                key={month.id}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleMonthSelect(month.id)}
                disabled={isCorrect !== null}
                className={buttonClass}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-sm font-bold">{month.roman}</span>
                  <span className="text-[10px]">{month.t[lang] || month.t.ro}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Next Question Button */}
      {showNext && (
        <div className="flex justify-center">
          <Button onClick={generateNewQuestion} size="lg" className="bg-green-500 hover:bg-green-600">
            {getTranslation('ui', 'nextQuestion', lang)} →
          </Button>
        </div>
      )}
    </div>
  );
}
