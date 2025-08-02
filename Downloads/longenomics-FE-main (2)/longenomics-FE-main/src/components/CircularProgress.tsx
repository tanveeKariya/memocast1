import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

interface CircularProgressProps {
  value: number;          // Progress value (0–100)
  size?: number;          // Size of the circle in px
  strokeWidth?: number;   // Thickness of the circle
  duration?: number;      // Animation duration in seconds
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 10,
  duration = 1
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      strokeDashoffset: offset,
      transition: { duration, ease: "easeInOut" }
    });
  }, [value]);

  return (
    <div className="relative w-fit h-fit">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb" // Tailwind gray-200
          strokeWidth={strokeWidth}
        />
        {/* Animated progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={controls}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />  {/* cyan-500 */}
            <stop offset="100%" stopColor="#3B82F6" /> {/* blue-500 */}
          </linearGradient>
        </defs>
      </svg>

      {/* Centered value */}
      <div
        className="absolute inset-0 flex items-center justify-center text-cyan-500 font-semibold"
        style={{ fontSize: size * 0.2 }}
      >
        {value}%
      </div>
    </div>
  );
};

export default CircularProgress;
