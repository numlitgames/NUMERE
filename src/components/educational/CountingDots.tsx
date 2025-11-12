import React from 'react';
import { cn } from "@/lib/utils";

interface CountingDotsProps {
  count: number;
  message?: string;
  className?: string;
}

export default function CountingDots({ count, message, className }: CountingDotsProps) {
  if (count === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Counting dots on blue line */}
      <div className="flex items-center justify-center">
        <div className="relative">
          <div className="h-1 bg-blue-500 rounded-full" style={{ width: `${Math.max(count * 20, 40)}px` }}>
          </div>
          <div className="absolute top-0 left-0 h-1 flex items-center space-x-1" style={{ transform: 'translateY(-50%)' }}>
            {Array.from({ length: count }, (_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-red-500 rounded-full animate-scale-in"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Message */}
      {message && (
        <p className="text-sm font-medium text-center text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
}