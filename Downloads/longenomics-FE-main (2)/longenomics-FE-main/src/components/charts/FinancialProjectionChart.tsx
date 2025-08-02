import React from 'react';
import { motion } from 'framer-motion';

const FinancialProjectionChart: React.FC = () => {
  const years = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];
  const savings = [0, 2500, 5200, 8100, 11500, 15200, 19800];
  const costs = [0, 800, 1400, 2200, 3000, 3900, 4800];
  
  const maxValue = Math.max(...savings, ...costs);
  const width = 600;
  const height = 240;
  const padding = { top: 20, right: 40, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const getSavingsPoints = () => {
    return savings.map((value, index) => {
      const x = (index / (savings.length - 1)) * chartWidth;
      const y = chartHeight - ((value / maxValue) * chartHeight);
      return `${x},${y}`;
    }).join(' ');
  };

  const getCostsPoints = () => {
    return costs.map((value, index) => {
      const x = (index / (costs.length - 1)) * chartWidth;
      const y = chartHeight - ((value / maxValue) * chartHeight);
      return `${x},${y}`;
    }).join(' ');
  };

  const savingsPoints = getSavingsPoints();
  const costsPoints = getCostsPoints();

  // Grid lines
  const gridLines = [];
  for (let i = 0; i <= 5; i++) {
    const y = (i / 5) * chartHeight;
    const value = maxValue - (i / 5) * maxValue;
    gridLines.push({ y, value: Math.round(value) });
  }

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg border border-gray-800">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Financial Projection</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-teal-400"></div>
              <span className="text-sm text-gray-300">Savings</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="text-sm text-gray-300">Costs</span>
            </div>
          </div>
        </div>
        
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id="savingsAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
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
                  ${(line.value / 1000).toFixed(0)}k
                </text>
              </g>
            ))}

            {/* Area under savings curve */}
            <motion.polygon
              points={`0,${chartHeight} ${savingsPoints} ${chartWidth},${chartHeight}`}
              fill="url(#savingsAreaGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />

            {/* Savings line */}
            <motion.polyline
              points={savingsPoints}
              fill="none"
              stroke="#14B8A6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Costs line */}
            <motion.polyline
              points={costsPoints}
              fill="none"
              stroke="#EF4444"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="6,4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
            />

            {/* Data points for savings */}
            {savings.map((value, index) => (
              <motion.circle
                key={`savings-${index}`}
                cx={(index / (savings.length - 1)) * chartWidth}
                cy={chartHeight - ((value / maxValue) * chartHeight)}
                r="4"
                fill="#14B8A6"
                stroke="#1F2937"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
                className="hover:r-5 transition-all cursor-pointer"
              />
            ))}

            {/* Data points for costs */}
            {costs.map((value, index) => (
              <motion.circle
                key={`costs-${index}`}
                cx={(index / (costs.length - 1)) * chartWidth}
                cy={chartHeight - ((value / maxValue) * chartHeight)}
                r="3"
                fill="#EF4444"
                stroke="#1F2937"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.8, duration: 0.3 }}
                className="hover:r-4 transition-all cursor-pointer"
              />
            ))}

            {/* Year labels */}
            {years.map((year, index) => (
              <text
                key={index}
                x={(index / (years.length - 1)) * chartWidth}
                y={chartHeight + 25}
                textAnchor="middle"
                className="text-xs fill-gray-400"
              >
                {year}
              </text>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default FinancialProjectionChart;