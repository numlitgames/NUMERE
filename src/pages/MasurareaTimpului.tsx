import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarProvider } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameControls from "@/components/educational/GameControls";
import ZoomControls from "@/components/educational/ZoomControls";
import Timer from "@/components/educational/Timer";
import ProgressBar from "@/components/educational/ProgressBar";
import ShopPromoBox from "@/components/educational/ShopPromoBox";
import { Home, Info, Volume2, Clock, CalendarClock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import SeasonWheel from "@/components/time-learning/SeasonWheel";
import MonthSelector from "@/components/time-learning/MonthSelector";
import MonthDaysCalendar from "@/components/time-learning/MonthDaysCalendar";
import MonthOrderGame from "@/components/time-learning/MonthOrderGame";
import GuessMonthGame from "@/components/time-learning/GuessMonthGame";
import SeasonActivities from "@/components/time-learning/SeasonActivities";
import TemperatureQuiz from '@/components/time-learning/TemperatureQuiz';
import WeatherSymbolsQuiz from '@/components/time-learning/WeatherSymbolsQuiz';
import ClothingSelector from '@/components/time-learning/ClothingSelector';
import WeekWheel from '@/components/time-learning/WeekWheel';

import WorkdayVsWeekendGame from '@/components/time-learning/WorkdayVsWeekendGame';
import WeekInMonthGame from '@/components/time-learning/WeekInMonthGame';
import DailyActivitiesGame from '@/components/time-learning/DailyActivitiesGame';
import EnergyBarometerGame from '@/components/time-learning/EnergyBarometerGame';
import WhatDayGame from '@/components/time-learning/WhatDayGame';
import DayNightClock from '@/components/time-learning/DayNightClock';
import DayGames from '@/components/time-learning/DayGames';
import ClockDisplay from '@/components/time-learning/ClockDisplay';
import HourGames from '@/components/time-learning/HourGames';
import { getTranslation, getTranslationObject, months, seasons, getSeasonById } from "@/lib/timeData";
import { Calendar, Activity, Battery, Puzzle, CalendarDays, ArrowUpDown, HelpCircle } from 'lucide-react';

type QuizType = 'temperature' | 'weather' | 'clothing' | null;

// Language definitions
const languages = {
  ro: { flag: "🇷🇴", name: "Română" },
  en: { flag: "🇬🇧", name: "English" },
  de: { flag: "🇩🇪", name: "Deutsch" },
  fr: { flag: "🇫🇷", name: "Français" },
  es: { flag: "🇪🇸", name: "Español" },
  it: { flag: "🇮🇹", name: "Italiano" },
  hu: { flag: "🇭🇺", name: "Magyar" },
  cs: { flag: "🇨🇿", name: "Čeština" },
  pl: { flag: "🇵🇱", name: "Polski" },
  bg: { flag: "🇧🇬", name: "Български" },
  ru: { flag: "🇷🇺", name: "Русский" },
  ar: { flag: "🇸🇦", name: "العربية" },
  ja: { flag: "🇯🇵", name: "日本語" },
  zh: { flag: "🇨🇳", name: "中文" },
  pt: { flag: "🇵🇹", name: "Português" },
  tr: { flag: "🇹🇷", name: "Türkçe" }
};

const levels = ['1', '2', '3'];

const weekGameButtons = [
  { id: 'workday' as const, icon: Activity, label: { ro: 'Zilele Săptămânii', en: 'Days of Week', de: 'Wochentage', fr: 'Jours de la Semaine', es: 'Días de la Semana', it: 'Giorni della Settimana', hu: 'A Hét Napjai', pl: 'Dni Tygodnia', bg: 'Дните от Седмицата', ru: 'Дни Недели', ar: 'أيام الأسبوع', el: 'Μέρες της Εβδομάδας', tr: 'Haftanın Günleri' } },
  { id: 'whatDay' as const, icon: CalendarClock, label: { ro: 'Ce Zi?', en: 'What Day?', de: 'Welcher Tag?', fr: 'Quel Jour?', es: '¿Qué Día?', it: 'Che Giorno?', hu: 'Melyik Nap?', pl: 'Jaki Dzień?', bg: 'Кой Ден?', ru: 'Какой День?', ar: 'أي يوم؟', el: 'Ποια Μέρα;', tr: 'Hangi Gün?' } },
  { id: 'weekInMonth' as const, icon: Calendar, label: { ro: 'Săptămâna în Lună', en: 'Week in Month', de: 'Woche im Monat', fr: 'Semaine du Mois', es: 'Semana del Mes', it: 'Settimana del Mese', hu: 'Hét a Hónapban', pl: 'Tydzień w Miesiącu', bg: 'Седмица в Месеца', ru: 'Неделя в Месяце', ar: 'الأسبوع في الشهر', el: 'Εβδομάδα του Μήνα', tr: 'Ayın Haftası' } },
  { id: 'activities' as const, icon: Puzzle, label: { ro: 'Activități Zilnice', en: 'Daily Activities', de: 'Tägliche Aktivitäten', fr: 'Activités Quotidiennes', es: 'Actividades Diarias', it: 'Attività Quotidiane', hu: 'Napi Tevékenységek', pl: 'Codzienne Aktywności', bg: 'Дневни Дейности', ru: 'Ежедневные Действия', ar: 'الأنشطة اليومية', el: 'Καθημερινές Δραστηριότητες', tr: 'Günlük Aktiviteler' } },
  { id: 'energy' as const, icon: Battery, label: { ro: 'Energie Săptămânală', en: 'Weekly Energy', de: 'Wöchentliche Energie', fr: 'Énergie Hebdomadaire', es: 'Energía Semanal', it: 'Energia Settimanale', hu: 'Heti Energia', pl: 'Energia Tygodniowa', bg: 'Седмична Енергия', ru: 'Еженедельная Энергия', ar: 'الطاقة الأسبوعية', el: 'Εβδομαδιαία Ενέργεια', tr: 'Haftalık Enerji' } },
];

export default function MasurareaTimpului() {
  const navigate = useNavigate();
  const location = useLocation();
  const [lang, setLang] = useState('ro');
  const [selectedLevel, setSelectedLevel] = useState('1');
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [mode, setMode] = useState<'season' | 'month' | 'week' | 'day' | 'hour'>('season');
  const [activeSeasonQuiz, setActiveSeasonQuiz] = useState<QuizType>(null);
  const [activeMonthGame, setActiveMonthGame] = useState<'calendar' | 'order' | 'guess' | null>('calendar');
  const [activeWeekGame, setActiveWeekGame] = useState<'workday' | 'whatDay' | 'weekInMonth' | 'activities' | 'energy' | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreenGame, setIsFullScreenGame] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentDate] = useState(new Date());
  const [completedQuizzes, setCompletedQuizzes] = useState({
    temperature: false,
    weather: false,
    clothing: false,
    monthQuestions: false,
  });

  // Handle URL parameters to set initial tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab') || params.get('mode');
    if (tab === 'hour') setMode('hour');
    if (tab === 'day') setMode('day');
    if (tab === 'week') setMode('week');
    if (tab === 'month') setMode('month');
    if (tab === 'season') setMode('season');
  }, [location.search]);

  const handleSeasonSelect = (seasonId: string) => {
    setSelectedSeason(seasonId);
    setProgress(prev => Math.min(prev + 1, 10));
  };

  const handleMonthSelect = (monthId: number) => {
    setSelectedMonth(monthId);
    setProgress(prev => Math.min(prev + 1, 10));
  };

  const handleWheelMonthSelect = (monthId: number) => {
    setSelectedMonth(monthId);
    setProgress(prev => Math.min(prev + 1, 10));
  };

  const handleMonthsSelect = (months: number[]) => {
    setSelectedMonths(months);
  };

  const handleGamePlay = () => {
    setIsPlaying(true);
    setIsTimerRunning(true);
  };

  const handleGamePause = () => {
    setIsPlaying(false);
    setIsTimerRunning(false);
  };

  const handleGameReset = () => {
    setSelectedSeason(null);
    setSelectedMonth(null);
    setSelectedMonths([]);
    setProgress(0);
    setIsTimerRunning(false);
    setIsPlaying(false);
  };

  const handleGameShuffle = () => {
    // Shuffle functionality - can be extended
    handleGameReset();
  };

  const handleModeChange = (newMode: string) => {
    setMode(newMode as 'season' | 'month' | 'week' | 'day' | 'hour');
    setSelectedSeason(null);
    setSelectedMonth(null);
    setSelectedMonths([]);
    setCompletedQuizzes({
      temperature: false,
      weather: false,
      clothing: false,
      monthQuestions: false,
    });
    setProgress(0);
  };

  const handleQuizComplete = (quizType: 'temperature' | 'weather' | 'clothing' | 'monthQuestions') => {
    setCompletedQuizzes(prev => ({ ...prev, [quizType]: true }));
    setProgress(prev => Math.min(prev + 2, 10));
  };

  const levelNames = getTranslationObject('levelNames');
  
  const t = {
    pageTitle: getTranslation('ui', 'page_title', lang),
    language: getTranslation('ui', 'language', lang),
    level: getTranslation('ui', 'level', lang),
    levelName: levelNames[selectedLevel]?.[lang] || levelNames[selectedLevel]?.['ro'] || `Nivel ${selectedLevel}`,
    instructions: getTranslation('ui', 'instructions', lang),
    instructionsText: getTranslation('ui', 'instructionsText', lang),
    spinWheel: getTranslation('ui', 'spin_wheel', lang),
    modeSeason: getTranslation('ui', 'mode_season', lang),
    modeMonth: getTranslation('ui', 'mode_month', lang),
    modeWeek: getTranslation('ui', 'mode_week', lang),
    modeDay: getTranslation('ui', 'mode_day', lang),
    modeHour: getTranslation('ui', 'mode_hour', lang),
    selectSeason: getTranslation('ui', 'select_season', lang),
    selectMonths: getTranslation('ui', 'select_months', lang),
    daysInMonth: getTranslation('ui', 'days_in_month', lang),
  };

  const selectedSeasonData = selectedSeason ? getSeasonById(selectedSeason) : null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Sidebar - 180px wide (reduced by 30%) */}
        <Sidebar className="w-44">
          <SidebarContent>
            {/* Language Selector - Green border */}
            <SidebarGroup className="mt-4">
              <SidebarGroupContent>
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-1">
                  <div className="bg-white border-2 border-green-400 rounded-lg p-1 mb-1">
                    <div className="text-sm font-bold text-green-600 text-center">
                      {t.language}
                    </div>
                  </div>
                  <Select value={lang} onValueChange={setLang}>
                    <SelectTrigger className="w-full h-6 text-xs border-green-300 focus:border-green-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50 max-h-60 overflow-y-auto">
                      {Object.entries(languages).map(([code, { flag, name }]) => (
                        <SelectItem key={code} value={code} className="text-sm">
                          <span className="flex items-center gap-2">
                            <span>{flag}</span>
                            <span>{name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Level Selector - Violet border */}
            <SidebarGroup className="mt-1">
              <SidebarGroupContent>
                <div className="bg-violet-50 border-2 border-violet-300 rounded-lg p-1">
                  <div className="bg-white border-2 border-violet-400 rounded-lg p-1 mb-1">
                    <div className="text-sm font-bold text-violet-600 text-center">
                      {t.level}
                    </div>
                  </div>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-full h-6 text-xs border-violet-300 focus:border-violet-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {levels.map((level) => {
                        const levelName = levelNames[level]?.[lang] || levelNames[level]?.['ro'] || `Nivel ${level}`;
                        return (
                          <SelectItem key={level} value={level} className="text-sm">
                            {levelName}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Shop Promo Box */}
            <div className="mt-auto p-4">
              <ShopPromoBox language={lang} />
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header - identical to Ma Joc Cu Fractii */}
          <header className="bg-white border-b shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
                  title="Acasă"
                >
                  <Home className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full">
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800">{t.pageTitle}</h1>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Info className="h-4 w-4" />
                      {t.instructions}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t.instructions}</DialogTitle>
                      <DialogDescription>
                        {t.instructionsText}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                {/* Progress Bar */}
                <ProgressBar 
                  current={progress} 
                  total={10} 
                  className="mx-4"
                  showCelebration={progress === 10}
                />
              </div>

              <div className="flex items-center gap-4">
                {/* Zoom Controls */}
                <ZoomControls 
                  zoom={zoom} 
                  onZoomChange={setZoom}
                />

                {/* Timer */}
                <Timer 
                  isRunning={isTimerRunning}
                  className="bg-gray-100"
                />

                {/* Game Controls */}
                <GameControls
                  isPlaying={isPlaying}
                  onPlay={handleGamePlay}
                  onPause={handleGamePause}
                  onRepeat={handleGameReset}
                  onShuffle={handleGameShuffle}
                />

                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-gray-100 transition-colors"
                  title="Sunet"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Game Area */}
          <main className="flex-1 p-6 overflow-auto" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}>
            <div className="w-full max-w-7xl mx-auto">
              {/* Tabs for all modes */}
              <Tabs value={mode} onValueChange={handleModeChange} className="w-full mb-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="season">{t.modeSeason}</TabsTrigger>
                  <TabsTrigger value="month">{t.modeMonth}</TabsTrigger>
                  <TabsTrigger value="week">{t.modeWeek}</TabsTrigger>
                  <TabsTrigger value="day">{t.modeDay}</TabsTrigger>
                  <TabsTrigger value="hour">{t.modeHour}</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Season Mode - Optimized Layout */}
            {mode === 'season' && (
              <div className="grid grid-cols-2 gap-6">
                {/* Left: Wheel + Toggle Buttons */}
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <SeasonActivities
                      selectedSeason={selectedSeason}
                      onSeasonSelect={handleSeasonSelect}
                      onSpinComplete={() => {}}
                      isSpinning={false}
                      activeQuiz={activeSeasonQuiz}
                      onQuizSelect={setActiveSeasonQuiz}
                      lang={lang}
                    />
                  </CardContent>
                </Card>

                {/* Right: Month Selector + Active Quiz */}
                <Card className="shadow-lg">
                  <CardContent className="p-6 space-y-4">
                    {/* Month Selector - Top */}
                    {selectedSeason ? (
                      <div>
                        <h3 className="text-sm font-bold text-center mb-2">
                          Alege Lunile Corecte ale {selectedSeasonData?.t[lang] || selectedSeasonData?.t.ro || 'anotimpului'}
                        </h3>
                        <MonthSelector
                          targetSeason={selectedSeason}
                          selectedMonths={selectedMonths}
                          onMonthToggle={(monthId) => {
                            const newMonths = selectedMonths.includes(monthId)
                              ? selectedMonths.filter(m => m !== monthId)
                              : [...selectedMonths, monthId];
                            handleMonthsSelect(newMonths);
                          }}
                          lang={lang}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">{t.spinWheel}</p>
                        <p className="text-xs mt-2">{t.selectSeason}</p>
                      </div>
                    )}

                    {/* Active Quiz - Bottom */}
                    {activeSeasonQuiz && selectedSeasonData && (
                      <div className="pt-4 border-t border-gray-200">
                        {activeSeasonQuiz === 'temperature' && (
                          <TemperatureQuiz
                            season={selectedSeasonData}
                            lang={lang}
                            onComplete={() => {
                              handleQuizComplete('temperature');
                              setActiveSeasonQuiz(null);
                            }}
                          />
                        )}
                        {activeSeasonQuiz === 'weather' && (
                          <WeatherSymbolsQuiz
                            season={selectedSeasonData}
                            lang={lang}
                            onComplete={() => {
                              handleQuizComplete('weather');
                              setActiveSeasonQuiz(null);
                            }}
                          />
                        )}
                        {activeSeasonQuiz === 'clothing' && (
                          <ClothingSelector
                            season={selectedSeasonData}
                            lang={lang}
                            onComplete={() => {
                              handleQuizComplete('clothing');
                              setActiveSeasonQuiz(null);
                            }}
                          />
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

              {/* Month Mode - 2 Column Layout */}
              {mode === 'month' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <Card className="shadow-lg">
                      <CardContent className="p-6">
                        <SeasonWheel
                          selectedSeason={selectedSeason}
                          onSeasonSelect={handleSeasonSelect}
                          onMonthSelect={handleWheelMonthSelect}
                          mode={mode}
                          lang={lang}
                        />
                      </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                      <CardContent className="p-6">
                        {/* Month Game Selection Buttons */}
                        <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b">
                          <Button
                            variant={activeMonthGame === 'calendar' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveMonthGame('calendar')}
                            className="h-auto py-2 px-2 flex flex-col items-center gap-1"
                          >
                            <CalendarDays className="h-4 w-4" />
                            <span className="text-xs text-center leading-tight">
                              {getTranslation('ui', 'calendarDays', lang)}
                            </span>
                          </Button>
                          <Button
                            variant={activeMonthGame === 'order' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveMonthGame('order')}
                            className="h-auto py-2 px-2 flex flex-col items-center gap-1"
                          >
                            <ArrowUpDown className="h-4 w-4" />
                            <span className="text-xs text-center leading-tight">
                              {getTranslation('ui', 'putInOrder', lang)}
                            </span>
                          </Button>
                          <Button
                            variant={activeMonthGame === 'guess' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveMonthGame('guess')}
                            className="h-auto py-2 px-2 flex flex-col items-center gap-1"
                          >
                            <HelpCircle className="h-4 w-4" />
                            <span className="text-xs text-center leading-tight">
                              {getTranslation('ui', 'guessTheMonth', lang)}
                            </span>
                          </Button>
                        </div>

                        {/* Render Active Game */}
                        {activeMonthGame === 'calendar' && selectedMonth ? (() => {
                          const month = months.find(m => m.id === selectedMonth);
                          const monthName = month?.t[lang] || month?.t.ro || '';
                          return (
                            <div>
                              <h3 className="text-lg font-bold text-center mb-4">{t.daysInMonth}</h3>
                              <MonthDaysCalendar
                                monthId={selectedMonth}
                                monthName={monthName}
                                lang={lang}
                                onComplete={() => handleQuizComplete('monthQuestions')}
                              />
                            </div>
                          );
                        })() : activeMonthGame === 'calendar' && !selectedMonth ? (
                          <div className="text-center py-8 text-gray-500">
                            <p className="text-lg">{t.spinWheel}</p>
                            <p className="text-sm mt-2">Selectează o lună</p>
                          </div>
                        ) : null}

                        {activeMonthGame === 'order' && (
                          <MonthOrderGame lang={lang} />
                        )}

                        {activeMonthGame === 'guess' && (
                          <GuessMonthGame lang={lang} />
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Week Mode - 2 Column Layout */}
              {mode === 'week' && (
                <div className="grid grid-cols-2 gap-6">
                  {/* Left: Week Wheel + Game Buttons */}
                  <Card className="shadow-lg">
                    <CardContent className="p-6">
                      {/* Week Wheel */}
                      <WeekWheel
                        selectedDay={selectedDay}
                        onDaySelect={setSelectedDay}
                        lang={lang}
                      />
                      
                      {/* Game Buttons Below Wheel */}
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t">
                        {weekGameButtons.map(({ id, icon: Icon, label }) => (
                          <Button
                            key={id}
                            variant={activeWeekGame === id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveWeekGame(activeWeekGame === id ? null : id)}
                            className="h-auto py-2 px-2 flex flex-col items-center gap-1"
                          >
                            <Icon className="h-4 w-4" />
                            <span className="text-xs text-center leading-tight">
                              {label[lang as keyof typeof label] || label.ro}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Right: Adaptive Game Zones */}
                  <div className="flex flex-col gap-6">
                    {activeWeekGame === 'workday' ? (
                      // Workday game only - Single card
                      <Card className="shadow-lg">
                        <CardContent className="p-6">
                          <WorkdayVsWeekendGame 
                            lang={lang} 
                            startDayFromWheel={selectedDay} 
                            onRequestReset={() => setSelectedDay(null)} 
                          />
                        </CardContent>
                      </Card>
                    ) : activeWeekGame ? (
                      // Other games - Full height single card
                      <Card className="shadow-lg h-full">
                        <CardContent className="p-6 h-full overflow-auto">
                          {activeWeekGame === 'whatDay' && <WhatDayGame lang={lang} />}
                          {activeWeekGame === 'weekInMonth' && <WeekInMonthGame lang={lang} />}
                          {activeWeekGame === 'activities' && <DailyActivitiesGame lang={lang} />}
                          {activeWeekGame === 'energy' && <EnergyBarometerGame lang={lang} />}
                        </CardContent>
                      </Card>
                    ) : (
                      // No game selected - Show placeholder
                      <Card className="shadow-lg">
                        <CardContent className="p-6">
                          <div className="text-center py-8 text-muted-foreground">
                            <p className="text-sm">
                              {lang === 'ro' ? 'Selectează un joc din stânga' :
                               lang === 'en' ? 'Select a game from the left' :
                               lang === 'de' ? 'Wähle ein Spiel von links' :
                               lang === 'fr' ? 'Sélectionnez un jeu à gauche' :
                               'Selectează un joc din stânga'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}

              {/* Day Mode */}
              {mode === 'day' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
                  {/* Stânga: Ceasurile - ascuns când e full-screen */}
                  {!isFullScreenGame && (
                    <Card className="shadow-lg">
                      <CardContent className="p-6">
                        <DayNightClock lang={lang} />
                      </CardContent>
                    </Card>
                  )}

                  {/* Dreapta: Jocurile - ocupa tot spațiul când e full-screen */}
                  <Card className={`shadow-lg ${isFullScreenGame ? 'lg:col-span-2' : ''}`}>
                    <CardContent className="p-6">
                      <DayGames 
                        lang={lang} 
                        onFullScreenGame={setIsFullScreenGame}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Hour Mode */}
              {mode === 'hour' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  {/* Clocks Display */}
                  <Card className="shadow-lg">
                    <CardContent className="p-6">
                      <ClockDisplay lang={lang} />
                    </CardContent>
                  </Card>

                  {/* Games Coming Soon */}
                  <Card className="shadow-lg border-2 border-dashed border-blue-300 bg-blue-50/50">
                    <CardContent className="p-8 text-center">
                      <Clock className="h-16 w-16 mx-auto mb-4 text-blue-400" />
                      <h3 className="text-xl font-semibold mb-2 text-blue-900">
                        {lang === 'ro' ? 'Jocuri în Construcție' : 'Games Coming Soon'}
                      </h3>
                      <p className="text-blue-700">
                        {lang === 'ro' 
                          ? 'Jocurile pentru învățarea orelor vor fi disponibile în curând!'
                          : 'Hour learning games will be available soon!'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
