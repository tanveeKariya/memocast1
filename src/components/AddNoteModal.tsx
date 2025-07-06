import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Upload, ChevronDown, FileText, Image, AlertCircle, Sparkles } from 'lucide-react';
import { notesAPI, foldersAPI, personalitiesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useVoice } from '../contexts/VoiceContext';
import Tesseract from 'tesseract.js';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNoteCreated: () => void;
}

interface Folder {
  _id: string;
  name: string;
  category: string;
}

interface Personality {
  _id: string;
  name: string;
  icon: string;
  color: string;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({ 
  isOpen, 
  onClose, 
  onNoteCreated 
}) => {
  const { user } = useAuth();
  const { isRecording, transcript, startRecording, stopRecording, clearTranscript } = useVoice();
  const [title, setTitle] = useState('Untitled Note 1');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Personal' | 'Academic' | 'Work' | 'Others'>('Academic');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedPersonality, setSelectedPersonality] = useState('');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [processingFiles, setProcessingFiles] = useState(false);
  const [showFileOptions, setShowFileOptions] = useState<File | null>(null);
  const [enhancing, setEnhancing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
      setSelectedPersonality(user?.currentPersonality?._id || '');
      clearTranscript();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (transcript) {
      setContent(prev => prev + (prev ? ' ' : '') + transcript);
    }
  }, [transcript]);

  const loadData = async () => {
    try {
      const [foldersRes, personalitiesRes] = await Promise.all([
        foldersAPI.getFolders(),
        personalitiesAPI.getPersonalities()
      ]);
      
      setFolders(foldersRes.data);
      setPersonalities(personalitiesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    for (const file of files) {
      setShowFileOptions(file);
    }
  };

  const processTextFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setContent(prev => prev + (prev ? '\n\n' : '') + text);
    };
    reader.readAsText(file);
  };

  const extractTextFromFile = async (file: File) => {
    setProcessingFiles(true);
    try {
      if (file.type.startsWith('image/')) {
        const result = await Tesseract.recognize(file, 'eng');
        setContent(prev => prev + (prev ? '\n\n' : '') + result.data.text);
      } else if (file.type.includes('text') || file.name.endsWith('.txt')) {
        await processTextFile(file);
      } else {
        // For other document types, add to attachments for server-side processing
        setUploadedFiles(prev => [...prev, file]);
      }
      setShowFileOptions(null);
    } catch (error) {
      console.error('Error extracting text:', error);
    } finally {
      setProcessingFiles(false);
    }
  };

  const saveFileAsAttachment = (file: File) => {
    setUploadedFiles(prev => [...prev, file]);
    setShowFileOptions(null);
  };

  const handleEnhance = async () => {
    if (!content.trim()) return;
    
    setEnhancing(true);
    try {
      const response = await notesAPI.enhanceContent({
        content,
        enhanceType: 'format',
        personalityId: selectedPersonality
      });
      
      setContent(response.data.enhancedContent);
    } catch (error) {
      console.error('Error enhancing content:', error);
    } finally {
      setEnhancing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !selectedPersonality) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      formData.append('personalityId', selectedPersonality);
      formData.append('isVoiceNote', String(!!transcript));
      
      if (selectedFolder) {
        formData.append('folderId', selectedFolder);
      }

      // Add attachments
      uploadedFiles.forEach((file) => {
        formData.append('attachments', file);
      });

      await notesAPI.createNote(formData);
      
      // Reset form
      setTitle('Untitled Note 1');
      setContent('');
      setCategory('Academic');
      setSelectedFolder('');
      setUploadedFiles([]);
      clearTranscript();
      onNoteCreated();
      onClose();
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add New Note</h2>
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
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-bold border-none outline-none bg-transparent text-gray-900"
                placeholder="Untitled Note 1"
              />
            </motion.div>

            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Content</span>
                <motion.button
                  type="button"
                  onClick={handleEnhance}
                  disabled={!content.trim() || enhancing}
                  className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">{enhancing ? 'Enhancing...' : 'Enhance'}</span>
                </motion.button>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-0 py-2 border-none outline-none bg-transparent resize-none text-gray-700"
                placeholder="Start typing..."
              />
            </motion.div>

            {/* Voice Recording */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                  isRecording 
                    ? 'bg-red-500 text-white' 
                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span>{isRecording ? 'Stop Recording' : 'Record Audio'}</span>
              </motion.button>
            </motion.div>

            {/* File Upload Section */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-sm text-gray-600 mb-3">Add Media to Notes</p>
              <label className="flex items-center justify-center space-x-2 text-purple-600 hover:text-purple-700 cursor-pointer bg-purple-50 hover:bg-purple-100 rounded-xl py-3 px-4 transition-all">
                <Upload className="w-5 h-5" />
                <span>Upload Media</span>
                <input
                  type="file"
                  accept="*/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  multiple
                />
              </label>
              
              {/* Display uploaded files */}
              {uploadedFiles.length > 0 && (
                <motion.div 
                  className="mt-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <p className="text-sm text-gray-600 mb-2">Uploaded files:</p>
                  <div className="space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <motion.div 
                        key={index} 
                        className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded flex items-center justify-between"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Identity Selection */}
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm text-gray-600 mb-2">
                Your Identity
              </label>
              <div className="relative">
                <select
                  value={selectedPersonality}
                  onChange={(e) => setSelectedPersonality(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none pr-10 bg-white text-gray-900"
                  required
                >
                  <option value="">Select Identity</option>
                  {personalities.map((personality) => (
                    <option key={personality._id} value={personality._id}>
                      {personality.icon} {personality.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </motion.div>

            {/* Project Selection */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm text-gray-600 mb-2">
                Select Project
              </label>
              <div className="relative">
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none pr-10 bg-white text-gray-900"
                >
                  <option value="">No Project</option>
                  {folders.map((folder) => (
                    <option key={folder._id} value={folder._id}>
                      {folder.name} ({folder.category})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading || !title.trim() || !content.trim() || !selectedPersonality || processingFiles}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {loading ? 'Saving...' : processingFiles ? 'Processing Files...' : 'Save Note'}
            </motion.button>
          </form>
        </motion.div>

        {/* File Options Modal */}
        <AnimatePresence>
          {showFileOptions && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white rounded-2xl p-6 w-full max-w-sm"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-orange-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">File Upload Options</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  What would you like to do with this file?
                </p>
                <div className="space-y-3">
                  <motion.button
                    onClick={() => extractTextFromFile(showFileOptions)}
                    className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={processingFiles}
                  >
                    {processingFiles ? 'Extracting Text...' : 'Extract Text from File'}
                  </motion.button>
                  <motion.button
                    onClick={() => saveFileAsAttachment(showFileOptions)}
                    className="w-full bg-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-400 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Save as Attachment
                  </motion.button>
                  <motion.button
                    onClick={() => setShowFileOptions(null)}
                    className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};