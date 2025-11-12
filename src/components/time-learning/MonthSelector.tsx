import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { months, getSeasonByMonth, type Month } from '@/lib/timeData';

interface MonthSelectorProps {
  selectedMonths: number[];
  targetSeason: string;
  onMonthToggle: (monthId: number) => void;
  lang: string;
}

export default function MonthSelector({ 
  selectedMonths, 
  targetSeason, 
  onMonthToggle,
  lang 
}: MonthSelectorProps) {
  
  const isCorrectMonth = (monthId: number): boolean => {
    const season = getSeasonByMonth(monthId);
    return season?.id === targetSeason;
  };

  const isSelected = (monthId: number): boolean => {
    return selectedMonths.includes(monthId);
  };

  const getButtonColor = (month: Month): string => {
    const season = getSeasonByMonth(month.id);
    if (!season) return 'bg-muted';
    
    if (isSelected(month.id)) {
      if (isCorrectMonth(month.id)) {
        return 'bg-green-500 hover:bg-green-600 text-white';
      } else {
        return 'bg-red-500 hover:bg-red-600 text-white';
      }
    }
    
    return 'bg-muted hover:bg-muted/80';
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5">
      {months.map((month) => (
        <Button
          key={month.id}
          onClick={() => onMonthToggle(month.id)}
          className={cn(
            'flex flex-col items-center gap-0.5 p-2 h-auto transition-all',
            getButtonColor(month)
          )}
          variant="outline"
        >
          <span className="text-sm font-bold">{month.roman}</span>
          <span className="text-[10px] text-center leading-tight">
            {month.t[lang] || month.t.ro}
          </span>
        </Button>
      ))}
    </div>
  );
}
