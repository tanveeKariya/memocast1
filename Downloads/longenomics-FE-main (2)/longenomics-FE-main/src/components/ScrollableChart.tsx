import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScrollableChartProps {
  title: string;
  children: React.ReactNode;
  isDarkTheme: boolean;
  onNavigate?: (direction: 'prev' | 'next') => void;
  currentPeriod?: string;
}

const ScrollableChart: React.FC<ScrollableChartProps> = ({ 
  title, 
  children, 
  isDarkTheme, 
  onNavigate,
  currentPeriod = "This Week"
}) => {
  return (
    <div className={`${isDarkTheme ? 'bg-gray-900/60' : 'bg-white/60'} backdrop-blur-xl rounded-2xl p-6 border ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>{currentPeriod}</p>
        </div>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate?.('prev')}
            className={`p-2 ${isDarkTheme ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors`}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate?.('next')}
            className={`p-2 ${isDarkTheme ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors`}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ScrollableChart;