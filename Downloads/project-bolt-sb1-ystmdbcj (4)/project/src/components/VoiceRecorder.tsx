import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoice } from '../contexts/VoiceContext';
import { useNotes } from '../contexts/NotesContext';
import { 
  Mic, 
  MicOff, 
  ArrowLeft, 
  Save, 
  Play, 
  Pause,
  Trash2,
  Volume2
} from 'lucide-react';

export const VoiceRecorder: React.FC = () => {
  const navigate = useNavigate();
  const { isRecording, isListening, transcript, startRecording, stopRecording, speakText, clearTranscript, error } = useVoice();
  const { addNote } = useNotes();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Personal' | 'Academic' | 'Work' | 'Others'>('Personal');
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isListening]);

  const handleSave = () => {
    if (transcript.trim()) {
      addNote({
        title: title || 'Voice Note',
        content: transcript,
        category,
        size: transcript.length / 1000,
        isVoiceNote: true
      });
      navigate('/');
    }
  };

  const handlePlayback = () => {
    if (transcript) {
      speakText(transcript);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Voice Recording</h1>
          <button
            onClick={handleSave}
            disabled={!transcript.trim()}
            className="p-2 rounded-full bg-purple-600 text-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-6 h-6" />
          </button>
        </div>

        {/* Recording Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
              isRecording ? 'bg-red-500' : 'bg-purple-600'
            } relative`}>
              {isRecording && (
                <div className="absolute inset-0 rounded-full bg-red-500 animate-pulse opacity-50"></div>
              )}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className="relative z-10"
              >
                {isRecording ? (
                  <MicOff className="w-16 h-16 text-white" />
                ) : (
                  <Mic className="w-16 h-16 text-white" />
                )}
              </button>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 mb-2">
              {isRecording ? 'Recording...' : 'Tap to record'}
            </p>
            {isListening && (
              <div className="flex items-center justify-center space-x-1 mb-4">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-red-500 rounded-full transition-all duration-100"
                    style={{ height: `${Math.random() * 20 + 10}px` }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Note Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="Personal">Personal</option>
              <option value="Academic">Academic</option>
              <option value="Work">Work</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Transcript</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handlePlayback}
                  className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors"
                >
                  <Volume2 className="w-5 h-5 text-purple-600" />
                </button>
                <button
                  onClick={clearTranscript}
                  className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              <p className="text-gray-700 leading-relaxed">{transcript}</p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};