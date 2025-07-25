import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Mic, 
  MicOff, 
  Volume2,
  VolumeX,
  Edit3,
  Trash2,
  Share2,
  Download,
  FileText,
  File,
  Sparkles,
  Paperclip,
  FolderOpen,
  ChevronDown,
  X,
  Upload,
  AlertCircle
} from 'lucide-react';
import { notesAPI, foldersAPI } from '../services/api';
import { useVoice } from '../contexts/VoiceContext';
import { EnhancedPublishModal } from './EnhancedPublishModal';
import { AddNoteModal } from './AddNoteModal';
import { extractTextFromFile } from './fileTextExtractor';
import Tesseract from 'tesseract.js';
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
  isVoiceNote: boolean;
  attachments: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  folderId?: {
    _id: string;
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

interface Folder {
  _id: string;
  name: string;
  category: string;
}

export const NoteEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isRecording, transcript, startRecording, stopRecording, speakText, stopSpeaking, clearTranscript } = useVoice();
  
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [processingFiles, setProcessingFiles] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showFileOptions, setShowFileOptions] = useState<File | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Dummy images for demonstration
  const dummyImages = [
    'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300'
  ];

  useEffect(() => {
    if (id) {
      loadNote();
      loadFolders();
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
      setSelectedFolder(noteData.folderId?._id || '');
    } catch (error) {
      console.error('Error loading note:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const response = await foldersAPI.getFolders();
      setFolders(response.data);
    } catch (error) {
      console.error('Error loading folders:', error);
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

  const handleSaveAsNew = () => {
    if (!note) return;
    
    // Open AddNoteModal with prefilled data
    setShowAddNoteModal(true);
  };

  const handleMoveNote = async () => {
    if (!note) return;
    
    try {
      await notesAPI.moveNote(note._id, { folderId: selectedFolder || null });
      setShowMoveModal(false);
      await loadNote();
    } catch (error) {
      console.error('Error moving note:', error);
    }
  };

  const handleEnhance = async () => {
    if (!note) return;
    
    setEnhancing(true);
    try {
      const response = await notesAPI.enhanceNote(note._id, {
        platform: 'linkedin',
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
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      speakText(content);
      setIsSpeaking(true);
      // Reset speaking state after speech ends
      setTimeout(() => setIsSpeaking(false), content.length * 50);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (file.type.startsWith('image/') || 
          file.type === 'application/pdf' || 
          file.type.includes('word') || 
          file.name.endsWith('.docx') ||
          file.type.startsWith('text/')) {
        setShowFileOptions(file);
      } else {
        saveFileAsAttachment(file);
      }
    });
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
      console.error('Error extracting text:', error);
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
    window.open(`${import.meta.env.VITE_API_URL?.replace('/api', '')}${attachment.url}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading note...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Note not found</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="px-6 pt-12 pb-32">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Note' : 'View Note'}
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowMoveModal(true)}
              className="p-2 rounded-full bg-blue-500 text-white shadow-md hover:shadow-lg transition-all"
            >
              <FolderOpen className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowPublishModal(true)}
              className="p-2 rounded-full bg-green-500 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Share2 className="w-6 h-6" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="p-2 rounded-full bg-blue-500 text-white shadow-md hover:shadow-lg transition-all"
              >
                <Download className="w-6 h-6" />
              </button>
              
              {showDownloadMenu && (
                <div className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-[9999] min-w-[180px]">
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
                </div>
              )}
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
            >
              <Edit3 className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-full bg-red-500 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Note Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm mb-6 border border-white/20">
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
              {note.isVoiceNote && (
                <span className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  <Mic className="w-3 h-3" />
                  <span>Voice Note</span>
                </span>
              )}
            </div>
          </div>

          {/* Voice Recording Visualization */}
          {note.isVoiceNote && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Volume2 className="w-4 h-4 mr-1" />
                Audio Recording
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Recording duration: 2:34</span>
                </div>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-purple-400 rounded-full"
                      style={{ height: `${Math.random() * 20 + 5}px` }}
                    />
                  ))}
                </div>
                <button
                  onClick={handlePlayback}
                  className="mt-2 flex items-center space-x-2 px-3 py-1 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm">Play Recording</span>
                </button>
              </div>
            </div>
          )}

          {/* Attachments */}
          {note.attachments && note.attachments.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Paperclip className="w-4 h-4 mr-1" />
                Attachments ({note.attachments.length})
              </h4>
              <div className="space-y-2">
                {note.attachments.map((attachment, index) => (
                  <button
                    key={index}
                    onClick={() => handleAttachmentClick(attachment)}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
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
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dummy Images for Image Attachments */}
          {note.attachments && note.attachments.some(att => att.type.startsWith('image/')) && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Images</h4>
              <div className="grid grid-cols-3 gap-2">
                {dummyImages.slice(0, Math.min(3, note.attachments.filter(att => att.type.startsWith('image/')).length)).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Attachment ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => window.open(img, '_blank')}
                  />
                ))}
              </div>
            </div>
          )}

          {/* File Upload Section for Editing */}
          {isEditing && (
            <div className="mb-4">
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
              
              {uploadedFiles.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">New files:</p>
                  <div className="space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <div 
                        key={index} 
                        className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded flex items-center justify-between"
                      >
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <button
                  onClick={handlePlayback}
                  className={`p-2 rounded-full transition-colors ${
                    isSpeaking 
                      ? 'bg-red-100 hover:bg-red-200 text-red-600' 
                      : 'bg-purple-100 hover:bg-purple-200 text-purple-600'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                {isEditing && (
                  <>
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`p-2 rounded-full transition-colors ${
                        isRecording 
                          ? 'bg-red-500 text-white' 
                          : 'bg-purple-100 hover:bg-purple-200 text-purple-600'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={handleEnhance}
                      disabled={enhancing}
                      className="flex items-center space-x-1 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-full transition-colors disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm">{enhancing ? 'Enhancing...' : 'Enhance'}</span>
                    </button>
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
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex space-x-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleSaveAsNew}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold"
            >
              Save as New Note
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setTitle(note.title);
                setContent(note.content);
                clearTranscript();
              }}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-400 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* File Options Modal */}
      {showFileOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-orange-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">File Upload Options</h3>
            </div>
            <p className="text-gray-600 mb-6">
              What would you like to do with this file?
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleExtractText(showFileOptions)}
                className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors"
                disabled={processingFiles}
              >
                {processingFiles ? 'Extracting Text...' : 'Extract Text from File'}
              </button>
              <button
                onClick={() => saveFileAsAttachment(showFileOptions)}
                className="w-full bg-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-400 transition-colors"
              >
                Save as Attachment
              </button>
              <button
                onClick={() => setShowFileOptions(null)}
                className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Move Note Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Move Note</h2>
              <button
                onClick={() => setShowMoveModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleMoveNote}
                className="flex-1 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold"
              >
                Move Note
              </button>
              <button
                onClick={() => setShowMoveModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-400 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Publish Modal */}
      <EnhancedPublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        content={content}
        title={title}
      />

      {/* Add Note Modal with prefilled data */}
      <AddNoteModal
        isOpen={showAddNoteModal}
        onClose={() => setShowAddNoteModal(false)}
        onNoteCreated={() => {
          setShowAddNoteModal(false);
          navigate('/');
        }}
        prefilledData={{
          title,
          content,
          personalityId: note?.personalityId._id,
          folderId: note?.folderId?._id,
          attachments: uploadedFiles
        }}
      />
    </div>
  );
};