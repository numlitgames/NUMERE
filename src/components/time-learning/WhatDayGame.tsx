import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CalendarClock, RotateCcw } from 'lucide-react';
import WeekWheel from './WeekWheel';
import {
  generateCalendarData,
  getDayNameShort,
  addDaysToDate,
  getMonthById,
  getDayOfWeekName,
  CalendarWeek,
} from '@/lib/timeData';

interface WhatDayGameProps {
  lang: string;
}

type Difficulty = 'easy' | 'medium' | 'hard';

export default function WhatDayGame({ lang }: WhatDayGameProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [daysToAdd, setDaysToAdd] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Date | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonths, setCalendarMonths] = useState<CalendarWeek[][]>([]);
  const { toast } = useToast();

  const generateDaysToAdd = (diff: Difficulty): number => {
    switch (diff) {
      case 'easy':
        const weeks = Math.floor(Math.random() * 8) + 1; // 1-8 weeks
        return weeks * 7;
      case 'medium':
        return Math.floor(Math.random() * 91) + 10; // 10-100 days
      case 'hard':
        return Math.floor(Math.random() * 111) + 40; // 40-150 days
      default:
        return 7;
    }
  };

  const validateMediumQuestion = (start: Date, target: Date): boolean => {
    return start.getFullYear() === target.getFullYear();
  };

  const generateCalendarMonths = (start: Date, target: Date): CalendarWeek[][] => {
    const months: CalendarWeek[][] = [];
    let currentMonth = start.getMonth() + 1;
    let currentYear = start.getFullYear();
    const endMonth = target.getMonth() + 1;
    const endYear = target.getFullYear();

    while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth + 1)) {
      months.push(generateCalendarData(currentMonth, currentYear, lang));
      currentMonth++;
      if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
      }
    }
    return months;
  };

  const handleDaySelected = (dayId: string) => {
    const today = new Date();
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetDayIndex = dayOfWeek.indexOf(dayId);
    const currentDayIndex = today.getDay();

    let daysUntilTarget = targetDayIndex - currentDayIndex;
    if (daysUntilTarget <= 0) daysUntilTarget += 7;

    const selectedDate = addDaysToDate(today, daysUntilTarget);
    setStartDate(selectedDate);

    let days = generateDaysToAdd(difficulty);
    let target = addDaysToDate(selectedDate, days);

    // For medium, validate that we don't cross year
    if (difficulty === 'medium') {
      let attempts = 0;
      while (!validateMediumQuestion(selectedDate, target) && attempts < 10) {
        days = generateDaysToAdd(difficulty);
        target = addDaysToDate(selectedDate, days);
        attempts++;
      }
      // If still crosses year after 10 attempts, reduce days to stay in same year
      if (!validateMediumQuestion(selectedDate, target)) {
        const daysLeftInYear = Math.floor(
          (new Date(selectedDate.getFullYear(), 11, 31).getTime() - selectedDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        days = Math.min(daysLeftInYear, 100);
        target = addDaysToDate(selectedDate, days);
      }
    }

    setDaysToAdd(days);
    setTargetDate(target);
    setCalendarMonths(generateCalendarMonths(selectedDate, target));
    setShowCalendar(true);
  };

  const handleDateSelect = (date: Date) => {
    if (isCompleted || !targetDate) return;

    setSelectedAnswer(date);

    const isCorrect =
      date.getDate() === targetDate.getDate() &&
      date.getMonth() === targetDate.getMonth() &&
      date.getFullYear() === targetDate.getFullYear();

    if (isCorrect) {
      const weekDayKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
        date.getDay()
      ];
      const monthName = getMonthById(date.getMonth() + 1)?.t[lang] || '';
      
      toast({
        title: lang === 'ro' ? '✅ Corect!' : '✅ Correct!',
        description: `${getDayOfWeekName(weekDayKey, lang)} ${date.getDate()} ${monthName} ${date.getFullYear()}`,
      });
      setIsCompleted(true);
      speakText(lang === 'ro' ? 'Corect! Bravo!' : 'Correct! Well done!');
    } else {
      toast({
        title: lang === 'ro' ? '❌ Încearcă din nou' : '❌ Try again',
        variant: 'destructive',
      });
    }
  };

  const resetGame = () => {
    setStartDate(null);
    setTargetDate(null);
    setDaysToAdd(0);
    setSelectedAnswer(null);
    setIsCompleted(false);
    setShowCalendar(false);
    setCalendarMonths([]);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ro' ? 'ro-RO' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const getMonthYearFromCalendar = (monthData: CalendarWeek[]): { month: number; year: number } => {
    const firstCurrentMonthDay = monthData.flatMap(w => w.days).find(d => d.isCurrentMonth);
    if (firstCurrentMonthDay) {
      return {
        month: firstCurrentMonthDay.date <= 7 ? 
          new Date(new Date().getFullYear(), 0, 1).getMonth() : 
          new Date().getMonth(),
        year: new Date().getFullYear()
      };
    }
    return { month: 0, year: new Date().getFullYear() };
  };

  return (
    <div className="space-y-6">
      {/* Header & Difficulty */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <CalendarClock className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-bold">{lang === 'ro' ? 'Ce Zi?' : 'What Day?'}</h3>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={difficulty === 'easy' ? 'default' : 'outline'}
            onClick={() => {
              setDifficulty('easy');
              resetGame();
            }}
            size="sm"
          >
            <div className="flex flex-col items-center">
              <span>{lang === 'ro' ? 'Ușor' : 'Easy'}</span>
              <span className="text-xs opacity-70">
                1-8 {lang === 'ro' ? 'săpt.' : 'wks'}
              </span>
            </div>
          </Button>
          <Button
            variant={difficulty === 'medium' ? 'default' : 'outline'}
            onClick={() => {
              setDifficulty('medium');
              resetGame();
            }}
            size="sm"
          >
            <div className="flex flex-col items-center">
              <span>{lang === 'ro' ? 'Mediu' : 'Medium'}</span>
              <span className="text-xs opacity-70">
                10-100 {lang === 'ro' ? 'zile' : 'days'}
              </span>
            </div>
          </Button>
          <Button
            variant={difficulty === 'hard' ? 'default' : 'outline'}
            onClick={() => {
              setDifficulty('hard');
              resetGame();
            }}
            size="sm"
          >
            <div className="flex flex-col items-center">
              <span>{lang === 'ro' ? 'Dificil' : 'Hard'}</span>
              <span className="text-xs opacity-70">
                40-150 {lang === 'ro' ? 'zile' : 'days'}
              </span>
            </div>
          </Button>
        </div>
      </div>

      {/* Wheel for Start Date Selection */}
      {!showCalendar && (
        <Card className="p-4">
          <WeekWheel onSpinComplete={handleDaySelected} lang={lang} isInteractive={true} />
          <p className="text-center mt-2 text-sm text-muted-foreground">
            {lang === 'ro'
              ? 'Învârte roata pentru a alege o zi de start'
              : 'Spin the wheel to choose a start day'}
          </p>
        </Card>
      )}

      {/* Question Card */}
      {showCalendar && startDate && targetDate && (
        <>
          <Card className="p-6 bg-primary/5 border-primary">
            <div className="space-y-2">
              <p className="text-lg text-center font-medium">
                {lang === 'ro' ? 'Astăzi este:' : 'Today is:'}
              </p>
              <p className="text-2xl text-center font-bold text-primary">
                {getDayOfWeekName(
                  ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
                    startDate.getDay()
                  ],
                  lang
                )}{' '}
                {startDate.getDate()} {getMonthById(startDate.getMonth() + 1)?.t[lang]}{' '}
                {startDate.getFullYear()}
              </p>
              <div className="border-t pt-3 mt-3">
                <p className="text-xl text-center font-bold">
                  {lang === 'ro' ? 'Ce zi va fi peste' : 'What day will it be in'}{' '}
                  {difficulty === 'easy'
                    ? `${daysToAdd / 7} ${
                        lang === 'ro'
                          ? daysToAdd / 7 === 1
                            ? 'săptămână'
                            : 'săptămâni'
                          : daysToAdd / 7 === 1
                          ? 'week'
                          : 'weeks'
                      }`
                    : `${daysToAdd} ${lang === 'ro' ? 'zile' : 'days'}`}
                  ?
                </p>
              </div>
            </div>
          </Card>

          {/* Calendar Grid */}
          <div className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              {lang === 'ro'
                ? 'Click pe data corectă din calendar'
                : 'Click on the correct date in the calendar'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {calendarMonths.map((monthData, idx) => {
              // Extract month and year from the calendar data
              const firstDayWithMonth = monthData
                .flatMap((week) => week.days)
                .find((day) => day.isCurrentMonth);
              
              if (!firstDayWithMonth) return null;

              // Calculate month and year based on calendar structure
              let displayMonth = startDate.getMonth() + 1 + idx;
              let displayYear = startDate.getFullYear();
              
              while (displayMonth > 12) {
                displayMonth -= 12;
                displayYear += 1;
              }

              return (
                <Card key={idx} className="p-3">
                  <h4 className="text-center font-bold text-sm mb-2">
                    {getMonthById(displayMonth)?.t[lang]} {displayYear}
                  </h4>

                  {/* Calendar Header */}
                  <div className="grid grid-cols-7 gap-0.5 mb-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="text-center text-[10px] font-medium text-muted-foreground">
                        {getDayNameShort(i, lang)}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  {monthData.map((week, wIdx) => (
                    <div key={wIdx} className="grid grid-cols-7 gap-0.5">
                      {week.days.map((day, dIdx) => {
                        if (!day.isCurrentMonth) {
                          return <div key={dIdx} className="aspect-square" />;
                        }

                        const dayDate = new Date(displayYear, displayMonth - 1, day.date);
                        const isStartDay =
                          day.date === startDate.getDate() &&
                          displayMonth === startDate.getMonth() + 1 &&
                          displayYear === startDate.getFullYear();
                        const isSelected =
                          selectedAnswer &&
                          day.date === selectedAnswer.getDate() &&
                          displayMonth === selectedAnswer.getMonth() + 1 &&
                          displayYear === selectedAnswer.getFullYear();
                        const isCorrect =
                          isSelected &&
                          isCompleted &&
                          day.date === targetDate.getDate() &&
                          displayMonth === targetDate.getMonth() + 1 &&
                          displayYear === targetDate.getFullYear();
                        const isWrong = isSelected && isCompleted && !isCorrect;

                        return (
                          <button
                            key={dIdx}
                            onClick={() => !isCompleted && handleDateSelect(dayDate)}
                            disabled={isCompleted}
                            className={`
                              aspect-square flex items-center justify-center text-[11px] rounded
                              transition-all hover:scale-110
                              ${isStartDay ? 'bg-blue-100 border-2 border-blue-500 font-bold' : 'bg-muted'}
                              ${isSelected && !isCompleted ? 'bg-primary text-primary-foreground' : ''}
                              ${isCorrect ? 'bg-green-500 text-white font-bold' : ''}
                              ${isWrong ? 'bg-red-500 text-white' : ''}
                              ${!isCompleted && !isStartDay ? 'cursor-pointer hover:bg-primary/20' : ''}
                            `}
                          >
                            {day.date}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </Card>
              );
            })}
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex gap-3 justify-center">
            <Button onClick={resetGame} variant="outline" size="lg" className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              {lang === 'ro' ? 'Resetează' : 'Reset'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
