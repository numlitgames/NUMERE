import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, Activity, Battery, Hash, MapPin, Scale, Puzzle, Timer, CalendarClock } from 'lucide-react';
import WeekWheel from './WeekWheel';
import WorkdayVsWeekendGame from './WorkdayVsWeekendGame';
import WeekInMonthGame from './WeekInMonthGame';
import DailyActivitiesGame from './DailyActivitiesGame';
import EnergyBarometerGame from './EnergyBarometerGame';
import WhatDayGame from './WhatDayGame';

type GameType = 'workday' | 'weekInMonth' | 'activities' | 'energy' | 'whatDay' | null;

interface WeekGamesProps {
  lang: string;
}

const gameButtons = [
  { id: 'workday' as const, icon: Activity, label: { ro: 'Zilele Săptămânii', en: 'Days of Week' } },
  { id: 'weekInMonth' as const, icon: Calendar, label: { ro: 'Săptămâna în Lună', en: 'Week in Month' } },
  { id: 'activities' as const, icon: Puzzle, label: { ro: 'Activități Zilnice', en: 'Daily Activities' } },
  { id: 'energy' as const, icon: Battery, label: { ro: 'Energie Săptămânală', en: 'Weekly Energy' } },
  { id: 'whatDay' as const, icon: CalendarClock, label: { ro: 'Ce Zi?', en: 'What Day?' } },
];

export default function WeekGames({ lang }: WeekGamesProps) {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const handleGameSelect = (game: GameType) => {
    setActiveGame(activeGame === game ? null : game);
  };

  return (
    <div className="space-y-4">
      {/* Week Wheel */}
      <Card className="p-4">
        <WeekWheel
          selectedDay={selectedDay}
          onDaySelect={setSelectedDay}
          lang={lang}
        />
      </Card>

      {/* Game Selection Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {gameButtons.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant={activeGame === id ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleGameSelect(id)}
            className="h-auto py-3 px-2 flex flex-col items-center gap-1"
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs text-center leading-tight">
              {label[lang as keyof typeof label] || label.ro}
            </span>
          </Button>
        ))}
      </div>

      {/* Active Game Display */}
      {activeGame && (
        <Card className="p-4">
          {activeGame === 'workday' && <WorkdayVsWeekendGame lang={lang} startDayFromWheel={selectedDay} onRequestReset={() => setSelectedDay(null)} />}
          {activeGame === 'weekInMonth' && <WeekInMonthGame lang={lang} />}
          {activeGame === 'activities' && <DailyActivitiesGame lang={lang} />}
          {activeGame === 'energy' && <EnergyBarometerGame lang={lang} />}
          {activeGame === 'whatDay' && <WhatDayGame lang={lang} />}
        </Card>
      )}
    </div>
  );
}
