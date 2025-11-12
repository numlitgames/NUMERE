import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getTranslation } from "@/lib/timeData";
import { Calendar } from "lucide-react";

interface DayExercisesProps {
  lang: string;
  currentDate: Date;
}

export default function DayExercises({ lang, currentDate }: DayExercisesProps) {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const t = {
    todayIs: getTranslation('ui', 'today_is', lang),
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(lang === 'ro' ? 'ro-RO' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Generate calendar for current month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const calendarDays: (number | null)[] = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Calendar className="h-6 w-6 text-blue-500" />
        <h3 className="text-xl font-bold text-center">Ziua</h3>
      </div>
      
      <Card className="p-6 bg-blue-50">
        <p className="text-lg text-center font-medium">
          {t.todayIs}:
        </p>
        <p className="text-xl text-center font-bold mt-2 text-blue-600">
          {formatDate(currentDate)}
        </p>
      </Card>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
            <div key={i} className="text-center font-bold text-sm text-gray-600">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const isToday = day === currentDate.getDate();
            
            return (
              <Button
                key={index}
                variant={isToday ? "default" : "outline"}
                size="sm"
                className={`h-12 ${
                  day === null ? 'invisible' : ''
                } ${
                  isToday ? 'bg-blue-500 hover:bg-blue-600 text-white font-bold' : ''
                }`}
                disabled={day === null}
              >
                {day}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}