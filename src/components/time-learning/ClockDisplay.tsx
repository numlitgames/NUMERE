import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnalogClockColored from './AnalogClockColored';
import DigitalClock7Segment from './DigitalClock7Segment';

interface ClockDisplayProps {
  lang: string;
}

export default function ClockDisplay({ lang }: ClockDisplayProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentSeconds = currentTime.getSeconds();
  
  // Day time is from 6 AM to 6 PM
  const isDayTime = currentHour >= 6 && currentHour < 18;

  return (
    <div className="space-y-6">
      {/* Day/Night Indicator */}
      <div className={cn(
        "p-4 rounded-lg transition-all duration-500",
        isDayTime 
          ? "bg-gradient-to-r from-blue-200 via-blue-100 to-yellow-100" 
          : "bg-gradient-to-r from-indigo-900 via-purple-900 to-gray-900"
      )}>
        <div className="flex justify-between items-center mb-2">
          <Sun className={cn(
            "w-6 h-6 transition-colors",
            isDayTime ? "text-yellow-500" : "text-gray-500"
          )} />
          <span className={cn(
            "text-2xl font-bold",
            isDayTime ? "text-gray-800" : "text-white"
          )}>
            {String(currentHour).padStart(2, '0')}:{String(currentMinutes).padStart(2, '0')}
          </span>
          <Moon className={cn(
            "w-6 h-6 transition-colors",
            !isDayTime ? "text-blue-300" : "text-gray-400"
          )} />
        </div>
        <div className={cn(
          "text-center text-sm font-medium",
          isDayTime ? "text-gray-700" : "text-white"
        )}>
          {isDayTime ? (lang === 'ro' ? 'Zi' : 'Day') : (lang === 'ro' ? 'Noapte' : 'Night')}
        </div>
      </div>

      {/* Analog Clock */}
      <div className="flex justify-center">
        <AnalogClockColored
          hours={currentHour}
          minutes={currentMinutes}
          seconds={currentSeconds}
          size={200}
          show24Hour={true}
          showSeconds={true}
        />
      </div>

      {/* Digital Clock - DIRECT SUB ANALOG */}
      <div className="flex justify-center">
        <DigitalClock7Segment
          hours={currentHour}
          minutes={currentMinutes}
          seconds={currentSeconds}
          show24Hour={true}
          showSeconds={true}
        />
      </div>
    </div>
  );
}
