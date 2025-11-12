import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getDayOfWeekName } from '@/lib/timeData';
import { useToast } from '@/hooks/use-toast';
import { RotateCcw } from 'lucide-react';

const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

interface OrderDaysGameProps {
  lang: string;
}

export default function OrderDaysGame({ lang }: OrderDaysGameProps) {
  const { toast } = useToast();
  const [shuffledDays, setShuffledDays] = useState<string[]>([]);
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const shuffled = [...WEEKDAYS].sort(() => Math.random() - 0.5);
    setShuffledDays(shuffled);
    setUserOrder([]);
    setIsComplete(false);
  };

  const handleDayClick = (day: string) => {
    if (isComplete || userOrder.includes(day)) return;

    const newOrder = [...userOrder, day];
    setUserOrder(newOrder);

    if (newOrder.length === 7) {
      checkOrder(newOrder);
    }
  };

  const checkOrder = (order: string[]) => {
    const isCorrect = order.every((day, idx) => day === WEEKDAYS[idx]);
    
    if (isCorrect) {
      toast({
        title: '🎉 Corect!',
        description: 'Ai aranjat zilele în ordinea corectă!',
      });
      setIsComplete(true);
    } else {
      toast({
        title: '❌ Greșit',
        description: 'Ordinea nu este corectă. Încearcă din nou!',
        variant: 'destructive',
      });
      setTimeout(() => {
        setUserOrder([]);
      }, 1500);
    }
  };

  const removeDay = (day: string) => {
    setUserOrder(userOrder.filter(d => d !== day));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Aranjează zilele în ordine (Luni → Duminică)</h3>
        <Button variant="outline" size="sm" onClick={resetGame}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* User's ordered days */}
      <div className="min-h-20 p-3 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300">
        <p className="text-sm font-medium mb-2 text-blue-900">Ordinea ta:</p>
        <div className="flex flex-wrap gap-2">
          {userOrder.map((day, idx) => (
            <Button
              key={idx}
              variant="default"
              size="sm"
              onClick={() => !isComplete && removeDay(day)}
              className={isComplete ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              {idx + 1}. {getDayOfWeekName(day, lang)}
            </Button>
          ))}
        </div>
      </div>

      {/* Available days */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {shuffledDays.map((day) => (
          <Button
            key={day}
            variant="outline"
            size="lg"
            onClick={() => handleDayClick(day)}
            disabled={userOrder.includes(day) || isComplete}
            className={`h-16 ${userOrder.includes(day) ? 'opacity-30' : ''}`}
          >
            {getDayOfWeekName(day, lang)}
          </Button>
        ))}
      </div>
    </div>
  );
}
