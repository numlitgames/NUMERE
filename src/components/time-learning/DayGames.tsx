import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Clock, Timer, Play } from "lucide-react";
import ClockMatchingGame from './day-games/ClockMatchingGame';
import TimeConversionGame from './day-games/TimeConversionGame';
import SetAlarmGame from './day-games/SetAlarmGame';
import ElapsedTimeGame from './day-games/ElapsedTimeGame';
import DailyTimelineGame from './day-games/DailyTimelineGame';
import TimeEstimationGame from './day-games/TimeEstimationGame';
import ChronologicalOrderGame from './day-games/ChronologicalOrderGame';
import FindMistakeGame from './day-games/FindMistakeGame';
import TimeQuizGame from './day-games/TimeQuizGame';

interface DayGamesProps {
  lang: string;
  onFullScreenGame?: (isFullScreen: boolean) => void;
}

type GameId = 'matching' | 'conversion' | 'alarm' | 'elapsed' | 'timeline' | 'estimation' | 'order' | 'mistake' | 'quiz' | null;
type CategoryId = 'clock' | 'time' | 'other' | null;

export default function DayGames({ lang, onFullScreenGame }: DayGamesProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>(null);
  const [activeGame, setActiveGame] = useState<GameId>(null);

  const categoryButtons = [
    { 
      id: 'clock' as CategoryId,
      icon: Clock,
      label: { ro: 'Potrivește Ceasul', en: 'Match Clock' },
      games: [
        { id: 'matching' as GameId, label: { ro: 'Analog↔Digital', en: 'Analog↔Digital' } },
        { id: 'conversion' as GameId, label: { ro: 'AM/PM vs 24h', en: 'AM/PM vs 24h' } },
        { id: 'alarm' as GameId, label: { ro: 'Setează Alarma', en: 'Set Alarm' } }
      ]
    },
    { 
      id: 'time' as CategoryId,
      icon: Timer,
      label: { ro: 'Timpul', en: 'Time' },
      games: [
        { id: 'elapsed' as GameId, label: { ro: 'Timp Scurs', en: 'Elapsed Time' } },
        { id: 'mistake' as GameId, label: { ro: 'Greșeala', en: 'Mistake' } },
        { id: 'estimation' as GameId, label: { ro: 'Estimare', en: 'Estimation' } }
      ]
    },
    { 
      id: 'other' as CategoryId,
      icon: Play,
      label: { ro: 'Alte Jocuri', en: 'Other Games' },
      games: [
        { id: 'order' as GameId, label: { ro: 'Ordine', en: 'Order' } },
        { id: 'timeline' as GameId, label: { ro: 'Timeline', en: 'Timeline' } },
        { id: 'quiz' as GameId, label: { ro: 'Quiz', en: 'Quiz' } }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      {/* Main Category Buttons */}
      <div className="grid grid-cols-3 gap-2 pb-4 border-b">
        {categoryButtons.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant={activeCategory === id ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setActiveCategory(activeCategory === id ? null : id);
              setActiveGame(null);
              onFullScreenGame?.(false);
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

      {/* Sub-Game Buttons */}
      {activeCategory && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {categoryButtons
            .find(cat => cat.id === activeCategory)
            ?.games.map((game) => (
              <Button
                key={game.id}
                variant={activeGame === game.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setActiveGame(game.id);
                  onFullScreenGame?.(game.id === 'matching');
                }}
                className="text-xs"
              >
                {game.label[lang as 'ro' | 'en'] || game.label.ro}
              </Button>
            ))}
        </div>
      )}

      {/* Active Game */}
      <div className="min-h-[300px]">
        {!activeCategory && (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>{lang === 'ro' ? 'Selectează o categorie de jocuri' : 'Select a game category'}</p>
          </div>
        )}
        
        {activeCategory && !activeGame && (
          <div className="text-center py-12 text-muted-foreground">
            <Play className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>{lang === 'ro' ? 'Selectează un joc' : 'Select a game'}</p>
          </div>
        )}

        {activeGame === 'matching' && <ClockMatchingGame lang={lang} />}
        {activeGame === 'conversion' && <TimeConversionGame lang={lang} />}
        {activeGame === 'alarm' && <SetAlarmGame lang={lang} />}
        {activeGame === 'elapsed' && <ElapsedTimeGame lang={lang} />}
        {activeGame === 'timeline' && <DailyTimelineGame lang={lang} />}
        {activeGame === 'estimation' && <TimeEstimationGame lang={lang} />}
        {activeGame === 'order' && <ChronologicalOrderGame lang={lang} />}
        {activeGame === 'mistake' && <FindMistakeGame lang={lang} />}
        {activeGame === 'quiz' && <TimeQuizGame lang={lang} />}
      </div>
    </div>
  );
}
