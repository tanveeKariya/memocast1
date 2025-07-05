import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Mic, FileText, Share2, Sparkles } from 'lucide-react';

interface OnboardingSlidesProps {
  onComplete: () => void;
}

export const OnboardingSlides: React.FC<OnboardingSlidesProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: (
        <motion.div 
          className="w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded-3xl flex items-center justify-center mb-8"
          animate={{ 
            rotateY: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div 
            className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div 
              className="w-12 h-16 bg-gradient-to-b from-pink-400 to-purple-500 rounded-lg relative"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.div 
                className="absolute top-2 left-2 w-6 h-6 bg-cyan-300 rounded-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.div 
                className="absolute bottom-2 right-1 w-3 h-8 bg-yellow-400 rounded-full"
                animate={{ scaleY: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      ),
      title: "Take Notes as audio or text",
      description: "You can take notes as audio and text using your phone at your fingertip"
    },
    {
      icon: (
        <motion.div 
          className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl flex items-center justify-center mb-8"
          animate={{ 
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 0 0 rgba(34, 197, 94, 0.4)",
              "0 0 0 20px rgba(34, 197, 94, 0)",
              "0 0 0 0 rgba(34, 197, 94, 0)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Mic className="w-16 h-16 text-white" />
          </motion.div>
        </motion.div>
      ),
      title: "Voice Recording Made Easy",
      description: "Record your thoughts instantly with our advanced voice-to-text technology"
    },
    {
      icon: (
        <motion.div 
          className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl flex items-center justify-center mb-8"
          animate={{ 
            rotate: [0, 5, -5, 0],
            background: [
              "linear-gradient(135deg, #fb923c, #ef4444)",
              "linear-gradient(135deg, #f97316, #dc2626)",
              "linear-gradient(135deg, #fb923c, #ef4444)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-16 h-16 text-white" />
          </motion.div>
        </motion.div>
      ),
      title: "AI-Powered Enhancement",
      description: "Transform your notes with AI to create professional content for any platform"
    },
    {
      icon: (
        <motion.div 
          className="w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl flex items-center justify-center mb-8"
          animate={{ 
            y: [0, -10, 0],
            boxShadow: [
              "0 10px 30px rgba(168, 85, 247, 0.3)",
              "0 20px 40px rgba(168, 85, 247, 0.4)",
              "0 10px 30px rgba(168, 85, 247, 0.3)"
            ]
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <motion.div
            animate={{ 
              x: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Share2 className="w-16 h-16 text-white" />
          </motion.div>
        </motion.div>
      ),
      title: "Share Everywhere",
      description: "Publish your enhanced content directly to LinkedIn, Twitter, and Instagram"
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
      <motion.div 
        className="w-full max-w-md text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <h1 className="text-3xl font-bold mb-2">Memocast.co</h1>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            {slides[currentSlide].icon}
            
            <motion.h2 
              className="text-2xl font-bold mb-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {slides[currentSlide].title}
            </motion.h2>
            
            <motion.p 
              className="text-lg text-white/80 text-center mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {slides[currentSlide].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <motion.div 
          className="flex justify-center space-x-2 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/30'
              }`}
              animate={{ 
                scale: index === currentSlide ? 1.2 : 1,
                opacity: index === currentSlide ? 1 : 0.5
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div 
          className="flex justify-between items-center w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={skipOnboarding}
            className="text-white/70 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Skip
          </motion.button>
          
          <motion.button
            onClick={nextSlide}
            className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-white/30 transition-all"
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};