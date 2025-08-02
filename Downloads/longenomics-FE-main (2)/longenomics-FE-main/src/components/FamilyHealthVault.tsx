import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Star } from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  x: number;
  y: number;
  generation: string;
  health: {
    diabetes: string;
    heart: string;
    bp: string;
  };
  age: number;
  biomarkers: {
    glucose: number;
    cholesterol: number;
    bp: number;
    vitaminD: number;
    hba1c: number;
    crp: number;
  };
}

interface FamilyHealthVaultProps {
  onMemberSelect: (member: FamilyMember) => void;
  isDarkTheme: boolean;
}

const FamilyHealthVault: React.FC<FamilyHealthVaultProps> = ({ onMemberSelect, isDarkTheme }) => {
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<string>('user');

  const familyMembers: FamilyMember[] = [
    // Grandparents level
    { id: 'grandpa-p', name: 'Grandpa (P)', x: 20, y: 10, generation: 'grandparents', health: { diabetes: 'high', heart: 'moderate', bp: 'high' }, age: 78, biomarkers: { glucose: 140, cholesterol: 220, bp: 150, vitaminD: 18, hba1c: 6.8, crp: 3.2 } },
    { id: 'grandma-p', name: 'Grandma (P)', x: 35, y: 10, generation: 'grandparents', health: { diabetes: 'low', heart: 'low', bp: 'moderate' }, age: 75, biomarkers: { glucose: 95, cholesterol: 190, bp: 130, vitaminD: 25, hba1c: 5.5, crp: 2.1 } },
    { id: 'grandpa-m', name: 'Grandpa (M)', x: 65, y: 10, generation: 'grandparents', health: { diabetes: 'moderate', heart: 'high', bp: 'high' }, age: 82, biomarkers: { glucose: 115, cholesterol: 240, bp: 160, vitaminD: 15, hba1c: 6.2, crp: 4.1 } },
    { id: 'grandma-m', name: 'Grandma (M)', x: 80, y: 10, generation: 'grandparents', health: { diabetes: 'low', heart: 'low', bp: 'low' }, age: 79, biomarkers: { glucose: 88, cholesterol: 170, bp: 120, vitaminD: 30, hba1c: 5.2, crp: 1.5 } },
    
    // Parents level
    { id: 'father', name: 'Father', x: 27.5, y: 35, generation: 'parents', health: { diabetes: 'moderate', heart: 'moderate', bp: 'high' }, age: 58, biomarkers: { glucose: 108, cholesterol: 200, bp: 140, vitaminD: 22, hba1c: 5.8, crp: 2.5 } },
    { id: 'mother', name: 'Mother', x: 72.5, y: 35, generation: 'parents', health: { diabetes: 'low', heart: 'low', bp: 'moderate' }, age: 55, biomarkers: { glucose: 92, cholesterol: 185, bp: 125, vitaminD: 28, hba1c: 5.3, crp: 1.8 } },
    
    // Current generation
    { id: 'user', name: 'You', x: 50, y: 60, generation: 'current', health: { diabetes: 'low', heart: 'low', bp: 'low' }, age: 36, biomarkers: { glucose: 85, cholesterol: 180, bp: 120, vitaminD: 32, hba1c: 5.2, crp: 1.8 } },
    { id: 'sibling', name: 'Sibling', x: 35, y: 60, generation: 'current', health: { diabetes: 'low', heart: 'moderate', bp: 'low' }, age: 34, biomarkers: { glucose: 90, cholesterol: 175, bp: 118, vitaminD: 29, hba1c: 5.1, crp: 2.0 } },
    
    // Children level
    { id: 'child1', name: 'Child 1', x: 45, y: 85, generation: 'children', health: { diabetes: 'low', heart: 'low', bp: 'low' }, age: 8, biomarkers: { glucose: 82, cholesterol: 150, bp: 100, vitaminD: 35, hba1c: 4.8, crp: 1.2 } },
    { id: 'child2', name: 'Child 2', x: 55, y: 85, generation: 'children', health: { diabetes: 'low', heart: 'low', bp: 'low' }, age: 6, biomarkers: { glucose: 80, cholesterol: 145, bp: 95, vitaminD: 38, hba1c: 4.7, crp: 1.0 } }
  ];

  const getHealthColor = (level: string) => {
    switch (level) {
      case 'high': return '#EF4444';
      case 'moderate': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const handleMemberClick = (member: FamilyMember) => {
    setSelectedMember(member.id);
    onMemberSelect(member);
  };

  const connections = [
    { from: 'grandpa-p', to: 'father' },
    { from: 'grandma-p', to: 'father' },
    { from: 'grandpa-m', to: 'mother' },
    { from: 'grandma-m', to: 'mother' },
    { from: 'father', to: 'user' },
    { from: 'mother', to: 'user' },
    { from: 'father', to: 'sibling' },
    { from: 'mother', to: 'sibling' },
    { from: 'user', to: 'child1' },
    { from: 'user', to: 'child2' }
  ];

  const tooltipThresholdY = 50;

  return (
    <div className="relative">
      <h3 className="text-lg font-semibold mb-4">Family Health Vault</h3>
      
      <div className={`relative w-full h-80 ${isDarkTheme ? 'bg-gray-800/30' : 'bg-gray-100/30'} rounded-xl overflow-hidden`}>
        <svg width="100%" height="100%" className="absolute inset-0">
          {connections.map((connection, index) => {
            const fromMember = familyMembers.find(m => m.id === connection.from);
            const toMember = familyMembers.find(m => m.id === connection.to);
            if (!fromMember || !toMember) return null;

            return (
              <line
                key={index}
                x1={`${fromMember.x}%`}
                y1={`${fromMember.y}%`}
                x2={`${toMember.x}%`}
                y2={`${toMember.y}%`}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {familyMembers.map((member) => {
          const isTooltipAbove = member.y >= tooltipThresholdY;
          const tooltipPositionClasses = isTooltipAbove ? "bottom-full mb-3" : "top-full mt-3";
          const arrowPositionClasses = isTooltipAbove ? "top-full border-t-4 border-t-gray-900" : "bottom-full border-b-4 border-b-gray-900";
          const isSelected = selectedMember === member.id;

          return (
            <div
              key={member.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: `${member.x}%`, top: `${member.y}%` }}
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
              onClick={() => handleMemberClick(member)}
            >
              <motion.div
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-400/50'
                    : member.id === 'user'
                    ? 'bg-teal-600 border-teal-400'
                    : `${isDarkTheme ? 'bg-gray-700 border-gray-500 hover:border-gray-400' : 'bg-white border-gray-300 hover:border-gray-400'}`
                }`}
                animate={{
                  scale: hoveredMember === member.id || isSelected ? 1.2 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <Users className="w-6 h-6 text-white" />
              </motion.div>
              
              <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs text-center whitespace-nowrap ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                {member.name}
              </div>

              <AnimatePresence>
                {hoveredMember === member.id && (
                  <motion.div
                    initial={{ opacity: 0, y: isTooltipAbove ? 10 : -10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: isTooltipAbove ? 10 : -10, scale: 0.8 }}
                    className={`absolute left-1/2 transform -translate-x-1/2 p-3 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg min-w-32 z-50 ${tooltipPositionClasses}`}
                  >
                    <div className="text-center">
                      <div className="font-bold text-white text-sm mb-2">{member.name}</div>
                      <div className="text-xs text-gray-400 mb-2">Age: {member.age}</div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Diabetes:</span>
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getHealthColor(member.health.diabetes) }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Heart:</span>
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getHealthColor(member.health.heart) }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>BP:</span>
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getHealthColor(member.health.bp) }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-transparent ${arrowPositionClasses}`}></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center space-x-6 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
          <span>High Risk</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
          <span>Moderate Risk</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
          <span>Low Risk</span>
        </div>
      </div>
    </div>
  );
};

export default FamilyHealthVault;