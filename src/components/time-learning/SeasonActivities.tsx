import { Button } from '@/components/ui/button';
import { Thermometer, Cloud, Shirt } from 'lucide-react';
import SeasonWheel from './SeasonWheel';

type QuizType = 'temperature' | 'weather' | 'clothing' | null;

interface SeasonActivitiesProps {
  selectedSeason: string | null;
  onSeasonSelect: (seasonId: string) => void;
  onSpinComplete: () => void;
  isSpinning: boolean;
  activeQuiz: QuizType;
  onQuizSelect: (quiz: QuizType) => void;
  lang: string;
}

const quizButtons = [
  { id: 'temperature' as const, icon: Thermometer, label: 'Temperatură' },
  { id: 'weather' as const, icon: Cloud, label: 'Vreme' },
  { id: 'clothing' as const, icon: Shirt, label: 'Haine' }
];

export default function SeasonActivities({
  selectedSeason,
  onSeasonSelect,
  onSpinComplete,
  isSpinning,
  activeQuiz,
  onQuizSelect,
  lang
}: SeasonActivitiesProps) {
  return (
    <div className="space-y-3">
      {/* Season Wheel */}
      <SeasonWheel
        selectedSeason={selectedSeason}
        onSeasonSelect={onSeasonSelect}
        onSpinComplete={onSpinComplete}
        mode="season"
        lang={lang}
        isSpinning={isSpinning}
      />

      {/* Quiz Toggle Buttons */}
      {selectedSeason && (
        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          {quizButtons.map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant={activeQuiz === id ? 'default' : 'outline'}
              size="sm"
              onClick={() => onQuizSelect(activeQuiz === id ? null : id)}
              className="h-10 text-xs font-semibold"
              title={label}
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
