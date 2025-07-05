import express from 'express';
import Personality from '../models/Personality.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get user personalities
router.get('/', auth, async (req, res) => {
  try {
    const personalities = await Personality.find({ userId: req.userId });
    res.json(personalities);
  } catch (error) {
    console.error('Get personalities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create personality
router.post('/', auth, async (req, res) => {
  try {
    const { name, icon, color, description } = req.body;
    
    if (!name || !icon || !description) {
      return res.status(400).json({ message: 'Name, icon, and description are required' });
    }
    
    const personality = new Personality({
      name,
      icon,
      color: color || '#8B5CF6',
      description,
      userId: req.userId
    });
    
    await personality.save();
    res.status(201).json(personality);
  } catch (error) {
    console.error('Create personality error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Update personality
router.put('/:id', auth, async (req, res) => {
  try {
    const personality = await Personality.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    
    if (!personality) {
      return res.status(404).json({ message: 'Personality not found' });
    }
    
    res.json(personality);
  } catch (error) {
    console.error('Update personality error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete personality
router.delete('/:id', auth, async (req, res) => {
  try {
    const personality = await Personality.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!personality) {
      return res.status(404).json({ message: 'Personality not found' });
    }
    
    res.json({ message: 'Personality deleted successfully' });
  } catch (error) {
    console.error('Delete personality error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Switch personality
router.put('/switch/:id', auth, async (req, res) => {
  try {
    const personality = await Personality.findOne({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!personality) {
      return res.status(404).json({ message: 'Personality not found' });
    }
    
    await User.findByIdAndUpdate(req.userId, {
      currentPersonality: personality._id
    });
    
    res.json({ message: 'Personality switched successfully' });
  } catch (error) {
    console.error('Switch personality error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;