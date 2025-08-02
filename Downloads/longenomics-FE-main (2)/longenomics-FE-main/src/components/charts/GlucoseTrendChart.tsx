import React from 'react';
import { motion } from 'framer-motion';

interface AdvancedGlucoseChartProps {
  dataIndex: number;
  isDarkTheme?: boolean;
}

const GlucoseTrendChart: React.FC<AdvancedGlucoseChartProps> = ({ dataIndex, isDarkTheme = true }) => {
  // Multiple datasets for different time periods
  const datasets = [
    // Last Week
    {
      glucose: [82, 85, 88, 84, 87, 89, 86, 83, 85, 88, 90, 87, 85, 89, 91, 88, 86, 84, 87, 89, 85, 88, 90, 87],
      target: [85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85],
      zones: [
        { name: 'Normal', min: 70, max: 100, color: '#10B981' },
        { name: 'Pre-diabetic', min: 100, max: 125, color: '#F59E0B' },
        { name: 'Diabetic', min: 125, max: 200, color: '#EF4444' }
      ]
    },
    // This Week
    {
      glucose: [85, 87, 89, 86, 88, 90, 87, 85, 88, 91, 89, 87, 86, 90, 92, 89, 87, 85, 88, 90, 87, 89, 91, 88],
      target: [85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85],
      zones: [
        { name: 'Normal', min: 70, max: 100, color: '#10B981' },
        { name: 'Pre-diabetic', min: 100, max: 125, color: '#F59E0B' },
        { name: 'Diabetic', min: 125, max: 200, color: '#EF4444' }
      ]
    },
    // Next Week Preview
    {
      glucose: [88, 90, 92, 89, 91, 93, 90, 88, 91, 94, 92, 90, 89, 93, 95, 92, 90, 88, 91, 93, 90, 92, 94, 91],
      target: [85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85],
      zones: [
        { name: 'Normal', min: 70, max: 100, color: '#10B981' },
        { name: 'Pre-diabetic', min: 100, max: 125, color: '#F59E0B' },
        { name: 'Diabetic', min: 125, max: 200, color: '#EF4444' }
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
  const allValues = [...currentData.glucose, ...currentData.target];
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

  const glucosePath = createPath(currentData.glucose);
  const targetPath = createPath(currentData.target);

  // Create area path for glucose
  const createAreaPath = (data: number[]) => {
    const linePath = createPath(data);
    const bottomY = chartHeight;
    const firstX = 0;
    const lastX = chartWidth;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const glucoseAreaPath = createAreaPath(currentData.glucose);

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
          <h3 className="text-lg font-semibold text-white">Glucose Levels</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-teal-400"></div>
              <span className="text-sm text-gray-300">Glucose</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="text-sm text-gray-300">Target</span>
            </div>
          </div>
        </div>
        
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          <defs>
            <linearGradient id="glucoseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.02" />
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
                  x="-15"
                  y={line.y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-400"
                >
                  {line.value}
                </text>
              </g>
            ))}

            {/* Area fill for glucose */}
            <motion.path
              d={glucoseAreaPath}
              fill="url(#glucoseGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />

            {/* Target line */}
            <motion.path
              d={targetPath}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeDasharray="6,4"
              opacity="0.8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Main glucose line */}
            <motion.path
              d={glucosePath}
              fill="none"
              stroke="#14B8A6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
            />

            {/* Data points */}
            {currentData.glucose.map((value, index) => {
              if (index % 4 !== 0) return null;
              const x = (index / (currentData.glucose.length - 1)) * chartWidth;
              const y = chartHeight - ((value - minValue) / valueRange) * chartHeight;
              
              return (
                <motion.circle
                  key={index}
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
          <g transform={`translate(${width - 120}, 30}`}>
            <rect
              x="0"
              y="0"
              width="100"
              height="70"
              rx="8"
              fill="rgba(17, 24, 39, 0.8)"
              stroke="rgba(55, 65, 81, 0.5)"
              strokeWidth="1"
            />
            <text x="50" y="20" textAnchor="middle" className="text-xs fill-gray-400">
              Current Level
            </text>
            <text x="50" y="40" textAnchor="middle" className="text-lg font-bold fill-teal-400">
              {currentData.glucose[currentData.glucose.length - 1]} mg/dL
            </text>
            <text x="50" y="60" textAnchor="middle" className="text-xs fill-green-400">
              Normal Range
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default GlucoseTrendChart;