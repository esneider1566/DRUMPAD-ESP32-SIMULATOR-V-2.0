import React, { useState, useEffect, useCallback } from 'react';

interface KnobProps {
  value: number;
  min: number;
  max: number;
  label: string;
  onChange: (val: number) => void;
}

const Knob: React.FC<KnobProps> = ({ value, min, max, label, onChange }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const range = max - min;
    const percent = (value - min) / range;
    setRotation(percent * 270 - 135);
  }, [value, min, max]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const startY = e.clientY;
    const startValue = value;
    const range = max - min;

    const handleMouseMove = (ev: MouseEvent) => {
      const deltaY = startY - ev.clientY;
      const change = (deltaY / 100) * range; 
      let newValue = startValue + change;
      newValue = Math.max(min, Math.min(max, newValue));
      onChange(Math.round(newValue));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex flex-col items-center group">
      <div 
        className="relative w-16 h-16 cursor-ns-resize"
        onMouseDown={handleMouseDown}
      >
        {/* Knob Body */}
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="#334155" stroke="#1e293b" strokeWidth="2" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="10 5" opacity="0.2" />
          
          {/* Marker */}
          <g transform={`rotate(${rotation} 50 50)`}>
            <line x1="50" y1="50" x2="50" y2="15" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
          </g>
        </svg>
      </div>
      <span className="text-xs font-mono mt-1 text-slate-400 group-hover:text-sky-400 transition-colors">{label}</span>
      <span className="text-xs font-bold text-slate-200">{value}</span>
    </div>
  );
};

export default Knob;