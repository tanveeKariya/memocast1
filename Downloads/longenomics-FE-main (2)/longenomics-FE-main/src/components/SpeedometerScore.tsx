import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface SpeedometerScoreProps {
  score: number;
  isDarkTheme: boolean;
}

const SpeedometerScore: React.FC<SpeedometerScoreProps> = ({ score, isDarkTheme }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        let current = 0;
        const increment = score / 60;
        const interval = setInterval(() => {
          current += increment;
          if (current >= score) {
            current = score;
            clearInterval(interval);
          }
          setAnimatedScore(Math.round(current));
        }, 25);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, score]);

  const radius = 80;
  const strokeWidth = 12;

  return (
    <div ref={ref} className="text-center">
      <div className="relative w-48 h-32 mx-auto mb-4">
        <svg width="192" height="128" viewBox="0 0 192 128" className="overflow-visible">
          <defs>
            <linearGradient id="speedometerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="30%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>

          {/* Background arc */}
          <path
            d={`M 16 96 A ${radius} ${radius} 0 0 1 176 96`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Animated progress arc */}
          <motion.path
            d={`M 16 96 A ${radius} ${radius} 0 0 1 176 96`}
            fill="none"
            stroke="url(#speedometerGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray="251.2"
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset: isVisible ? 251.2 - (animatedScore / 100) * 251.2 : 251.2 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.5 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="text-center"
      >
        <div className="text-4xl font-bold text-cyan-400 mb-2">{animatedScore}</div>
        <h3 className="text-xl font-bold">Longevity Score</h3>
        <p className={`${isDarkTheme ? 'text-gray-500' : 'text-gray-600'}`}>
          {animatedScore >= 80 ? 'Excellent' : animatedScore >= 60 ? 'Good' : 'Needs Improvement'}
        </p>
      </motion.div>
    </div>
  );
};

export default SpeedometerScore;
