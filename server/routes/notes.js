import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Note from '../models/Note.js';
import Folder from '../models/Folder.js';
import { auth } from '../middleware/auth.js';
import axios from 'axios';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';

const router = express.Router();

// GridFS setup for file storage
let gfsBucket;
mongoose.connection.once('open', () => {
  gfsBucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'attachments'
  });
});

// Configure multer for file uploads
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Get user notes
router.get('/', auth, async (req, res) => {
  try {
    const { folderId, category, search } = req.query;
    let query = { userId: req.userId };
    
    if (folderId && folderId !== 'null') query.folderId = folderId;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    const notes = await Note.find(query)
      .populate('folderId', 'name color')
      .populate('personalityId', 'name icon color')
      .sort({ updatedAt: -1 });
    
    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single note
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId
    })
    .populate('folderId', 'name color')
    .populate('personalityId', 'name icon color');
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create note with file uploads
router.post('/', auth, upload.array('attachments', 10), async (req, res) => {
  try {
    const { title, content, category, folderId, personalityId, isVoiceNote, tags } = req.body;
    
    // Validate required fields
    if (!title || !content || !personalityId) {
      return res.status(400).json({ message: 'Title, content, and personality are required' });
    }

    // Process uploaded files
    const attachments = [];
    let finalContent = content;
    
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        let extractedText = '';
        
        // Extract text from documents if needed
        if (file.mimetype === 'application/pdf') {
          try {
            const data = await pdfParse(file.buffer);
            extractedText = data.text;
          } catch (error) {
            console.error('PDF parsing error:', error);
          }
        } else if (file.mimetype.includes('word') || file.originalname.endsWith('.docx')) {
          try {
            const result = await mammoth.extractRawText({ buffer: file.buffer });
            extractedText = result.value;
          } catch (error) {
            console.error('Word document parsing error:', error);
          }
        }
        
        // Store file in GridFS
        const uploadStream = gfsBucket.openUploadStream(file.originalname, {
          metadata: {
            userId: req.userId,
            originalName: file.originalname,
            mimeType: file.mimetype
          }
        });
        
        uploadStream.end(file.buffer);
        
        await new Promise((resolve, reject) => {
          uploadStream.on('finish', resolve);
          uploadStream.on('error', reject);
        });
        
        attachments.push({
          name: file.originalname,
          url: `/api/files/${uploadStream.id}`,
          type: file.mimetype,
          size: file.size,
          gridfsId: uploadStream.id
        });
        
        // If text was extracted, append to content
        if (extractedText) {
          finalContent = content + '\n\n--- Extracted Text ---\n' + extractedText;
        }
      }
    }
    
    const note = new Note({
      title,
      content: finalContent,
      category: category || 'Personal',
      folderId: folderId && folderId !== 'null' ? folderId : null,
      personalityId,
      isVoiceNote: isVoiceNote === 'true',
      tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [],
      attachments,
      size: finalContent.length / 1000,
      userId: req.userId
    });
    
    await note.save();
    
    // Update folder note count and size
    if (folderId && folderId !== 'null') {
      await Folder.findByIdAndUpdate(folderId, {
        $inc: { noteCount: 1, size: note.size }
      });
    }
    
    await note.populate([
      { path: 'folderId', select: 'name color' },
      { path: 'personalityId', select: 'name icon color' }
    ]);
    
    res.status(201).json(note);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Update note
router.put('/:id', auth, async (req, res) => {
  try {
    const oldNote = await Note.findOne({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!oldNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { ...req.body, size: req.body.content ? req.body.content.length / 1000 : oldNote.size },
      { new: true }
    )
    .populate('folderId', 'name color')
    .populate('personalityId', 'name icon color');
    
    // Update folder size if content changed
    if (req.body.content && oldNote.folderId) {
      const sizeDiff = updatedNote.size - oldNote.size;
      await Folder.findByIdAndUpdate(oldNote.folderId, {
        $inc: { size: sizeDiff }
      });
    }
    
    res.json(updatedNote);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Delete associated files from GridFS
    if (note.attachments && note.attachments.length > 0) {
      for (const attachment of note.attachments) {
        if (attachment.gridfsId) {
          try {
            await gfsBucket.delete(attachment.gridfsId);
          } catch (error) {
            console.error('Error deleting file from GridFS:', error);
          }
        }
      }
    }
    
    // Update folder note count and size
    if (note.folderId) {
      await Folder.findByIdAndUpdate(note.folderId, {
        $inc: { noteCount: -1, size: -note.size }
      });
    }
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enhance note content with DeepSeek AI
router.post('/:id/enhance', auth, async (req, res) => {
  try {
    const { platform, personalityId, enhanceType = 'social' } = req.body;
    
    if (!process.env.DEEPSEEK_API_KEY) {
      return res.status(400).json({ message: 'AI enhancement not available' });
    }
    
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId
    }).populate('personalityId');
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    const personality = note.personalityId;
    let prompt = '';
    
    if (enhanceType === 'format') {
      prompt = `You are a helpful assistant, you correct spellings, sentence formation and grammar, without changing the tone or meaning of the content. Check and correct the content and return just the corrected content without any other sentences: ${note.content}`;
    } else if (enhanceType === 'social') {
      prompt = `Transform the following note content for ${platform} platform.
Personality: ${personality.name} - ${personality.description}

Original content:
Title: ${note.title}
Content: ${note.content}

Please create an engaging ${platform} post that:
1. Matches the ${personality.name} personality style
2. Is optimized for ${platform} format and audience
3. Includes relevant hashtags
4. Maintains the core message while making it more engaging

Return only the enhanced content, ready to post.`;
    } else if (enhanceType === 'portfolio') {
      const format = req.body.format || 'portfolio';
      prompt = `Generate a ${format} in the following format based on this content:

Content: ${note.content}
Personality: ${personality.name} - ${personality.description}

Create a professional ${format} that showcases the information effectively.`;
    }
    
    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that enhances content while maintaining its original meaning and tone."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: platform === 'twitter' ? 280 : 1024
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      }
    });
    
    const enhancedContent = response.data.choices[0].message.content;
    
    // Save enhanced version
    note.enhancedVersions.push({
      platform: platform || 'general',
      content: enhancedContent
    });
    
    await note.save();
    
    res.json({ enhancedContent });
  } catch (error) {
    console.error('AI enhancement error:', error);
    res.status(500).json({ message: 'Enhancement failed: ' + error.message });
  }
});

// Enhance content directly (without note ID)
router.post('/enhance', auth, async (req, res) => {
  try {
    const { content, enhanceType = 'format', personalityId, format } = req.body;
    
    if (!process.env.DEEPSEEK_API_KEY) {
      return res.status(400).json({ message: 'AI enhancement not available' });
    }
    
    let prompt = '';
    
    if (enhanceType === 'format') {
      prompt = `You are a helpful assistant, you correct spellings, sentence formation and grammar, without changing the tone or meaning of the content. Check and correct the content and return just the corrected content without any other sentences: ${content}`;
    } else if (enhanceType === 'combine') {
      prompt = `Combine these files with proper formatting and make necessary changes for better readability and flow. Maintain the original meaning while improving structure: ${content}`;
    } else if (enhanceType === 'portfolio') {
      prompt = `Generate a ${format} in the following format based on this content:

Content: ${content}

Create a professional ${format} that showcases the information effectively. Format it properly with sections and bullet points where appropriate.`;
    }
    
    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that enhances content while maintaining its original meaning and tone."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1024
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      }
    });
    
    const enhancedContent = response.data.choices[0].message.content;
    
    res.json({ enhancedContent });
  } catch (error) {
    console.error('AI enhancement error:', error);
    res.status(500).json({ message: 'Enhancement failed: ' + error.message });
  }
});

// Get file from GridFS
router.get('/files/:id', auth, async (req, res) => {
  try {
    const file = await gfsBucket.find({ _id: req.params.id }).toArray();
    
    if (!file || file.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    const downloadStream = gfsBucket.openDownloadStream(req.params.id);
    
    res.set('Content-Type', file[0].metadata.mimeType);
    res.set('Content-Disposition', `attachment; filename="${file[0].filename}"`);
    
    downloadStream.pipe(res);
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notes statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const stats = await Note.aggregate([
      { $match: { userId: req.userId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalSize: { $sum: '$size' }
        }
      }
    ]);
    
    const totalNotes = await Note.countDocuments({ userId: req.userId });
    const totalSize = await Note.aggregate([
      { $match: { userId: req.userId } },
      { $group: { _id: null, total: { $sum: '$size' } } }
    ]);
    
    res.json({
      totalNotes,
      totalSize: totalSize[0]?.total || 0,
      categoryStats: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;