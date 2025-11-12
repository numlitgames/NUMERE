import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTranslation } from '@/lib/timeData';

interface TemperatureSliderProps {
  temperature: number;
  onTemperatureChange: (temp: number) => void;
  lang: string;
}

export default function TemperatureSlider({ 
  temperature, 
  onTemperatureChange,
  lang 
}: TemperatureSliderProps) {
  
  const getTemperatureColor = (temp: number): string => {
    if (temp < 0) return 'from-blue-600 to-blue-400';
    if (temp < 10) return 'from-cyan-500 to-blue-300';
    if (temp < 20) return 'from-green-400 to-cyan-400';
    if (temp < 30) return 'from-yellow-400 to-green-400';
    return 'from-orange-500 to-red-500';
  };

  const getWeatherEmoji = (temp: number): string => {
    if (temp < 0) return '❄️';
    if (temp < 10) return '🌧️';
    if (temp < 20) return '⛅';
    if (temp < 30) return '🌤️';
    return '☀️';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          {getTranslation('ui', 'adjust_temperature', lang)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center">
          <div className={`text-6xl bg-gradient-to-br ${getTemperatureColor(temperature)} 
                          w-32 h-32 rounded-full flex items-center justify-center text-white 
                          font-bold shadow-lg`}>
            {getWeatherEmoji(temperature)}
          </div>
        </div>
        
        <div className="space-y-4">
          <Slider
            value={[temperature]}
            onValueChange={(value) => onTemperatureChange(value[0])}
            min={-20}
            max={40}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">-20°C</span>
            <div className="flex items-center gap-2">
              <span className={`text-4xl font-bold bg-gradient-to-r ${getTemperatureColor(temperature)} 
                              bg-clip-text text-transparent`}>
                {temperature}°C
              </span>
            </div>
            <span className="text-sm text-muted-foreground">40°C</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 text-2xl">
          <span className={temperature < 0 ? 'opacity-100' : 'opacity-30'}>❄️</span>
          <span className={temperature >= 0 && temperature < 10 ? 'opacity-100' : 'opacity-30'}>🌧️</span>
          <span className={temperature >= 10 && temperature < 20 ? 'opacity-100' : 'opacity-30'}>⛅</span>
          <span className={temperature >= 20 && temperature < 30 ? 'opacity-100' : 'opacity-30'}>🌤️</span>
          <span className={temperature >= 30 ? 'opacity-100' : 'opacity-30'}>☀️</span>
        </div>
      </CardContent>
    </Card>
  );
}
