import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Eye,
  Share2,
  FolderPlus,
  X // <--- Added missing import for X icon
} from 'lucide-react';
import { notesAPI, foldersAPI, personalitiesAPI, authAPI } from '../services/api';
import { CreateFolderModal } from './CreateFolderModal';
import { AddNoteModal } from './AddNoteModal';
import { SettingsModal } from './SettingsModal';
import { CreatePersonalityModal } from './CreatePersonalityModal';

// Assuming User interface is defined elsewhere, but including it here for completeness
// based on previous interaction's correction for 'preferences'.
interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  authProvider?: string;
  currentPersonality: {
    _id: string;
    name: string;
    icon: string;
    color: string;
  };
  preferences?: {
    notifications?: boolean;
    autoSave?: boolean;
    language?: string;
  };
}

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

interface StorageStats {
  used: number;
  total: number;
  percentage: number;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedPersonality, setSelectedPersonality] = useState<string>('');
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [showFolderMenu, setShowFolderMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [storageStats, setStorageStats] = useState<StorageStats>({ used: 0, total: 25, percentage: 0 });

  useEffect(() => {
    loadData();
    loadStorageStats();
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

  const loadStorageStats = async () => {
    try {
      const response = await authAPI.getStorageStats();
      setStorageStats(response.data);
    } catch (error) {
      console.error('Error loading storage stats:', error);
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
        loadStorageStats();
        setShowFolderMenu(null);
      } catch (error) {
        console.error('Error deleting folder:', error);
      }
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

  const handleShareFolder = async (folder: Folder, platform: string) => {
    try {
      const shareContent = `📁 ${folder.name} - Shared from Memocast.co\n\nExplore my organized notes and insights!`;
      
      // Copy content to clipboard
      await copyToClipboard(shareContent);

      let response;

      if (platform === 'linkedin') {
        response = await authAPI.linkedinPost({ content: shareContent });
      } else if (platform === 'twitter') {
        response = await authAPI.twitterPost({ content: shareContent });
      } else if (platform === 'instagram') {
        response = await authAPI.instagramPost({ content: shareContent });
      }

      if (response?.data.redirectUrl) {
        console.log('Opening social platform with URL:', response.data.redirectUrl);
        window.open(response.data.redirectUrl, '_blank');
      }

      setShowFolderMenu(null);
    } catch (error) {
      console.error('Error sharing folder:', error);
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
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleProfileClick}
            className="flex items-center space-x-3"
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
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
            >
              <Search className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
            >
              <Settings className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Available Space Card */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-6 mb-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg"></div>
            </div>
            <div>
              <h3 className="text-xl font-bold">Available Space</h3>
              <p className="text-white/80">
                {storageStats.used.toFixed(2)} GB of {storageStats.total} GB Used
              </p>
              <div className="w-48 h-2 bg-white/20 rounded-full mt-2">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(storageStats.percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes and projects..."
                className="w-full px-4 py-3 pr-12 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearch(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Back to All Button */}
        {selectedFolder && (
          <div className="mb-6">
            <button
              onClick={() => {
                setSelectedFolder(null);
                setView('folders');
                loadData();
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl text-purple-600 hover:bg-white transition-all"
            >
              <span>← Back to All Projects</span>
            </button>
            <h2 className="text-xl font-bold text-gray-900 mt-2">
              📁 {selectedFolder.name}
            </h2>
          </div>
        )}

        {/* Identity Selector */}
        {personalities.length > 0 && !selectedFolder && (
          <div className="mb-6">
            <p className="text-gray-600 text-sm mb-3">Your Identity</p>
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {personalities.map((personality, index) => (
                <button
                  key={personality._id}
                  onClick={() => handlePersonalityFilter(personality._id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                    selectedPersonality === personality._id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : user?.currentPersonality?._id === personality._id
                      ? 'bg-purple-100 text-purple-600 border-2 border-purple-300'
                      : 'bg-white/80 text-gray-700 hover:bg-white'
                  }`}
                >
                  <span>{personality.icon}</span>
                  <span className="font-medium">{personality.name}</span>
                  {user?.currentPersonality?._id === personality._id && (
                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Active</span>
                  )}
                </button>
              ))}
              <button
                onClick={() => setShowCreatePersonality(true)}
                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-all flex-shrink-0"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}

        {/* View Toggle */}
        {!selectedFolder && (
          <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 mb-6 w-fit">
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
          </div>
        )}

        {/* Category Cards */}
        {view === 'folders' ? (
          <div>
            {/* Create Project Button */}
            {(selectedPersonality || personalities.length > 0) && (
              <div className="mb-6">
                <button
                  onClick={() => setShowCreateFolder(true)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all font-semibold flex items-center justify-center space-x-2"
                >
                  <FolderPlus className="w-5 h-5" />
                  <span>Create New Project</span>
                </button>
              </div>
            )}

            {filteredFolders.length === 0 ? (
              /* Empty State */
              <div className="text-center py-16">
                <div className="w-64 h-48 mx-auto mb-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl flex items-center justify-center">
                  <div className="text-6xl">📁</div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {searchQuery || selectedPersonality ? 'No projects found' : 'No projects found?'}
                </h2>
                <p className="text-gray-600 mb-8">
                  {searchQuery || selectedPersonality ? 'Try adjusting your search or filter' : 'Create your first project to organize your notes'}
                </p>
                {!searchQuery && !selectedPersonality && (
                  <button
                    onClick={() => setShowCreateFolder(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold"
                  >
                    Create New Project
                  </button>
                )}
              </div>
            ) : (
              /* Folders Grid */
              <div className="space-y-4 pb-32">
                {filteredFolders.map((folder, index) => (
                  <div
                    key={folder._id}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-white/20 cursor-pointer relative"
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowFolderMenu(showFolderMenu === folder._id ? null : folder._id);
                          }}
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                        </button>

                        {showFolderMenu === folder._id && (
                          <div className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-[9999] min-w-[150px]">
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
                            <div className="relative">
                              <button 
                                className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 w-full text-left"
                                onMouseEnter={(e) => {
                                  const submenu = e.currentTarget.nextElementSibling as HTMLElement;
                                  if (submenu) submenu.style.display = 'block';
                                }}
                                onMouseLeave={(e) => {
                                  setTimeout(() => {
                                    const submenu = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (submenu && !submenu.matches(':hover')) {
                                      submenu.style.display = 'none';
                                    }
                                  }, 100);
                                }}
                              >
                                <Share2 className="w-4 h-4 text-gray-500" />
                                <span>Share</span>
                              </button>
                              <div 
                                className="absolute left-full top-0 ml-2 hidden bg-white border border-gray-200 rounded-lg shadow-xl p-2 min-w-[120px] z-[9999]"
                                style={{ display: 'none' }}
                                onMouseEnter={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = 'block';
                                }}
                                onMouseLeave={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = 'none';
                                }}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShareFolder(folder, 'linkedin');
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center space-x-2"
                                >
                                  <span>💼</span>
                                  LinkedIn
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShareFolder(folder, 'twitter');
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center space-x-2"
                                >
                                  <span>🐦</span>
                                  Twitter
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShareFolder(folder, 'instagram');
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center space-x-2"
                                >
                                  <span>📸</span>
                                  Instagram
                                </button>
                              </div>
                            </div>
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
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Notes List */
          <div>
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
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchQuery || selectedPersonality || selectedFolder ? 'No notes found' : 'No notes yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || selectedPersonality || selectedFolder ? 'Try a different search term or filter' : 'Start by creating your first note'}
                </p>
                {!searchQuery && !selectedPersonality && (
                  <button
                    onClick={() => setShowAddNote(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    Create Note
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredNotes.map((note, index) => (
                  <div
                    key={note._id}
                    onClick={() => navigate(`/note/${note._id}`)}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-white/20 cursor-pointer"
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
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button - Fixed positioning */}
      <button
        onClick={() => setShowAddNote(true)}
        className="fixed bottom-28 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40"
      >
        <Plus className="w-8 h-8 text-white" />
      </button>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center space-y-1">
            <Home className="w-6 h-6 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Home</span>
            <div className="w-6 h-1 bg-purple-600 rounded-full"></div>
          </button>
          <button
            onClick={() => navigate('/publish')}
            className="flex flex-col items-center space-y-1"
          >
            <Upload className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Publish</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <CreateFolderModal
        isOpen={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        onFolderCreated={() => {
          loadData();
          loadStorageStats();
        }}
      />
      <AddNoteModal
        isOpen={showAddNote}
        onClose={() => setShowAddNote(false)}
        onNoteCreated={() => {
          loadData();
          loadStorageStats();
        }}
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
    </div>
  );
};