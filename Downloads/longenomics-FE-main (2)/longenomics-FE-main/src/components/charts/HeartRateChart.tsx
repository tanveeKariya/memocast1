import React from 'react';
import { motion } from 'framer-motion';

interface AdvancedHeartRateChartProps {
  dataIndex: number;
  isDarkTheme?: boolean;
}

const HeartRateChart: React.FC<AdvancedHeartRateChartProps> = ({ dataIndex, isDarkTheme = true }) => {
  // Multiple datasets for different time periods
  const datasets = [
    // Last Week
    {
      heartRate: [68, 72, 75, 70, 73, 76, 71, 69, 74, 77, 73, 70, 68, 75, 78, 74, 71, 69, 73, 76, 72, 74, 77, 73],
      restingHR: [65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65],
      zones: [
        { name: 'Zone 1 (Recovery)', min: 65, max: 108, color: '#10B981' },
        { name: 'Zone 2 (Aerobic)', min: 108, max: 126, color: '#3B82F6' },
        { name: 'Zone 3 (Threshold)', min: 126, max: 144, color: '#F59E0B' },
        { name: 'Zone 4 (Anaerobic)', min: 144, max: 162, color: '#EF4444' },
        { name: 'Zone 5 (Max)', min: 162, max: 180, color: '#8B5CF6' }
      ]
    },
    // This Week
    {
      heartRate: [70, 74, 77, 72, 75, 78, 73, 71, 76, 79, 75, 72, 70, 77, 80, 76, 73, 71, 75, 78, 74, 76, 79, 75],
      restingHR: [65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65],
      zones: [
        { name: 'Zone 1 (Recovery)', min: 65, max: 108, color: '#10B981' },
        { name: 'Zone 2 (Aerobic)', min: 108, max: 126, color: '#3B82F6' },
        { name: 'Zone 3 (Threshold)', min: 126, max: 144, color: '#F59E0B' },
        { name: 'Zone 4 (Anaerobic)', min: 144, max: 162, color: '#EF4444' },
        { name: 'Zone 5 (Max)', min: 162, max: 180, color: '#8B5CF6' }
      ]
    },
    // Next Week Preview
    {
      heartRate: [72, 76, 79, 74, 77, 80, 75, 73, 78, 81, 77, 74, 72, 79, 82, 78, 75, 73, 77, 80, 76, 78, 81, 77],
      restingHR: [65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65],
      zones: [
        { name: 'Zone 1 (Recovery)', min: 65, max: 108, color: '#10B981' },
        { name: 'Zone 2 (Aerobic)', min: 108, max: 126, color: '#3B82F6' },
        { name: 'Zone 3 (Threshold)', min: 126, max: 144, color: '#F59E0B' },
        { name: 'Zone 4 (Anaerobic)', min: 144, max: 162, color: '#EF4444' },
        { name: 'Zone 5 (Max)', min: 162, max: 180, color: '#8B5CF6' }
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
  const allValues = [...currentData.heartRate, ...currentData.restingHR];
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

  const heartRatePath = createPath(currentData.heartRate);
  const restingHRPath = createPath(currentData.restingHR);

  // Create area path for heart rate
  const createAreaPath = (data: number[]) => {
    const linePath = createPath(data);
    const bottomY = chartHeight;
    const firstX = 0;
    const lastX = chartWidth;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const heartRateAreaPath = createAreaPath(currentData.heartRate);

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
          <h3 className="text-lg font-semibold text-white">Heart Rate</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-teal-400"></div>
              <span className="text-sm text-gray-300">Heart Rate</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-sm text-gray-300">Resting HR</span>
            </div>
          </div>
        </div>
        
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          <defs>
            <linearGradient id="heartRateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
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

            {/* Area fill for heart rate */}
            <motion.path
              d={heartRateAreaPath}
              fill="url(#heartRateGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />

            {/* Resting heart rate line */}
            <motion.path
              d={restingHRPath}
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeDasharray="6,4"
              opacity="0.8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Main heart rate line */}
            <motion.path
              d={heartRatePath}
              fill="none"
              stroke="#14B8A6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
            />

            {/* Data points with heart beat effect */}
            {currentData.heartRate.map((value, index) => {
              if (index % 4 !== 0) return null;
              const x = (index / (currentData.heartRate.length - 1)) * chartWidth;
              const y = chartHeight - ((value - minValue) / valueRange) * chartHeight;
              
              return (
                <motion.g key={index}>
                  <motion.circle
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
                  {/* Subtle pulse effect */}
                  <motion.circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill="none"
                    stroke="#14B8A6"
                    strokeWidth="1"
                    opacity="0"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                </motion.g>
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
              height="70"
              rx="8"
              fill="rgba(17, 24, 39, 0.8)"
              stroke="rgba(55, 65, 81, 0.5)"
              strokeWidth="1"
            />
            <text x="50" y="20" textAnchor="middle" className="text-xs fill-gray-400">
              Current HR
            </text>
            <text x="50" y="40" textAnchor="middle" className="text-lg font-bold fill-teal-400">
              {currentData.heartRate[currentData.heartRate.length - 1]} BPM
            </text>
            <text x="50" y="60" textAnchor="middle" className="text-xs fill-green-400">
              Zone 1 - Recovery
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default HeartRateChart;