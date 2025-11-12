import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Sun, Moon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import AnalogClockColored from "./AnalogClockColored";
import DigitalClock7Segment from "./DigitalClock7Segment";

interface DayNightClockProps {
  lang: string;
}

export default function DayNightClock({ lang }: DayNightClockProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [use24Hour, setUse24Hour] = useState(false);
  const [dayNightSlider, setDayNightSlider] = useState([12]); // 0-24 hours

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  // Determine if it's day or night based on slider
  const sliderHour = dayNightSlider[0];
  const isDayTime = sliderHour >= 6 && sliderHour < 18;

  return (
    <div className="space-y-6">
      {/* Day/Night Slider */}
      <Card className={cn(
        "p-6 transition-all duration-500",
        isDayTime 
          ? "bg-gradient-to-r from-blue-200 via-blue-100 to-yellow-100" 
          : "bg-gradient-to-r from-indigo-900 via-purple-900 to-gray-900"
      )}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sun className={cn("h-8 w-8", isDayTime ? "text-yellow-500" : "text-gray-500")} />
            <span className={cn("font-bold", isDayTime ? "text-gray-800" : "text-gray-400")}>
              {lang === 'ro' ? 'Zi' : 'Day'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("font-bold", !isDayTime ? "text-white" : "text-gray-400")}>
              {lang === 'ro' ? 'Noapte' : 'Night'}
            </span>
            <Moon className={cn("h-8 w-8", !isDayTime ? "text-blue-300" : "text-gray-400")} />
          </div>
        </div>
        
        <Slider
          value={dayNightSlider}
          onValueChange={setDayNightSlider}
          min={0}
          max={24}
          step={1}
          className="w-full"
        />
        
        <div className="text-center mt-2">
          <span className={cn("text-2xl font-bold", isDayTime ? "text-gray-800" : "text-white")}>
            {String(sliderHour).padStart(2, '0')}:00
          </span>
        </div>
      </Card>

      {/* Analog Clock - Centered */}
      <div className="flex justify-center">
        <AnalogClockColored
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          size={260}
          show24Hour={true}
          showSeconds={true}
        />
      </div>

      {/* Digital Clock - DIRECT SUB ANALOG */}
      <div className="flex flex-col items-center gap-4">
        <DigitalClock7Segment
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          show24Hour={use24Hour}
          showSeconds={true}
        />
        
        <Button
          variant="outline"
          onClick={() => setUse24Hour(!use24Hour)}
          size="sm"
        >
          {use24Hour ? '12h' : '24h'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {currentTime.toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Time Information */}
      <Card className="p-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">{lang === 'ro' ? 'Ore' : 'Hours'}</p>
            <p className="text-4xl font-bold text-primary">{currentTime.getHours()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{lang === 'ro' ? 'Minute' : 'Minutes'}</p>
            <p className="text-4xl font-bold text-primary">{minutes}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{lang === 'ro' ? 'Secunde' : 'Seconds'}</p>
            <p className="text-4xl font-bold text-primary">{seconds}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
