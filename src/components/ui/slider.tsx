import React from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  className?: string;
}

export function Slider({ min, max, step = 1, value, onValueChange, className }: SliderProps) {
  return (
    <div className={className}>
      <div className="flex gap-2 items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={e => {
            const newMin = Math.min(Number(e.target.value), value[1]);
            onValueChange([newMin, value[1]]);
          }}
          className="w-full"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={e => {
            const newMax = Math.max(Number(e.target.value), value[0]);
            onValueChange([value[0], newMax]);
          }}
          className="w-full"
        />
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
} 