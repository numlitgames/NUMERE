import timeData from "../../data/time-learning.json";

export type Season = {
  id: string;
  order: number;
  months: number[];
  colors: string[];
  temperature_range: number[];
  weather: string[];
  activities: string[];
  clothing: string[];
  t: Record<string, string>;
};

export type Month = {
  id: number;
  roman: string;
  t: Record<string, string>;
};

export type TimeProgress = {
  level: number;
  currentStep: number;
  completedSeasons: string[];
  seasonProgress: {
    [seasonId: string]: {
      monthsSelected: boolean;
      clothingMatched: boolean;
      temperatureSet: boolean;
      romanNumeralsMatched: boolean;
      activitiesSelected: boolean;
    };
  };
  lastActivity: string;
};

export const seasons = timeData.seasons as Season[];
export const months = timeData.months as Month[];
export const ui = timeData.ui as any;
export const weekDays = (timeData as any).weekDays as Record<string, Record<string, string>>;

export function getSeasonById(id: string): Season | undefined {
  return seasons.find(s => s.id === id);
}

export function getMonthById(id: number): Month | undefined {
  return months.find(m => m.id === id);
}

export function getSeasonByMonth(monthId: number): Season | undefined {
  return seasons.find(s => s.months.includes(monthId));
}

// Get translation string for a specific key
export function getTranslation(section: string, key: string, lang: string): string {
  const sectionData = ui[key];
  if (!sectionData) return key;
  
  // If it's a direct translation object with language keys
  if (typeof sectionData === 'object' && sectionData[lang]) {
    return sectionData[lang];
  }
  
  // Fallback to Romanian
  if (typeof sectionData === 'object' && sectionData['ro']) {
    return sectionData['ro'];
  }
  
  return key;
}

// Get nested translation object (like levelNames)
export function getTranslationObject(key: string): any {
  return ui[key] || {};
}

// LocalStorage helpers
export function saveProgress(progress: TimeProgress): void {
  localStorage.setItem('time_learning_progress', JSON.stringify(progress));
}

export function loadProgress(): TimeProgress | null {
  const saved = localStorage.getItem('time_learning_progress');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved progress:', e);
      return null;
    }
  }
  return null;
}

export function createDefaultProgress(): TimeProgress {
  return {
    level: 1,
    currentStep: 1,
    completedSeasons: [],
    seasonProgress: {},
    lastActivity: new Date().toISOString()
  };
}

export function getDaysInMonth(monthId: number, year: number = new Date().getFullYear()): number {
  // monthId is 1-12
  // JavaScript Date month is 0-11, so we use monthId directly which will give us the last day of monthId
  return new Date(year, monthId, 0).getDate();
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// Get day of week name in specified language
export function getDayOfWeekName(dayKey: string, lang: string): string {
  return weekDays[dayKey]?.[lang] || weekDays[dayKey]?.ro || dayKey;
}

// Add days to a weekday and return the resulting weekday
export function addDaysToWeekday(currentDay: string, daysToAdd: number): string {
  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const currentIndex = weekDays.indexOf(currentDay);
  
  if (currentIndex === -1) return 'monday';
  
  // Formula corectă care gestionează și valori negative
  const newIndex = ((currentIndex + daysToAdd) % 7 + 7) % 7;
  return weekDays[newIndex];
}

// Get weather symbols for a season
export function getWeatherSymbolsForSeason(seasonId: string): string[] {
  const season = getSeasonById(seasonId);
  return season?.weather || [];
}

// Get clothing items for a season
export function getClothingForSeason(seasonId: string): string[] {
  const season = getSeasonById(seasonId);
  return season?.clothing || [];
}

// Generate temperature options (2 false + 1 correct)
export function getTemperatureOptions(correctRange: number[]): number[][] {
  const [min, max] = correctRange;
  const options: number[][] = [[min, max]];
  
  // Generate false options
  options.push([min - 10, max - 10]);
  options.push([min + 10, max + 10]);
  
  // Shuffle
  return options.sort(() => Math.random() - 0.5);
}

// Get number of weeks in a month (always 4-5 for educational purposes)
export function getWeeksInMonth(monthId: number): string {
  return "4-5";
}

// Calendar types and functions for WeekInMonthGame
export interface CalendarDay {
  date: number;
  dayOfWeek: number; // 0-6 (0 = Sunday or Monday depending on locale)
  isCurrentMonth: boolean;
}

export interface CalendarWeek {
  weekNumber: number;
  days: CalendarDay[];
}

// Generate calendar data for a specific month and year
export function generateCalendarData(
  monthId: number,
  year: number,
  lang: string = 'ro'
): CalendarWeek[] {
  // For Romanian (ro), week starts on Monday (1)
  // For English (en), week starts on Sunday (0)
  const weekStartsOnMonday = lang === 'ro';
  
  const firstDay = new Date(year, monthId - 1, 1);
  const lastDay = new Date(year, monthId, 0);
  const daysInMonth = lastDay.getDate();
  
  // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
  let firstDayOfWeek = firstDay.getDay();
  
  // Adjust for Monday start
  if (weekStartsOnMonday) {
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  }
  
  const weeks: CalendarWeek[] = [];
  let currentWeek: CalendarDay[] = [];
  let weekNumber = 1;
  
  // Add empty days from previous month
  for (let i = 0; i < firstDayOfWeek; i++) {
    const prevMonthLastDay = new Date(year, monthId - 1, 0).getDate();
    const dayDate = prevMonthLastDay - (firstDayOfWeek - i - 1);
    currentWeek.push({
      date: dayDate,
      dayOfWeek: i,
      isCurrentMonth: false
    });
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayOfWeek = (firstDayOfWeek + day - 1) % 7;
    
    currentWeek.push({
      date: day,
      dayOfWeek,
      isCurrentMonth: true
    });
    
    // Week is complete (7 days)
    if (currentWeek.length === 7) {
      weeks.push({
        weekNumber,
        days: [...currentWeek]
      });
      currentWeek = [];
      weekNumber++;
    }
  }
  
  // Add remaining days from next month if needed
  if (currentWeek.length > 0) {
    let nextMonthDay = 1;
    while (currentWeek.length < 7) {
      currentWeek.push({
        date: nextMonthDay,
        dayOfWeek: currentWeek.length,
        isCurrentMonth: false
      });
      nextMonthDay++;
    }
    weeks.push({
      weekNumber,
      days: currentWeek
    });
  }
  
  return weeks;
}

// Get localized day name (short version for calendar header)
export function getDayNameShort(dayIndex: number, lang: string = 'ro'): string {
  const weekStartsOnMonday = lang === 'ro';
  
  // Adjust index if week starts on Monday
  const adjustedIndex = weekStartsOnMonday ? (dayIndex + 1) % 7 : dayIndex;
  
  const daysRo = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  const daysEn = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  return lang === 'ro' ? daysRo[adjustedIndex] : daysEn[adjustedIndex];
}

// Add days to a date
export function addDaysToDate(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
