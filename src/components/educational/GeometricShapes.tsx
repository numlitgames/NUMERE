import React from 'react';
import { cn } from "@/lib/utils";

// Rigleta colors mapping for geometric shapes
const rigletaColors = {
  1: "bg-purple-100 border-purple-500",
  2: "bg-red-100 border-red-500", 
  3: "bg-green-100 border-green-500",
  4: "bg-yellow-100 border-yellow-500",
  5: "bg-blue-100 border-blue-500",
  6: "bg-pink-100 border-pink-500",
  7: "bg-orange-100 border-orange-500",
  8: "bg-cyan-100 border-cyan-500",
  9: "bg-indigo-100 border-indigo-500",
  10: "bg-lime-100 border-lime-500"
};

interface GeometricShapeProps {
  shape: 'square' | 'rectangle' | 'circle' | 'diamond';
  denominator: number;
  numerator: number;
  coloredParts: boolean[];
  onPartClick: (index: number) => void;
  className?: string;
  targetDenominator?: number; // The main fraction denominator for color reference
}

export const GeometricShape: React.FC<GeometricShapeProps> = ({
  shape,
  denominator,
  numerator,
  coloredParts,
  onPartClick,
  className,
  targetDenominator
}) => {
  const getShapeColor = () => {
    // Use the shape's own denominator for coloring
    const colorKey = denominator;
    return rigletaColors[colorKey as keyof typeof rigletaColors] || "bg-gray-100 border-gray-500";
  };

  const getShapeOutlineColor = () => {
    // Use the shape's own denominator for coloring, not the target denominator
    const colorKey = denominator; // Each shape uses its own part count
    const colorMap = rigletaColors[colorKey as keyof typeof rigletaColors] || "bg-gray-100 border-gray-500";
    const borderClass = colorMap.split(' ')[1]; // Get the border color part
    
    // Convert border classes to CSS color values for SVG and HTML borders
    const colorMapping: { [key: string]: string } = {
      'border-purple-500': '#8b5cf6',
      'border-red-500': '#ef4444',
      'border-green-500': '#10b981',
      'border-yellow-500': '#f59e0b',
      'border-blue-500': '#3b82f6',
      'border-pink-500': '#ec4899',
      'border-orange-500': '#f97316',
      'border-cyan-500': '#06b6d4',
      'border-indigo-500': '#6366f1',
      'border-lime-500': '#84cc16',
      'border-gray-500': '#6b7280'
    };
    
    return {
      cssColor: colorMapping[borderClass] || '#6b7280',
      tailwindClass: borderClass || 'border-gray-500'
    };
  };

  // Universal method to find optimal grid layout
  const getOptimalGrid = (totalParts: number, shapeType: 'square' | 'rectangle') => {
    if (totalParts === 1) return { rows: 1, cols: 1 };
    
    if (shapeType === 'square') {
      // For squares, find factors that make the most square-like arrangement
      let bestRows = 1, bestCols = totalParts;
      let minDifference = Math.abs(totalParts - 1);
      
      for (let rows = 1; rows <= Math.sqrt(totalParts); rows++) {
        if (totalParts % rows === 0) {
          const cols = totalParts / rows;
          const difference = Math.abs(cols - rows);
          if (difference < minDifference) {
            minDifference = difference;
            bestRows = rows;
            bestCols = cols;
          }
        }
      }
      return { rows: bestRows, cols: bestCols };
    } else {
      // For rectangles, prefer horizontal layouts for small numbers, grid for larger
      if (totalParts <= 6) {
        return { rows: 1, cols: totalParts }; // Horizontal strip
      } else {
        // Find factors optimized for rectangle (prefer more columns than rows)
        let bestRows = Math.ceil(Math.sqrt(totalParts));
        let bestCols = Math.ceil(totalParts / bestRows);
        
        // Ensure we have enough cells
        while (bestRows * bestCols < totalParts) {
          bestCols++;
        }
        
        return { rows: bestRows, cols: bestCols };
      }
    }
  };

  const renderSquare = () => {
    const parts = [];
    const { rows, cols } = getOptimalGrid(denominator, 'square');
    
    for (let i = 0; i < denominator; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      parts.push(
        <div
          key={i}
          className={cn(
            "absolute cursor-pointer transition-all duration-200 hover:scale-105 border-2",
            coloredParts[i] 
              ? getShapeColor()
              : "bg-white hover:bg-gray-50"
          )}
          style={{
            left: `${(col * 100) / cols}%`,
            top: `${(row * 100) / rows}%`,
            width: `${100 / cols}%`,
            height: `${100 / rows}%`,
            borderColor: getShapeOutlineColor().cssColor
          }}
          onClick={() => onPartClick(i)}
        />
      );
    }
    
    return (
      <div 
        className="relative w-64 h-64 border-4" 
        style={{ borderColor: getShapeOutlineColor().cssColor }}
      >
        {parts}
      </div>
    );
  };

  const renderRectangle = () => {
    const parts = [];
    const { rows, cols } = getOptimalGrid(denominator, 'rectangle');
    
    for (let i = 0; i < denominator; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      parts.push(
        <div
          key={i}
          className={cn(
            "absolute cursor-pointer transition-all duration-200 hover:scale-105 border-2",
            coloredParts[i] 
              ? getShapeColor()
              : "bg-white hover:bg-gray-50"
          )}
          style={{
            left: `${(col * 100) / cols}%`,
            top: `${(row * 100) / rows}%`,
            width: `${100 / cols}%`,
            height: `${100 / rows}%`,
            borderColor: getShapeOutlineColor().cssColor
          }}
          onClick={() => onPartClick(i)}
        />
      );
    }
    
    return (
      <div 
        className="relative w-80 h-48 border-4" 
        style={{ borderColor: getShapeOutlineColor().cssColor }}
      >
        {parts}
      </div>
    );
  };

  const renderCircle = () => {
    const parts = [];
    const anglePerPart = 360 / denominator;
    
    for (let i = 0; i < denominator; i++) {
      const startAngle = i * anglePerPart - 90; // Start from top
      const endAngle = (i + 1) * anglePerPart - 90;
      
      // Calculate path for pie slice
      const radius = 120;
      const centerX = 128;
      const centerY = 128;
      
      const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
      
      const largeArcFlag = anglePerPart > 180 ? 1 : 0;
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      parts.push(
        <path
          key={i}
          d={pathData}
          className={cn(
            "cursor-pointer transition-all duration-200 hover:opacity-80",
            coloredParts[i] 
              ? getShapeColor().replace('bg-', 'fill-').replace('border-', 'stroke-').replace('-100', '-200').replace('-500', '-600')
              : "fill-white hover:fill-gray-50"
          )}
          stroke={getShapeOutlineColor().cssColor}
          strokeWidth="3"
          onClick={() => onPartClick(i)}
        />
      );
    }
    
    return (
      <svg width="256" height="256">
        <circle 
          cx="128" 
          cy="128" 
          r="120" 
          fill="none" 
          stroke={getShapeOutlineColor().cssColor} 
          strokeWidth="4"
        />
        {parts}
      </svg>
    );
  };

  const renderDiamond = () => {
    const parts = [];
    
    if (denominator === 2) {
      // Split diamond horizontally
      parts.push(
        <polygon
          key={0}
          points="128,16 240,128 128,128 16,128"
          className={cn(
            "cursor-pointer transition-all duration-200 hover:opacity-80",
            coloredParts[0] 
              ? getShapeColor().replace('bg-', 'fill-').replace('border-', 'stroke-').replace('-100', '-200').replace('-500', '-600')
              : "fill-white hover:fill-gray-50"
          )}
          stroke={getShapeOutlineColor().cssColor}
          strokeWidth="3"
          onClick={() => onPartClick(0)}
        />,
        <polygon
          key={1}
          points="16,128 128,128 240,128 128,240"
          className={cn(
            "cursor-pointer transition-all duration-200 hover:opacity-80",
            coloredParts[1] 
              ? getShapeColor().replace('bg-', 'fill-').replace('border-', 'stroke-').replace('-100', '-200').replace('-500', '-600')
              : "fill-white hover:fill-gray-50"
          )}
          stroke={getShapeOutlineColor().cssColor}
          strokeWidth="3"
          onClick={() => onPartClick(1)}
        />
      );
    } else if (denominator === 4) {
      // Split diamond into 4 triangles
      const triangles = [
        "128,16 240,128 128,128", // Top
        "240,128 128,240 128,128", // Right  
        "128,240 16,128 128,128", // Bottom
        "16,128 128,16 128,128" // Left
      ];
      
      triangles.forEach((points, i) => {
        parts.push(
          <polygon
            key={i}
            points={points}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:opacity-80",
              coloredParts[i] 
                ? getShapeColor().replace('bg-', 'fill-').replace('border-', 'stroke-').replace('-100', '-200').replace('-500', '-600')
                : "fill-white hover:fill-gray-50"
            )}
            stroke={getShapeOutlineColor().cssColor}
            strokeWidth="3"
            onClick={() => onPartClick(i)}
          />
        );
      });
    } else {
      // For other denominators, create radial divisions like circle
      const anglePerPart = 360 / denominator;
      
      for (let i = 0; i < denominator; i++) {
        const startAngle = i * anglePerPart - 90;
        const endAngle = (i + 1) * anglePerPart - 90;
        
        const centerX = 128;
        const centerY = 128;
        
        // Calculate points for diamond edge
        const getEdgePoint = (angle: number) => {
          const rad = (angle * Math.PI) / 180;
          const cos = Math.cos(rad);
          const sin = Math.sin(rad);
          
          // Diamond bounds: top (0,-112), right (112,0), bottom (0,112), left (-112,0)
          if (Math.abs(cos) > Math.abs(sin)) {
            // Hit left or right edge
            const x = cos > 0 ? 112 : -112;
            const y = x * Math.tan(rad);
            return [centerX + x, centerY + y];
          } else {
            // Hit top or bottom edge  
            const y = sin > 0 ? 112 : -112;
            const x = y / Math.tan(rad);
            return [centerX + x, centerY + y];
          }
        };
        
        const [x1, y1] = getEdgePoint(startAngle);
        const [x2, y2] = getEdgePoint(endAngle);
        
        parts.push(
          <polygon
            key={i}
            points={`${centerX},${centerY} ${x1},${y1} ${x2},${y2}`}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:opacity-80",
              coloredParts[i] 
                ? getShapeColor().replace('bg-', 'fill-').replace('border-', 'stroke-').replace('-100', '-200').replace('-500', '-600')
                : "fill-white hover:fill-gray-50"
            )}
            stroke={getShapeOutlineColor().cssColor}
            strokeWidth="3"
            onClick={() => onPartClick(i)}
          />
        );
      }
    }
    
    return (
      <svg width="256" height="256">
        <polygon 
          points="128,16 240,128 128,240 16,128" 
          fill="none" 
          stroke={getShapeOutlineColor().cssColor} 
          strokeWidth="3"
        />
        {parts}
      </svg>
    );
  };

  const renderShape = () => {
    switch (shape) {
      case 'square':
        return renderSquare();
      case 'rectangle':
        return renderRectangle();
      case 'circle':
        return renderCircle();
      case 'diamond':
        return renderDiamond();
      default:
        return null;
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {renderShape()}
    </div>
  );
};

interface GeometricShapesLevel2Props {
  numerator: number;
  denominator: number;
  onValidation?: (isCorrect: boolean) => void;
  className?: string;
  shapeStates?: {[key: string]: boolean[]};
  shapeConfigs?: {[key: string]: { parts: number; colored: number }};
  onShapeStatesChange?: (states: {[key: string]: boolean[]}) => void;
  translations?: {
    numeratorLabel: string;
    denominatorLabel: string;
    clickPartsInstruction: string;
  };
}

export const GeometricShapesLevel2: React.FC<GeometricShapesLevel2Props> = ({
  numerator,
  denominator,
  onValidation,
  className,
  shapeStates: externalShapeStates,
  shapeConfigs: externalShapeConfigs,
  onShapeStatesChange,
  translations
}) => {
  const shapes: ('square' | 'rectangle' | 'circle')[] = ['square', 'rectangle', 'circle'];
  const [selectedShape, setSelectedShape] = React.useState<string | null>(null);
  const [correctShapeIndex, setCorrectShapeIndex] = React.useState<number>(0);
  
  // State for each shape's colored parts - use external state if provided
  const [internalShapeStates, setInternalShapeStates] = React.useState<{[key: string]: boolean[]}>({});
  const shapeStates = externalShapeStates || internalShapeStates;
  
  // Generate different scenarios for each shape - use external configs if provided
  const [internalShapeConfigs, setInternalShapeConfigs] = React.useState<{
    [key: string]: { parts: number; colored: number }
  }>({});
  const shapeConfigs = externalShapeConfigs || internalShapeConfigs;

  // Initialize shape configurations
  React.useEffect(() => {
    if (externalShapeConfigs && externalShapeStates) return; // Don't override external data
    
    const configs: { [key: string]: { parts: number; colored: number } } = {};
    const states: { [key: string]: boolean[] } = {};
    const correctIndex = Math.floor(Math.random() * shapes.length);
    setCorrectShapeIndex(correctIndex);
    
    shapes.forEach((shape, index) => {
      if (index === correctIndex) {
        // Correct answer - use the exact denominator
        configs[shape] = { parts: denominator, colored: 0 };
      } else {
        // Incorrect answers with different number of parts
        let wrongParts;
        do {
          wrongParts = Math.floor(Math.random() * 8) + 2; // 2-9 parts
        } while (wrongParts === denominator); // Make sure it's different from correct answer
        
        configs[shape] = { parts: wrongParts, colored: 0 };
      }
      // Initialize all parts as uncolored
      states[shape] = new Array(configs[shape].parts).fill(false);
    });
    
    setInternalShapeConfigs(configs);
    setInternalShapeStates(states);
  }, [numerator, denominator, externalShapeConfigs, externalShapeStates]);

  const handlePartClick = (shape: string, partIndex: number) => {
    const currentStates = externalShapeStates || internalShapeStates;
    const currentParts = currentStates[shape] || [];
    const newParts = [...currentParts];
    
    // Toggle the clicked part
    newParts[partIndex] = !newParts[partIndex];
    
    const newStates = { ...currentStates, [shape]: newParts };
    
    if (externalShapeStates && onShapeStatesChange) {
      onShapeStatesChange(newStates);
    } else {
      setInternalShapeStates(newStates);
    }
  };

  const handleShapeClick = (shape: string, index: number) => {
    const coloredCount = getColoredCount(shape);
    const config = shapeConfigs[shape];
    
    // Check if this is the correct shape (has correct number of parts = denominator)
    // AND user colored the correct number of parts = numerator  
    const isCorrectShape = config && config.parts === denominator;
    const isCorrectColoring = coloredCount === numerator;
    
    setSelectedShape(shape);
    const isCorrect = isCorrectShape && isCorrectColoring;
    
    if (isCorrect) {
      onValidation?.(true);
    } else {
      onValidation?.(false);
    }
  };

  const getColoredCount = (shape: string) => {
    return shapeStates[shape]?.filter(Boolean).length || 0;
  };

  const validateAnswer = () => {
    // Check all shapes to find the correct answer
    let foundCorrect = false;
    
    shapes.forEach((shape, index) => {
      const config = shapeConfigs[shape];
      const coloredCount = getColoredCount(shape);
      
      if (config && config.parts === denominator && coloredCount === numerator) {
        foundCorrect = true;
        setSelectedShape(shape);
      }
    });
    
    onValidation?.(foundCorrect);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600">
          {translations?.clickPartsInstruction || "Apasă pe părțile fiecărei figuri pentru a le colora"}
        </p>
      </div>
      
      <div className="flex justify-between items-center px-8">
        {shapes.map((shape, index) => {
          const config = shapeConfigs[shape];
          if (!config) return null;
          
          const coloredCount = getColoredCount(shape);
          
          return (
            <div 
              key={shape} 
              className={cn(
                "flex flex-col items-center gap-4"
              )}
            >
              <div className="text-lg font-semibold text-gray-700 capitalize opacity-0">
                {shape === 'square' ? 'Pătrat' : 
                 shape === 'rectangle' ? 'Dreptunghi' : 
                 shape === 'circle' ? 'Cerc' : 'Romb'}
              </div>
              
              {/* Fraction Display */}
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 mb-2">
                <div className="flex items-center justify-center gap-4">
                  {/* Labels */}
                  <div className="flex flex-col gap-2">
                    <div className="bg-orange-200 px-2 py-1 rounded text-xs font-bold text-orange-800">{translations?.numeratorLabel || "NUMĂRĂTOR"}</div>
                    <div className="bg-blue-200 px-2 py-1 rounded text-xs font-bold text-blue-800">{translations?.denominatorLabel || "NUMITOR"}</div>
                  </div>
                  
                  {/* Fraction boxes */}
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-12 border-2 border-gray-400 flex items-center justify-center text-lg font-bold bg-white text-red-600">
                      {coloredCount}
                    </div>
                    <div className="h-8 w-12 border-2 border-gray-400 border-t-0 flex items-center justify-center text-lg font-bold bg-white text-blue-600">
                      {config.parts}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center" style={{ minHeight: '256px' }}>
                <GeometricShape
                  shape={shape}
                  denominator={config.parts}
                  numerator={config.colored}
                  coloredParts={shapeStates[shape] || new Array(config.parts).fill(false)}
                  onPartClick={(partIndex) => handlePartClick(shape, partIndex)}
                  targetDenominator={denominator}
                />
              </div>
              
              {selectedShape === shape && (
                <div className={cn(
                  "text-sm font-bold px-3 py-1 rounded mt-2",
                  config && config.parts === denominator && coloredCount === numerator
                    ? "text-green-700 bg-green-200" 
                    : "text-red-700 bg-red-200"
                )}>
                  {config && config.parts === denominator && coloredCount === numerator ? "Corect!" : "Greșit!"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};