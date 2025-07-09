import Draft from '../models/Draft.js';

// Get user drafts
export const getDrafts = async (req, res) => {
  try {
    const drafts = await Draft.find({ userId: req.userId })
      .populate('personalityId', 'name icon color')
      .populate('originalNotes', 'title')
      .sort({ updatedAt: -1 });
    
    res.json(drafts);
  } catch (error) {
    console.error('Get drafts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create draft
export const createDraft = async (req, res) => {
  try {
    const { title, content, type, platform, personalityId, originalNotes } = req.body;
    
    const draft = new Draft({
      title,
      content,
      type,
      platform,
      personalityId,
      originalNotes: originalNotes || [],
      userId: req.userId
    });
    
    await draft.save();
    await draft.populate([
      { path: 'personalityId', select: 'name icon color' },
      { path: 'originalNotes', select: 'title' }
    ]);
    
    res.status(201).json(draft);
  } catch (error) {
    console.error('Create draft error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update draft
export const updateDraft = async (req, res) => {
  try {
    const draft = await Draft.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    ).populate([
      { path: 'personalityId', select: 'name icon color' },
      { path: 'originalNotes', select: 'title' }
    ]);
    
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }
    
    res.json(draft);
  } catch (error) {
    console.error('Update draft error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete draft
export const deleteDraft = async (req, res) => {
  try {
    const draft = await Draft.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }
    
    res.json({ message: 'Draft deleted successfully' });
  } catch (error) {
    console.error('Delete draft error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Publish draft
export const publishDraft = async (req, res) => {
  try {
    const draft = await Draft.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { 
        isPublished: true,
        publishedAt: new Date()
      },
      { new: true }
    );
    
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }
    
    res.json(draft);
  } catch (error) {
    console.error('Publish draft error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Share draft to social media
export const shareDraft = async (req, res) => {
  try {
    const { platform } = req.body;
    const draft = await Draft.findOne({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }
    
    let redirectUrl = '';
    
    switch (platform) {
      case 'linkedin':
        redirectUrl = 'https://www.linkedin.com/feed/';
        break;
      case 'twitter':
        redirectUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(draft.content)}`;
        break;
      case 'instagram':
        redirectUrl = 'https://www.instagram.com/';
        break;
      default:
        return res.status(400).json({ message: 'Invalid platform' });
    }
    
    res.json({
      success: true,
      redirectUrl,
      content: draft.content,
      message: `Content copied to clipboard. Redirecting to ${platform}...`
    });
  } catch (error) {
    console.error('Share draft error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};