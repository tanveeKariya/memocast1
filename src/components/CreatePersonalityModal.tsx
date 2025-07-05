import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, ChevronDown } from 'lucide-react';
import { personalitiesAPI } from '../services/api';

interface CreatePersonalityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPersonalityCreated: () => void;
}

const iconOptions = [
  '👤', '😊', '🎵', '💼', '🎨', '📚', '🏃‍♂️', '🍳', '🌟', '🚀',
  '💡', '🎯', '🔥', '⚡', '🌈', '🎭', '🎪', '🎨', '🎬', '📸',
  '✍️', '🎤', '🎸', '🎹', '🎺', '🥁', '🎻', '🎲', '🎮', '🏆',
  '💎', '🌺', '🦋', '🐱', '🐶', '🦊', '🐻', '🐼', '🦁', '🐯'
];

export const CreatePersonalityModal: React.FC<CreatePersonalityModalProps> = ({ 
  isOpen, 
  onClose, 
  onPersonalityCreated 
}) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('👤');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#8B5CF6');
  const [loading, setLoading] = useState(false);
  const [showIconDropdown, setShowIconDropdown] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setLoading(true);
    try {
      await personalitiesAPI.createPersonality({
        name,
        icon,
        description,
        color
      });
      
      // Reset form
      setName('');
      setIcon('👤');
      setDescription('');
      setColor('#8B5CF6');
      
      onPersonalityCreated();
      onClose();
    } catch (error) {
      console.error('Error creating personality:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        className="bg-white rounded-2xl p-6 w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Create Identity</h2>
          <motion.button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6 text-gray-600" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Identity Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
              placeholder="e.g., Professional, Creative, Personal"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowIconDropdown(!showIconDropdown)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{icon}</span>
                  <span>Choose an icon</span>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              
              {showIconDropdown && (
                <motion.div 
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="grid grid-cols-8 gap-2 p-3">
                    {iconOptions.map((iconOption) => (
                      <button
                        key={iconOption}
                        type="button"
                        onClick={() => {
                          setIcon(iconOption);
                          setShowIconDropdown(false);
                        }}
                        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors text-xl ${
                          icon === iconOption ? 'bg-purple-100 ring-2 ring-purple-500' : ''
                        }`}
                      >
                        {iconOption}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white text-gray-900"
              placeholder="Describe the tone and style for this identity..."
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Theme
            </label>
            <div className="flex space-x-3">
              {['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'].map((colorOption) => (
                <motion.button
                  key={colorOption}
                  type="button"
                  onClick={() => setColor(colorOption)}
                  className={`w-10 h-10 rounded-full border-4 transition-all ${
                    color === colorOption ? 'border-gray-800 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: colorOption }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading || !name.trim() || !description.trim()}
            className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Creating...' : 'Create Identity'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};