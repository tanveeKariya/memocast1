import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Heart,
  Brain,
  Activity,
  Zap,
  Mic,
  MicOff,
  Play,
  Pause,
  BarChart3,
  TrendingUp,
  Shield,
  Target,
  Search,
  Bell,
  Settings,
  Home,
  MessageCircle,
  Stethoscope,
  TestTube,
  Pill,
  Moon,
  Sun,
  Apple,
  Dumbbell,
  ChevronDown,
  ChevronUp,
  Watch,
  Smartphone,
  Eye,
  Menu,
  X,
  Star,
  Upload,
  Download,
  FileText,
  MapPin,
  Users,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingDown
} from 'lucide-react';

// Import components
import CircularProgress from './CircularProgress';
import SpeedometerScore from './SpeedometerScore';
import FinancialProjectionChart from './charts/FinancialProjectionChart';
import GlucoseTrendChart from './charts/GlucoseTrendChart';
import HeartRateChart from './charts/HeartRateChart';
import BloodPressureChart from './charts/BloodPressureChart';
import FamilyHealthVault from './FamilyHealthVault';
import BodyOverview from './BodyOverview';
import PatientProfile from './PatientProfile';
import ScrollableChart from './ScrollableChart';

// Add font import
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// Upload Health Report Component
const UploadHealthReport: React.FC<{ isDarkTheme: boolean }> = ({ isDarkTheme }) => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging
            ? 'border-blue-400 bg-blue-500/10'
            : `${isDarkTheme ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'}`
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`} />
        <h3 className="text-lg font-semibold mb-2">Upload Health Report</h3>
        <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-600'} mb-4`}>Drag and drop your report or browse</p>
        <input
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
          accept=".pdf,.jpg,.png,.doc,.docx"
        />
        <label
          htmlFor="file-upload"
          className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors text-white"
        >
          Browse Files
        </label>
      </div>

      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm rounded-xl"
          >
            <div className="bg-green-600 p-6 rounded-xl text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-white" />
              <h4 className="text-lg font-bold text-white mb-2">Success!</h4>
              <p className="text-green-100">Your report has been uploaded</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Download Smart Report Component
const DownloadSmartReport: React.FC<{ isDarkTheme: boolean }> = ({ isDarkTheme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDoctorPopup, setShowDoctorPopup] = useState(false);

  const suggestions = ['Diabetes', 'Hypertension', 'Cholesterol', 'Heart Disease'];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setShowAutoComplete(false);
    if (term.toLowerCase() === 'diabetes') {
      setIsDownloading(true);
      setTimeout(() => {
        setIsDownloading(false);
        const link = document.createElement('a');
        link.href = 'data:application/pdf;base64,';
        link.download = 'diabetes-report.pdf';
        link.click();
      }, 2000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowAutoComplete(value.length > 0);
  };

  const handleDoctorIntervention = () => {
    setShowDoctorPopup(true);
  };

  return (
    <div className="relative">
      <h3 className="text-lg font-semibold mb-4">Download Smart Report</h3>
      <div className="relative">
        <div className="flex">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search reports... (try 'Diabetes')"
            className={`flex-1 px-4 py-3 ${isDarkTheme ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} border rounded-l-lg focus:border-blue-500 focus:outline-none`}
          />
          <button
            onClick={() => handleSearch(searchTerm)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-r-lg transition-colors"
            disabled={isDownloading}
          >
            {isDownloading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Search className="w-5 h-5 text-white" />
              </motion.div>
            ) : (
              <Search className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {showAutoComplete && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute top-full left-0 right-0 mt-1 ${isDarkTheme ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} border rounded-lg shadow-lg z-10`}
            >
              {suggestions
                .filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(suggestion)}
                    className={`w-full px-4 py-2 text-left ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} first:rounded-t-lg last:rounded-b-lg transition-colors`}
                  >
                    {suggestion}
                  </button>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isDownloading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-4 bg-blue-600/20 border border-blue-500 rounded-lg"
        >
          <div className="flex items-center">
            <Download className="w-5 h-5 mr-2 text-blue-400" />
            <span>Generating report... Please wait</span>
          </div>
        </motion.div>
      )}

      <button
        onClick={handleDoctorIntervention}
        className="mt-4 w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors text-white font-semibold"
      >
        Request for Physician Intervention
      </button>

      <AnimatePresence>
        {showDoctorPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} p-8 rounded-xl text-center border ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'} shadow-lg relative`}>
              <h4 className="text-2xl font-bold text-blue-400 mb-4">Report Sent!</h4>
              <p className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-700'} mb-6`}>Your report has been sent to the most optimal clinics for review.</p>
              <button
                onClick={() => setShowDoctorPopup(false)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
              >
                Close
              </button>
              <button
                onClick={() => setShowDoctorPopup(false)}
                className={`absolute top-3 right-3 ${isDarkTheme ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Uber Clinic Component
const UberClinic: React.FC<{ isDarkTheme: boolean }> = ({ isDarkTheme }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const hospitals = [
    { name: 'Mayo Clinic', location: 'Rochester, MN', rating: 4.9, speciality: 'Longevity Medicine' },
    { name: 'Cleveland Clinic', location: 'Cleveland, OH', rating: 4.8, speciality: 'Preventive Care' },
    { name: 'Johns Hopkins', location: 'Baltimore, MD', rating: 4.9, speciality: 'Advanced Diagnostics' },
    { name: 'Mass General', location: 'Boston, MA', rating: 4.7, speciality: 'Genetic Testing' },
    { name: 'Stanford Health', location: 'Palo Alto, CA', rating: 4.8, speciality: 'Anti-Aging' }
  ];

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.speciality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Uber Clinic</h3>

      <div className="relative mb-6">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search hospitals, locations, or specialties..."
          className={`w-full pl-10 pr-4 py-3 ${isDarkTheme ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} border rounded-lg focus:border-blue-500 focus:outline-none`}
        />
      </div>

      <div className="space-y-3 h-80 overflow-y-auto pr-2">
        {filteredHospitals.map((hospital, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 ${isDarkTheme ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' : 'bg-gray-50/50 border-gray-200 hover:border-gray-300'} border rounded-lg transition-colors cursor-pointer`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{hospital.name}</h4>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{hospital.rating}</span>
              </div>
            </div>
            <div className={`flex items-center text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
              <MapPin className="w-4 h-4 mr-1" />
              {hospital.location}
            </div>
            <div className="text-sm text-blue-400">{hospital.speciality}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Wearable Data Component
const WearableData: React.FC<{ isDarkTheme: boolean }> = ({ isDarkTheme }) => {
  const wearableDevices = [
    { name: 'Apple Watch', icon: Watch, color: 'text-blue-400' },
    { name: 'Fitbit', icon: Activity, color: 'text-green-400' },
    { name: 'OURA Ring', icon: Watch, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Wearable Data</h3>
      <div className="space-y-3">
        {wearableDevices.map((device, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-2 ${isDarkTheme ? 'bg-gray-800/30' : 'bg-gray-100/30'} rounded-lg`}
          >
            <div className="flex items-center">
              <device.icon className={`w-4 h-4 mr-2 ${device.color}`} />
              <span className="text-sm font-medium">{device.name}</span>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </motion.div>
        ))}
      </div>
      <div className={`text-xs ${isDarkTheme ? 'text-gray-500' : 'text-gray-600'} mt-2`}>
        Last sync: 2 minutes ago
      </div>
    </div>
  );
};

// Voice Recorder Component
const VoiceRecorder: React.FC<{
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  currentQuestion: string;
  showResponse: boolean;
  typedResponse: string;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  isDarkTheme: boolean;
}> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  currentQuestion,
  showResponse,
  typedResponse,
  isSpeaking,
  onStopSpeaking,
  isDarkTheme,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <motion.button
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'
              : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isRecording ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}

          {isRecording && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-red-400"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {currentQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`text-center p-4 ${isDarkTheme ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100/50 border-gray-200'} rounded-xl border`}
          >
            <h4 className="text-lg font-semibold mb-2 text-blue-400">AI Question</h4>
            <p className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>{currentQuestion}</p>

            {isRecording && (
              <div className="flex justify-center mt-4 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-blue-400 rounded-full"
                    animate={{
                      height: [4, 20, 4],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl border border-green-500/30"
          >
            <h4 className="text-lg font-semibold mb-2 text-green-400">AI Recommendation</h4>
            <p className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>{typedResponse}</p>
            {typedResponse.length > 0 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={onStopSpeaking}
                  className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full"
                >
                  {isSpeaking ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!isRecording && !currentQuestion && !showResponse && (
        <div className={`text-center ${isDarkTheme ? 'text-gray-500' : 'text-gray-600'}`}>
          <p>Click the microphone to start your health assessment</p>
        </div>
      )}
    </div>
  );
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  const [typedResponse, setTypedResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<any>(null);
  const speechTimeoutRef = useRef<number | null>(null);

  // Chart navigation states
  const [glucoseDataIndex, setGlucoseDataIndex] = useState(0);
  const [heartRateDataIndex, setHeartRateDataIndex] = useState(0);
  const [bloodPressureDataIndex, setBloodPressureDataIndex] = useState(0);

  const [collapsedSections, setCollapsedSections] = useState<{[key: string]: boolean}>({
    actions: false,
    diet: false,
    tests: false
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const loggedInUser = "Soumik"; // Constant user name
  const currentPatient = selectedFamilyMember || { name: loggedInUser, age: 36 };

  const healthQuestions = [
    "How has your energy level been over the past week?",
    "Have you noticed any changes in your sleep quality recently?",
    "What activities make you feel most energized and alive?"
  ];

  const sampleResponse = "Based on your response, I recommend focusing on consistent sleep patterns and incorporating 15 minutes of morning sunlight exposure to optimize your circadian rhythm.";

  // Dummy data periods for charts
  const dataPeriods = [
    "Last Week",
    "This Week", 
    "Next Week Preview"
  ];

  const startRecording = () => {
    setIsRecording(true);
    setCurrentQuestion(healthQuestions[Math.floor(Math.random() * healthQuestions.length)]);
    setShowResponse(false);
    setTypedResponse('');
    setIsSpeaking(false);
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
    setTimeout(() => {
      stopRecording();
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setCurrentQuestion('');
    setTimeout(() => {
      setShowResponse(true);
      typeResponse();
    }, 1000);
  };

  const typeResponse = () => {
    let index = 0;
    setTypedResponse('');
    
    setIsSpeaking(true);
    speakText(sampleResponse);
    
    const interval = setInterval(() => {
      if (index < sampleResponse.length) {
        setTypedResponse(sampleResponse.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('victoria') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('susan') ||
        voice.gender === 'female'
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setIsSpeaking(false);
      }, sampleResponse.length * 50 + 1000);
    }
  };

  const handleStopSpeaking = () => {
    setIsSpeaking(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
  };

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFamilyMemberSelect = (member: any) => {
    setSelectedFamilyMember(member);
  };

  // Chart navigation handlers
  const handleGlucoseNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && glucoseDataIndex > 0) {
      setGlucoseDataIndex(glucoseDataIndex - 1);
    } else if (direction === 'next' && glucoseDataIndex < dataPeriods.length - 1) {
      setGlucoseDataIndex(glucoseDataIndex + 1);
    }
  };

  const handleHeartRateNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && heartRateDataIndex > 0) {
      setHeartRateDataIndex(heartRateDataIndex - 1);
    } else if (direction === 'next' && heartRateDataIndex < dataPeriods.length - 1) {
      setHeartRateDataIndex(heartRateDataIndex + 1);
    }
  };

  const handleBloodPressureNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && bloodPressureDataIndex > 0) {
      setBloodPressureDataIndex(bloodPressureDataIndex - 1);
    } else if (direction === 'next' && bloodPressureDataIndex < dataPeriods.length - 1) {
      setBloodPressureDataIndex(bloodPressureDataIndex + 1);
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'biomarkers', label: 'Biomarkers', icon: TestTube },
    { id: 'insights', label: 'AI Insights', icon: Brain },
    { id: 'interventions', label: 'Interventions', icon: Target },
    { id: 'risks', label: 'Risk Analysis', icon: Shield },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle },
    { id: 'search', label: 'Search', icon: Search },
  ];

  const getCurrentBiomarkerData = () => {
    if (selectedFamilyMember && selectedFamilyMember.biomarkers) {
      return [
        { name: 'Glucose', value: selectedFamilyMember.biomarkers.glucose, status: 'optimal', color: 'text-green-400' },
        { name: 'Cholesterol', value: selectedFamilyMember.biomarkers.cholesterol, status: 'moderate', color: 'text-yellow-400' },
        { name: 'Blood Pressure', value: selectedFamilyMember.biomarkers.bp, status: 'optimal', color: 'text-green-400' },
        { name: 'Vitamin D', value: selectedFamilyMember.biomarkers.vitaminD, status: 'low', color: 'text-red-400' },
        { name: 'HbA1c', value: selectedFamilyMember.biomarkers.hba1c, status: 'optimal', color: 'text-green-400' },
        { name: 'CRP', value: selectedFamilyMember.biomarkers.crp, status: 'moderate', color: 'text-yellow-400' },
      ];
    }
    
    return [
      { name: 'Glucose', value: 85, status: 'optimal', color: 'text-green-400' },
      { name: 'Cholesterol', value: 180, status: 'moderate', color: 'text-yellow-400' },
      { name: 'Blood Pressure', value: 120, status: 'optimal', color: 'text-green-400' },
      { name: 'Vitamin D', value: 32, status: 'low', color: 'text-red-400' },
      { name: 'HbA1c', value: 5.2, status: 'optimal', color: 'text-green-400' },
      { name: 'CRP', value: 1.8, status: 'moderate', color: 'text-yellow-400' },
    ];
  };

  const biomarkerData = getCurrentBiomarkerData();

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`} style={{ fontFamily: "'Playfair Display', serif" }}>
      <div className="fixed inset-0 opacity-5 z-0">
        <div className={`absolute inset-0 ${isDarkTheme ? 'bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900' : 'bg-gradient-to-br from-blue-50 via-gray-50 to-purple-50'}`}></div>
      </div>

      {/* Top Navbar */}
      <nav className={`fixed top-0 left-0 right-0 ${isDarkTheme ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-xl border-b ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'} z-50`}>
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 mr-3 ${isDarkTheme ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100/50'} rounded-lg transition-colors lg:hidden`}
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-semibold hidden sm:block">Longenomics</span>
            </div>
          </div>

          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold">Longevity Dashboard</h1>
            <p className={`text-sm ${isDarkTheme ? 'text-gray-500' : 'text-gray-600'} hidden sm:block`}>Family Health Risk Modeling and Financial Planning</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className={`p-2 ${isDarkTheme ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100/50'} rounded-lg transition-colors`}
            >
              {isDarkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className={`p-2 ${isDarkTheme ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100/50'} rounded-lg transition-colors`}>
              <Bell className="w-5 h-5" />
            </button>
            <button className={`p-2 ${isDarkTheme ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100/50'} rounded-lg transition-colors`}>
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className={`fixed inset-y-0 left-0 top-16 w-64 ${isDarkTheme ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-xl border-r ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'} p-6 z-40 lg:hidden`}
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full mr-3"></div>
                <div>
                  <h2 className="text-lg font-bold">Longevity Dashboard</h2>
                  <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                    Logged in as: <span className="font-semibold text-blue-400">{loggedInUser}</span>
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <PatientProfile name={currentPatient.name} age={currentPatient.age} isDarkTheme={isDarkTheme} />
              </div>

              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center p-3 rounded-lg transition-all ${
                      activeSection === item.id
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                        : `${isDarkTheme ? 'hover:bg-gray-800/50 text-gray-400' : 'hover:bg-gray-100/50 text-gray-600'}`
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <div className={`hidden lg:block w-64 ${isDarkTheme ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-xl border-r ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'} p-6 fixed inset-y-0 left-0 top-16 z-40`}>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full mr-3"></div>
            <div>
              <h4 className="text-sm font-bold">Longevity Dashboard</h4>
              <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                Logged in as: <span className="font-semibold text-blue-400">{loggedInUser}</span>
              </p>
            </div>
          </div>

          

          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                }}
                className={`w-full flex items-center p-3 rounded-lg transition-all ${
                  activeSection === item.id
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                    : `${isDarkTheme ? 'hover:bg-gray-800/50 text-gray-400' : 'hover:bg-gray-100/50 text-gray-600'}`
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mb-6">
            <PatientProfile name={currentPatient.name} age={currentPatient.age} isDarkTheme={isDarkTheme} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 relative z-10">
          <div className="p-4 lg:p-6 overflow-y-auto min-h-screen">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`${isDarkTheme ? 'bg-gray-900/60' : 'bg-white/60'} backdrop-blur-xl rounded-2xl p-6 border ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'}`}
              >
                <WearableData isDarkTheme={isDarkTheme} />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`${isDarkTheme ? 'bg-gray-900/60' : 'bg-white/60'} backdrop-blur-xl rounded-2xl p-6 border ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'} col-span-1 lg:col-span-2`}
              >
                <div className="text-center">
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <span className="text-3xl">🏆</span>
                  </motion.div>

                  <h4 className="text-xl font-bold text-teal-400 mb-2">Your Achievement</h4>
                  <div className="text-3xl font-bold mb-1">100</div>
                  <div className="text-lg text-teal-300 mb-4">Longevity Tokens</div>

                  <div className={`${isDarkTheme ? 'bg-gray-800/50' : 'bg-gray-100/50'} rounded-lg p-4 border ${isDarkTheme ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
                    <div className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Progress to Next Level</div>
                    <div className={`w-full ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-300'} rounded-full h-3 mb-3`}>
                      <motion.div
                        className="bg-gradient-to-r from-teal-400 to-teal-600 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '10%' }}
                        transition={{ delay: 1, duration: 1.5 }}
                      ></motion.div>
                    </div>
                    <div className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                      Perform <span className="text-teal-400 font-semibold">1000 more steps</span> to earn and unlock next level
                    </div>
                  </div>
                </div>
              </motion.div>

           <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`${isDarkTheme ? 'bg-gray-900/60' : 'bg-white/60'} backdrop-blur-xl rounded-2xl p-6 border ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'} text-center`}
              >
  <div className="text-2xl font-semibold text-green-500 mb-4">
    First ever Outcome Based Longevity Program
  </div>

  <div className="text-4xl font-bold text-green-400">98%</div>

  <div className="text-xl font-semibold text-blue-500 mt-3">
    Success Rate
  </div>

  <h3 className="text-xl font-bold mt-4">
    Money Back Guarantee
  </h3>

  <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
    With our expert intervention: Money-back guarantee if key biomarkers don't improve within 12 months
  </p>
</motion.div>


            </div>

            {/* Body Overview Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className={`${isDarkTheme ? 'bg-gray-900/60' : 'bg-white/60'} backdrop-blur-xl rounded-2xl p-8 border ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'}`}>
                <BodyOverview isDarkTheme={isDarkTheme} />
              </div>
            </motion.div>

            {/* Financial Projection - Special Attention Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-teal-900/40 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-teal-600/10"></div>
                <div className="relative p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Financial Projection</h3>
                      <p className="text-blue-200">Healthcare savings through preventive care</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-400">$19,800</div>
                      <div className="text-sm text-green-300">Projected savings by 2030</div>
                      <div className="text-xs text-blue-300 mt-1">ROI: 312%</div>
                    </div>
                  </div>
                  <FinancialProjectionChart />
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-blue-200">Healthcare Savings</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-red-200">Prevention Costs</span>
                      </div>
                    </div>
                    <div className="text-teal-300 font-semibold">Net Benefit: $15,000</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Longevity Score with Speedometer */}
            <motion.div
  initial={{ y: 40, opacity: 0, scale: 0.95 }}
  animate={{ y: 0, opacity: 1, scale: 1 }}
  transition={{
    delay: 0.3,
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1] // standard "ease" timing curve
  }}
  className="mb-8"
>
  <div className={`${isDarkTheme ? 'bg-gray-900/60' : 'bg-white/60'} backdrop-blur-xl rounded-2xl p-8 border ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'}`}>
    <SpeedometerScore score={86} isDarkTheme={isDarkTheme} />
  </div>
</motion.div>


            {/* Individual Chart Rows with Navigation */}
            <div className="space-y-8 mb-8">
              {/* Glucose Trend Row */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <ScrollableChart 
                  title="Glucose Trend" 
                  isDarkTheme={isDarkTheme}
                  currentPeriod={dataPeriods[glucoseDataIndex]}
                  onNavigate={handleGlucoseNavigate}
                >
                  <GlucoseTrendChart dataIndex={glucoseDataIndex} />
                </ScrollableChart>
              </motion.div>

              {/* Heart Rate Row */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <ScrollableChart 
                  title="Heart Rate Monitoring" 
                  isDarkTheme={isDarkTheme}
                  currentPeriod={dataPeriods[heartRateDataIndex]}
                  onNavigate={handleHeartRateNavigate}
                >
                  <HeartRateChart dataIndex={heartRateDataIndex} />
                </ScrollableChart>
              </motion.div>

              {/* Blood Pressure Row */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <ScrollableChart 
                  title="Blood Pressure Tracking" 
                  isDarkTheme={isDarkTheme}
                  currentPeriod={dataPeriods[bloodPressureDataIndex]}
                  onNavigate={handleBloodPressureNavigate}
                >
                  <BloodPressureChart dataIndex={bloodPressureDataIndex} />
                </ScrollableChart>
              </motion.div>
            </div>

            {/* Age Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
                className={`${isDarkTheme ? 'bg-gray-900/60' : 'bg-white/60'} backdrop-blur-xl rounded-2xl p-6 border ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'} text-center`}
              >
                <div className="text-4xl font-bold text-blue-400">{currentPatient.age - 5}</div>
                <h3 className="text-xl font-bold mt-2">Biological Age</h3>
                <p className={`${isDarkTheme ? 'text-gray-500' : 'text-gray-600'}`}>5 years younger</p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
                className={`${isDarkTheme ? 'bg-gray-900/60' : 'bg-white/60'} backdrop-blur-xl rounded-2xl p-6 border ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'} text-center`}
              >
                <div className={`text-4xl font-bold ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>{currentPatient.age}</div>
                <h3 className="text-xl font-bold mt-2">Chronological Age</h3>
                <p className={`${isDarkTheme ? 'text-gray-500' : 'text-gray-600'}`}>Actual age</p>
              </motion.div>
            </div>

            {/* Biomarker Grid */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mb-8"
            >
              <h3 className="text-xl font-bold mb-4">Biomarkers </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {biomarkerData.map((marker, index) => (
                  <div key={index} className={`${isDarkTheme ? 'bg-gray-900/60' : 'bg-white/60'} backdrop-blur-xl rounded-xl p-4 border ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'}`}>
                    <div className={`text-sm ${isDarkTheme ? 'text-gray-500' : 'text-gray-600'}`}>{marker.name}</div>
                    <div className={`text-2xl font-bold ${marker.color}`}>{marker.value}</div>
                    <div className={`text-xs capitalize ${isDarkTheme ? 'text-gray-500' : 'text-gray-600'}`}>{marker.status}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Upload and Download Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3 }}
                className={`${isDarkTheme ? 'bg-gray-900/60' : 'bg-white/60'} backdrop-blur-xl rounded-2xl p-6 border ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'}`}
              >
                <UploadHealthReport isDarkTheme={isDarkTheme} />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4 }}
                className={`${isDarkTheme ? 'bg-gray-900/60' : 'bg-white/60'} backdrop-blur-xl rounded-2xl p-6 border ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'}`}
              >
                <DownloadSmartReport isDarkTheme={isDarkTheme} />
              </motion.div>
            </div>

            {/* Family Health Vault and Uber Clinic */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5 }}
                className={`${isDarkTheme ? 'bg-gray-900/60' : 'bg-white/60'} backdrop-blur-xl rounded-2xl p-6 border ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'}`}
              >
                <FamilyHealthVault onMemberSelect={handleFamilyMemberSelect} isDarkTheme={isDarkTheme} />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.6 }}
                className={`${isDarkTheme ? 'bg-gray-900/60' : 'bg-white/60'} backdrop-blur-xl rounded-2xl p-6 border ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'}`}
              >
                <UberClinic isDarkTheme={isDarkTheme} />
              </motion.div>
            </div>

            {/* Voice Recorder Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.7 }}
              className={`${isDarkTheme ? 'bg-gray-900/60' : 'bg-white/60'} backdrop-blur-xl rounded-2xl p-6 border ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'} mb-8`}
            >
              <h3 className="text-xl font-bold mb-4">Your Health Assessment</h3>
              <VoiceRecorder
                isRecording={isRecording}
                onStartRecording={startRecording}
                onStopRecording={stopRecording}
                currentQuestion={currentQuestion}
                showResponse={showResponse}
                typedResponse={typedResponse}
                isSpeaking={isSpeaking}
                onStopSpeaking={handleStopSpeaking}
                isDarkTheme={isDarkTheme}
              />
            </motion.div>

            {/* AI Insights - Collapsible */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {/* Suggested Actions */}
              <div className={`${isDarkTheme ? 'bg-gray-900/60' : 'bg-white/60'} backdrop-blur-xl rounded-2xl border ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'}`}>
                <button
                  onClick={() => toggleSection('actions')}
                  className={`w-full p-6 flex items-center justify-between ${isDarkTheme ? 'hover:bg-gray-800/30' : 'hover:bg-gray-100/30'} transition-colors rounded-t-2xl`}
                >
                  <h3 className="text-lg font-bold flex items-center text-blue-400">
                    <Dumbbell className="w-5 h-5 mr-2 text-blue-400" />
                    Suggested Actions
                  </h3>
                  {collapsedSections.actions ? <ChevronDown className={`w-5 h-5 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`} /> : <ChevronUp className={`w-5 h-5 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`} />}
                </button>
                <AnimatePresence>
                  {!collapsedSections.actions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6"
                    >
                      <div className="space-y-3">
                        <div className={`${isDarkTheme ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100/50 border-gray-200'} border rounded-lg p-3`}>
                          <div className={`font-semibold text-sm mb-1 ${isDarkTheme ? 'text-gray-200' : 'text-gray-800'}`}>Workout: 10 min Zone 2 Cardio</div>
                          <div className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                            Reference: <span className="text-blue-400 underline">https://yourapp.com/learn/zone-2-cardio</span>
                          </div>
                        </div>
                        <div className={`${isDarkTheme ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100/50 border-gray-200'} border rounded-lg p-3`}>
                          <div className={`font-semibold text-sm mb-1 ${isDarkTheme ? 'text-gray-200' : 'text-gray-800'}`}>Workout: Protein-rich breakfast</div>
                          <div className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                            Reference: <span className="text-blue-400 underline">https://yourapp.com/learn/high-protein-breakfast</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Suggested Diet */}
              <div className={`${isDarkTheme ? 'bg-gray-900/60' : 'bg-white/60'} backdrop-blur-xl rounded-2xl border ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'}`}>
                <button
                  onClick={() => toggleSection('diet')}
                  className={`w-full p-6 flex items-center justify-between ${isDarkTheme ? 'hover:bg-gray-800/30' : 'hover:bg-gray-100/30'} transition-colors rounded-t-2xl`}
                >
                  <h3 className="text-lg font-bold flex items-center text-blue-400">
                    <Apple className="w-5 h-5 mr-2 text-blue-400" />
                    Diet
                  </h3>
                  {collapsedSections.diet ? <ChevronDown className={`w-5 h-5 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`} /> : <ChevronUp className={`w-5 h-5 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`} />}
                </button>
                <AnimatePresence>
                  {!collapsedSections.diet && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6"
                    >
                      <div className="space-y-3">
                        <div className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-200' : 'text-gray-800'}`}>Oats + Greek Yogurt + Berries</div>
                        <div className={`${isDarkTheme ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100/50 border-gray-200'} border rounded-lg p-3`}>
                          <div className={`font-semibold text-sm mb-1 ${isDarkTheme ? 'text-gray-200' : 'text-gray-800'}`}>Item: Oats</div>
                          <div className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                            Product Link: <span className="text-blue-400 underline">https://yourstore.com/buy/oats</span>
                          </div>
                        </div>
                        <div className={`${isDarkTheme ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100/50 border-gray-200'} border rounded-lg p-3`}>
                          <div className={`font-semibold text-sm mb-1 ${isDarkTheme ? 'text-gray-200' : 'text-gray-800'}`}>Item: Greek Yogurt</div>
                          <div className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                            Product Link: <span className="text-blue-400 underline">https://yourstore.com/buy/greek-yogurt</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Suggested Tests */}
              <div className={`${isDarkTheme ? 'bg-gray-900/60' : 'bg-white/60'} backdrop-blur-xl rounded-2xl border ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'}`}>
                <button
                  onClick={() => toggleSection('tests')}
                  className={`w-full p-6 flex items-center justify-between ${isDarkTheme ? 'hover:bg-gray-800/30' : 'hover:bg-gray-100/30'} transition-colors rounded-t-2xl`}
                >
                  <h3 className="text-lg font-bold flex items-center text-blue-400">
                    <TestTube className="w-5 h-5 mr-2 text-blue-400" />
                    Tests
                  </h3>
                  {collapsedSections.tests ? <ChevronDown className={`w-5 h-5 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`} /> : <ChevronUp className={`w-5 h-5 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`} />}
                </button>
                <AnimatePresence>
                  {!collapsedSections.tests && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6"
                    >
                      <div className="space-y-3">
                        <div className={`${isDarkTheme ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100/50 border-gray-200'} border rounded-lg p-3`}>
                          <div className={`font-semibold text-sm mb-1 ${isDarkTheme ? 'text-gray-200' : 'text-gray-800'}`}>Test: Vitamin D3</div>
                          <div className="text-sm text-red-400 mb-1">Urgency: high</div>
                          <div className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                            Booking: <span className="text-blue-400 underline">https://yourlab.com/book/vitamin-d3</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;