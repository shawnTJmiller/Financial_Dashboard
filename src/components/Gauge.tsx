import React from 'react';

interface GaugeProps {
  min: number;
  max: number;
  value: number;
  label: string;
  startAngle?: number;
  radialSpan?: number;
  colorRangeMin?: number;
  colorRangeMax?: number;
  visible: boolean;
  size?: number;
}

export const Gauge: React.FC<GaugeProps> = ({
  min,
  max,
  value,
  label,
  startAngle = -225,
  radialSpan = 270,
  colorRangeMin,
  colorRangeMax,
  visible,
  size = 200,
}) => {
  if (!visible) return null;

  // Clamp value between min and max
  const clampedValue = Math.max(min, Math.min(max, value));

  // Calculate needle angle
  const proportion = (clampedValue - min) / (max - min);
  const needleAngle = startAngle + proportion * radialSpan;

  // Convert to radians
  const needleRad = (needleAngle * Math.PI) / 180;

  // Calculate needle position
  const radius = size / 2.5;
  const needleX = Math.cos(needleRad) * radius;
  const needleY = Math.sin(needleRad) * radius;

  // Determine color based on position
  let needleColor = '#ef4444'; // red
  if (colorRangeMin !== undefined && colorRangeMax !== undefined) {
    if (clampedValue >= colorRangeMax) {
      needleColor = '#22c55e'; // green
    } else if (clampedValue >= colorRangeMin) {
      // Gradient between min and max
      const gradientProp = (clampedValue - colorRangeMin) / (colorRangeMax - colorRangeMin);
      const r = Math.round(239 + (34 - 239) * gradientProp);
      const g = Math.round(68 + (197 - 68) * gradientProp);
      const b = Math.round(68 + (85 - 68) * gradientProp);
      needleColor = `rgb(${r}, ${g}, ${b})`;
    }
  } else {
    // Default gradient: red -> yellow -> green
    if (proportion < 0.5) {
      const gradientProp = proportion * 2;
      const r = 239;
      const g = Math.round(68 + (234 - 68) * gradientProp);
      const b = 68;
      needleColor = `rgb(${r}, ${g}, ${b})`;
    } else {
      const gradientProp = (proportion - 0.5) * 2;
      const r = Math.round(239 - (239 - 34) * gradientProp);
      const g = 234;
      const b = Math.round(68 + (85 - 68) * gradientProp);
      needleColor = `rgb(${r}, ${g}, ${b})`;
    }
  }

  // Draw arc path
  const arcStartRad = (startAngle * Math.PI) / 180;
  const arcStartX = Math.cos(arcStartRad) * radius;
  const arcStartY = Math.sin(arcStartRad) * radius;

  const arcEndX = Math.cos(needleRad) * radius;
  const arcEndY = Math.sin(needleRad) * radius;

  const largeArc = radialSpan > 180 ? 1 : 0;

  const arcPath = `M ${size / 2 + arcStartX} ${size / 2 + arcStartY} A ${radius} ${radius} 0 ${largeArc} 1 ${size / 2 + arcEndX} ${size / 2 + arcEndY}`;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="bg-gray-800 rounded-full">
        {/* Background circle */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#404040" strokeWidth="2" />

        {/* Gauge arc (colored) */}
        <path d={arcPath} fill="none" stroke={needleColor} strokeWidth="3" strokeLinecap="round" />

        {/* Needle */}
        <line
          x1={size / 2}
          y1={size / 2}
          x2={size / 2 + needleX}
          y2={size / 2 + needleY}
          stroke={needleColor}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Center circle */}
        <circle cx={size / 2} cy={size / 2} r="6" fill={needleColor} />

        {/* Min/Max labels */}
        <text
          x={size / 2 + Math.cos(arcStartRad) * radius * 1.3}
          y={size / 2 + Math.sin(arcStartRad) * radius * 1.3}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs fill-gray-500 font-mono"
        >
          {min}
        </text>
        <text
          x={size / 2 + Math.cos(needleRad + (radialSpan * Math.PI) / 180) * radius * 1.3}
          y={size / 2 + Math.sin(needleRad + (radialSpan * Math.PI) / 180) * radius * 1.3}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs fill-gray-500 font-mono"
        >
          {max}
        </text>

        {/* Current value */}
        <text
          x={size / 2}
          y={size / 2 + size / 3}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm fill-gray-300 font-bold"
        >
          ${clampedValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </text>
      </svg>
      <p className="mt-2 text-sm font-semibold text-gray-200 text-center">{label}</p>
    </div>
  );
};
