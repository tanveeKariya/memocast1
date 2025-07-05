import express from 'express';
import Draft from '../models/Draft.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get user drafts
router.get('/', auth, async (req, res) => {
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
});

// Create draft
router.post('/', auth, async (req, res) => {
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
});

// Update draft
router.put('/:id', auth, async (req, res) => {
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
});

// Delete draft
router.delete('/:id', auth, async (req, res) => {
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
});

// Publish draft
router.post('/:id/publish', auth, async (req, res) => {
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
});

export default router;