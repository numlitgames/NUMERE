import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ProportionSelectorProps {
  currentScale: number;
  onScaleChange: (scale: number) => void;
  className?: string;
}

const ProportionSelector: React.FC<ProportionSelectorProps> = ({
  currentScale,
  onScaleChange,
  className = ""
}) => {
  const scaleOptions = [
    { value: 0.5, label: '50%' },
    { value: 0.75, label: '75%' },
    { value: 1, label: '100%' },
    { value: 1.25, label: '125%' },
    { value: 1.5, label: '150%' },
    { value: 2, label: '200%' }
  ];

  const handleZoomIn = () => {
    const currentIndex = scaleOptions.findIndex(option => option.value === currentScale);
    if (currentIndex < scaleOptions.length - 1) {
      onScaleChange(scaleOptions[currentIndex + 1].value);
    }
  };

  const handleZoomOut = () => {
    const currentIndex = scaleOptions.findIndex(option => option.value === currentScale);
    if (currentIndex > 0) {
      onScaleChange(scaleOptions[currentIndex - 1].value);
    }
  };

  const handleReset = () => {
    onScaleChange(1);
  };

  const currentLabel = scaleOptions.find(option => option.value === currentScale)?.label || '100%';

  return (
    <div className={`flex items-center gap-2 bg-white rounded-lg border border-gray-300 p-2 ${className}`}>
      {/* Zoom Out Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleZoomOut}
        disabled={currentScale <= 0.5}
        className="h-8 w-8 p-0 hover:bg-gray-100"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>

      {/* Scale Selector */}
      <Select 
        value={currentScale.toString()} 
        onValueChange={(value) => onScaleChange(parseFloat(value))}
      >
        <SelectTrigger className="w-20 h-8 text-sm">
          <SelectValue>
            {currentLabel}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {scaleOptions.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Zoom In Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleZoomIn}
        disabled={currentScale >= 2}
        className="h-8 w-8 p-0 hover:bg-gray-100"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>

      {/* Reset Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReset}
        className="h-8 w-8 p-0 hover:bg-gray-100"
        title="Reset to 100%"
      >
        <RotateCcw className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default ProportionSelector;