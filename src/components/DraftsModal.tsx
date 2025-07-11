import React, { useState, useEffect } from 'react';
import { X, Edit3, Trash2, Share2, Calendar, User, FileText, ExternalLink } from 'lucide-react';
import { draftsAPI, authAPI } from '../services/api';

interface DraftsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DraftsModal: React.FC<DraftsModalProps> = ({ isOpen, onClose }) => {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDraft, setSelectedDraft] = useState<any>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [editingDraft, setEditingDraft] = useState<any>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadDrafts();
    }
  }, [isOpen]);

  const loadDrafts = async () => {
    try {
      const response = await draftsAPI.getDrafts();
      setDrafts(response.data);
    } catch (error) {
      console.error('Error loading drafts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDraft = async (draftId: string) => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      try {
        await draftsAPI.deleteDraft(draftId);
        loadDrafts();
      } catch (error) {
        console.error('Error deleting draft:', error);
      }
    }
  };

  const handleEditDraft = (draft: any) => {
    setEditingDraft(draft);
    setEditContent(draft.content);
  };

  const handleSaveEdit = async () => {
    if (!editingDraft) return;
    
    try {
      await draftsAPI.updateDraft(editingDraft._id, {
        content: editContent
      });
      setEditingDraft(null);
      setEditContent('');
      loadDrafts();
    } catch (error) {
      console.error('Error updating draft:', error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  };

  const handleShareDraft = async (draft: any, platform: string) => {
    setIsPublishing(true);
    try {
      // Copy content to clipboard
      await copyToClipboard(draft.content);
      
      let response;
      
      if (platform === 'linkedin') {
        response = await authAPI.linkedinPost({ content: draft.content });
      } else if (platform === 'twitter') {
        response = await authAPI.twitterPost({ content: draft.content });
      } else if (platform === 'instagram') {
        response = await authAPI.instagramPost({ content: draft.content });
      }
      
      if (response?.data.redirectUrl) {
        window.open(response.data.redirectUrl, '_blank');
      }
      
      // Mark as published
      await draftsAPI.updateDraft(draft._id, {
        isPublished: true,
        publishedAt: new Date()
      });
      
      loadDrafts();
    } catch (error) {
      console.error('Sharing error:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Drafts</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading drafts...</p>
            </div>
          ) : drafts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No drafts yet</h3>
              <p className="text-gray-600">Your saved drafts will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {drafts.map((draft, index) => (
                <div
                  key={draft._id}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-purple-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{draft.title}</h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {draft.personalityId?.name}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(draft.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          draft.type === 'social' ? 'bg-blue-100 text-blue-800' :
                          draft.type === 'portfolio' ? 'bg-green-100 text-green-800' :
                          draft.type === 'resume' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {draft.type}
                        </span>
                        {draft.platform !== 'general' && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                            {draft.platform}
                          </span>
                        )}
                        {draft.isPublished && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Published
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {draft.content.substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {draft.content.length} characters
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditDraft(draft)}
                        className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {!draft.isPublished && draft.platform !== 'general' && (
                        <div className="relative group">
                          <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[120px] z-50">
                            <button
                              onClick={() => handleShareDraft(draft, 'linkedin')}
                              disabled={isPublishing}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center space-x-2"
                            >
                              <span>💼</span>
                              <span>LinkedIn</span>
                            </button>
                            <button
                              onClick={() => handleShareDraft(draft, 'twitter')}
                              disabled={isPublishing}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center space-x-2"
                            >
                              <span>🐦</span>
                              <span>Twitter</span>
                            </button>
                            <button
                              onClick={() => handleShareDraft(draft, 'instagram')}
                              disabled={isPublishing}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center space-x-2"
                            >
                              <span>📸</span>
                              <span>Instagram</span>
                            </button>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => handleDeleteDraft(draft._id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Draft Modal */}
        {editingDraft && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Edit Draft</h3>
                <button
                  onClick={() => {
                    setEditingDraft(null);
                    setEditContent('');
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{editingDraft.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span>{editingDraft.type}</span>
                    <span>{editingDraft.platform}</span>
                    <span>{editingDraft.personalityId?.name}</span>
                  </div>
                </div>
                
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={12}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white text-gray-700"
                  placeholder="Edit your draft content..."
                />
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-500">
                    {editContent.length} characters
                  </span>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setEditingDraft(null);
                        setEditContent('');
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};