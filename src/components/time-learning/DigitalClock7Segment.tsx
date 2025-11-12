import React from 'react';

interface DigitalClock7SegmentProps {
  hours: number;
  minutes: number;
  seconds?: number;
  show24Hour?: boolean;
  showSeconds?: boolean;
}

interface SegmentDigitProps {
  value: number;
}

const segmentMap: Record<number, Record<string, boolean>> = {
  0: { a: true, b: true, c: true, d: true, e: true, f: true, g: false },
  1: { a: false, b: true, c: true, d: false, e: false, f: false, g: false },
  2: { a: true, b: true, c: false, d: true, e: true, f: false, g: true },
  3: { a: true, b: true, c: true, d: true, e: false, f: false, g: true },
  4: { a: false, b: true, c: true, d: false, e: false, f: true, g: true },
  5: { a: true, b: false, c: true, d: true, e: false, f: true, g: true },
  6: { a: true, b: false, c: true, d: true, e: true, f: true, g: true },
  7: { a: true, b: true, c: true, d: false, e: false, f: false, g: false },
  8: { a: true, b: true, c: true, d: true, e: true, f: true, g: true },
  9: { a: true, b: true, c: true, d: true, e: false, f: true, g: true },
};

const SevenSegmentDigit = ({ value }: SegmentDigitProps) => {
  const segments = segmentMap[value] || segmentMap[0];
  const activeColor = '#00BCD4'; // Cyan
  const inactiveColor = '#E5E7EB'; // Light grey

  return (
    <svg viewBox="0 0 50 80" className="w-10 h-16 md:w-12 md:h-20">
      {/* Segment A (top) */}
      <path
        d="M 10 5 L 15 10 L 35 10 L 40 5 L 35 0 L 15 0 Z"
        fill={segments.a ? activeColor : inactiveColor}
      />
      
      {/* Segment B (top right) */}
      <path
        d="M 40 5 L 45 10 L 45 30 L 40 35 L 35 30 L 35 10 Z"
        fill={segments.b ? activeColor : inactiveColor}
      />
      
      {/* Segment C (bottom right) */}
      <path
        d="M 40 45 L 45 50 L 45 70 L 40 75 L 35 70 L 35 50 Z"
        fill={segments.c ? activeColor : inactiveColor}
      />
      
      {/* Segment D (bottom) */}
      <path
        d="M 10 75 L 15 70 L 35 70 L 40 75 L 35 80 L 15 80 Z"
        fill={segments.d ? activeColor : inactiveColor}
      />
      
      {/* Segment E (bottom left) */}
      <path
        d="M 5 50 L 10 45 L 15 50 L 15 70 L 10 75 L 5 70 Z"
        fill={segments.e ? activeColor : inactiveColor}
      />
      
      {/* Segment F (top left) */}
      <path
        d="M 5 10 L 10 5 L 15 10 L 15 30 L 10 35 L 5 30 Z"
        fill={segments.f ? activeColor : inactiveColor}
      />
      
      {/* Segment G (middle) */}
      <path
        d="M 10 40 L 15 35 L 35 35 L 40 40 L 35 45 L 15 45 Z"
        fill={segments.g ? activeColor : inactiveColor}
      />
    </svg>
  );
};

export default function DigitalClock7Segment({
  hours,
  minutes,
  seconds = 0,
  show24Hour = true,
  showSeconds = true
}: DigitalClock7SegmentProps) {
  const displayHours = show24Hour ? hours : (hours % 12 || 12);
  const hourTens = Math.floor(displayHours / 10);
  const hourOnes = displayHours % 10;
  const minuteTens = Math.floor(minutes / 10);
  const minuteOnes = minutes % 10;
  const secondTens = Math.floor(seconds / 10);
  const secondOnes = seconds % 10;

  return (
    <div className="relative bg-white border-4 border-cyan-400 rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-lg inline-flex items-center gap-1 md:gap-2">
      {/* Hours */}
      <SevenSegmentDigit value={hourTens} />
      <SevenSegmentDigit value={hourOnes} />
      
      {/* Separator */}
      <div className="flex flex-col gap-2 mx-1">
        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full" />
        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full" />
      </div>
      
      {/* Minutes */}
      <SevenSegmentDigit value={minuteTens} />
      <SevenSegmentDigit value={minuteOnes} />
      
      {/* Seconds (optional) */}
      {showSeconds && (
        <>
          <div className="flex flex-col gap-2 mx-1">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full" />
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full" />
          </div>
          <SevenSegmentDigit value={secondTens} />
          <SevenSegmentDigit value={secondOnes} />
        </>
      )}
    </div>
  );
}
