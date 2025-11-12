import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import AnalogClockColored from "./AnalogClockColored";
import DigitalClock7Segment from "./DigitalClock7Segment";

interface HourExercisesProps {
  lang: string;
}

export default function HourExercises({ lang }: HourExercisesProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock className="h-6 w-6 text-blue-500" />
        <h3 className="text-xl font-bold text-center">Ora</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Analog Clock */}
        <Card className="p-6 flex flex-col items-center justify-center">
          <h4 className="text-lg font-bold mb-4">Ceas Analog</h4>
          <AnalogClockColored
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            size={240}
            show24Hour={true}
            showSeconds={true}
          />
        </Card>

        {/* Digital Clock */}
        <Card className="p-6 flex flex-col items-center justify-center">
          <h4 className="text-lg font-bold mb-4">Ceas Digital</h4>
          <DigitalClock7Segment
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            show24Hour={true}
            showSeconds={true}
          />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {currentTime.toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </Card>
      </div>

      {/* Time information */}
      <Card className="p-6 bg-blue-50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Ore</p>
            <p className="text-3xl font-bold text-blue-600">{hours}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Minute</p>
            <p className="text-3xl font-bold text-blue-600">{minutes}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Secunde</p>
            <p className="text-3xl font-bold text-blue-600">{seconds}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}