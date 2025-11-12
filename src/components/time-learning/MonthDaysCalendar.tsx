import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getDaysInMonth } from '@/lib/timeData';
import { useState } from 'react';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import MonthQuestionsQuiz from './MonthQuestionsQuiz';

interface MonthDaysCalendarProps {
  monthId: number;
  monthName: string;
  lang: string;
  onComplete?: () => void;
}

export default function MonthDaysCalendar({ monthId, monthName, lang, onComplete }: MonthDaysCalendarProps) {
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const currentYear = new Date().getFullYear();
  const correctDays = getDaysInMonth(monthId, currentYear);
  
  const dayOptions = [28, 29, 30, 31];

  const handleValidate = () => {
    if (selectedDays === null) {
      toast.error('Alege un număr de zile');
      return;
    }
    
    if (selectedDays === correctDays) {
      toast.success('Corect!');
    } else {
      toast.error('Greșit!');
    }
  };

  // Generate calendar days for display
  const calendarDays = Array.from({ length: correctDays }, (_, i) => i + 1);
  
  // Calculate weeks for layout
  const weeks: number[][] = [];
  let currentWeek: number[] = [];
  
  calendarDays.forEach((day, index) => {
    currentWeek.push(day);
    if ((index + 1) % 7 === 0 || index === calendarDays.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  return (
    <div className="space-y-1">
      {/* Month name and question on same line */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h3 className="text-sm font-bold text-primary">{monthName}</h3>
          <p className="text-xs text-muted-foreground">An: {currentYear}</p>
        </div>
        <h4 className="text-xs font-bold">Câte zile are luna?</h4>
      </div>

      {/* Calendar Display - more compact */}
      <div className="bg-muted/30 rounded-lg p-1">
        <div className="mb-1 grid grid-cols-7 gap-1 text-center font-semibold text-xs">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
            <div key={i} className="text-muted-foreground">{day}</div>
          ))}
        </div>
        
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIndex) => (
                <Button
                  key={dayIndex}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-6 w-full font-bold text-xs p-0",
                    dayIndex % 2 === 0 ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-600" : "bg-red-500 hover:bg-red-600 text-white border-red-600"
                  )}
                >
                  {day}
                </Button>
              ))}
              {/* Fill empty cells */}
              {week.length < 7 && Array.from({ length: 7 - week.length }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Day Selection Buttons with validation button */}
      <div className="grid grid-cols-5 gap-1">
        {dayOptions.map((days) => (
          <Button
            key={days}
            onClick={() => setSelectedDays(days)}
            variant={selectedDays === days ? "default" : "outline"}
            size="sm"
            className="h-8 text-base font-bold"
          >
            {days}
          </Button>
        ))}
        
        {/* Validation button with check icon */}
        <Button
          onClick={handleValidate}
          variant="default"
          size="sm"
          className="h-8 bg-green-500 hover:bg-green-600"
          disabled={selectedDays === null}
        >
          <Check className="h-5 w-5" />
        </Button>
      </div>

      {/* Weeks Quiz - Integrated */}
      <div className="mt-2 pt-2 border-t border-gray-200">
        <MonthQuestionsQuiz
          monthId={monthId}
          monthName={monthName}
          lang={lang}
          onComplete={onComplete}
        />
      </div>
    </div>
  );
}
