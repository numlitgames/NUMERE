import React from 'react';

type WordGridItem = {
  id: string;
  img: string;
  label: string;
  audio?: string;
};

interface WordGridProps {
  items: WordGridItem[];
  targetId?: string;
  onPick?: (id: string) => void;
  className?: string;
}

const WordGrid: React.FC<WordGridProps> = ({ 
  items, 
  targetId, 
  onPick,
  className = ""
}) => {
  return (
    <div className={`grid grid-cols-3 gap-4 max-w-3xl w-full ${className}`}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onPick?.(item.id)}
          aria-label={item.label}
          className="aspect-square rounded-2xl bg-white shadow-md hover:scale-[1.02] transition-transform duration-200 p-3 border border-border"
        >
          <img 
            src={item.img} 
            alt={item.label} 
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback to placeholder if image doesn't exist
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </button>
      ))}
    </div>
  );
};

export default WordGrid;