import React, { useState, useEffect } from 'react';
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
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Create a New Project</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg bg-white text-gray-900"
              placeholder="Enter project name..."
              autoFocus
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Your Identity for this project
            </label>
            <div className="flex items-center space-x-3">
              <Music className="w-6 h-6 text-purple-600" />
              <select
                value={selectedPersonality}
                onChange={(e) => setSelectedPersonality(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
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
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="Personal">Personal</option>
              <option value="Academic">Academic</option>
              <option value="Work">Work</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !folderName.trim() || !selectedPersonality}
            className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Now'}
          </button>
        </form>
      </div>
    </div>
  );
};