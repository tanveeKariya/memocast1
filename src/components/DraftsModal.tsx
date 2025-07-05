import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Trash2, Share2, Calendar, User, FileText } from 'lucide-react';
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

  const handlePublishDraft = async (draft: any) => {
    setIsPublishing(true);
    try {
      let response;
      
      if (draft.platform === 'linkedin') {
        response = await authAPI.linkedinPost({ content: draft.content });
      } else if (draft.platform === 'twitter') {
        response = await authAPI.twitterPost({ content: draft.content });
      } else if (draft.platform === 'instagram') {
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
      console.error('Publishing error:', error);
    } finally {
      setIsPublishing(false);
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
          className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Drafts</h2>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6 text-gray-600" />
            </motion.button>
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
                  <motion.div
                    key={draft._id}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-purple-300 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
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
                        <motion.button
                          onClick={() => setSelectedDraft(draft)}
                          className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit3 className="w-4 h-4" />
                        </motion.button>
                        {!draft.isPublished && draft.platform !== 'general' && (
                          <motion.button
                            onClick={() => handlePublishDraft(draft)}
                            disabled={isPublishing}
                            className="p-2 text-gray-600 hover:text-green-600 transition-colors disabled:opacity-50"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Share2 className="w-4 h-4" />
                          </motion.button>
                        )}
                        <motion.button
                          onClick={() => handleDeleteDraft(draft._id)}
                          className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Draft Detail Modal */}
          <AnimatePresence>
            {selectedDraft && (
              <motion.div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">{selectedDraft.title}</h3>
                    <button
                      onClick={() => setSelectedDraft(null)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <pre className="whitespace-pre-wrap text-gray-700 text-sm">
                        {selectedDraft.content}
                      </pre>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{selectedDraft.type}</span>
                        <span>{selectedDraft.platform}</span>
                        <span>{selectedDraft.personalityId?.name}</span>
                      </div>
                      
                      {!selectedDraft.isPublished && selectedDraft.platform !== 'general' && (
                        <motion.button
                          onClick={() => handlePublishDraft(selectedDraft)}
                          disabled={isPublishing}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isPublishing ? 'Publishing...' : 'Publish Now'}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};