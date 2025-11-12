import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Sparkles, ListOrdered, Target, HelpCircle } from 'lucide-react';
import { 
  generateCalendarData, 
  getDayNameShort, 
  getMonthById,
  ui as timeUI 
} from '@/lib/timeData';
import type { CalendarWeek } from '@/lib/timeData';
import WeekWheel from './WeekWheel';
import timeDataRaw from '../../../data/time-learning.json';
interface WeekInMonthGameProps {
  lang: string;
}

type GameType = 'findWeek' | 'completeWeek' | 'collectDays' | null;

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1; // 1-12

export default function WeekInMonthGame({ lang }: WeekInMonthGameProps) {
  const { toast } = useToast();
  const [gameType, setGameType] = useState<GameType>(null);
  
  // Calendar data
  const [calendarData, setCalendarData] = useState<CalendarWeek[]>([]);
  const [currentMonth] = useState(CURRENT_MONTH);
  const [currentYear] = useState(CURRENT_YEAR);
  
  // Game 1: Find Week
  const [targetDay, setTargetDay] = useState<number | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [correctWeek, setCorrectWeek] = useState<number | null>(null);
  
  // Game 2: Complete Week
  const [selectedWeekForCompletion, setSelectedWeekForCompletion] = useState<number | null>(null);
  const [availableDaysForCompletion, setAvailableDaysForCompletion] = useState<number[]>([]);
  const [droppedDays, setDroppedDays] = useState<(number | null)[]>([null, null, null, null, null, null, null]);
  const [draggedDay, setDraggedDay] = useState<number | null>(null);
  
  // Game 3: Collect Days - NEW STATE
  const [game3SelectedDayId, setGame3SelectedDayId] = useState<string | null>(null); // 'monday', 'tuesday', etc.
  const [game3SelectedDayName, setGame3SelectedDayName] = useState<string>('');
  const [game3AllDaysInMonth, setGame3AllDaysInMonth] = useState<number[]>([]); // [1, 8, 15, 22, 29]
  const [game3DroppedDays, setGame3DroppedDays] = useState<(number | null)[]>([]); // [null, null, null, null]
  const [game3DraggedDay, setGame3DraggedDay] = useState<number | null>(null);
  const [game3ShowWheel, setGame3ShowWheel] = useState(true);
  const [game3ShowHelp, setGame3ShowHelp] = useState(false);
  
  // Generate calendar on mount
  useEffect(() => {
    const calendar = generateCalendarData(currentMonth, currentYear, lang);
    setCalendarData(calendar);
  }, [currentMonth, currentYear, lang]);
  
  // Translations helper
  const t = (key: string): string => {
    const base: any = (timeUI as any)?.weekInMonth ?? (timeDataRaw as any)?.weekInMonth ?? {};
    const value: any = key.split('.').reduce((acc: any, k: string) => acc?.[k], base);
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object') return value[lang] ?? value.ro ?? key;
    return key;
  };
  // ===== GAME 1: Find Week =====
  const startGame1 = () => {
    // Pick a random day from current month
    const currentMonthDays: number[] = [];
    calendarData.forEach((week) => {
      week.days.forEach((day) => {
        if (day.isCurrentMonth) {
          currentMonthDays.push(day.date);
        }
      });
    });
    
    const randomDay = currentMonthDays[Math.floor(Math.random() * currentMonthDays.length)];
    setTargetDay(randomDay);
    
    // Find correct week
    let correctWeekNum = 1;
    for (const week of calendarData) {
      if (week.days.some(d => d.date === randomDay && d.isCurrentMonth)) {
        correctWeekNum = week.weekNumber;
        break;
      }
    }
    setCorrectWeek(correctWeekNum);
    setSelectedWeek(null);
    setGameType('findWeek');
  };
  
  const handleWeekSelect = (weekNum: number) => {
    setSelectedWeek(weekNum);
    
    if (weekNum === correctWeek) {
      toast({
        title: t('correct'),
        description: `${t('game1.instruction')} ${targetDay} ${t('game1.week')} ${correctWeek}!`,
      });
    } else {
      toast({
        title: t('incorrect'),
        variant: 'destructive',
      });
    }
  };
  
  // ===== GAME 2: Complete Week =====
  const startGame2 = () => {
    // Pick a random week that has complete days from current month
    const completeWeeks = calendarData.filter(week => 
      week.days.filter(d => d.isCurrentMonth).length === 7
    );
    
    if (completeWeeks.length === 0) {
      // If no complete week, pick first week with most days
      const weekNum = 2; // Usually week 2 or 3 has complete days
      setSelectedWeekForCompletion(weekNum);
      initializeGame2Days(weekNum);
    } else {
      const randomWeek = completeWeeks[Math.floor(Math.random() * completeWeeks.length)];
      setSelectedWeekForCompletion(randomWeek.weekNumber);
      initializeGame2Days(randomWeek.weekNumber);
    }
    
    setGameType('completeWeek');
  };
  
  const initializeGame2Days = (weekNum: number) => {
    const week = calendarData.find(w => w.weekNumber === weekNum);
    if (!week) return;
    
    const days = week.days
      .filter(d => d.isCurrentMonth)
      .map(d => d.date);
    
    // Shuffle days
    const shuffled = [...days].sort(() => Math.random() - 0.5);
    setAvailableDaysForCompletion(shuffled);
    setDroppedDays([null, null, null, null, null, null, null]);
  };
  
  const handleDragStart = (day: number) => {
    setDraggedDay(day);
  };
  
  const handleDragEnd = () => {
    setDraggedDay(null);
  };
  
  const handleDropToSlot = (slotIndex: number) => {
    if (draggedDay === null) return;
    
    // Remove from available
    setAvailableDaysForCompletion(prev => prev.filter(d => d !== draggedDay));
    
    // Add to slot
    const newDropped = [...droppedDays];
    newDropped[slotIndex] = draggedDay;
    setDroppedDays(newDropped);
    setDraggedDay(null);
  };
  
  const handleRemoveFromSlot = (slotIndex: number) => {
    const day = droppedDays[slotIndex];
    if (day === null) return;
    
    // Add back to available
    setAvailableDaysForCompletion(prev => [...prev, day]);
    
    // Remove from slot
    const newDropped = [...droppedDays];
    newDropped[slotIndex] = null;
    setDroppedDays(newDropped);
  };
  
  const checkGame2Answer = () => {
    const week = calendarData.find(w => w.weekNumber === selectedWeekForCompletion);
    if (!week) return;
    
    const correctDays = week.days
      .filter(d => d.isCurrentMonth)
      .map(d => d.date);
    
    // Check if all dropped days match correct order
    let allCorrect = true;
    for (let i = 0; i < droppedDays.length; i++) {
      if (droppedDays[i] !== correctDays[i]) {
        allCorrect = false;
        break;
      }
    }
    
    if (allCorrect) {
      toast({
        title: t('allCorrect'),
      });
    } else {
      toast({
        title: t('incorrect'),
        variant: 'destructive',
      });
    }
  };
  
  // ===== GAME 3: Collect Days =====
  const getDayOfWeekName = (dayId: string, language: string): string => {
    const dayNames: Record<string, Record<string, string>> = {
      'sunday': { ro: 'Duminică', en: 'Sunday', de: 'Sonntag', fr: 'Dimanche' },
      'monday': { ro: 'Luni', en: 'Monday', de: 'Montag', fr: 'Lundi' },
      'tuesday': { ro: 'Marți', en: 'Tuesday', de: 'Dienstag', fr: 'Mardi' },
      'wednesday': { ro: 'Miercuri', en: 'Wednesday', de: 'Mittwoch', fr: 'Mercredi' },
      'thursday': { ro: 'Joi', en: 'Thursday', de: 'Donnerstag', fr: 'Jeudi' },
      'friday': { ro: 'Vineri', en: 'Friday', de: 'Freitag', fr: 'Vendredi' },
      'saturday': { ro: 'Sâmbătă', en: 'Saturday', de: 'Samstag', fr: 'Samedi' },
    };
    return dayNames[dayId]?.[language] || dayId;
  };

  const handleWheelDaySelect = (dayId: string) => {
    // dayId = 'monday', 'tuesday', etc.
    const dayName = getDayOfWeekName(dayId, lang);
    
    // Map day IDs to day-of-week indices
    // This MUST match the logic in generateCalendarData (timeData.ts)
    // For Romanian (and most EU languages): week starts on Monday (0=Monday, 6=Sunday)
    // For English/Others: week starts on Sunday (0=Sunday, 6=Saturday)
    const weekStartsOnMonday = lang === 'ro';
    
    const dayOfWeekMap: Record<string, number> = weekStartsOnMonday
      ? {
          // European format: Monday=0, Tuesday=1, ..., Sunday=6
          'monday': 0,
          'tuesday': 1,
          'wednesday': 2,
          'thursday': 3,
          'friday': 4,
          'saturday': 5,
          'sunday': 6
        }
      : {
          // US format: Sunday=0, Monday=1, ..., Saturday=6
          'sunday': 0,
          'monday': 1,
          'tuesday': 2,
          'wednesday': 3,
          'thursday': 4,
          'friday': 5,
          'saturday': 6
        };
    
    const targetDayOfWeek = dayOfWeekMap[dayId];
    
    // Find all days in current month that match this day of week
    const matchingDays: number[] = [];
    calendarData.forEach((week) => {
      week.days.forEach((day) => {
        if (day.isCurrentMonth && day.dayOfWeek === targetDayOfWeek) {
          matchingDays.push(day.date);
        }
      });
    });
    
    // Sort in ascending order
    matchingDays.sort((a, b) => a - b);
    
    setGame3SelectedDayId(dayId);
    setGame3SelectedDayName(dayName);
    setGame3AllDaysInMonth(matchingDays);
    setGame3DroppedDays(new Array(matchingDays.length).fill(null)); // Empty slots
    setGame3ShowWheel(false);
  };

  // ===== GAME 3: DRAG & DROP HANDLERS =====
  const handleGame3DragStart = (day: number) => {
    setGame3DraggedDay(day);
  };

  const handleGame3DropToSlot = (slotIndex: number) => {
    if (game3DraggedDay === null) return;
    
    // Check if day already dropped somewhere
    if (game3DroppedDays.includes(game3DraggedDay)) {
      return;
    }
    
    const newDropped = [...game3DroppedDays];
    newDropped[slotIndex] = game3DraggedDay;
    setGame3DroppedDays(newDropped);
    setGame3DraggedDay(null);
  };

  const handleGame3RemoveFromSlot = (slotIndex: number) => {
    const newDropped = [...game3DroppedDays];
    newDropped[slotIndex] = null;
    setGame3DroppedDays(newDropped);
  };

  const checkGame3Answer = () => {
    // Check if all slots filled
    if (game3DroppedDays.some(day => day === null)) {
      toast({
        title: lang === 'ro' ? 'Completează toate casetele!' : 'Fill all boxes!',
        variant: 'destructive',
      });
      speakText(lang === 'ro' ? 'Completează toate casetele!' : 'Fill all boxes!');
      return;
    }
    
    // Check if in correct order (ascending)
    const isCorrect = game3DroppedDays.every((day, idx) => day === game3AllDaysInMonth[idx]);
    
    if (isCorrect) {
      toast({
        title: lang === 'ro' ? '🎉 Foarte bine!' : '🎉 Great job!',
      });
      speakText(lang === 'ro' ? 'Foarte bine! Ai aranjat zilele corect!' : 'Great job! You arranged the days correctly!');
      
      // Reset to wheel after 2 seconds
      setTimeout(() => {
        resetGame3();
      }, 2000);
    } else {
      toast({
        title: lang === 'ro' ? 'Încearcă din nou!' : 'Try again!',
        description: lang === 'ro' ? 'Aranjează zilele în ordine crescătoare.' : 'Arrange days in ascending order.',
        variant: 'destructive',
      });
      speakText(lang === 'ro' ? 'Încearcă din nou! Aranjează zilele în ordine crescătoare.' : 'Try again! Arrange days in ascending order.');
    }
  };

  // Web Speech API - Text to Speech (FREE)
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ro' ? 'ro-RO' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const resetGame3 = () => {
    setGame3SelectedDayId(null);
    setGame3SelectedDayName('');
    setGame3AllDaysInMonth([]);
    setGame3DroppedDays([]);
    setGame3ShowWheel(true);
    setGame3ShowHelp(false);
  };
  
  const startGame3 = () => {
    setGameType('collectDays');
    resetGame3();
  };
  
  // ===== RENDER HELPERS =====
  const renderCalendar = (highlightWeek?: number, highlightDays?: number[]) => {
    const monthName = getMonthById(currentMonth)?.t[lang] || '';
    
    return (
      <div className="bg-card border-2 border-primary/20 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-5 w-5 text-primary" />
          <h4 className="font-bold text-foreground">{monthName} {currentYear}</h4>
        </div>
        
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => (
            <div
              key={dayIdx}
              className="text-center text-xs font-bold text-muted-foreground p-1"
            >
              {getDayNameShort(dayIdx, lang)}
            </div>
          ))}
        </div>
        
        {/* Calendar weeks */}
        {calendarData.map((week) => {
          const isHighlightedWeek = highlightWeek === week.weekNumber;
          
          return (
            <div key={week.weekNumber} className="grid grid-cols-7 gap-1 mb-1">
              {week.days.map((day, dayIdx) => {
                const isHighlightedDay = highlightDays?.includes(day.date) && day.isCurrentMonth;
                const isCurrentMonthDay = day.isCurrentMonth;
                
                return (
                  <div
                    key={dayIdx}
                    className={`
                      aspect-square flex items-center justify-center text-xs rounded
                      ${isHighlightedWeek && isCurrentMonthDay ? 'bg-primary text-primary-foreground font-bold' : ''}
                      ${isHighlightedDay ? 'bg-accent text-accent-foreground font-bold ring-2 ring-primary' : ''}
                      ${!isHighlightedWeek && !isHighlightedDay && isCurrentMonthDay ? 'bg-muted text-foreground' : ''}
                      ${!isCurrentMonthDay ? 'bg-background text-muted-foreground/30' : ''}
                    `}
                  >
                    {day.date}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };
  
  // ===== MAIN RENDER =====
  return (
    <div className="space-y-6">
    {/* Game Selection - Always Visible */}
    <div className="flex gap-4 justify-center flex-wrap">
      <Button 
        onClick={startGame1}
        variant={gameType === 'findWeek' ? 'default' : 'outline'}
        size="default"
      >
        {t('game1.title')}
      </Button>

      <Button 
        onClick={startGame2}
        variant={gameType === 'completeWeek' ? 'default' : 'outline'}
        size="default"
      >
        {t('game2.title')}
      </Button>

      <Button 
        onClick={startGame3}
        variant={gameType === 'collectDays' ? 'default' : 'outline'}
        size="default"
      >
        {t('game3.title')}
      </Button>
    </div>

      {/* No game selected */}
      {!gameType && (
        <div className="text-center p-8 border-2 border-dashed border-muted rounded-lg">
          <p className="text-lg text-muted-foreground">
            {lang === 'ro' ? 'Selectează un joc de mai sus' :
             lang === 'en' ? 'Select a game from above' :
             lang === 'de' ? 'Wähle ein Spiel von oben' :
             lang === 'fr' ? 'Sélectionnez un jeu ci-dessus' :
             'Selectează un joc de mai sus'}
          </p>
        </div>
      )}

      {/* GAME 1: Find Week */}
      {gameType === 'findWeek' && (
        <div className="space-y-4">
          <div className="p-4 bg-accent rounded-lg border border-primary">
            <p className="text-sm font-medium text-foreground">
              {t('game1.instruction')} <span className="text-2xl font-bold text-primary">{targetDay}</span>?
            </p>
          </div>
          
          {/* Week selector buttons */}
          <div className="flex gap-2 justify-center flex-wrap">
            {calendarData.map((week) => (
              <Button
                key={week.weekNumber}
                variant={selectedWeek === week.weekNumber ? 'default' : 'outline'}
                size="lg"
                onClick={() => handleWeekSelect(week.weekNumber)}
                className="min-w-[80px]"
                disabled={selectedWeek !== null}
              >
                {t('game1.week')} {week.weekNumber}
              </Button>
            ))}
          </div>
          
          {renderCalendar(selectedWeek || undefined)}
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={startGame1}
          >
            {t('reset')}
          </Button>
        </div>
      )}

      {/* GAME 2: Complete Week */}
      {gameType === 'completeWeek' && (
        <div className="space-y-4">
          <div className="p-4 bg-accent rounded-lg border border-primary">
            <p className="text-sm font-medium text-foreground">
              {t('game2.instruction')} {selectedWeekForCompletion}
            </p>
          </div>
          
          {/* Drop zones for days */}
          <div className="grid grid-cols-7 gap-2">
            {droppedDays.map((day, idx) => (
              <div
                key={idx}
                className="aspect-square border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center bg-muted hover:bg-accent transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDropToSlot(idx)}
                onClick={() => day !== null && handleRemoveFromSlot(idx)}
              >
                {day !== null ? (
                  <span className="text-lg font-bold text-foreground cursor-pointer">{day}</span>
                ) : (
                  <span className="text-xs text-muted-foreground">{getDayNameShort(idx, lang)}</span>
                )}
              </div>
            ))}
          </div>
          
          {/* Available days */}
          <div>
            <p className="text-sm font-medium mb-2 text-foreground">{t('game2.availableDays')}</p>
            <div className="flex gap-2 flex-wrap">
              {availableDaysForCompletion.map((day) => (
                <div
                  key={day}
                  draggable
                  onDragStart={() => handleDragStart(day)}
                  onDragEnd={handleDragEnd}
                  className="w-12 h-12 border-2 border-primary rounded-lg flex items-center justify-center bg-card text-foreground font-bold cursor-move hover:bg-accent transition-colors"
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="default" 
              className="flex-1" 
              onClick={checkGame2Answer}
              disabled={droppedDays.some(d => d === null)}
            >
              {t('check')}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={startGame2}
            >
              {t('reset')}
            </Button>
          </div>
          
          {renderCalendar(selectedWeekForCompletion)}
        </div>
      )}

      {/* GAME 3: Collect Days */}
      {gameType === 'collectDays' && (
        <div className="space-y-6">
          {game3ShowWheel ? (
            <div className="flex justify-center">
              <WeekWheel
                lang={lang}
                onSpinComplete={handleWheelDaySelect}
                isInteractive={true}
              />
            </div>
          ) : (
            <>
              {/* Display Selected Day */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary rounded-lg p-6 text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  {game3SelectedDayName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {lang === 'ro' 
                    ? `Trage în casete toate zilele de ${game3SelectedDayName} din calendar, în ordine crescătoare` 
                    : `Drag all ${game3SelectedDayName}s from the calendar into the boxes, in ascending order`}
                </p>
              </div>

              {/* Empty Drop Slots */}
              <div className="flex gap-3 justify-center flex-wrap">
                {game3DroppedDays.map((droppedDay, idx) => (
                  <div
                    key={idx}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleGame3DropToSlot(idx)}
                    className={`
                      w-20 h-20 border-4 border-dashed rounded-lg
                      flex items-center justify-center text-3xl font-bold
                      transition-all
                      ${droppedDay !== null 
                        ? 'bg-green-100 border-green-400 text-green-700' 
                        : 'bg-gray-50 border-gray-300 text-gray-400 hover:border-primary hover:bg-primary/5'
                      }
                    `}
                  >
                    {droppedDay !== null ? (
                      <button
                        onClick={() => handleGame3RemoveFromSlot(idx)}
                        className="w-full h-full flex items-center justify-center hover:opacity-70"
                      >
                        {droppedDay}
                      </button>
                    ) : (
                      '?'
                    )}
                  </div>
                ))}
              </div>

              {/* Calendar with Draggable Days */}
              <div className="bg-card border-2 border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h4 className="font-bold text-foreground">
                    {getMonthById(currentMonth)?.t[lang] || ''} {currentYear}
                  </h4>
                </div>
                
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => (
                    <div
                      key={dayIdx}
                      className="text-center text-xs font-bold text-muted-foreground p-1"
                    >
                      {getDayNameShort(dayIdx, lang)}
                    </div>
                  ))}
                </div>
                
                {/* Calendar weeks */}
                {calendarData.map((week) => (
                  <div key={week.weekNumber} className="grid grid-cols-7 gap-1 mb-1">
                    {week.days.map((day, dayIdx) => {
                      const isTargetDay = game3AllDaysInMonth.includes(day.date) && day.isCurrentMonth;
                      const isAlreadyDropped = game3DroppedDays.includes(day.date);
                      const isCurrentMonthDay = day.isCurrentMonth;
                      
                      return (
                        <div
                          key={dayIdx}
                          draggable={isTargetDay && !isAlreadyDropped}
                          onDragStart={() => handleGame3DragStart(day.date)}
                          className={`
                            aspect-square flex items-center justify-center text-xs rounded
                            transition-all
                            ${isTargetDay && !isAlreadyDropped && game3ShowHelp
                              ? 'bg-primary text-primary-foreground font-bold cursor-grab active:cursor-grabbing hover:scale-110 hover:shadow-lg' 
                              : ''
                            }
                            ${isTargetDay && !isAlreadyDropped && !game3ShowHelp
                              ? 'bg-muted text-foreground cursor-grab active:cursor-grabbing hover:scale-105' 
                              : ''
                            }
                            ${isTargetDay && isAlreadyDropped 
                              ? 'bg-gray-200 text-gray-400 line-through' 
                              : ''
                            }
                            ${!isTargetDay && isCurrentMonthDay 
                              ? 'bg-muted text-foreground' 
                              : ''
                            }
                            ${!isCurrentMonthDay 
                              ? 'bg-background text-muted-foreground/30' 
                              : ''
                            }
                          `}
                        >
                          {day.date}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center flex-wrap">
                <Button
                  onClick={() => setGame3ShowHelp(!game3ShowHelp)}
                  variant={game3ShowHelp ? "default" : "outline"}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <HelpCircle className="h-5 w-5" />
                  {lang === 'ro' ? 'Ajutor' : 'Help'}
                </Button>
                
                <Button
                  onClick={checkGame3Answer}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  {lang === 'ro' ? 'Verifică' : 'Check'}
                </Button>
                
                <Button
                  onClick={resetGame3}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Target className="h-5 w-5" />
                  {lang === 'ro' ? 'Alege altă zi' : 'Choose another day'}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
