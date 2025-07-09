import Folder from '../models/Folder.js';
import Note from '../models/Note.js';

// Get user folders
export const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.userId })
      .populate('personalityId', 'name icon color');
    res.json(folders);
  } catch (error) {
    console.error('Get folders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create folder
export const createFolder = async (req, res) => {
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
};

// Update folder
export const updateFolder = async (req, res) => {
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
};

// Delete folder
export const deleteFolder = async (req, res) => {
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
};

// Share folder
export const shareFolder = async (req, res) => {
  try {
    const { platform } = req.body;
    const folder = await Folder.findOne({
      _id: req.params.id,
      userId: req.userId
    }).populate('personalityId', 'name icon color');
    
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    
    // Get all notes in this folder
    const notes = await Note.find({ folderId: folder._id });
    const content = `📁 ${folder.name}\n\n${notes.map(note => `• ${note.title}\n${note.content.substring(0, 100)}...`).join('\n\n')}`;
    
    let redirectUrl = '';
    
    switch (platform) {
      case 'linkedin':
        redirectUrl = 'https://www.linkedin.com/feed/';
        break;
      case 'twitter':
        redirectUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`;
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
      content,
      message: `Folder content copied to clipboard. Redirecting to ${platform}...`
    });
  } catch (error) {
    console.error('Share folder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};