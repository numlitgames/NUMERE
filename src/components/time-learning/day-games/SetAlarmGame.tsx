import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import AnalogClockColored from "../AnalogClockColored";

interface SetAlarmGameProps {
  lang: string;
}

export default function SetAlarmGame({ lang }: SetAlarmGameProps) {
  const [targetTime] = useState({ hours: 7, minutes: 15 });
  const [userHours, setUserHours] = useState(12);
  const [userMinutes, setUserMinutes] = useState(0);


  const checkAlarm = () => {
    if (userHours === targetTime.hours && userMinutes === targetTime.minutes) {
      toast.success(lang === 'ro' ? 'Alarma setată corect! 🔔' : 'Alarm set correctly! 🔔');
    } else {
      toast.error(
        lang === 'ro' 
          ? `Încearcă din nou! Ținta: ${targetTime.hours}:${String(targetTime.minutes).padStart(2, '0')}`
          : `Try again! Target: ${targetTime.hours}:${String(targetTime.minutes).padStart(2, '0')}`
      );
    }
  };

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold flex items-center justify-center gap-2">
          <Bell className="h-6 w-6" />
          {lang === 'ro' ? 'Setează Alarma' : 'Set Alarm'}
        </h3>
        <p className="text-lg mt-2 text-muted-foreground">
          {lang === 'ro' ? 'Țintă' : 'Target'}: <span className="font-bold text-primary">
            {targetTime.hours}:{String(targetTime.minutes).padStart(2, '0')}
          </span>
        </p>
      </div>

      {/* Interactive Clock */}
      <div className="flex justify-center mb-6">
        <AnalogClockColored
          hours={userHours}
          minutes={userMinutes}
          seconds={0}
          size={260}
          show24Hour={false}
          showSeconds={false}
        />
      </div>

      {/* Time Controls */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium mb-2 block">{lang === 'ro' ? 'Ore' : 'Hours'}</label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setUserHours((userHours - 1 + 12) % 12 || 12)}>-</Button>
            <div className="flex-1 text-center py-2 border rounded">{userHours}</div>
            <Button variant="outline" size="sm" onClick={() => setUserHours((userHours % 12) + 1)}>+</Button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">{lang === 'ro' ? 'Minute' : 'Minutes'}</label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setUserMinutes((userMinutes - 5 + 60) % 60)}>-</Button>
            <div className="flex-1 text-center py-2 border rounded">{String(userMinutes).padStart(2, '0')}</div>
            <Button variant="outline" size="sm" onClick={() => setUserMinutes((userMinutes + 5) % 60)}>+</Button>
          </div>
        </div>
      </div>

      <Button onClick={checkAlarm} className="w-full">
        {lang === 'ro' ? 'Verifică Alarma' : 'Check Alarm'}
      </Button>
    </Card>
  );
}
