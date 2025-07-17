import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Upload, ChevronDown, FileText, AlertCircle, Sparkles, Paperclip } from 'lucide-react';
import { notesAPI, foldersAPI, personalitiesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useVoice } from '../contexts/VoiceContext';
import Tesseract from 'tesseract.js';
import { extractTextFromFile } from '../components/fileTextExtractor';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNoteCreated: () => void;
  prefilledData?: {
    title?: string;
    content?: string;
    personalityId?: string;
    folderId?: string;
    attachments?: File[];
  };
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
  onNoteCreated,
  prefilledData 
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

      if (prefilledData) {
        setTitle(prefilledData.title || 'Untitled Note 1');
        setContent(prefilledData.content || '');
        setSelectedPersonality(prefilledData.personalityId || user?.currentPersonality?._id || '');
        setSelectedFolder(prefilledData.folderId || '');
        setUploadedFiles(prefilledData.attachments || []);
      } else {
        setTitle('Untitled Note 1');
        setContent('');
        setSelectedFolder('');
        setUploadedFiles([]);
      }
    }
  }, [isOpen, user, prefilledData]);

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
      if (file.type.startsWith('image/') || 
          file.type === 'application/pdf' || 
          file.type.includes('word') || 
          file.name.endsWith('.docx') ||
          file.type.startsWith('text/')) {
        setShowFileOptions(file);
      } else {
        saveFileAsAttachment(file);
      }
    }
  };

  const extractTextFromFileLocal = async (file: File): Promise<string> => {
    setProcessingFiles(true);
    try {
      if (file.type.startsWith('image/')) {
        const result = await Tesseract.recognize(file, 'eng');
        return result?.data?.text?.trim() || '';
      } else {
        return await extractTextFromFile(file);
      }
    } catch (error) {
      console.error('❌ Error extracting text from file:', error);
      return '';
    } finally {
      setProcessingFiles(false);
    }
  };

  const handleExtractText = async (file: File) => {
    const extractedText = await extractTextFromFileLocal(file);
    if (extractedText) {
      setContent(prev => prev + (prev ? '\n\n' : '') + extractedText);
    }
    setShowFileOptions(null);
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
      if (selectedFolder) formData.append('folderId', selectedFolder);
      uploadedFiles.forEach((file) => formData.append('attachments', file));
      await notesAPI.createNote(formData);
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
            <h2 className="text-xl font-semibold text-gray-900">
              {prefilledData ? 'Save as New Note' : 'Add New Note'}
            </h2>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6 text-gray-600" />
            </motion.button>
          </div>

          {/* The full JSX UI continues here — truncated for brevity. */}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
