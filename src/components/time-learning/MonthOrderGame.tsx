import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RotateCcw, Check } from 'lucide-react';
import { months, getSeasonByMonth } from '@/lib/timeData';
import { getTranslation } from '@/lib/timeData';

interface MonthOrderGameProps {
  lang: string;
}

export default function MonthOrderGame({ lang }: MonthOrderGameProps) {
  const { toast } = useToast();
  const [selectedMonths, setSelectedMonths] = useState<typeof months>([]);
  const [shuffledMonths, setShuffledMonths] = useState<typeof months>([]);
  const [droppedMonths, setDroppedMonths] = useState<(typeof months[0] | null)[]>([]);
  const [draggedMonth, setDraggedMonth] = useState<typeof months[0] | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    // Select 8-10 random months
    const count = Math.floor(Math.random() * 3) + 8; // 8, 9, or 10
    const shuffled = [...months].sort(() => Math.random() - 0.5).slice(0, count);
    const sorted = [...shuffled].sort((a, b) => a.id - b.id);
    
    setSelectedMonths(sorted);
    setShuffledMonths([...shuffled].sort(() => Math.random() - 0.5));
    setDroppedMonths(new Array(sorted.length).fill(null));
    setIsCompleted(false);
  };

  const handleDragStart = (month: typeof months[0]) => {
    setDraggedMonth(month);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (!draggedMonth) return;

    const targetMonth = selectedMonths[index];
    const isCorrect = draggedMonth.id === targetMonth.id;

    if (isCorrect) {
      const newDropped = [...droppedMonths];
      newDropped[index] = draggedMonth;
      setDroppedMonths(newDropped);
      
      // Remove from shuffled list
      setShuffledMonths(shuffledMonths.filter(m => m.id !== draggedMonth.id));

      // Check if all completed
      if (newDropped.every(m => m !== null)) {
        setIsCompleted(true);
        toast({
          title: '🎉 ' + getTranslation('ui', 'correct', lang),
          description: getTranslation('ui', 'monthOrderComplete', lang),
        });
      }
    } else {
      toast({
        title: '❌ ' + getTranslation('ui', 'incorrect', lang),
        description: getTranslation('ui', 'wrongMonthPosition', lang),
        variant: 'destructive',
      });
    }

    setDraggedMonth(null);
  };

  const handleRemoveMonth = (index: number) => {
    const month = droppedMonths[index];
    if (!month || isCompleted) return;

    const newDropped = [...droppedMonths];
    newDropped[index] = null;
    setDroppedMonths(newDropped);
    setShuffledMonths([...shuffledMonths, month].sort(() => Math.random() - 0.5));
  };

  const getSeasonColor = (monthId: number) => {
    const season = getSeasonByMonth(monthId);
    return season?.colors[0] || '#CBD5E1';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">
          {getTranslation('ui', 'monthOrderGame', lang)}
        </h3>
        <Button variant="outline" size="sm" onClick={resetGame}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        {getTranslation('ui', 'dragMonthsInOrder', lang)}
      </p>

      {/* Drop Zones */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 min-h-40">
        {selectedMonths.map((month, idx) => {
          const droppedMonth = droppedMonths[idx];
          const borderColor = getSeasonColor(month.id);
          
          return (
            <div
              key={month.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(idx)}
              className={`
                relative border-2 border-dashed rounded-lg p-3 text-center transition-all
                ${droppedMonth 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-gray-50 hover:bg-gray-100'
                }
              `}
              style={{ 
                borderColor: droppedMonth ? '#22c55e' : borderColor,
                borderWidth: '2px'
              }}
            >
              {droppedMonth ? (
                <div 
                  onClick={() => handleRemoveMonth(idx)}
                  className="cursor-pointer"
                >
                  <div className="text-xl font-bold flex items-center justify-center gap-1">
                    <Check className="h-4 w-4 text-green-600" />
                    {droppedMonth.roman}
                  </div>
                  <div className="text-xs mt-1">
                    {droppedMonth.t[lang] || droppedMonth.t.ro}
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">
                  <div className="text-2xl font-bold opacity-30">{month.roman}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Draggable Months */}
      {shuffledMonths.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">
            {getTranslation('ui', 'availableMonths', lang)}:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {shuffledMonths.map((month) => (
              <Card
                key={month.id}
                draggable
                onDragStart={() => handleDragStart(month)}
                className="p-3 cursor-grab active:cursor-grabbing bg-gray-100 border-2 border-gray-400 hover:bg-gray-200 transition-colors"
              >
                <div className="text-center">
                  <div className="text-lg font-bold">{month.roman}</div>
                  <div className="text-xs">{month.t[lang] || month.t.ro}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="text-center py-4 bg-green-50 rounded-lg border-2 border-green-300">
          <p className="text-lg font-bold text-green-700">
            🎉 {getTranslation('ui', 'wellDone', lang)}!
          </p>
        </div>
      )}
    </div>
  );
}
