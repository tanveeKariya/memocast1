import React from 'react';
import { User } from 'lucide-react';

interface PatientProfileProps {
  name: string;
  age: number;
  isDarkTheme: boolean;
}

const PatientProfile: React.FC<PatientProfileProps> = ({ name, age, isDarkTheme }) => {
  return (
    <div className={`${isDarkTheme ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100/50 border-gray-200'} rounded-xl p-4 border`}>
      <h3 className="text-lg font-semibold mb-3">Patient Profile</h3>
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="font-bold text-lg">{name}</div>
          <div className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Age: {age}</div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;