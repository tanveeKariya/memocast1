import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Mic, 
  MicOff, 
  Volume2,
  Edit3,
  Trash2,
  Share2,
  Download,
  FileText,
  File,
  Sparkles,
  Paperclip
} from 'lucide-react';
import { notesAPI } from '../services/api';
import { useVoice } from '../contexts/VoiceContext';
import { EnhancedPublishModal } from './EnhancedPublishModal';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  attachments: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  folderId?: {
    name: string;
    color: string;
  };
  personalityId: {
    _id: string;
    name: string;
    icon: string;
    color: string;
  };
}

export const NoteEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isRecording, transcript, startRecording, stopRecording, speakText, clearTranscript } = useVoice();
  
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  useEffect(() => {
    if (id) {
      loadNote();
    }
  }, [id]);

  useEffect(() => {
    if (transcript && isRecording) {
      setContent(prev => prev + ' ' + transcript);
    }
  }, [transcript, isRecording]);

  const loadNote = async () => {
    try {
      const response = await notesAPI.getNote(id!);
      const noteData = response.data;
      setNote(noteData);
      setTitle(noteData.title);
      setContent(noteData.content);
    } catch (error) {
      console.error('Error loading note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!note) return;
    
    setSaving(true);
    try {
      await notesAPI.updateNote(note._id, {
        title,
        content
      });
      setIsEditing(false);
      await loadNote();
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEnhance = async () => {
    if (!note) return;
    
    setEnhancing(true);
    try {
      const response = await notesAPI.enhanceNote(note._id, {
        platform: 'general',
        personalityId: note.personalityId._id,
        enhanceType: 'format'
      });
      
      setContent(response.data.enhancedContent);
    } catch (error) {
      console.error('Error enhancing note:', error);
    } finally {
      setEnhancing(false);
    }
  };

  const handleDelete = async () => {
    if (!note || !window.confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await notesAPI.deleteNote(note._id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handlePlayback = () => {
    speakText(content);
  };

  const downloadAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(title, 20, 30);
    doc.setFontSize(12);
    
    const splitContent = doc.splitTextToSize(content, 170);
    doc.text(splitContent, 20, 50);
    
    doc.save(`${title}.pdf`);
    setShowDownloadMenu(false);
  };

  const downloadAsTXT = () => {
    const blob = new Blob([`${title}\n\n${content}`], { type: 'text/plain' });
    saveAs(blob, `${title}.txt`);
    setShowDownloadMenu(false);
  };

  const downloadAsDOCX = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: title,
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: content,
                size: 24,
              }),
            ],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${title}.docx`);
    setShowDownloadMenu(false);
  };

  const handleAttachmentClick = (attachment: any) => {
    window.open(`https://memocast1.onrender.com${attachment.url}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div 
            className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600">Loading note...</p>
        </motion.div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xl text-gray-600 mb-4">Note not found</p>
          <motion.button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.div 
        className="px-6 pt-12 pb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={() => navigate('/')}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </motion.button>
          <h1 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Note' : 'View Note'}
          </h1>
          <div className="flex space-x-2">
            <motion.button
              onClick={() => setShowPublishModal(true)}
              className="p-2 rounded-full bg-green-500 text-white shadow-md hover:shadow-lg transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 className="w-6 h-6" />
            </motion.button>
            <div className="relative">
              <motion.button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="p-2 rounded-full bg-blue-500 text-white shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Download className="w-6 h-6" />
              </motion.button>
              
              {showDownloadMenu && (
                <motion.div 
                  className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <button
                    onClick={downloadAsPDF}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 w-full text-left"
                  >
                    <FileText className="w-4 h-4 text-red-500" />
                    <span>Download as PDF</span>
                  </button>
                  <button
                    onClick={downloadAsTXT}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 w-full text-left"
                  >
                    <File className="w-4 h-4 text-gray-500" />
                    <span>Download as TXT</span>
                  </button>
                  <button
                    onClick={downloadAsDOCX}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 w-full text-left"
                  >
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>Download as DOCX</span>
                  </button>
                </motion.div>
              )}
            </div>
            <motion.button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit3 className="w-6 h-6 text-gray-600" />
            </motion.button>
            <motion.button
              onClick={handleDelete}
              className="p-2 rounded-full bg-red-500 text-white shadow-md hover:shadow-lg transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Note Content */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm mb-6 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-6">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-bold border-none outline-none bg-transparent"
                placeholder="Note title..."
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            )}
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-4 mb-4">
              <span className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                <span>{note.personalityId.icon}</span>
                <span>{note.personalityId.name}</span>
              </span>
              <span className="text-sm text-gray-500">
                {new Date(note.updatedAt).toLocaleDateString()}
              </span>
              {note.folderId && (
                <span className="text-sm text-gray-500">
                  📁 {note.folderId.name}
                </span>
              )}
            </div>
          </div>

          {/* Attachments */}
          {note.attachments && note.attachments.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Paperclip className="w-4 h-4 mr-1" />
                Attachments ({note.attachments.length})
              </h4>
              <div className="space-y-2">
                {note.attachments.map((attachment, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAttachmentClick(attachment)}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      {attachment.type.startsWith('image/') ? (
                        <span className="text-sm">🖼️</span>
                      ) : attachment.type.includes('pdf') ? (
                        <span className="text-sm">📄</span>
                      ) : (
                        <span className="text-sm">📎</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{attachment.name}</p>
                      <p className="text-sm text-gray-500">
                        {(attachment.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <motion.button
                  onClick={handlePlayback}
                  className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Volume2 className="w-5 h-5 text-purple-600" />
                </motion.button>
                {isEditing && (
                  <>
                    <motion.button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`p-2 rounded-full transition-colors ${
                        isRecording 
                          ? 'bg-red-500 text-white' 
                          : 'bg-purple-100 hover:bg-purple-200 text-purple-600'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </motion.button>
                    <motion.button
                      onClick={handleEnhance}
                      disabled={enhancing}
                      className="flex items-center space-x-1 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-full transition-colors disabled:opacity-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm">{enhancing ? 'Enhancing...' : 'Enhance'}</span>
                    </motion.button>
                  </>
                )}
              </div>
            </div>
            
            {isEditing ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-0 py-2 border-none outline-none bg-transparent resize-none text-gray-700 leading-relaxed"
                placeholder="Start typing or use voice input..."
              />
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        {isEditing && (
          <motion.div 
            className="flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </motion.button>
            <motion.button
              onClick={() => {
                setIsEditing(false);
                setTitle(note.title);
                setContent(note.content);
                clearTranscript();
              }}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-400 transition-colors font-semibold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced Publish Modal */}
      <EnhancedPublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        content={content}
        title={title}
      />
    </div>
  );
};