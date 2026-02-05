import React from 'react';

interface ConfigSliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  displayValue?: string | number;
}

const ConfigSlider: React.FC<ConfigSliderProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
  displayValue
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-sm font-semibold text-emerald-600">
          {displayValue ?? value}{unit}
        </span>
      </div>
      <div className="relative w-full h-6 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full absolute z-20 opacity-0 cursor-pointer h-full"
        />
        <div className="w-full h-1.5 bg-slate-200 rounded-full absolute z-0">
           <div 
             className="h-full bg-emerald-500 rounded-full absolute left-0 top-0"
             style={{ width: `${((value - min) / (max - min)) * 100}%` }}
           ></div>
        </div>
        <div 
            className="w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-md absolute z-10 pointer-events-none transition-transform duration-75 ease-out"
            style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 10px)` }}
        ></div>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-slate-400">{min}{unit}</span>
        <span className="text-xs text-slate-400">{max}{unit}</span>
      </div>
    </div>
  );
};

export default ConfigSlider;