import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Music } from 'lucide-react';
import { foldersAPI, personalitiesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFolderCreated: () => void;
}

interface Personality {
  _id: string;
  name: string;
  icon: string;
  color: string;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({ 
  isOpen, 
  onClose, 
  onFolderCreated 
}) => {
  const { user } = useAuth();
  const [folderName, setFolderName] = useState('Untitled Project 1');
  const [category, setCategory] = useState<'Personal' | 'Academic' | 'Work' | 'Others'>('Personal');
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPersonalities();
      setSelectedPersonality(user?.currentPersonality?._id || '');
    }
  }, [isOpen, user]);

  const loadPersonalities = async () => {
    try {
      const response = await personalitiesAPI.getPersonalities();
      setPersonalities(response.data);
    } catch (error) {
      console.error('Error loading personalities:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim() || !selectedPersonality) return;

    setLoading(true);
    try {
      await foldersAPI.createFolder({
        name: folderName,
        category,
        personalityId: selectedPersonality,
        color: '#8B5CF6'
      });
      
      setFolderName('Untitled Project 1');
      setCategory('Personal');
      onFolderCreated();
      onClose();
    } catch (error) {
      console.error('Error creating folder:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create a New Project</h2>
          <motion.button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter project name..."
              autoFocus
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choose Your Identity for this project
            </label>
            <div className="flex items-center space-x-3">
              <Music className="w-6 h-6 text-purple-600" />
              <select
                value={selectedPersonality}
                onChange={(e) => setSelectedPersonality(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select Personality</option>
                {personalities.map((personality) => (
                  <option key={personality._id} value={personality._id}>
                    {personality.icon} {personality.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Personal">Personal</option>
              <option value="Academic">Academic</option>
              <option value="Work">Work</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <motion.button
            type="submit"
            disabled={loading || !folderName.trim() || !selectedPersonality}
            className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Creating...' : 'Create Now'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};