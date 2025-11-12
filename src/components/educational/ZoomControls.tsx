import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  className?: string;
  translations?: {
    zoomLabel?: string;
  };
}

export default function ZoomControls({ 
  zoom, 
  onZoomChange, 
  className,
  translations 
}: ZoomControlsProps) {
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 10, 200);
    onZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 10, 50);
    onZoomChange(newZoom);
  };

  const handleSliderChange = (value: number[]) => {
    onZoomChange(value[0]);
  };

  return (
    <div className={cn("flex items-center gap-2 bg-white rounded-lg shadow-sm border p-2", className)}>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleZoomOut}
        disabled={zoom <= 50}
        className="h-8 w-8 p-0"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-2 min-w-[120px]">
        <Slider
          value={[zoom]}
          onValueChange={handleSliderChange}
          min={50}
          max={200}
          step={10}
          className="flex-1"
        />
        <span className="text-xs font-medium min-w-[35px] text-center">
          {zoom}%
        </span>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleZoomIn}
        disabled={zoom >= 200}
        className="h-8 w-8 p-0"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
}