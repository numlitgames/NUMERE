import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GripVertical } from "lucide-react";

interface ChronologicalOrderGameProps {
  lang: string;
}

type Activity = {
  time: string;
  name: { ro: string; en: string };
  correctOrder: number;
};

export default function ChronologicalOrderGame({ lang }: ChronologicalOrderGameProps) {
  const [activities] = useState<Activity[]>([
    { time: '08:15', name: { ro: 'Micul dejun', en: 'Breakfast' }, correctOrder: 1 },
    { time: '09:30', name: { ro: 'Începe școala', en: 'School starts' }, correctOrder: 2 },
    { time: '12:00', name: { ro: 'Pauza de prânz', en: 'Lunch break' }, correctOrder: 3 },
    { time: '15:45', name: { ro: 'Teme', en: 'Homework' }, correctOrder: 4 },
    { time: '18:30', name: { ro: 'Cină', en: 'Dinner' }, correctOrder: 5 },
  ].sort(() => Math.random() - 0.5));

  const [userOrder, setUserOrder] = useState<Activity[]>([...activities]);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...userOrder];
    [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    setUserOrder(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === userOrder.length - 1) return;
    const newOrder = [...userOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setUserOrder(newOrder);
  };

  const checkOrder = () => {
    const isCorrect = userOrder.every((activity, index) => activity.correctOrder === index + 1);
    
    if (isCorrect) {
      toast.success(lang === 'ro' ? 'Perfect! Toate activitățile sunt în ordine!' : 'Perfect! All activities are in order!');
    } else {
      toast.error(lang === 'ro' ? 'Nu e corect. Încearcă din nou!' : 'Not correct. Try again!');
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-center mb-6">
        {lang === 'ro' ? 'Ordine Cronologică' : 'Chronological Order'}
      </h3>

      <p className="text-center text-muted-foreground mb-6">
        {lang === 'ro' 
          ? 'Aranjează activitățile în ordinea corectă după oră'
          : 'Arrange the activities in the correct order by time'}
      </p>

      <div className="space-y-3">
        {userOrder.map((activity, index) => (
          <div key={index} className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="h-6 px-2"
              >
                ▲
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveDown(index)}
                disabled={index === userOrder.length - 1}
                className="h-6 px-2"
              >
                ▼
              </Button>
            </div>
            
            <GripVertical className="h-5 w-5 text-gray-400" />
            
            <div className="flex-1">
              <p className="font-bold text-lg">{activity.time}</p>
              <p className="text-muted-foreground">
                {activity.name[lang as 'ro' | 'en'] || activity.name.ro}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={checkOrder} className="w-full mt-6">
        {lang === 'ro' ? 'Verifică Ordinea' : 'Check Order'}
      </Button>
    </Card>
  );
}
