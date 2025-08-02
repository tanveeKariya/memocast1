import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Eye,
  Heart,
  Activity,
  Zap,
  Settings
} from 'lucide-react';

// Human Body Component with Surrounding Organs
const HumanBody: React.FC<{ biomarkers: any[] }> = ({ biomarkers }) => {
  const [hoveredOrgan, setHoveredOrgan] = useState<string | null>(null);

  const surroundingOrgans = [
    { name: 'Brain', icon: Brain, x: 55, y: 8, color: '#8B5CF6', marker: 'Glucose', value: '85 mg/dL', status: 'optimal' },
    { name: 'Eyes', icon: Eye, x: 85, y: 20, color: '#10B981', marker: 'Vision', value: '20/20', status: 'optimal' },
    { name: 'Heart', icon: Heart, x: 15, y: 35, color: '#EF4444', marker: 'Heart Rate', value: '72 bpm', status: 'optimal' },
    { name: 'Lungs', icon: Settings, x: 85, y: 40, color: '#06B6D4', marker: 'SpO2', value: '98%', status: 'optimal' },
    { name: 'Liver', icon: Activity, x: 15, y: 55, color: '#F59E0B', marker: 'ALT', value: '25 U/L', status: 'optimal' },
    { name: 'Kidneys', icon: Zap, x: 85, y: 65, color: '#3B82F6', marker: 'Creatinine', value: '0.9 mg/dL', status: 'optimal' },
  ];

  const tooltipThresholdY = 30; // Organs with y < 30 will have tooltip below them

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-gray-900/40 to-gray-800/40 rounded-2xl overflow-hidden border border-gray-700/50">
      {/* Human Body Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <img
              src="/body.jpg"
              alt="Human Body Anatomy"
              className="w-64 h-100 object-cover rounded-lg opacity-70 filter grayscale contrast-125"
              style={{
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.8) 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.8) 100%)'
              }}
            />

            {/* Overlay gradient for better integration */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-purple-900/20 rounded-lg"></div>

            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-lg shadow-2xl shadow-blue-500/20"></div>
          </motion.div>
        </div>
      </div>

      {/* Surrounding Organ Icons */}
      {surroundingOrgans.map((organ, index) => {
        const isTooltipAbove = organ.y >= tooltipThresholdY;
        const tooltipPositionClasses = isTooltipAbove ? "bottom-full mb-3" : "top-full mt-3";
        const arrowPositionClasses = isTooltipAbove ? "top-full border-t-4 border-t-gray-900" : "bottom-full border-b-4 border-b-gray-900";

        return (
          <motion.div
            key={`organ-${index}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            style={{ left: `${organ.x}%`, top: `${organ.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.2 + 1.2, duration: 0.5 }}
            onMouseEnter={() => setHoveredOrgan(organ.name)}
            onMouseLeave={() => setHoveredOrgan(null)}
          >
            <motion.div
              className={`relative p-4 rounded-full backdrop-blur-sm border-2 transition-all duration-300 ${
                hoveredOrgan === organ.name
                  ? 'bg-gray-800/80 border-white/40 shadow-2xl'
                  : 'bg-gray-800/60 border-gray-600/60 hover:border-gray-400 hover:bg-gray-800/70'
              }`}
              animate={{
                scale: hoveredOrgan === organ.name ? 1.2 : 1,
                boxShadow: hoveredOrgan === organ.name
                  ? `0 0 30px ${organ.color}60`
                  : '0 0 0px transparent'
              }}
              transition={{ duration: 0.3 }}
            >
              <organ.icon
                className="w-6 h-6 transition-colors duration-300"
                style={{ color: organ.color }}
              />

              {/* Pulsing ring effect */}
              {hoveredOrgan === organ.name && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: organ.color }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.8, 0, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>

            {/* Organ Tooltip */}
            <AnimatePresence>
              {hoveredOrgan === organ.name && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  className={`absolute left-1/2 transform -translate-x-1/2 p-4 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl min-w-40 z-50 ${tooltipPositionClasses}`}
                >
                  <div className="text-center">
                    <div className="font-bold text-white text-sm mb-1">{organ.name}</div>
                    <div className="text-xs text-gray-400 mb-2">{organ.marker}</div>
                    <div className="text-lg font-bold mb-2" style={{ color: organ.color }}>
                      {organ.value}
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                      {organ.status}
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-transparent ${arrowPositionClasses}`}></div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Animated Energy Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Subtle pulse effect around the container */}
      <motion.div
        className="absolute inset-0 rounded-2xl border border-blue-400/20"
        animate={{
          scale: [1, 1.01, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

// Body Overview Section Component
const BodyOverview: React.FC = () => {
  const biomarkerData = [
    { name: 'Glucose', value: 85, status: 'optimal', color: 'text-green-400' },
    { name: 'Cholesterol', value: 180, status: 'moderate', color: 'text-yellow-400' },
    { name: 'Blood Pressure', value: 120, status: 'optimal', color: 'text-green-400' },
    { name: 'Vitamin D', value: 32, status: 'low', color: 'text-red-400' },
    { name: 'HbA1c', value: 5.2, status: 'optimal', color: 'text-green-400' },
    { name: 'CRP', value: 1.8, status: 'moderate', color: 'text-yellow-400' },
  ];

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1.0 }}
      className="mb-8"
    >
      <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
        <h3 className="text-xl font-bold mb-4">Body Overview</h3>
        <HumanBody biomarkers={biomarkerData} />
      </div>
    </motion.div>
  );
};

export default BodyOverview;