import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ChevronRight, FileText, Mic, Home, Upload } from 'lucide-react';
import { EnhancedPublishModal } from './EnhancedPublishModal';
import { DraftsModal } from './DraftsModal';
import { draftsAPI } from '../services/api';

export const PublishScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDraftsModal, setShowDraftsModal] = useState(false);
  const [publishHistory, setPublishHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublishHistory();
  }, []);

  const loadPublishHistory = async () => {
    try {
      const response = await draftsAPI.getDrafts();
      setPublishHistory(response.data.filter((draft: any) => draft.isPublished));
    } catch (error) {
      console.error('Error loading publish history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Publish</h1>
          <div className="w-10"></div>
        </div>

        {/* Header with Profile */}
        <div className="flex items-center space-x-3 mb-6">
          <img
            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Memocast
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <button
            onClick={() => setShowPublishModal(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold"
          >
            Publish a New Portfolio
          </button>

          {/* Create Podcast Button - Coming Soon */}
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 py-4 rounded-2xl font-semibold cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Mic className="w-5 h-5" />
            <span>Create Podcast (coming soon)</span>
          </button>

          <button
            onClick={() => setShowDraftsModal(true)}
            className="w-full bg-white/80 backdrop-blur-sm border border-purple-200 text-purple-600 py-4 rounded-2xl hover:bg-white transition-all font-semibold flex items-center justify-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>View All Drafts</span>
          </button>
        </div>

        {/* Publish History */}
        <div className="pb-32">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Publish History</h3>
            <p className="text-gray-600 text-sm">
              You have {publishHistory.length} portfolio published in last 6 months.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading publish history...</p>
            </div>
          ) : publishHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No published content yet</h3>
              <p className="text-gray-600 mb-6">Start by publishing your first portfolio</p>
              <button
                onClick={() => setShowPublishModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Create First Portfolio
              </button>
            </div>
          ) : (
            <div className="space-y-4 pb-8">
              {publishHistory.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {item.content.substring(0, 100)}...
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-purple-600 font-medium">
                          {item.type} • {item.platform}
                        </span>
                        <span className="text-gray-500">
                          {new Date(item.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowPublishModal(true)}
        className="fixed bottom-28 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40"
      >
        <Plus className="w-8 h-8 text-white" />
      </button>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-around">
          <button 
            onClick={() => navigate('/')}
            className="flex flex-col items-center space-y-1"
          >
            <Home className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Home</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <Upload className="w-6 h-6 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Publish</span>
            <div className="w-6 h-1 bg-purple-600 rounded-full"></div>
          </button>
        </div>
      </div>

      {/* Modals */}
      <EnhancedPublishModal
        isOpen={showPublishModal}
        onClose={() => {
          setShowPublishModal(false);
          loadPublishHistory(); // Refresh history when modal closes
        }}
      />
      
      <DraftsModal
        isOpen={showDraftsModal}
        onClose={() => setShowDraftsModal(false)}
      />
    </div>
  );
};