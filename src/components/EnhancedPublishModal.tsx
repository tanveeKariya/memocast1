import React, { useState, useEffect } from 'react';
import { X, Sparkles, Share2, ChevronDown, Loader, Edit3, Check, Search, Save } from 'lucide-react';
import { notesAPI, personalitiesAPI, authAPI, draftsAPI } from '../services/api';

interface EnhancedPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  content?: string;
  title?: string;
}

export const EnhancedPublishModal: React.FC<EnhancedPublishModalProps> = ({ 
  isOpen, 
  onClose, 
  content = '',
  title = ''
}) => {
  const [publishName, setPublishName] = useState('');
  const [selectedPersonality, setSelectedPersonality] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [availableNotes, setAvailableNotes] = useState<any[]>([]);
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [allNotes, setAllNotes] = useState<any[]>([]);
  const [selectedNotesFromAll, setSelectedNotesFromAll] = useState<any[]>([]);
  const [personalities, setPersonalities] = useState<any[]>([]);
  const [enhancedContent, setEnhancedContent] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [step, setStep] = useState<'form' | 'selection' | 'enhance' | 'review' | 'publish'>('form');
  const [combinedContent, setCombinedContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<any[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<'linkedin' | 'twitter' | 'instagram'>('linkedin');
  const [portfolioType, setPortfolioType] = useState<'portfolio' | 'resume' | 'biodata'>('portfolio');
  const [showPortfolioOptions, setShowPortfolioOptions] = useState(false);

  const platforms = [
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: '💼',
      description: 'Professional networking',
      maxLength: 3000
    },
    { 
      id: 'twitter', 
      name: 'Twitter Post', 
      icon: '🐦',
      description: 'Short-form social media',
      maxLength: 280
    },
    { 
      id: 'instagram', 
      name: 'Instagram Story', 
      icon: '📸',
      description: 'Visual storytelling',
      maxLength: 2200
    }
  ];

  useEffect(() => {
    if (isOpen) {
      loadData();
      loadAllNotes();
      setStep('form');
      setPublishName('');
      setSelectedPersonality('');
      setSelectedProject('');
      setSelectedNotes([]);
      setSelectedNotesFromAll([]);
      setEnhancedContent('');
      setCombinedContent('');
      setSearchQuery('');
      setShowPortfolioOptions(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = availableNotes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(availableNotes);
    }
  }, [searchQuery, availableNotes]);

  const loadData = async () => {
    try {
      const [personalitiesRes] = await Promise.all([
        personalitiesAPI.getPersonalities()
      ]);
      
      setPersonalities(personalitiesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadAllNotes = async () => {
    try {
      const response = await notesAPI.getNotes();
      setAllNotes(response.data);
    } catch (error) {
      console.error('Error loading all notes:', error);
    }
  };

  const loadProjectsForPersonality = async (personalityId: string) => {
    try {
      const response = await notesAPI.getNotes();
      const userNotes = response.data.filter((note: any) => note.personalityId._id === personalityId);
      const projects = userNotes.reduce((acc: any[], note: any) => {
        if (note.folderId && !acc.find(p => p._id === note.folderId._id)) {
          acc.push(note.folderId);
        }
        return acc;
      }, []);
      setAvailableProjects(projects);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadNotesForProject = async (projectId: string) => {
    try {
      const response = await notesAPI.getNotes({ 
        folderId: projectId,
        personalityId: selectedPersonality 
      });
      setAvailableNotes(response.data);
      setFilteredNotes(response.data);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handlePersonalitySelect = (personalityId: string) => {
    setSelectedPersonality(personalityId);
    setSelectedProject('');
    setAvailableNotes([]);
    setSelectedNotes([]);
    loadProjectsForPersonality(personalityId);
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    setSelectedNotes([]);
    loadNotesForProject(projectId);
  };

  const handleNoteSelection = (noteId: string) => {
    setSelectedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleFormSubmit = () => {
    if (!publishName.trim() || !selectedPersonality) return;
    
    setStep('selection');
  };

  const handleNoteSelectionFromAll = (note: any) => {
    setSelectedNotesFromAll(prev => {
      const exists = prev.find(n => n._id === note._id);
      if (exists) {
        return prev.filter(n => n._id !== note._id);
      } else {
        return [...prev, note];
      }
    });
  };

  const removeSelectedNote = (noteId: string) => {
    setSelectedNotesFromAll(prev => prev.filter(n => n._id !== noteId));
  };

  const proceedToEnhance = () => {
    if (selectedNotesFromAll.length === 0) return;
    
    const combined = selectedNotesFromAll.map(note => `${note.title}\n\n${note.content}`).join('\n\n---\n\n');
    setCombinedContent(combined);
    setStep('enhance');
  };

  const handleEnhance = async () => {
    setIsEnhancing(true);
    try {
      let enhanceType = 'social';
      let prompt = '';

      if (showPortfolioOptions) {
        enhanceType = 'portfolio';
        prompt = `Generate a ${portfolioType} in the following format based on this content`;
      } else {
        prompt = `Combine these files with proper formatting and make necessary changes for better readability and flow. Maintain the original meaning while improving structure for ${selectedPlatform} platform.`;
      }

      const response = await notesAPI.enhanceContent({
        content: combinedContent,
        enhanceType,
        personalityId: selectedPersonality,
        format: showPortfolioOptions ? portfolioType : undefined
      });
      
      let enhanced = response.data.enhancedContent;
      
      if (!showPortfolioOptions) {
        // Platform-specific enhancements
        if (selectedPlatform === 'linkedin') {
          enhanced = `🚀 ${publishName || 'Professional Update'}

${enhanced}

Key insights:
• Professional growth through innovation
• Building meaningful connections
• Sharing knowledge with the community

What are your thoughts on this? I'd love to hear your perspective in the comments below.

#Professional #Growth #Innovation #Networking`;
        } else if (selectedPlatform === 'twitter') {
          enhanced = enhanced.substring(0, 250) + (enhanced.length > 250 ? '...' : '') + '\n\n#Innovation #Growth';
        } else {
          enhanced = `✨ ${publishName || 'Creative Update'}

${enhanced}

Swipe to see more insights! 👉

#Creative #Inspiration #Growth #Mindset`;
        }
      }
      
      setEnhancedContent(enhanced);
      setStep('review');
    } catch (error) {
      console.error('Enhancement error:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSkipEnhancement = () => {
    setEnhancedContent(combinedContent);
    setStep('review');
  };

  const handleSaveAsDraft = async () => {
    setIsSavingDraft(true);
    try {
      await draftsAPI.createDraft({
        title: publishName || 'Untitled Draft',
        content: enhancedContent,
        type: showPortfolioOptions ? portfolioType : 'social',
        platform: showPortfolioOptions ? 'general' : selectedPlatform,
        personalityId: selectedPersonality,
        originalNotes: selectedNotes
      });
      
      onClose();
      resetModal();
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Copy content to clipboard first
      await copyToClipboard(enhancedContent);
      
      let response;
      let redirectUrl = '';
      
      if (selectedPlatform === 'linkedin') {
        response = await authAPI.linkedinPost({ content: enhancedContent });
        redirectUrl = response.data.redirectUrl || 'https://www.linkedin.com/feed/';
      } else if (selectedPlatform === 'twitter') {
        response = await authAPI.twitterPost({ content: enhancedContent });
        redirectUrl = response.data.redirectUrl || `https://twitter.com/intent/tweet?text=${encodeURIComponent(enhancedContent)}`;
      } else {
        response = await authAPI.instagramPost({ content: enhancedContent });
        redirectUrl = response.data.redirectUrl || 'https://www.instagram.com/';
      }
      
      // Save as published draft
      await draftsAPI.createDraft({
        title: publishName || 'Published Post',
        content: enhancedContent,
        type: showPortfolioOptions ? portfolioType : 'social',
        platform: showPortfolioOptions ? 'general' : selectedPlatform,
        personalityId: selectedPersonality,
        originalNotes: selectedNotesFromAll.map(note => note._id),
        isPublished: true,
        publishedAt: new Date()
      });
      
      // Show success message
      setStep('publish');
      
      // Open social media platform after a short delay
      setTimeout(() => {
        console.log('Opening LinkedIn with URL:', redirectUrl);
        if (redirectUrl) {
          window.open(redirectUrl, '_blank');
        }
        
        // Close modal after redirect
        setTimeout(() => {
          onClose();
          resetModal();
        }, 1000);
      }, 1500);
      
    } catch (error) {
      console.error('Publishing error:', error);
      alert('Content copied to clipboard! Please paste it in the social media platform.');
    } finally {
      setIsPublishing(false);
    }
  };

  const resetModal = () => {
    setStep('form');
    setPublishName('');
    setSelectedPersonality('');
    setSelectedProject('');
    setSelectedNotes([]);
    setEnhancedContent('');
    setCombinedContent('');
    setSearchQuery('');
    setShowPortfolioOptions(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {step === 'form' && 'Publish a New Portfolio'}
            {step === 'enhance' && 'Enhance & Publish'}
            {step === 'review' && 'Review Enhanced Content'}
            {step === 'publish' && 'Publishing...'}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetModal();
            }}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {step === 'form' && (
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  value={publishName}
                  onChange={(e) => setPublishName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg bg-white text-gray-900"
                  placeholder="Enter Publish name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Your Ego for this folder
                </label>
                <div className="relative">
                  <select
                    value={selectedPersonality}
                    onChange={(e) => handlePersonalitySelect(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none pr-10 bg-white text-gray-900"
                  >
                    <option value="">Choose</option>
                    {personalities.map((personality) => (
                      <option key={personality._id} value={personality._id}>
                        {personality.icon} {personality.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {selectedPersonality && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Folders/Projects
                  </label>
                  <div className="relative">
                    <select
                      value={selectedProject}
                      onChange={(e) => handleProjectSelect(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none pr-10 bg-white text-gray-900"
                    >
                      <option value="">Choose</option>
                      {availableProjects.map((project) => (
                        <option key={project._id} value={project._id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              )}

              {selectedProject && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose notes/Files
                  </label>
                  
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 w-full"
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-300 rounded-xl p-3">
                    {filteredNotes.map((note) => (
                      <div 
                        key={note._id}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedNotes.includes(note._id)
                            ? 'bg-purple-50 border-purple-300 border-2'
                            : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                        }`}
                        onClick={() => handleNoteSelection(note._id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{note.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {note.content.substring(0, 50)}...
                            </p>
                          </div>
                          {selectedNotes.includes(note._id) && (
                            <Check className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-500">
                Ready to select notes from all your content.
              </p>

              <button
                onClick={handleFormSubmit}
                disabled={!publishName.trim() || !selectedPersonality}
                className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Select Notes
              </button>
            </div>
          )}

          {step === 'selection' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Select Notes to Publish</h3>
                <button
                  onClick={() => setStep('form')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Back
                </button>
              </div>
              
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search all notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 w-full"
                />
              </div>

              {/* Selected Notes */}
              {selectedNotesFromAll.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Notes ({selectedNotesFromAll.length})</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto bg-purple-50 rounded-lg p-3">
                    {selectedNotesFromAll.map((note) => (
                      <div key={note._id} className="flex items-center justify-between bg-white rounded-lg p-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 text-sm">{note.title}</h5>
                          <p className="text-xs text-gray-600">{note.personalityId.name} • {note.folderId?.name || 'No Project'}</p>
                        </div>
                        <button
                          onClick={() => removeSelectedNote(note._id)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Notes */}
              <div className="max-h-64 overflow-y-auto space-y-2 border border-gray-300 rounded-xl p-3">
                {allNotes
                  .filter(note => 
                    !searchQuery || 
                    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    note.content.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((note) => {
                    const isSelected = selectedNotesFromAll.find(n => n._id === note._id);
                    return (
                      <div 
                        key={note._id}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-purple-50 border-purple-300 border-2'
                            : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                        }`}
                        onClick={() => handleNoteSelectionFromAll(note)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{note.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {note.content.substring(0, 50)}...
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-purple-600">{note.personalityId.icon} {note.personalityId.name}</span>
                              {note.folderId && (
                                <span className="text-xs text-gray-500">📁 {note.folderId.name}</span>
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              <button
                onClick={proceedToEnhance}
                disabled={selectedNotesFromAll.length === 0}
                className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue with {selectedNotesFromAll.length} notes
              </button>
            </div>
          )}

          {step === 'enhance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Combined Content</h3>
                <button
                  onClick={() => setStep('selection')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Back
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 max-h-32 overflow-y-auto">
                <textarea
                  value={combinedContent}
                  onChange={(e) => setCombinedContent(e.target.value)}
                  rows={6}
                  className="w-full bg-transparent border-none outline-none resize-none text-gray-700 text-sm"
                  placeholder="Combined content will appear here..."
                />
              </div>

              {/* Type Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose Type</h3>
                <div className="flex space-x-3 mb-4">
                  <button
                    onClick={() => setShowPortfolioOptions(false)}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      !showPortfolioOptions
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">📱</div>
                      <div className="font-semibold text-gray-900">Social Post</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setShowPortfolioOptions(true)}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      showPortfolioOptions
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">📄</div>
                      <div className="font-semibold text-gray-900">Portfolio</div>
                    </div>
                  </button>
                </div>

                {showPortfolioOptions ? (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Portfolio Type</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {['portfolio', 'resume', 'biodata'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setPortfolioType(type as any)}
                          className={`p-3 rounded-xl border-2 transition-all text-center ${
                            portfolioType === type
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-semibold text-gray-900 capitalize">{type}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Choose Platform</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {platforms.map((platform) => (
                        <button
                          key={platform.id}
                          onClick={() => setSelectedPlatform(platform.id as any)}
                          className={`p-4 rounded-xl border-2 transition-all text-center ${
                            selectedPlatform === platform.id
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">{platform.icon}</div>
                          <div className="font-semibold text-gray-900">{platform.name}</div>
                          <div className="text-sm text-gray-600">{platform.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSkipEnhancement}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                >
                  Skip Enhancement
                </button>
                <button
                  onClick={handleEnhance}
                  disabled={isEnhancing}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold disabled:opacity-50 flex items-center justify-center"
                >
                  {isEnhancing ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Enhance with AI
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Enhanced Content</h3>
                <button
                  onClick={() => setStep('enhance')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Back
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
                <textarea
                  value={enhancedContent}
                  onChange={(e) => setEnhancedContent(e.target.value)}
                  rows={12}
                  className="w-full bg-transparent border-none outline-none resize-none text-gray-700"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {showPortfolioOptions ? `Type: ${portfolioType}` : `Platform: ${platforms.find(p => p.id === selectedPlatform)?.name}`}
                </span>
                <span className="text-sm text-gray-500">
                  {enhancedContent.length} characters
                </span>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handlePublish}
                  disabled={isPublishing || showPortfolioOptions}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold disabled:opacity-50 flex items-center justify-center"
                >
                  {isPublishing ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5 mr-2" />
                      {showPortfolioOptions ? 'Download Portfolio' : 'Publish Now'}
                    </>
                  )}
                </button>
                <button
                  onClick={handleSaveAsDraft}
                  disabled={isSavingDraft}
                  className="flex-1 bg-yellow-600 text-white py-3 rounded-xl hover:bg-yellow-700 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center"
                >
                  {isSavingDraft ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save as Draft
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'publish' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Successfully Published!</h3>
              <p className="text-gray-600">Your content has been copied to clipboard and you'll be redirected to {platforms.find(p => p.id === selectedPlatform)?.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};