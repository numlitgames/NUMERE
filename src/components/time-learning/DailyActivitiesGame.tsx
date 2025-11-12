import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getDayOfWeekName } from '@/lib/timeData';
import { useToast } from '@/hooks/use-toast';
import { Dumbbell, Book, Pencil } from 'lucide-react';

const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const ACTIVITIES = [
  { id: 'sport', label: 'Sport', icon: Dumbbell, color: 'bg-red-500' },
  { id: 'english', label: 'Engleză', icon: Book, color: 'bg-blue-500' },
  { id: 'homework', label: 'Teme', icon: Pencil, color: 'bg-green-500' },
];

interface DailyActivitiesGameProps {
  lang: string;
}

export default function DailyActivitiesGame({ lang }: DailyActivitiesGameProps) {
  const { toast } = useToast();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [dayActivities, setDayActivities] = useState<Record<string, string[]>>({});

  const handleDayClick = (day: string) => {
    if (!selectedActivity) {
      toast({
        title: 'Selectează o activitate',
        description: 'Mai întâi alege Sport, Engleză sau Teme.',
        variant: 'destructive',
      });
      return;
    }

    const currentActivities = dayActivities[day] || [];
    
    if (currentActivities.includes(selectedActivity)) {
      // Remove activity
      setDayActivities({
        ...dayActivities,
        [day]: currentActivities.filter(a => a !== selectedActivity)
      });
    } else {
      // Add activity
      setDayActivities({
        ...dayActivities,
        [day]: [...currentActivities, selectedActivity]
      });
    }
  };

  const resetGame = () => {
    setDayActivities({});
    setSelectedActivity(null);
  };

  const getActivityIcon = (activityId: string) => {
    const activity = ACTIVITIES.find(a => a.id === activityId);
    if (!activity) return null;
    const Icon = activity.icon;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Distribuie Activitățile pe Zile</h3>
        <Button variant="outline" size="sm" onClick={resetGame}>
          Reset
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Selectează o activitate și apoi apasă pe zilele când vrei să o faci.
      </p>

      {/* Activity selector */}
      <div className="grid grid-cols-3 gap-2">
        {ACTIVITIES.map((activity) => {
          const Icon = activity.icon;
          return (
            <Button
              key={activity.id}
              variant={selectedActivity === activity.id ? 'default' : 'outline'}
              onClick={() => setSelectedActivity(activity.id)}
              className={`h-16 flex flex-col gap-1 ${
                selectedActivity === activity.id ? activity.color : ''
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs">{activity.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {WEEKDAYS.map((day) => {
          const activities = dayActivities[day] || [];
          
          return (
            <div
              key={day}
              className="border-2 rounded-lg p-3 cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={() => handleDayClick(day)}
            >
              <p className="font-bold text-sm text-center mb-2">
                {getDayOfWeekName(day, lang)}
              </p>
              <div className="flex flex-wrap gap-1 justify-center min-h-[40px]">
                {activities.map((activityId, idx) => (
                  <div
                    key={idx}
                    className={`p-1.5 rounded ${
                      ACTIVITIES.find(a => a.id === activityId)?.color
                    } text-white`}
                  >
                    {getActivityIcon(activityId)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
