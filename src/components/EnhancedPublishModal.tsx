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
  const [personalities, setPersonalities] = useState<any[]>([]);
  const [enhancedContent, setEnhancedContent] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [step, setStep] = useState<'form' | 'enhance' | 'review' | 'publish'>('form');
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
      name: 'Twitter',
      icon: '🐦',
      description: 'Short-form social media',
      maxLength: 280
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📸',
      description: 'Visual storytelling',
      maxLength: 2200
    }
  ];

  useEffect(() => {
    if (isOpen) {
      loadData();
      setStep('form');
      setPublishName('');
      setSelectedPersonality('');
      setSelectedProject('');
      setSelectedNotes([]);
      setEnhancedContent('');
      setCombinedContent('');
      setSearchQuery('');
      setShowPortfolioOptions(false);
      setSelectedPlatform('linkedin'); // Reset selected platform on open
      setPortfolioType('portfolio'); // Reset portfolio type on open
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
      // Optionally set an error state to display to the user
    }
  };

  const loadProjectsForPersonality = async (personalityId: string) => {
    try {
      const response = await notesAPI.getNotes();
      // Assuming notes come with a folderId property that can be null or an object with _id and name
      const userNotes = response.data.filter((note: any) => note.personalityId?._id === personalityId);
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
      // Ensure both folderId and personalityId are sent if needed by your API
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
    setSelectedProject(''); // Reset project when personality changes
    setAvailableProjects([]); // Clear projects for new personality
    setAvailableNotes([]); // Clear notes
    setSelectedNotes([]); // Clear selected notes
    if (personalityId) { // Only load if a personality is actually selected
      loadProjectsForPersonality(personalityId);
    }
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    setSelectedNotes([]); // Clear selected notes when project changes
    setAvailableNotes([]); // Clear notes
    if (projectId) { // Only load if a project is actually selected
      loadNotesForProject(projectId);
    }
  };

  const handleNoteSelection = (noteId: string) => {
    setSelectedNotes(prev =>
      prev.includes(noteId)
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleFormSubmit = () => {
    if (!publishName.trim() || !selectedPersonality || selectedNotes.length === 0) {
      alert('Please fill in all required fields: Publish Name, Ego, and select at least one Note.');
      return;
    }

    const selected = availableNotes.filter(note => selectedNotes.includes(note._id));
    const combined = selected.map(note => `${note.title}\n\n${note.content}`).join('\n\n---\n\n');
    setCombinedContent(combined);
    setStep('enhance');
  };

  const handleEnhance = async () => {
    if (!combinedContent) {
      alert('No content to enhance. Please select notes.');
      return;
    }

    setIsEnhancing(true);
    try {
      let enhanceType = 'social';
      let prompt = ''; // The prompt sent to the backend might be based on `enhanceType` and `format`

      if (showPortfolioOptions) {
        enhanceType = 'portfolio';
        // The backend `notesAPI.enhanceContent` should handle the actual AI prompt
        // based on `enhanceType` and `format` ('portfolio', 'resume', 'biodata')
      } else {
        enhanceType = 'social';
        // The backend `notesAPI.enhanceContent` should handle the actual AI prompt
        // based on `enhanceType` and `platform` ('linkedin', 'twitter', 'instagram')
      }

      const response = await notesAPI.enhanceContent({
        content: combinedContent,
        enhanceType: enhanceType, // Pass enhanceType to backend
        personalityId: selectedPersonality,
        format: showPortfolioOptions ? portfolioType : undefined, // Send portfolioType if portfolio
        platform: !showPortfolioOptions ? selectedPlatform : undefined // Send selectedPlatform if social
      });

      let enhanced = response.data.enhancedContent;

      // Frontend-side additions (optional, usually done by backend for consistency)
      if (!showPortfolioOptions) {
        if (selectedPlatform === 'linkedin') {
          enhanced = `🚀 ${publishName || 'Professional Update'}\n\n${enhanced}\n\nKey insights:\n• Professional growth through innovation\n• Building meaningful connections\n• Sharing knowledge with the community\n\nWhat are your thoughts on this? I'd love to hear your perspective in the comments below.\n\n#Professional #Growth #Innovation #Networking`;
        } else if (selectedPlatform === 'twitter') {
          const twitterMaxLength = platforms.find(p => p.id === 'twitter')?.maxLength || 280;
          enhanced = enhanced.substring(0, twitterMaxLength - 50) + (enhanced.length > (twitterMaxLength - 50) ? '...' : '') + '\n\n#Innovation #Growth'; // Leave room for hashtags
        } else if (selectedPlatform === 'instagram') {
          enhanced = `✨ ${publishName || 'Creative Update'}\n\n${enhanced}\n\nSwipe to see more insights! 👉\n\n#Creative #Inspiration #Growth #Mindset`;
        }
      }

      setEnhancedContent(enhanced);
      setStep('review');
    } catch (error) {
      console.error('Enhancement error:', error);
      alert('Failed to enhance content. Please try again.'); // User feedback
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
        content: enhancedContent || combinedContent, // Save enhanced or original if skipped
        type: showPortfolioOptions ? portfolioType : 'social',
        platform: showPortfolioOptions ? 'general' : selectedPlatform, // 'general' for portfolio types
        personalityId: selectedPersonality,
        originalNotes: selectedNotes
      });

      onClose();
      resetModal();
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please try again.'); // User feedback
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    let clipboardSuccess = false;
    try {
      // 1. Copy content to clipboard
      await navigator.clipboard.writeText(enhancedContent);
      clipboardSuccess = true;

      // 2. Determine platform-specific action
      let redirectTarget = '';
      let apiResponse;

      if (selectedPlatform === 'linkedin') {
        // Call backend API which might initiate OAuth or return a direct share URL
        apiResponse = await authAPI.linkedinPost({ content: enhancedContent });
        redirectTarget = apiResponse.data.redirectUrl || 'https://www.linkedin.com/feed/';
      } else if (selectedPlatform === 'twitter') {
        // Call backend API for Twitter, it might return a pre-filled tweet URL
        apiResponse = await authAPI.twitterPost({ content: enhancedContent });
        redirectTarget = apiResponse.data.redirectUrl || `https://twitter.com/intent/tweet?text=${encodeURIComponent(enhancedContent)}`;
      } else if (selectedPlatform === 'instagram') {
        // Instagram usually doesn't allow direct text posting via API for users,
        // so we just open the app/web and ask the user to paste.
        redirectTarget = 'https://www.instagram.com/';
      }

      // 3. Open the target URL
      if (redirectTarget) {
        window.open(redirectTarget, '_blank');
      } else {
        // Fallback if no specific redirect was found or necessary
        alert('Content copied to clipboard! Please open your social media app and paste it manually.');
      }

      // 4. Save as published draft
      await draftsAPI.createDraft({
        title: publishName || 'Published Post',
        content: enhancedContent,
        type: showPortfolioOptions ? portfolioType : 'social',
        platform: showPortfolioOptions ? 'general' : selectedPlatform,
        personalityId: selectedPersonality,
        originalNotes: selectedNotes,
        isPublished: true,
        publishedAt: new Date()
      });

      setStep('publish');
      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose();
        resetModal();
      }, 2000);

    } catch (err: any) {
      console.error('Publishing error:', err);
      if (clipboardSuccess) {
        alert('Content copied to clipboard! Please open your social media app/web and paste it manually.');
      } else {
        alert('Failed to copy content to clipboard. Please try again.');
      }
      // Stay on the review step if publishing fails so user can still copy manually
      setStep('review');
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
    setAvailableProjects([]); // Clear available projects
    setAvailableNotes([]); // Clear available notes
    setPersonalities([]); // Clear personalities (will reload on next open)
    setEnhancedContent('');
    setCombinedContent('');
    setSearchQuery('');
    setShowPortfolioOptions(false);
    setSelectedPlatform('linkedin');
    setPortfolioType('portfolio');
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
                    {filteredNotes.length > 0 ? (
                      filteredNotes.map((note) => (
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
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">No notes found for this project.</p>
                    )}
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-500">
                {selectedNotes.length} items selected.
              </p>

              <button
                onClick={handleFormSubmit}
                disabled={!publishName.trim() || !selectedPersonality || selectedNotes.length === 0}
                className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Enhance Content
              </button>
            </div>
          )}

          {step === 'enhance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Combined Content</h3>
                <button
                  onClick={() => setStep('form')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Back
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 max-h-32 overflow-y-auto">
                <p className="text-gray-700 text-sm">{combinedContent}</p>
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
                  {enhancedContent.length} characters {
                    !showPortfolioOptions && platforms.find(p => p.id === selectedPlatform) &&
                    ` / ${platforms.find(p => p.id === selectedPlatform)?.maxLength}`
                  }
                </span>
              </div>

              <div className="flex space-x-3">
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
                {!showPortfolioOptions && ( // Only show Publish Now for social posts
                  <button
                    onClick={handlePublish}
                    disabled={isPublishing}
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
                        Publish Now
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 'publish' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Successfully Published!</h3>
              <p className="text-gray-600">Your content has been shared {
                !showPortfolioOptions && platforms.find(p => p.id === selectedPlatform)
                  ? `to ${platforms.find(p => p.id === selectedPlatform)?.name}`
                  : 'to your clipboard for manual paste'
              }.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};