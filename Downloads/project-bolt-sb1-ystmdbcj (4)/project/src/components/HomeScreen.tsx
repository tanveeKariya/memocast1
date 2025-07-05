import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  FileText, 
  GraduationCap, 
  Briefcase, 
  FolderOpen, 
  Home,
  Upload,
  MoreHorizontal,
  Settings,
  Search,
  Edit3,
  Trash2,
  Eye
} from 'lucide-react';
import { notesAPI, foldersAPI, personalitiesAPI } from '../services/api';
import { CreateFolderModal } from './CreateFolderModal';
import { AddNoteModal } from './AddNoteModal';
import { SettingsModal } from './SettingsModal';
import { CreatePersonalityModal } from './CreatePersonalityModal';
import { EnhancedPublishModal } from './EnhancedPublishModal';

interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
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
  noteCount: number;
  size: number;
  color: string;
  personalityId: {
    _id: string;
    name: string;
    icon: string;
    color: string;
  };
}

interface Personality {
  _id: string;
  name: string;
  icon: string;
  color: string;
}

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [view, setView] = useState<'folders' | 'notes'>('folders');
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [filteredFolders, setFilteredFolders] = useState<Folder[]>([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCreatePersonality, setShowCreatePersonality] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedPersonality, setSelectedPersonality] = useState<string>('');
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [showFolderMenu, setShowFolderMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery, selectedPersonality, notes, folders]);

  const loadData = async () => {
    try {
      const [notesRes, foldersRes, personalitiesRes] = await Promise.all([
        notesAPI.getNotes(),
        foldersAPI.getFolders(),
        personalitiesAPI.getPersonalities()
      ]);
      
      setNotes(notesRes.data);
      setFolders(foldersRes.data);
      setPersonalities(personalitiesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let filteredN = notes;
    let filteredF = folders;

    // Filter by personality
    if (selectedPersonality) {
      filteredN = filteredN.filter(note => note.personalityId._id === selectedPersonality);
      filteredF = filteredF.filter(folder => folder.personalityId._id === selectedPersonality);
    }

    // Filter by search query
    if (searchQuery) {
      filteredN = filteredN.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      filteredF = filteredF.filter(folder =>
        folder.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNotes(filteredN);
    setFilteredFolders(filteredF);
  };

  const switchPersonality = async (personalityId: string) => {
    try {
      await personalitiesAPI.switchPersonality(personalityId);
      setSelectedPersonality(personalityId);
      window.location.reload();
    } catch (error) {
      console.error('Error switching personality:', error);
    }
  };

  const handlePersonalityFilter = (personalityId: string) => {
    setSelectedPersonality(selectedPersonality === personalityId ? '' : personalityId);
  };

  const handleFolderClick = async (folder: Folder) => {
    try {
      const response = await notesAPI.getNotes({ folderId: folder._id });
      setSelectedFolder(folder);
      setFilteredNotes(response.data);
      setView('notes');
    } catch (error) {
      console.error('Error loading folder notes:', error);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (window.confirm('Are you sure you want to delete this project? All notes in this project will be deleted.')) {
      try {
        await foldersAPI.deleteFolder(folderId);
        loadData();
        setShowFolderMenu(null);
      } catch (error) {
        console.error('Error deleting folder:', error);
      }
    }
  };

  const handleProfileClick = () => {
    if (personalities.length === 0) {
      setShowCreatePersonality(true);
    } else {
      setShowSettings(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600">Loading your notes...</p>
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
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={handleProfileClick}
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img
              src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150';
              }}
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Memocast.co
              </h1>
              <p className="text-sm text-gray-600">Welcome {user?.username}</p>
            </div>
          </motion.button>
          
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Search className="w-6 h-6 text-gray-600" />
            </motion.button>
            <motion.button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Settings className="w-6 h-6 text-gray-600" />
            </motion.button>
          </div>
        </div>

        {/* Available Space Card */}
        <motion.div 
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-6 mb-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg"></div>
            </div>
            <div>
              <h3 className="text-xl font-bold">Available Space</h3>
              <p className="text-white/80">20.254 GB of 25 GB Used</p>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes and projects..."
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to All Button */}
        {selectedFolder && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.button
              onClick={() => {
                setSelectedFolder(null);
                setView('folders');
                loadData();
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl text-purple-600 hover:bg-white transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>← Back to All Projects</span>
            </motion.button>
            <h2 className="text-xl font-bold text-gray-900 mt-2">
              📁 {selectedFolder.name}
            </h2>
          </motion.div>
        )}

        {/* Identity Selector */}
        {personalities.length > 0 && !selectedFolder && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-600 text-sm mb-3">Your Identity</p>
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {personalities.map((personality, index) => (
                <motion.button
                  key={personality._id}
                  onClick={() => handlePersonalityFilter(personality._id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                    selectedPersonality === personality._id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : user?.currentPersonality?._id === personality._id
                      ? 'bg-purple-100 text-purple-600 border-2 border-purple-300'
                      : 'bg-white/80 text-gray-700 hover:bg-white'
                  }`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{personality.icon}</span>
                  <span className="font-medium">{personality.name}</span>
                  {user?.currentPersonality?._id === personality._id && (
                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Active</span>
                  )}
                </motion.button>
              ))}
              <motion.button 
                onClick={() => setShowCreatePersonality(true)}
                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-all flex-shrink-0"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* View Toggle */}
        {!selectedFolder && (
          <motion.div 
            className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 mb-6 w-fit"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => setView('folders')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                view === 'folders' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setView('notes')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                view === 'notes' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Notes
            </button>
          </motion.div>
        )}

        {/* Category Cards */}
        <AnimatePresence mode="wait">
          {view === 'folders' ? (
            <motion.div
              key="folders"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredFolders.length === 0 ? (
                /* Empty State */
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div 
                    className="w-64 h-48 mx-auto mb-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl flex items-center justify-center"
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="text-6xl">📁</div>
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {searchQuery || selectedPersonality ? 'No projects found' : 'No projects found?'}
                  </h2>
                  <p className="text-gray-600 mb-8">
                    {searchQuery || selectedPersonality ? 'Try adjusting your search or filter' : 'Create your first project to organize your notes'}
                  </p>
                  {!searchQuery && !selectedPersonality && (
                    <motion.button
                      onClick={() => setShowCreateFolder(true)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Create New Project
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                /* Folders Grid */
                <div className="space-y-4">
                  {filteredFolders.map((folder, index) => (
                    <motion.div
                      key={folder._id}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-white/20 cursor-pointer relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      onClick={() => handleFolderClick(folder)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <span className="text-xl">{folder.personalityId.icon}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{folder.name}</h3>
                            <p className="text-sm text-gray-600">{folder.noteCount} notes • {folder.size.toFixed(2)} MB</p>
                            <p className="text-xs text-purple-600">{folder.personalityId.name}</p>
                          </div>
                        </div>
                        <div className="relative">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowFolderMenu(showFolderMenu === folder._id ? null : folder._id);
                            }}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <MoreHorizontal className="w-5 h-5 text-gray-400" />
                          </motion.button>
                          
                          {showFolderMenu === folder._id && (
                            <motion.div 
                              className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFolderClick(folder);
                                  setShowFolderMenu(null);
                                }}
                                className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 w-full text-left"
                              >
                                <Eye className="w-4 h-4 text-gray-500" />
                                <span>View</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Add edit functionality
                                  setShowFolderMenu(null);
                                }}
                                className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 w-full text-left"
                              >
                                <Edit3 className="w-4 h-4 text-gray-500" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFolder(folder._id);
                                }}
                                className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 w-full text-left text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            /* Notes List */
            <motion.div
              key="notes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedFolder ? `Notes in ${selectedFolder.name}` : 'Your Notes'}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    You have {filteredNotes.length} notes
                  </p>
                </div>
              </div>

              {filteredNotes.length === 0 ? (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchQuery || selectedPersonality || selectedFolder ? 'No notes found' : 'No notes yet'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || selectedPersonality || selectedFolder ? 'Try a different search term or filter' : 'Start by creating your first note'}
                  </p>
                  {!searchQuery && !selectedPersonality && (
                    <motion.button
                      onClick={() => setShowAddNote(true)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Create Note
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredNotes.map((note, index) => (
                    <motion.div
                      key={note._id}
                      onClick={() => navigate(`/note/${note._id}`)}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-white/20 cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, x: 5 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{note.title}</h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {note.content.substring(0, 100)}...
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-purple-600 font-medium">
                              📚 {note.category}
                            </span>
                            <span className="flex items-center space-x-1">
                              <span>{note.personalityId.icon}</span>
                              <span className="text-gray-500">{note.personalityId.name}</span>
                            </span>
                            <span className="text-gray-500">
                              {new Date(note.createdAt).toLocaleDateString()}
                            </span>
                            {note.folderId && (
                              <span className="text-gray-500">
                                📁 {note.folderId.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <MoreHorizontal className="w-5 h-5 text-gray-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setShowAddNote(true)}
        className="fixed bottom-24 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Plus className="w-8 h-8 text-white" />
      </motion.button>

      {/* Bottom Navigation */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 px-6 py-4"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center space-y-1">
            <Home className="w-6 h-6 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Home</span>
            <div className="w-6 h-1 bg-purple-600 rounded-full"></div>
          </button>
          <button 
            onClick={() => setShowPublishModal(true)}
            className="flex flex-col items-center space-y-1"
          >
            <Upload className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Publish</span>
          </button>
        </div>
      </motion.div>

      {/* Modals */}
      <CreateFolderModal
        isOpen={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        onFolderCreated={loadData}
      />
      <AddNoteModal
        isOpen={showAddNote}
        onClose={() => setShowAddNote(false)}
        onNoteCreated={loadData}
      />
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSettingsUpdated={loadData}
      />
      <CreatePersonalityModal
        isOpen={showCreatePersonality}
        onClose={() => setShowCreatePersonality(false)}
        onPersonalityCreated={loadData}
      />
      <EnhancedPublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
      />
    </div>
  );
};