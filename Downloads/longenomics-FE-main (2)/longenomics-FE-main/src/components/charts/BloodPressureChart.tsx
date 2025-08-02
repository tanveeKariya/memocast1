import React from 'react';
import { motion } from 'framer-motion';

interface AdvancedBloodPressureChartProps {
  dataIndex: number;
  isDarkTheme?: boolean;
}

const BloodPressureChart: React.FC<AdvancedBloodPressureChartProps> = ({ dataIndex, isDarkTheme = true }) => {
  // Multiple datasets for different time periods
  const datasets = [
    // Last Week
    {
      systolic: [118, 120, 122, 119, 121, 123, 120, 118, 119, 121, 124, 122, 120, 118, 121, 123, 119, 120, 122, 121, 119, 120, 122, 120],
      diastolic: [78, 80, 82, 79, 81, 83, 80, 78, 79, 81, 84, 82, 80, 78, 81, 83, 79, 80, 82, 81, 79, 80, 82, 80],
      zones: [
        { name: 'Normal', systolicMin: 90, systolicMax: 120, diastolicMin: 60, diastolicMax: 80, color: '#10B981' },
        { name: 'Elevated', systolicMin: 120, systolicMax: 129, diastolicMin: 60, diastolicMax: 80, color: '#F59E0B' },
        { name: 'High Stage 1', systolicMin: 130, systolicMax: 139, diastolicMin: 80, diastolicMax: 89, color: '#EF4444' },
        { name: 'High Stage 2', systolicMin: 140, systolicMax: 180, diastolicMin: 90, diastolicMax: 120, color: '#DC2626' }
      ]
    },
    // This Week
    {
      systolic: [120, 122, 124, 121, 123, 125, 122, 120, 121, 123, 126, 124, 122, 120, 123, 125, 121, 122, 124, 123, 121, 122, 124, 122],
      diastolic: [80, 82, 84, 81, 83, 85, 82, 80, 81, 83, 86, 84, 82, 80, 83, 85, 81, 82, 84, 83, 81, 82, 84, 82],
      zones: [
        { name: 'Normal', systolicMin: 90, systolicMax: 120, diastolicMin: 60, diastolicMax: 80, color: '#10B981' },
        { name: 'Elevated', systolicMin: 120, systolicMax: 129, diastolicMin: 60, diastolicMax: 80, color: '#F59E0B' },
        { name: 'High Stage 1', systolicMin: 130, systolicMax: 139, diastolicMin: 80, diastolicMax: 89, color: '#EF4444' },
        { name: 'High Stage 2', systolicMin: 140, systolicMax: 180, diastolicMin: 90, diastolicMax: 120, color: '#DC2626' }
      ]
    },
    // Next Week Preview
    {
      systolic: [122, 124, 126, 123, 125, 127, 124, 122, 123, 125, 128, 126, 124, 122, 125, 127, 123, 124, 126, 125, 123, 124, 126, 124],
      diastolic: [82, 84, 86, 83, 85, 87, 84, 82, 83, 85, 88, 86, 84, 82, 85, 87, 83, 84, 86, 85, 83, 84, 86, 84],
      zones: [
        { name: 'Normal', systolicMin: 90, systolicMax: 120, diastolicMin: 60, diastolicMax: 80, color: '#10B981' },
        { name: 'Elevated', systolicMin: 120, systolicMax: 129, diastolicMin: 60, diastolicMax: 80, color: '#F59E0B' },
        { name: 'High Stage 1', systolicMin: 130, systolicMax: 139, diastolicMin: 80, diastolicMax: 89, color: '#EF4444' },
        { name: 'High Stage 2', systolicMin: 140, systolicMax: 180, diastolicMin: 90, diastolicMax: 120, color: '#DC2626' }
      ]
    }
  ];

  const currentData = datasets[dataIndex] || datasets[0];

  // Calculate chart dimensions
  const width = 800;
  const height = 320;
  const padding = { top: 20, right: 140, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find min/max values for scaling
  const allValues = [...currentData.systolic, ...currentData.diastolic];
  const minValue = Math.min(...allValues) - 5;
  const maxValue = Math.max(...allValues) + 10;
  const valueRange = maxValue - minValue;

  // Create path strings
  const createPath = (data: number[]) => {
    return data.map((value, index) => {
      const x = (index / (data.length - 1)) * chartWidth;
      const y = chartHeight - ((value - minValue) / valueRange) * chartHeight;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const systolicPath = createPath(currentData.systolic);
  const diastolicPath = createPath(currentData.diastolic);

  // Create area path for systolic
  const createAreaPath = (data: number[]) => {
    const linePath = createPath(data);
    const bottomY = chartHeight;
    const firstX = 0;
    const lastX = chartWidth;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const systolicAreaPath = createAreaPath(currentData.systolic);

  // Grid lines
  const gridLines = [];
  for (let i = 0; i <= 6; i++) {
    const y = (i / 6) * chartHeight;
    const value = maxValue - (i / 6) * valueRange;
    gridLines.push({ y, value: Math.round(value) });
  }

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg border border-gray-800">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Blood Pressure</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-teal-400"></div>
              <span className="text-sm text-gray-300">Systolic</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-sm text-gray-300">Diastolic</span>
            </div>
          </div>
        </div>
        
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          <defs>
            <linearGradient id="systolicGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.02" />
            </linearGradient>
            
            <linearGradient id="diastolicGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Grid lines */}
            {gridLines.map((line, index) => (
              <g key={index}>
                <line
                  x1="0"
                  y1={line.y}
                  x2={chartWidth}
                  y2={line.y}
                  stroke="rgba(55, 65, 81, 0.3)"
                  strokeWidth="1"
                />
                <text
                  x="-10"
                  y={line.y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-400"
                >
                  {line.value}
                </text>
              </g>
            ))}

            {/* Area fill for systolic */}
            <motion.path
              d={systolicAreaPath}
              fill="url(#systolicGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />

            {/* Diastolic line */}
            <motion.path
              d={diastolicPath}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Systolic line */}
            <motion.path
              d={systolicPath}
              fill="none"
              stroke="#14B8A6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
            />

            {/* Data points for systolic */}
            {currentData.systolic.map((value, index) => {
              if (index % 4 !== 0) return null;
              const x = (index / (currentData.systolic.length - 1)) * chartWidth;
              const y = chartHeight - ((value - minValue) / valueRange) * chartHeight;
              
              return (
                <motion.circle
                  key={`sys-${index}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#14B8A6"
                  stroke="#1F2937"
                  strokeWidth="2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 + 1, duration: 0.3 }}
                  className="hover:r-5 transition-all cursor-pointer"
                />
              );
            })}

            {/* Data points for diastolic */}
            {currentData.diastolic.map((value, index) => {
              if (index % 4 !== 0) return null;
              const x = (index / (currentData.diastolic.length - 1)) * chartWidth;
              const y = chartHeight - ((value - minValue) / valueRange) * chartHeight;
              
              return (
                <motion.circle
                  key={`dia-${index}`}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#3B82F6"
                  stroke="#1F2937"
                  strokeWidth="2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 + 1.2, duration: 0.3 }}
                  className="hover:r-4 transition-all cursor-pointer"
                />
              );
            })}

            {/* X-axis time labels */}
            {[0, 6, 12, 18, 24].map((hour, index) => (
              <text
                key={index}
                x={(hour / 24) * chartWidth}
                y={chartHeight + 25}
                textAnchor="middle"
                className="text-xs fill-gray-400"
              >
                {hour === 24 ? '00:00' : `${hour.toString().padStart(2, '0')}:00`}
              </text>
            ))}
          </g>

          {/* Current readings panel */}
          <g transform={`translate(${width - 120}, 30)`}>
            <rect
              x="0"
              y="0"
              width="100"
              height="80"
              rx="8"
              fill="rgba(17, 24, 39, 0.8)"
              stroke="rgba(55, 65, 81, 0.5)"
              strokeWidth="1"
            />
            <text x="50" y="20" textAnchor="middle" className="text-xs fill-gray-400">
              Current Reading
            </text>
            <text x="50" y="40" textAnchor="middle" className="text-lg font-bold fill-teal-400">
              {currentData.systolic[currentData.systolic.length - 1]}/{currentData.diastolic[currentData.diastolic.length - 1]}
            </text>
            <text x="50" y="55" textAnchor="middle" className="text-xs fill-gray-500">
              mmHg
            </text>
            <text x="50" y="70" textAnchor="middle" className="text-xs fill-green-400">
              Normal
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default BloodPressureChart;