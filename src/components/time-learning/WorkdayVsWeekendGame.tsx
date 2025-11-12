import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, BookOpen, Dumbbell, CalendarDays, Palette, Hash, Check, X } from 'lucide-react';
import { toast } from 'sonner';

import { addDaysToWeekday, getDayOfWeekName } from '@/lib/timeData';
import timeData from '../../../data/time-learning.json';

interface WorkdayVsWeekendGameProps {
  lang: string;
  startDayFromWheel?: string | null;
  onRequestReset?: () => void;
}

const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// Rainbow colors (ROYGBIV)
const WEEKDAY_COLORS: Record<string, string> = {
  monday: '#ef4444',    // Red
  tuesday: '#f97316',   // Orange
  wednesday: '#eab308', // Yellow
  thursday: '#22c55e',  // Green
  friday: '#3b82f6',    // Blue
  saturday: '#6366f1',  // Indigo
  sunday: '#a855f7'     // Violet
};

const WORKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const WEEKEND_DAYS = ['saturday', 'sunday'];

type GameMode = 'accommodation' | 'orderDays' | 'exercise' | null;
type Difficulty = 'easy' | 'medium' | 'pro' | null;
type QuestionType = 'future' | 'past';

export default function WorkdayVsWeekendGame({ lang, startDayFromWheel, onRequestReset }: WorkdayVsWeekendGameProps) {
  const ui = timeData.ui as any;
  
  // Game mode state
  const [gameMode, setGameMode] = useState<GameMode>(null);
  
  // Accommodation mode states
  const [availableDays, setAvailableDays] = useState<string[]>(WEEKDAYS);
  const [workdayZone, setWorkdayZone] = useState<string[]>([]);
  const [weekendZone, setWeekendZone] = useState<string[]>([]);
  const [draggedDay, setDraggedDay] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  
  // Exercise mode states
  const [wheelDay, setWheelDay] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(null);
  const [currentDay, setCurrentDay] = useState<string | null>(null);
  const [questionType, setQuestionType] = useState<QuestionType>('future');
  const [daysOffset, setDaysOffset] = useState(0);
  const [availableDaysForAnswer, setAvailableDaysForAnswer] = useState<string[]>([]);
  
  // Helper function to shuffle and select random days
  const getRandomDays = (count: number) => {
    const shuffled = [...WEEKDAYS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };
  const [droppedAnswer, setDroppedAnswer] = useState<string | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  
  // Order Days mode states
  const [orderDaysShuffled, setOrderDaysShuffled] = useState<string[]>([]);
  const [orderDaysUserOrder, setOrderDaysUserOrder] = useState<string[]>([]);
  const [orderDaysIsComplete, setOrderDaysIsComplete] = useState(false);

  // Order Days sub-mode
  type OrderDaysSubMode = 'sequence' | 'colorMatch' | 'dayNumber' | null;
  const [orderDaysSubMode, setOrderDaysSubMode] = useState<OrderDaysSubMode>(null);

  // Color Matching mode states
  const [colorMatchDays, setColorMatchDays] = useState<string[]>([]);
  const [colorMatchDropZones, setColorMatchDropZones] = useState<Record<string, string | null>>({
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null
  });
  const [colorMatchChecked, setColorMatchChecked] = useState(false);

  // Day Number mode states
  const [dayNumberDays, setDayNumberDays] = useState<string[]>([]);
  const [dayNumberSlots, setDayNumberSlots] = useState<(string | null)[]>(Array(7).fill(null));
  const [dayNumberChecked, setDayNumberChecked] = useState(false);

  // Get translation
  const t = (key: string): string => {
    return ui[key]?.[lang] || ui[key]?.ro || key;
  };

  // Reset accommodation mode
  const resetAccommodation = () => {
    const randomDays = getRandomDays(5);
    setAvailableDays(randomDays);
    setWorkdayZone([]);
    setWeekendZone([]);
    setIsChecked(false);
    setDraggedDay(null);
  };

  // Reset exercise mode
  const resetExercise = () => {
    setDifficulty(null);
    setCurrentDay(null);
    setWheelDay(null);
    setDroppedAnswer(null);
    setAnsweredCorrectly(false);
    setAvailableDaysForAnswer([]);
    setDaysOffset(0);
    
    // Signal parent to reset wheel
    if (onRequestReset) {
      onRequestReset();
    }
  };

  // Reset color match
  const resetColorMatch = (keepSubMode = false) => {
    const randomDays = getRandomDays(5);
    setColorMatchDays(randomDays);
    setColorMatchDropZones({
      monday: null, tuesday: null, wednesday: null,
      thursday: null, friday: null, saturday: null, sunday: null
    });
    setColorMatchChecked(false);
  };

  // Reset day number
  const resetDayNumber = (keepSubMode = false) => {
    const randomDays = getRandomDays(5);
    setDayNumberDays(randomDays);
    setDayNumberSlots(Array(7).fill(null));
    setDayNumberChecked(false);
  };

  // Reset order days mode
  const resetOrderDays = (keepSubMode = false) => {
    if (!keepSubMode) {
      setOrderDaysSubMode(null);
    }
    const shuffled = [...WEEKDAYS].sort(() => Math.random() - 0.5);
    setOrderDaysShuffled(shuffled);
    setOrderDaysUserOrder([]);
    setOrderDaysIsComplete(false);
    resetColorMatch();
    resetDayNumber();
  };

  // Handle day click in order mode
  const handleOrderDayClick = (day: string) => {
    if (orderDaysIsComplete || orderDaysUserOrder.includes(day)) return;

    const newOrder = [...orderDaysUserOrder, day];
    setOrderDaysUserOrder(newOrder);

    if (newOrder.length === 7) {
      checkOrderDaysAnswer(newOrder);
    }
  };

  // Check order days answer
  const checkOrderDaysAnswer = (order: string[]) => {
    const isCorrect = order.every((day, idx) => day === WEEKDAYS[idx]);
    
    if (isCorrect) {
      toast.success('🎉 ' + t('correct'), {
        description: 'Ai aranjat zilele în ordinea corectă!',
      });
      setOrderDaysIsComplete(true);
    } else {
      toast.error('❌ ' + t('incorrect'), {
        description: 'Ordinea nu este corectă. Încearcă din nou!',
      });
      setTimeout(() => {
        setOrderDaysUserOrder([]);
      }, 1500);
    }
  };

  // Remove day from order
  const removeOrderDay = (day: string) => {
    setOrderDaysUserOrder(orderDaysUserOrder.filter(d => d !== day));
  };

  // Generate exercise question
  const generateExerciseQuestion = (startDay: string) => {
    if (!difficulty) return;
    
    let minOffset = 2;
    let maxOffset = 7;
    
    if (difficulty === 'medium') {
      minOffset = 7;
      maxOffset = 14;
    } else if (difficulty === 'pro') {
      minOffset = 14;
      maxOffset = 100;
    }
    
    const offset = Math.floor(Math.random() * (maxOffset - minOffset + 1)) + minOffset;
    setDaysOffset(offset);
    
    setQuestionType(Math.random() > 0.5 ? 'future' : 'past');
    setCurrentDay(startDay);
    setAnsweredCorrectly(false);
    setAvailableDaysForAnswer([...WEEKDAYS]);
  };

  // Detect when wheel stops on a day
  useEffect(() => {
    if (startDayFromWheel && gameMode === 'exercise') {
      setWheelDay(startDayFromWheel);
    }
  }, [startDayFromWheel, gameMode]);

  // Generate question when difficulty is selected AND we have a wheel day
  useEffect(() => {
    if (difficulty && wheelDay && !currentDay) {
      generateExerciseQuestion(wheelDay);
    }
  }, [difficulty, wheelDay, currentDay]);
  // Accommodation mode drag handlers
  const handleDragStart = (e: React.DragEvent, day: string) => {
    setDraggedDay(day);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedDay(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropToWorkday = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedDay) return;

    if (availableDays.includes(draggedDay)) {
      setAvailableDays(prev => prev.filter(d => d !== draggedDay));
      setWorkdayZone(prev => [...prev, draggedDay]);
    } else if (weekendZone.includes(draggedDay)) {
      setWeekendZone(prev => prev.filter(d => d !== draggedDay));
      setWorkdayZone(prev => [...prev, draggedDay]);
    }
    setDraggedDay(null);
  };

  const handleDropToWeekend = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedDay) return;

    if (availableDays.includes(draggedDay)) {
      setAvailableDays(prev => prev.filter(d => d !== draggedDay));
      setWeekendZone(prev => [...prev, draggedDay]);
    } else if (workdayZone.includes(draggedDay)) {
      setWorkdayZone(prev => prev.filter(d => d !== draggedDay));
      setWeekendZone(prev => [...prev, draggedDay]);
    }
    setDraggedDay(null);
  };

  const handleDropBackToAvailable = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedDay) return;

    if (workdayZone.includes(draggedDay)) {
      setWorkdayZone(prev => prev.filter(d => d !== draggedDay));
      setAvailableDays(prev => [...prev, draggedDay]);
    } else if (weekendZone.includes(draggedDay)) {
      setWeekendZone(prev => prev.filter(d => d !== draggedDay));
      setAvailableDays(prev => [...prev, draggedDay]);
    }
    setDraggedDay(null);
  };

  const checkAccommodationAnswers = () => {
    const workdayCorrect = workdayZone.every(day => WORKDAYS.includes(day)) && 
                          workdayZone.length === WORKDAYS.length;
    const weekendCorrect = weekendZone.every(day => WEEKEND_DAYS.includes(day)) && 
                          weekendZone.length === WEEKEND_DAYS.length;

    setIsChecked(true);

    if (workdayCorrect && weekendCorrect) {
      toast.success(t('correct'), {
        description: '🎉 Bravo! Toate zilele sunt plasate corect!',
      });
    } else {
      toast.error(t('incorrect'), {
        description: 'Verifică plasarea zilelor și încearcă din nou!',
      });
    }
  };

  // Exercise mode drag handlers
  const handleExerciseDragStart = (e: React.DragEvent, day: string) => {
    if (answeredCorrectly) return;
    setDraggedDay(day);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropAnswer = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedDay || answeredCorrectly) return;

    setDroppedAnswer(draggedDay);
    setAvailableDaysForAnswer(prev => prev.filter(d => d !== draggedDay));
    setDraggedDay(null);
  };

  const handleRemoveAnswer = () => {
    if (droppedAnswer && !answeredCorrectly) {
      setAvailableDaysForAnswer(prev => [...prev, droppedAnswer]);
      setDroppedAnswer(null);
    }
  };

  const checkExerciseAnswer = () => {
    if (!droppedAnswer || !currentDay) return;

    const offset = questionType === 'past' ? -daysOffset : daysOffset;
    const correctDay = addDaysToWeekday(currentDay, offset);
    const isCorrect = droppedAnswer === correctDay;

    if (isCorrect) {
      toast.success('🎉 ' + t('correct'), {
        description: `Bravo! Răspunsul corect este ${getDayOfWeekName(correctDay, lang)}`,
      });
      setAnsweredCorrectly(true);
    } else {
      toast.error('❌ ' + t('incorrect'), {
        description: `Răspunsul corect este ${getDayOfWeekName(correctDay, lang)}`,
      });
      
      // Return day to available
      if (droppedAnswer) {
        setAvailableDaysForAnswer(prev => [...prev, droppedAnswer]);
      }
      setDroppedAnswer(null);
    }
  };

  const getDayClassName = (day: string, zone: 'workday' | 'weekend') => {
    if (!isChecked) return 'bg-primary text-primary-foreground';
    
    const isCorrect = zone === 'workday' 
      ? WORKDAYS.includes(day)
      : WEEKEND_DAYS.includes(day);
    
    return isCorrect 
      ? 'bg-green-500 text-white' 
      : 'bg-red-500 text-white';
  };

  const getZoneClassName = (zone: 'workday' | 'weekend', days: string[]) => {
    if (!isChecked || days.length === 0) return '';
    
    const allCorrect = zone === 'workday'
      ? days.every(d => WORKDAYS.includes(d)) && days.length === WORKDAYS.length
      : days.every(d => WEEKEND_DAYS.includes(d)) && days.length === WEEKEND_DAYS.length;
    
    return allCorrect ? 'border-green-500' : 'border-red-500';
  };

  // Color Match drag handlers
  const handleColorMatchDrop = (e: React.DragEvent, targetDay: string) => {
    e.preventDefault();
    if (!draggedDay || colorMatchChecked) return;

    if (!colorMatchDays.includes(draggedDay)) return;

    setColorMatchDropZones(prev => ({
      ...prev,
      [targetDay]: draggedDay
    }));
    
    setColorMatchDays(prev => prev.filter(d => d !== draggedDay));
    setDraggedDay(null);
  };

  const handleRemoveColorMatch = (zoneName: string) => {
    if (colorMatchChecked) return;
    
    const removedDay = colorMatchDropZones[zoneName];
    if (removedDay) {
      setColorMatchDays(prev => [...prev, removedDay]);
      setColorMatchDropZones(prev => ({
        ...prev,
        [zoneName]: null
      }));
    }
  };

  const checkColorMatchAnswer = () => {
    let allCorrect = true;
    WEEKDAYS.forEach(day => {
      const placedDay = colorMatchDropZones[day];
      if (placedDay !== day && placedDay !== null) {
        allCorrect = false;
      }
    });

    setColorMatchChecked(true);

    if (allCorrect && colorMatchDays.length === 0) {
      toast.success('🎉 ' + t('correct'), {
        description: 'Toate zilele sunt plasate pe culorile corecte!',
      });
    } else {
      toast.error('❌ ' + t('incorrect'), {
        description: 'Unele zile nu sunt pe culoarea corectă!',
      });
    }
  };

  // Day Number drag handlers
  const handleDayNumberDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    if (!draggedDay || dayNumberChecked) return;

    if (!dayNumberDays.includes(draggedDay)) return;

    const newSlots = [...dayNumberSlots];
    newSlots[slotIndex] = draggedDay;
    setDayNumberSlots(newSlots);
    
    setDayNumberDays(prev => prev.filter(d => d !== draggedDay));
    setDraggedDay(null);
  };

  const handleRemoveDayNumber = (slotIndex: number) => {
    if (dayNumberChecked) return;
    
    const removedDay = dayNumberSlots[slotIndex];
    if (removedDay) {
      setDayNumberDays(prev => [...prev, removedDay]);
      const newSlots = [...dayNumberSlots];
      newSlots[slotIndex] = null;
      setDayNumberSlots(newSlots);
    }
  };

  const checkDayNumberAnswer = () => {
    let allCorrect = true;
    dayNumberSlots.forEach((day, index) => {
      if (day && WEEKDAYS[index] !== day) {
        allCorrect = false;
      }
    });

    setDayNumberChecked(true);

    const filledSlots = dayNumberSlots.filter(Boolean).length;
    if (allCorrect && filledSlots === 5) {
      toast.success('🎉 ' + t('correct'), {
        description: 'Toate zilele sunt plasate corect!',
      });
    } else {
      toast.error('❌ ' + t('incorrect'), {
        description: 'Unele zile nu sunt în poziția corectă!',
      });
    }
  };


  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={() => {
            setGameMode('accommodation');
            setDifficulty(null);
            resetAccommodation();
            resetExercise();
            resetOrderDays();
          }}
          variant={gameMode === 'accommodation' ? 'default' : 'outline'}
          size="lg"
          className="flex items-center gap-2"
        >
          <BookOpen className="h-5 w-5" />
          {t('choose_day')}
        </Button>
        <Button
          onClick={() => {
            setGameMode('orderDays');
            resetOrderDays();
            resetAccommodation();
            resetExercise();
          }}
          variant={gameMode === 'orderDays' ? 'default' : 'outline'}
          size="lg"
          className="flex items-center gap-2"
        >
          <CalendarDays className="h-5 w-5" />
          {t('order_days')}
        </Button>
        <Button
          onClick={() => {
            setGameMode('exercise');
            resetAccommodation();
            resetExercise();
            resetOrderDays();
          }}
          variant={gameMode === 'exercise' ? 'default' : 'outline'}
          size="lg"
          className="flex items-center gap-2"
        >
          <Dumbbell className="h-5 w-5" />
          {t('find_day')}
        </Button>
      </div>

      {/* No mode selected */}
      {!gameMode && (
        <div className="text-center p-8 border-2 border-dashed border-muted rounded-lg">
          <p className="text-lg text-muted-foreground">{t('select_mode')}</p>
        </div>
      )}

      {/* Accommodation Mode */}
      {gameMode === 'accommodation' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">{t('accommodation')}</h3>
            <Button onClick={resetAccommodation} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Available Days */}
          <div
            onDrop={handleDropBackToAvailable}
            onDragOver={handleDragOver}
            className="min-h-[80px] p-4 border-2 border-dashed border-muted rounded-lg"
          >
            <p className="text-sm font-medium mb-3 text-muted-foreground">
              {t('available_days')}
            </p>
            <div className="flex flex-wrap gap-2">
              {availableDays.map(day => (
                <div
                  key={day}
                  draggable
                  onDragStart={(e) => handleDragStart(e, day)}
                  onDragEnd={handleDragEnd}
                  className="px-4 py-2 rounded-lg cursor-move hover:opacity-80 transition-all text-white shadow-md font-medium"
                  style={{ 
                    backgroundColor: WEEKDAY_COLORS[day],
                    borderWidth: '2px',
                    borderColor: WEEKDAY_COLORS[day]
                  }}
                >
                  {getDayOfWeekName(day, lang)}
                </div>
              ))}
            </div>
          </div>

          {/* Drop Zones */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Workday Zone */}
            <div
              onDrop={handleDropToWorkday}
              onDragOver={handleDragOver}
              className={`min-h-[150px] p-4 border-2 border-dashed rounded-lg ${getZoneClassName('workday', workdayZone)}`}
            >
              <p className="text-sm font-medium mb-3 text-center">{t('workday')}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {workdayZone.map(day => (
                  <div
                    key={day}
                    draggable
                    onDragStart={(e) => handleDragStart(e, day)}
                    onDragEnd={handleDragEnd}
                    className={`px-4 py-2 rounded-lg cursor-move hover:opacity-80 transition-all shadow-md font-medium ${
                      isChecked 
                        ? getDayClassName(day, 'workday')
                        : 'text-white'
                    }`}
                    style={!isChecked ? { 
                      backgroundColor: WEEKDAY_COLORS[day],
                      borderWidth: '2px',
                      borderColor: WEEKDAY_COLORS[day]
                    } : {}}
                  >
                    {getDayOfWeekName(day, lang)}
                  </div>
                ))}
              </div>
            </div>

            {/* Weekend Zone */}
            <div
              onDrop={handleDropToWeekend}
              onDragOver={handleDragOver}
              className={`min-h-[150px] p-4 border-2 border-dashed rounded-lg ${getZoneClassName('weekend', weekendZone)}`}
            >
              <p className="text-sm font-medium mb-3 text-center">{t('weekend')}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {weekendZone.map(day => (
                  <div
                    key={day}
                    draggable
                    onDragStart={(e) => handleDragStart(e, day)}
                    onDragEnd={handleDragEnd}
                    className={`px-4 py-2 rounded-lg cursor-move hover:opacity-80 transition-all shadow-md font-medium ${
                      isChecked 
                        ? getDayClassName(day, 'weekend')
                        : 'text-white'
                    }`}
                    style={!isChecked ? { 
                      backgroundColor: WEEKDAY_COLORS[day],
                      borderWidth: '2px',
                      borderColor: WEEKDAY_COLORS[day]
                    } : {}}
                  >
                    {getDayOfWeekName(day, lang)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!isChecked && availableDays.length === 0 && (
            <Button onClick={checkAccommodationAnswers} className="w-full" size="lg">
              {t('check_answer')}
            </Button>
          )}
        </div>
      )}

      {/* Order Days Mode - Sub-mode Selection */}
      {gameMode === 'orderDays' && !orderDaysSubMode && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center">{t('order_days')}</h3>
          <p className="text-center text-muted-foreground">
            {lang === 'ro' ? 'Alege un joc:' : 'Choose a game:'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => {
                setOrderDaysSubMode('sequence');
                resetOrderDays(true);
              }}
              variant="outline"
              size="lg"
              className="h-24 flex flex-col gap-2"
            >
              <CalendarDays className="h-8 w-8" />
              <span>{t('order_sequence')}</span>
            </Button>

            <Button
              onClick={() => {
                setOrderDaysSubMode('colorMatch');
                resetColorMatch(true);
              }}
              variant="outline"
              size="lg"
              className="h-24 flex flex-col gap-2"
            >
              <Palette className="h-8 w-8" />
              <span>{t('color_matching')}</span>
            </Button>

            <Button
              onClick={() => {
                setOrderDaysSubMode('dayNumber');
                resetDayNumber(true);
              }}
              variant="outline"
              size="lg"
              className="h-24 flex flex-col gap-2"
            >
              <Hash className="h-8 w-8" />
              <span>{t('day_number')}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Order Days Mode - Sequence Sub-game */}
      {gameMode === 'orderDays' && orderDaysSubMode === 'sequence' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">{t('order_sequence')}</h3>
            <Button onClick={() => resetOrderDays(true)} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          <div className="min-h-20 p-4 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300">
            <p className="text-sm font-medium mb-3 text-blue-900">
              {lang === 'ro' ? 'Ordinea ta:' : 'Your order:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {orderDaysUserOrder.map((day, idx) => (
                <div
                  key={idx}
                  onClick={() => !orderDaysIsComplete && removeOrderDay(day)}
                  className={`px-4 py-2 rounded-lg cursor-pointer transition-all shadow-md font-medium ${
                    orderDaysIsComplete 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'text-white hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: orderDaysIsComplete ? undefined : WEEKDAY_COLORS[day],
                  }}
                >
                  {idx + 1}. {getDayOfWeekName(day, lang)}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {orderDaysShuffled.map((day) => (
              <Button
                key={day}
                variant="outline"
                size="lg"
                onClick={() => handleOrderDayClick(day)}
                disabled={orderDaysUserOrder.includes(day) || orderDaysIsComplete}
                className={`h-16 text-white border-2 font-medium ${
                  orderDaysUserOrder.includes(day) ? 'opacity-30' : 'hover:opacity-80'
                }`}
                style={{ 
                  backgroundColor: WEEKDAY_COLORS[day],
                  borderColor: WEEKDAY_COLORS[day]
                }}
              >
                {getDayOfWeekName(day, lang)}
              </Button>
            ))}
          </div>

          <p className="text-sm text-center text-muted-foreground italic">
            {lang === 'ro' 
              ? 'Apasă pe zile în ordinea corectă: Luni → Duminică' 
              : 'Click days in correct order: Monday → Sunday'}
          </p>
        </div>
      )}

      {/* Order Days Mode - Color Match Sub-game */}
      {gameMode === 'orderDays' && orderDaysSubMode === 'colorMatch' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">{t('color_matching')}</h3>
            <Button onClick={() => resetColorMatch(true)} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          <p className="text-center text-muted-foreground">{t('drag_to_color')}</p>

          <div className="flex flex-wrap gap-3 justify-center min-h-[80px] p-4 border-2 border-dashed rounded-lg">
            {colorMatchDays.map(day => (
              <div
                key={day}
                draggable
                onDragStart={(e) => handleDragStart(e, day)}
                onDragEnd={handleDragEnd}
                className="px-6 py-3 rounded-lg cursor-move hover:scale-105 transition-all text-white shadow-lg font-bold text-lg"
                style={{ 
                  backgroundColor: WEEKDAY_COLORS[day],
                  borderWidth: '3px',
                  borderColor: 'white'
                }}
              >
                {getDayOfWeekName(day, lang)}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {WEEKDAYS.map(day => {
              const placedDay = colorMatchDropZones[day];
              const isCorrect = colorMatchChecked && placedDay === day;
              const isWrong = colorMatchChecked && placedDay && placedDay !== day;
              
              return (
                <div
                  key={day}
                  onDrop={(e) => handleColorMatchDrop(e, day)}
                  onDragOver={handleDragOver}
                  onClick={() => placedDay && handleRemoveColorMatch(day)}
                  className={`
                    h-32 rounded-xl border-4 flex items-center justify-center
                    transition-all cursor-pointer relative
                    ${!placedDay ? 'border-dashed' : 'border-solid'}
                    ${isCorrect ? 'border-green-500 scale-105' : ''}
                    ${isWrong ? 'border-red-500' : ''}
                  `}
                  style={{ 
                    backgroundColor: WEEKDAY_COLORS[day],
                    opacity: placedDay ? 1 : 0.3
                  }}
                >
                  {placedDay ? (
                    <span className="text-white font-bold text-xl">
                      {getDayOfWeekName(placedDay, lang)}
                    </span>
                  ) : (
                    <span className="text-white/50 font-semibold text-sm">
                      {getDayOfWeekName(day, lang).substring(0, 3)}
                    </span>
                  )}
                  
                  {isCorrect && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {isWrong && (
                    <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
                      <X className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!colorMatchChecked && colorMatchDays.length === 0 && (
            <Button onClick={checkColorMatchAnswer} className="w-full" size="lg">
              {t('check_answer')}
            </Button>
          )}
        </div>
      )}

      {/* Order Days Mode - Day Number Sub-game */}
      {gameMode === 'orderDays' && orderDaysSubMode === 'dayNumber' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">{t('day_number')}</h3>
            <Button onClick={() => resetDayNumber(true)} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          <p className="text-center text-muted-foreground">{t('drag_to_number')}</p>

          <div className="flex flex-wrap gap-3 justify-center min-h-[80px] p-4 border-2 border-dashed rounded-lg">
            {dayNumberDays.map(day => (
              <div
                key={day}
                draggable
                onDragStart={(e) => handleDragStart(e, day)}
                onDragEnd={handleDragEnd}
                className="px-6 py-3 rounded-lg cursor-move hover:scale-105 transition-all text-white shadow-lg font-bold"
                style={{ 
                  backgroundColor: WEEKDAY_COLORS[day],
                  borderWidth: '2px',
                  borderColor: 'white'
                }}
              >
                {getDayOfWeekName(day, lang)}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[1, 2, 3, 4, 5, 6, 7].map((num, index) => {
              const placedDay = dayNumberSlots[index];
              const correctDay = WEEKDAYS[index];
              const isCorrect = dayNumberChecked && placedDay === correctDay;
              const isWrong = dayNumberChecked && placedDay && placedDay !== correctDay;
              
              return (
                <div
                  key={num}
                  onDrop={(e) => handleDayNumberDrop(e, index)}
                  onDragOver={handleDragOver}
                  onClick={() => placedDay && handleRemoveDayNumber(index)}
                  className={`
                    relative h-28 rounded-xl border-4 flex flex-col items-center justify-center
                    transition-all cursor-pointer
                    ${!placedDay ? 'border-dashed border-gray-400 bg-gray-100' : 'border-solid'}
                    ${isCorrect ? 'border-green-500 bg-green-50' : ''}
                    ${isWrong ? 'border-red-500 bg-red-50' : ''}
                  `}
                >
                  <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {num}
                  </div>
                  
                  {placedDay ? (
                    <div
                      className="text-white font-bold px-4 py-2 rounded-lg"
                      style={{ backgroundColor: WEEKDAY_COLORS[placedDay] }}
                    >
                      {getDayOfWeekName(placedDay, lang)}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm mt-6">
                      {lang === 'ro' ? 'Trage aici' : 'Drag here'}
                    </span>
                  )}

                  {isCorrect && (
                    <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {isWrong && (
                    <div className="absolute bottom-2 right-2 bg-red-500 rounded-full p-1">
                      <X className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!dayNumberChecked && dayNumberDays.length === 0 && (
            <Button onClick={checkDayNumberAnswer} className="w-full" size="lg">
              {t('check_answer')}
            </Button>
          )}
        </div>
      )}

      {/* Exercise Mode */}
      {gameMode === 'exercise' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">{t('exercise')}</h3>
            <Button onClick={resetExercise} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              {t('new_question')}
            </Button>
          </div>

          {/* Difficulty Selection */}
          {!difficulty && (
            <div className="space-y-4">
              {/* Show wheel day if available */}
              {wheelDay && (
                <div className="text-center p-6 bg-primary/10 rounded-lg border-2 border-primary mb-4">
                  <p className="text-2xl font-bold text-primary">
                    {t('today_is')} {getDayOfWeekName(wheelDay, lang)}
                  </p>
                </div>
              )}
              
              <p className="text-center text-lg font-medium">{t('select_difficulty')}</p>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  onClick={() => setDifficulty('easy')}
                  variant="outline"
                  size="lg"
                  className="h-20 text-lg flex-col"
                >
                  <span>🟢 {t('easy')}</span>
                  <span className="text-sm text-muted-foreground">2-7 {t('days')}</span>
                </Button>
                <Button
                  onClick={() => setDifficulty('medium')}
                  variant="outline"
                  size="lg"
                  className="h-20 text-lg flex-col"
                >
                  <span>🟡 {t('medium')}</span>
                  <span className="text-sm text-muted-foreground">7-14 {t('days')}</span>
                </Button>
                <Button
                  onClick={() => setDifficulty('pro')}
                  variant="outline"
                  size="lg"
                  className="h-20 text-lg flex-col"
                >
                  <span>🔴 {t('pro')}</span>
                  <span className="text-sm text-muted-foreground">14-100 {t('days')}</span>
                </Button>
              </div>
            </div>
          )}

          {/* Exercise Content - 2 Column Layout */}
          {difficulty && (
            <div className="space-y-6">

              {/* Right Column - Result/Question */}
              <div className="space-y-6 min-h-[400px]">
                {!currentDay ? (
                  <div className="text-center p-12 border-2 border-dashed border-muted rounded-lg h-full flex items-center justify-center">
                    <div>
                      {wheelDay ? (
                        <>
                          <p className="text-3xl font-bold text-primary mb-4">
                            {t('today_is')} {getDayOfWeekName(wheelDay, lang)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Se generează întrebarea...
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-xl font-medium text-muted-foreground mb-2">
                            👈 Învârte roata din stânga
                          </p>
                          <p className="text-sm text-muted-foreground">
                            pentru a selecta ziua de start
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Question Display */}
                    <div className="p-6 bg-muted rounded-lg text-center">
                      <p className="text-lg font-semibold mb-2">
                        {t('today_is')} <span className="text-primary text-xl">{getDayOfWeekName(currentDay, lang)}</span>
                      </p>
                      <p className="text-xl font-bold">
                        {questionType === 'future' ? t('what_day_will_be_in') : t('what_day_was')} {daysOffset} {t('days')}?
                      </p>
                    </div>

                    {/* Answer Drop Zone */}
                    <div
                      onDrop={handleDropAnswer}
                      onDragOver={handleDragOver}
                      onClick={handleRemoveAnswer}
                      className={`min-h-[120px] p-6 border-4 border-dashed rounded-lg flex items-center justify-center transition-colors ${
                        droppedAnswer
                          ? answeredCorrectly
                            ? 'border-green-500 bg-green-50'
                            : 'border-primary bg-primary/5 cursor-pointer'
                          : 'border-muted'
                      }`}
                    >
                      {droppedAnswer ? (
                        <div 
                          className={`text-2xl font-bold px-6 py-3 rounded-lg shadow-md ${
                            answeredCorrectly ? 'bg-green-500 text-white' : 'text-white'
                          }`}
                          style={!answeredCorrectly ? { 
                            backgroundColor: WEEKDAY_COLORS[droppedAnswer],
                            borderWidth: '2px',
                            borderColor: WEEKDAY_COLORS[droppedAnswer]
                          } : {}}
                        >
                          {getDayOfWeekName(droppedAnswer, lang)}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-lg">{t('drag_answer_here')}</p>
                      )}
                    </div>

                    {/* Available Days for Answer */}
                    <div className="flex flex-wrap gap-3 justify-center">
                      {availableDaysForAnswer.map(day => (
                        <div
                          key={day}
                          draggable
                          onDragStart={(e) => handleExerciseDragStart(e, day)}
                          onDragEnd={handleDragEnd}
                          className={`px-5 py-3 rounded-lg text-lg font-medium text-white shadow-md ${
                            answeredCorrectly ? 'opacity-50 cursor-not-allowed' : 'cursor-move hover:opacity-80'
                          } transition-opacity`}
                          style={{ 
                            backgroundColor: WEEKDAY_COLORS[day],
                            borderWidth: '2px',
                            borderColor: WEEKDAY_COLORS[day]
                          }}
                        >
                          {getDayOfWeekName(day, lang)}
                        </div>
                      ))}
                    </div>

                    {/* Check Button */}
                    {droppedAnswer && !answeredCorrectly && (
                      <Button onClick={checkExerciseAnswer} className="w-full" size="lg">
                        {t('check_answer')}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
