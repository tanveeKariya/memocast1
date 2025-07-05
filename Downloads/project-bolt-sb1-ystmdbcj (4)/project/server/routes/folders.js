import express from 'express';
import Folder from '../models/Folder.js';
import Note from '../models/Note.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get user folders
router.get('/', auth, async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.userId })
      .populate('personalityId', 'name icon color');
    res.json(folders);
  } catch (error) {
    console.error('Get folders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create folder
router.post('/', auth, async (req, res) => {
  try {
    const { name, category, color, personalityId } = req.body;
    
    const folder = new Folder({
      name,
      category,
      color,
      personalityId,
      userId: req.userId
    });
    
    await folder.save();
    await folder.populate('personalityId', 'name icon color');
    
    res.status(201).json(folder);
  } catch (error) {
    console.error('Create folder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update folder
router.put('/:id', auth, async (req, res) => {
  try {
    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    ).populate('personalityId', 'name icon color');
    
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    
    res.json(folder);
  } catch (error) {
    console.error('Update folder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete folder
router.delete('/:id', auth, async (req, res) => {
  try {
    const folder = await Folder.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    
    // Delete all notes in this folder
    await Note.deleteMany({ folderId: folder._id });
    
    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Delete folder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;