import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { getDayOfWeekName } from '@/lib/timeData';

const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const ENERGY_EMOJIS = ['😫', '😕', '😐', '🙂', '😊', '😄', '🤩'];

interface EnergyBarometerGameProps {
  lang: string;
}

export default function EnergyBarometerGame({ lang }: EnergyBarometerGameProps) {
  const [energyLevels, setEnergyLevels] = useState<Record<string, number>>({
    monday: 50,
    tuesday: 50,
    wednesday: 50,
    thursday: 50,
    friday: 50,
    saturday: 50,
    sunday: 50,
  });

  const handleEnergyChange = (day: string, value: number[]) => {
    setEnergyLevels({
      ...energyLevels,
      [day]: value[0]
    });
  };

  const getEnergyEmoji = (energy: number) => {
    const index = Math.floor((energy / 100) * (ENERGY_EMOJIS.length - 1));
    return ENERGY_EMOJIS[index];
  };

  const calculateWeekAverage = () => {
    const values = Object.values(energyLevels);
    const sum = values.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / values.length);
  };

  const resetToDefault = () => {
    const defaultLevels: Record<string, number> = {};
    WEEKDAYS.forEach(day => defaultLevels[day] = 50);
    setEnergyLevels(defaultLevels);
  };

  const weekAverage = calculateWeekAverage();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Barometru Energie Săptămânală</h3>
        <Button variant="outline" size="sm" onClick={resetToDefault}>
          Reset
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Setează nivelul de energie pentru fiecare zi a săptămânii.
      </p>

      {/* Days with sliders */}
      <div className="space-y-4">
        {WEEKDAYS.map((day) => {
          const energy = energyLevels[day];
          const isWeekend = day === 'saturday' || day === 'sunday';
          
          return (
            <div
              key={day}
              className={`p-4 rounded-lg border-2 ${
                isWeekend ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm">
                  {getDayOfWeekName(day, lang)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getEnergyEmoji(energy)}</span>
                  <span className="text-sm font-bold min-w-[45px] text-right">
                    {energy}%
                  </span>
                </div>
              </div>
              
              <Slider
                value={[energy]}
                onValueChange={(value) => handleEnergyChange(day, value)}
                max={100}
                step={1}
                className="cursor-pointer"
              />
            </div>
          );
        })}
      </div>

      {/* Week average */}
      <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-2 border-purple-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-900">Media Săptămânii</p>
            <p className="text-xs text-purple-700">Energia medie pe 7 zile</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getEnergyEmoji(weekAverage)}</span>
            <span className="text-2xl font-bold text-purple-900">
              {weekAverage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
