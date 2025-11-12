import React, { useState } from 'react';
import { Clock, Timer, Puzzle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ClockMatchingGame from './day-games/ClockMatchingGame';
import TimeConversionGame from './day-games/TimeConversionGame';
import TimeEstimationGame from './day-games/TimeEstimationGame';
import TimeQuizGame from './day-games/TimeQuizGame';
import ElapsedTimeGame from './day-games/ElapsedTimeGame';
import DailyTimelineGame from './day-games/DailyTimelineGame';
import SetAlarmGame from './day-games/SetAlarmGame';
import ChronologicalOrderGame from './day-games/ChronologicalOrderGame';
import FindMistakeGame from './day-games/FindMistakeGame';

type GameCategory = 'clock' | 'time' | 'other' | null;
type GameId = 'matching' | 'conversion' | 'estimation' | 'quiz' | 'elapsed' | 'timeline' | 'alarm' | 'order' | 'mistake' | null;

interface HourGamesProps {
  lang: string;
}

interface CategoryButton {
  id: GameCategory;
  icon: any;
  label: { ro: string; en: string };
  games: Array<{
    id: GameId;
    label: { ro: string; en: string };
  }>;
}

const categoryButtons: CategoryButton[] = [
  { 
    id: 'clock', 
    icon: Clock, 
    label: { ro: 'Potrivește Ceasul', en: 'Match Clock' },
    games: [
      { id: 'matching', label: { ro: 'Analog ↔ Digital', en: 'Analog ↔ Digital' } },
      { id: 'conversion', label: { ro: 'AM/PM vs 24h', en: 'AM/PM vs 24h' } },
      { id: 'estimation', label: { ro: 'Estimare & Verificare', en: 'Estimate & Check' } }
    ]
  },
  { 
    id: 'time', 
    icon: Timer, 
    label: { ro: 'Timpul', en: 'Time' },
    games: [
      { id: 'quiz', label: { ro: 'Mini-Quiz', en: 'Mini-Quiz' } },
      { id: 'elapsed', label: { ro: 'Timp Scurs', en: 'Elapsed Time' } },
      { id: 'timeline', label: { ro: 'Timeline', en: 'Timeline' } }
    ]
  },
  { 
    id: 'other', 
    icon: Puzzle, 
    label: { ro: 'Alte Jocuri', en: 'Other Games' },
    games: [
      { id: 'alarm', label: { ro: 'Setează Alarma', en: 'Set Alarm' } },
      { id: 'order', label: { ro: 'Ordine Cronologică', en: 'Chronological Order' } },
      { id: 'mistake', label: { ro: 'Găsește Greșeala', en: 'Find Mistake' } }
    ]
  }
];

export default function HourGames({ lang }: HourGamesProps) {
  const [activeCategory, setActiveCategory] = useState<GameCategory>(null);
  const [activeGame, setActiveGame] = useState<GameId>(null);

  return (
    <div className="space-y-4">
      {/* Main Category Buttons - EXACT CA LA MONTH */}
      <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b">
        {categoryButtons.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant={activeCategory === id ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setActiveCategory(id);
              setActiveGame(null);
            }}
            className="h-auto py-2 px-2 flex flex-col items-center gap-1"
          >
            <Icon className="h-4 w-4" />
            <span className="text-xs text-center leading-tight">
              {label[lang as 'ro' | 'en'] || label.ro}
            </span>
          </Button>
        ))}
      </div>

      {/* Sub-Game Buttons (when category selected) */}
      {activeCategory && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {categoryButtons
            .find(cat => cat.id === activeCategory)
            ?.games.map((game) => (
              <Button
                key={game.id}
                variant={activeGame === game.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveGame(game.id)}
                className="text-xs"
              >
                {game.label[lang as 'ro' | 'en'] || game.label.ro}
              </Button>
            ))}
        </div>
      )}

      {/* Active Game Component */}
      <div className="min-h-[300px]">
        {!activeCategory && (
          <div className="text-center py-8 text-muted-foreground">
            <p>{lang === 'ro' ? 'Selectează o categorie de jocuri' : 'Select a game category'}</p>
          </div>
        )}
        
        {activeCategory && !activeGame && (
          <div className="text-center py-8 text-muted-foreground">
            <p>{lang === 'ro' ? 'Selectează un joc din lista de mai sus' : 'Select a game from the list above'}</p>
          </div>
        )}

        {activeGame === 'matching' && <ClockMatchingGame lang={lang} />}
        {activeGame === 'conversion' && <TimeConversionGame lang={lang} />}
        {activeGame === 'estimation' && <TimeEstimationGame lang={lang} />}
        {activeGame === 'quiz' && <TimeQuizGame lang={lang} />}
        {activeGame === 'elapsed' && <ElapsedTimeGame lang={lang} />}
        {activeGame === 'timeline' && <DailyTimelineGame lang={lang} />}
        {activeGame === 'alarm' && <SetAlarmGame lang={lang} />}
        {activeGame === 'order' && <ChronologicalOrderGame lang={lang} />}
        {activeGame === 'mistake' && <FindMistakeGame lang={lang} />}
      </div>
    </div>
  );
}
