import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Personality from '../models/Personality.js';
import Note from '../models/Note.js';
import Folder from '../models/Folder.js';
import Draft from '../models/Draft.js';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Demo login
export const demoLogin = async (req, res) => {
  try {
    // Check if demo user exists
    let user = await User.findOne({ email: 'demo@memocast.co' });
    
    if (!user) {
      // Create demo user
      user = new User({
        username: 'Demo User',
        email: 'demo@memocast.co',
        password: 'demo123',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
      });
      await user.save();

      // Create default personality for demo user
      const defaultPersonality = new Personality({
        name: 'Default',
        icon: '👤',
        color: '#8B5CF6',
        description: 'Your default identity',
        userId: user._id,
        isDefault: true
      });
      await defaultPersonality.save();

      user.currentPersonality = defaultPersonality._id;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userWithPersonality = await User.findById(user._id)
      .populate('currentPersonality')
      .select('-password');

    res.json({
      token,
      user: userWithPersonality
    });
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({ message: 'Server error during demo login' });
  }
};

// Google OAuth login
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ message: 'No credential provided' });
    }
    
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }
    
    const { sub: googleId, email, name, picture } = payload;
    
    let user = await User.findOne({ 
      $or: [{ email }, { googleId }] 
    });
    
    if (!user) {
      // Create new user
      user = new User({
        username: name,
        email,
        googleId,
        avatar: picture || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        authProvider: 'google'
      });
      await user.save();
      
      // Create default personality
      const defaultPersonality = new Personality({
        name: 'Default',
        icon: '👤',
        color: '#8B5CF6',
        description: 'Your default identity',
        userId: user._id,
        isDefault: true
      });
      await defaultPersonality.save();
      
      user.currentPersonality = defaultPersonality._id;
      await user.save();
    } else if (!user.googleId) {
      // Link existing account
      user.googleId = googleId;
      if (picture) user.avatar = picture;
      user.authProvider = 'google';
      await user.save();
    } else if (picture && picture !== user.avatar) {
      // Update profile picture if changed
      user.avatar = picture;
      await user.save();
    }
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    const userWithPersonality = await User.findById(user._id)
      .populate('currentPersonality')
      .select('-password');
    
    res.json({
      token,
      user: userWithPersonality
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Google authentication failed: ' + error.message });
  }
};

// LinkedIn OAuth login
export const linkedinLogin = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'No authorization code provided' });
    }
    
    // Exchange code for access token
    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', 
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: process.env.CLIENT_URL || 'https://memocast.netlify.app/linkedin-callback'
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      }
    );
    
    const { access_token } = tokenResponse.data;
    
    if (!access_token) {
      return res.status(400).json({ message: 'Failed to get access token from LinkedIn' });
    }
    
    // Get user profile
    const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json'
      }
    });
    
    const profile = profileResponse.data;
    const linkedinId = profile.sub;
    const email = profile.email;
    const name = profile.name;
    const picture = profile.picture;
    
    let user = await User.findOne({ 
      $or: [{ email }, { linkedinId }] 
    });
    
    if (!user) {
      // Create new user
      user = new User({
        username: name,
        email,
        linkedinId,
        avatar: picture || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        authProvider: 'linkedin',
        linkedinAccessToken: access_token
      });
      await user.save();
      
      // Create default personality
      const defaultPersonality = new Personality({
        name: 'Professional',
        icon: '💼',
        color: '#0077B5',
        description: 'Professional LinkedIn identity',
        userId: user._id,
        isDefault: true
      });
      await defaultPersonality.save();
      
      user.currentPersonality = defaultPersonality._id;
      await user.save();
    } else {
      // Update existing user
      user.linkedinId = linkedinId;
      user.linkedinAccessToken = access_token;
      if (picture && picture !== user.avatar) user.avatar = picture;
      await user.save();
    }
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    const userWithPersonality = await User.findById(user._id)
      .populate('currentPersonality')
      .select('-password');
    
    res.json({
      token,
      user: userWithPersonality
    });
  } catch (error) {
    console.error('LinkedIn login error:', error);
    res.status(500).json({ 
      message: 'LinkedIn authentication failed: ' + (error.response?.data?.error_description || error.message)
    });
  }
};

// Post to LinkedIn
export const linkedinPost = async (req, res) => {
  try {
    const { content } = req.body;
    
    // Copy content to clipboard and redirect
    const linkedinUrl = 'https://www.linkedin.com/feed/';
    
    res.json({ 
      success: true, 
      redirectUrl: linkedinUrl,
      content: content,
      message: 'Content copied to clipboard. Redirecting to LinkedIn...'
    });
  } catch (error) {
    console.error('LinkedIn post error:', error);
    res.status(500).json({ message: 'Failed to post to LinkedIn' });
  }
};

// Post to Twitter
export const twitterPost = async (req, res) => {
  try {
    const { content } = req.body;
    
    // For Twitter, we'll redirect to Twitter's intent URL with prefilled content
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`;
    
    res.json({ 
      success: true, 
      redirectUrl: twitterUrl,
      content: content,
      message: 'Content copied to clipboard. Redirecting to Twitter...'
    });
  } catch (error) {
    console.error('Twitter post error:', error);
    res.status(500).json({ message: 'Failed to post to Twitter' });
  }
};

// Post to Instagram
export const instagramPost = async (req, res) => {
  try {
    const { content } = req.body;
    
    // For Instagram, we'll provide instructions to copy content
    res.json({ 
      success: true, 
      redirectUrl: 'https://www.instagram.com/',
      content: content,
      message: 'Content copied to clipboard. Redirecting to Instagram...'
    });
  } catch (error) {
    console.error('Instagram post error:', error);
    res.status(500).json({ message: 'Failed to prepare Instagram post' });
  }
};

// Register
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create user
    const user = new User({ username, email, password });
    await user.save();

    // Create default personality
    const defaultPersonality = new Personality({
      name: 'Default',
      icon: '👤',
      color: '#8B5CF6',
      description: 'Your default identity',
      userId: user._id,
      isDefault: true
    });
    await defaultPersonality.save();

    user.currentPersonality = defaultPersonality._id;
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userWithPersonality = await User.findById(user._id)
      .populate('currentPersonality')
      .select('-password');

    res.status(201).json({
      token,
      user: userWithPersonality
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('currentPersonality');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('currentPersonality')
      .select('-password');
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // Check if email/username already exists for other users
    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: req.userId } },
        { $or: [{ email }, { username }] }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email or username already exists' 
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { username, email },
      { new: true }
    ).populate('currentPersonality').select('-password');
    
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update preferences
export const updatePreferences = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { preferences: req.body },
      { new: true }
    ).populate('currentPersonality').select('-password');
    
    res.json(user);
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.userId);
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export user data
export const exportData = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    const personalities = await Personality.find({ userId: req.userId });
    const folders = await Folder.find({ userId: req.userId });
    const notes = await Note.find({ userId: req.userId });
    const drafts = await Draft.find({ userId: req.userId });

    const exportData = {
      user,
      personalities,
      folders,
      notes,
      drafts,
      exportDate: new Date().toISOString()
    };

    res.json(exportData);
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete account
export const deleteAccount = async (req, res) => {
  try {
    // Delete all user data
    await Promise.all([
      User.findByIdAndDelete(req.userId),
      Personality.deleteMany({ userId: req.userId }),
      Folder.deleteMany({ userId: req.userId }),
      Note.deleteMany({ userId: req.userId }),
      Draft.deleteMany({ userId: req.userId })
    ]);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get storage stats
export const getStorageStats = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId });
    const folders = await Folder.find({ userId: req.userId });
    
    // Calculate total size in MB
    const totalNotesSize = notes.reduce((acc, note) => acc + (note.size || 0), 0);
    const totalFoldersSize = folders.reduce((acc, folder) => acc + (folder.size || 0), 0);
    const totalUsed = totalNotesSize + totalFoldersSize;
    
    // Convert to GB for display
    const usedGB = totalUsed / 1000; // Convert MB to GB
    const totalGB = 25; // 25GB total storage
    
    res.json({
      used: usedGB,
      total: totalGB,
      usedMB: totalUsed,
      percentage: (usedGB / totalGB) * 100
    });
  } catch (error) {
    console.error('Get storage stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};