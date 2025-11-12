import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { getTranslation, Season } from "@/lib/timeData";
import { useToast } from "@/hooks/use-toast";
import { Shirt } from "lucide-react";

interface ClothingSelectorProps {
  season: Season;
  lang: string;
  onComplete?: () => void;
}

const CLOTHING_ITEMS = {
  sweater: "🧥",
  light_jacket: "🧥",
  pants: "👖",
  winter_jacket: "🧥",
  hat: "🧢",
  gloves: "🧤",
  shirt: "👔",
  shoes: "👞",
  tshirt: "👕",
  shorts: "🩳",
  sandals: "🩴"
};

const CLOTHING_NAMES: Record<string, Record<string, string>> = {
  sweater: { ro: "Pulover", en: "Sweater", de: "Pullover" },
  light_jacket: { ro: "Jachetă ușoară", en: "Light jacket", de: "Leichte Jacke" },
  pants: { ro: "Pantaloni", en: "Pants", de: "Hose" },
  winter_jacket: { ro: "Geacă de iarnă", en: "Winter jacket", de: "Winterjacke" },
  hat: { ro: "Căciulă", en: "Hat", de: "Mütze" },
  gloves: { ro: "Mănuși", en: "Gloves", de: "Handschuhe" },
  shirt: { ro: "Cămașă", en: "Shirt", de: "Hemd" },
  shoes: { ro: "Pantofi", en: "Shoes", de: "Schuhe" },
  tshirt: { ro: "Tricou", en: "T-shirt", de: "T-Shirt" },
  shorts: { ro: "Pantaloni scurți", en: "Shorts", de: "Shorts" },
  sandals: { ro: "Sandale", en: "Sandals", de: "Sandalen" }
};

export default function ClothingSelector({ season, lang, onComplete }: ClothingSelectorProps) {
  const { toast } = useToast();
  const [selected, setSelected] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const correctClothing = season.clothing;
  
  const t = {
    title: getTranslation('ui', 'clothing_selector_title', lang),
    correct: getTranslation('ui', 'correct', lang),
    incorrect: getTranslation('ui', 'incorrect', lang),
  };

  const handleToggle = (item: string) => {
    if (isCompleted) return;
    
    const newSelected = selected.includes(item)
      ? selected.filter(i => i !== item)
      : [...selected, item];
    
    setSelected(newSelected);
    
    // Check if all correct items are selected
    const allCorrect = correctClothing.every(c => newSelected.includes(c));
    const noIncorrect = newSelected.every(s => correctClothing.includes(s));
    
    if (allCorrect && noIncorrect && newSelected.length === correctClothing.length) {
      toast({
        title: t.correct,
        variant: "default",
      });
      setIsCompleted(true);
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(CLOTHING_ITEMS).map(([key, emoji]) => {
          const isSelected = selected.includes(key);
          const isCorrect = correctClothing.includes(key);
          const showCorrect = isCompleted && isCorrect;
          
          return (
            <Button
              key={key}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => handleToggle(key)}
              disabled={isCompleted}
              className={`h-20 text-base font-bold flex flex-col gap-1 ${
                showCorrect ? 'bg-green-500 hover:bg-green-600' : ''
              }`}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs text-center leading-tight">{CLOTHING_NAMES[key]?.[lang] || CLOTHING_NAMES[key]?.ro}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}