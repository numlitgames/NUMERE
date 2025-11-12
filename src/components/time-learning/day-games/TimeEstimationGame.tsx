import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TimeEstimationGameProps {
  lang: string;
}

const tasks = [
  { ro: '100 sărituri', en: '100 jumps', expectedSeconds: 120 },
  { ro: 'Scrie numele tău de 10 ori', en: 'Write your name 10 times', expectedSeconds: 60 },
  { ro: 'Numără până la 50', en: 'Count to 50', expectedSeconds: 30 },
  { ro: 'Desenează un soare', en: 'Draw a sun', expectedSeconds: 45 },
];

export default function TimeEstimationGame({ lang }: TimeEstimationGameProps) {
  const [currentTask] = useState(tasks[Math.floor(Math.random() * tasks.length)]);
  const [estimation, setEstimation] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hasEstimated, setHasEstimated] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleEstimate = () => {
    if (parseInt(estimation) > 0) {
      setHasEstimated(true);
      toast.success(lang === 'ro' ? 'Estimare înregistrată!' : 'Estimation recorded!');
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    const diff = Math.abs(elapsedTime - parseInt(estimation));
    const accuracy = Math.max(0, 100 - (diff / parseInt(estimation)) * 100);
    
    toast.success(
      lang === 'ro'
        ? `Finalizat în ${elapsedTime}s! Precizie: ${accuracy.toFixed(0)}%`
        : `Completed in ${elapsedTime}s! Accuracy: ${accuracy.toFixed(0)}%`
    );
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setEstimation('');
    setHasEstimated(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-center mb-6">
        {lang === 'ro' ? 'Estimare & Verificare' : 'Estimate & Verify'}
      </h3>

      <div className="bg-blue-50 p-6 rounded-lg mb-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          {lang === 'ro' ? 'Sarcină' : 'Task'}:
        </p>
        <p className="text-2xl font-bold text-primary">
          {currentTask[lang as 'ro' | 'en'] || currentTask.ro}
        </p>
      </div>

      {!hasEstimated ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {lang === 'ro' ? 'Cât crezi că durează? (secunde)' : 'How long do you think it takes? (seconds)'}
            </label>
            <Input
              type="number"
              min="1"
              value={estimation}
              onChange={(e) => setEstimation(e.target.value)}
              placeholder="60"
              className="text-center text-lg"
            />
          </div>
          <Button onClick={handleEstimate} className="w-full" disabled={!estimation}>
            {lang === 'ro' ? 'Confirmă Estimarea' : 'Confirm Estimation'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {lang === 'ro' ? 'Timp scurs' : 'Elapsed time'}
            </p>
            <p className="text-6xl font-bold font-mono text-primary">
              {formatTime(elapsedTime)}
            </p>
            <p className="text-sm mt-2 text-muted-foreground">
              {lang === 'ro' ? 'Estimare' : 'Estimation'}: {estimation}s
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              className="flex-1"
              variant={isRunning ? "secondary" : "default"}
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  {lang === 'ro' ? 'Pauză' : 'Pause'}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  {lang === 'ro' ? 'Start' : 'Start'}
                </>
              )}
            </Button>
            
            {!isRunning && elapsedTime > 0 && (
              <Button onClick={handleStop} className="flex-1">
                {lang === 'ro' ? 'Verifică' : 'Check'}
              </Button>
            )}
            
            <Button onClick={handleReset} variant="outline" size="icon">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
