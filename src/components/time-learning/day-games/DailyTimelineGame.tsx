import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DailyTimelineGameProps {
  lang: string;
}

type Activity = {
  id: string;
  name: { ro: string; en: string };
  startHour: number;
  duration: number;
  color: string;
};

const activities: Activity[] = [
  { id: 'sleep', name: { ro: 'Somn', en: 'Sleep' }, startHour: 22, duration: 8, color: 'bg-indigo-500' },
  { id: 'breakfast', name: { ro: 'Micul Dejun', en: 'Breakfast' }, startHour: 7, duration: 1, color: 'bg-orange-500' },
  { id: 'school', name: { ro: 'Școală', en: 'School' }, startHour: 8, duration: 5, color: 'bg-blue-500' },
  { id: 'lunch', name: { ro: 'Prânz', en: 'Lunch' }, startHour: 13, duration: 1, color: 'bg-green-500' },
  { id: 'homework', name: { ro: 'Teme', en: 'Homework' }, startHour: 15, duration: 2, color: 'bg-purple-500' },
  { id: 'play', name: { ro: 'Joacă', en: 'Play' }, startHour: 17, duration: 2, color: 'bg-pink-500' },
  { id: 'dinner', name: { ro: 'Cină', en: 'Dinner' }, startHour: 19, duration: 1, color: 'bg-red-500' },
];

export default function DailyTimelineGame({ lang }: DailyTimelineGameProps) {
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);

  const toggleActivity = (activity: Activity) => {
    if (selectedActivities.find(a => a.id === activity.id)) {
      setSelectedActivities(selectedActivities.filter(a => a.id !== activity.id));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-center mb-6">
        {lang === 'ro' ? 'Timeline Zilnic' : 'Daily Timeline'}
      </h3>

      {/* Activity Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {activities.map(activity => (
          <Button
            key={activity.id}
            variant={selectedActivities.find(a => a.id === activity.id) ? "default" : "outline"}
            onClick={() => toggleActivity(activity)}
            className="h-auto py-3"
          >
            {activity.name[lang as 'ro' | 'en'] || activity.name.ro}
          </Button>
        ))}
      </div>

      {/* 24-Hour Timeline */}
      <div className="relative h-96 border-2 border-gray-300 rounded-lg p-4 bg-gradient-to-b from-blue-50 via-white to-indigo-50">
        {/* Hour markers */}
        {[...Array(24)].map((_, hour) => (
          <div
            key={hour}
            className="absolute left-0 right-0 border-t border-gray-200"
            style={{ top: `${(hour / 24) * 100}%` }}
          >
            <span className="absolute -left-2 -top-3 text-xs font-medium bg-white px-1">
              {String(hour).padStart(2, '0')}:00
            </span>
          </div>
        ))}

        {/* Activities */}
        {selectedActivities.map(activity => {
          const top = (activity.startHour / 24) * 100;
          const height = (activity.duration / 24) * 100;
          
          return (
            <div
              key={activity.id}
              className={cn(
                "absolute left-12 right-4 rounded-lg p-2 text-white font-medium text-sm shadow-md",
                activity.color
              )}
              style={{
                top: `${top}%`,
                height: `${height}%`,
              }}
            >
              <div className="flex items-center justify-between h-full">
                <span>{activity.name[lang as 'ro' | 'en'] || activity.name.ro}</span>
                <span className="text-xs">
                  {activity.startHour}:00 - {(activity.startHour + activity.duration) % 24}:00
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
