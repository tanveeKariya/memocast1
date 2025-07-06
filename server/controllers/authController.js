import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Personality from '../models/Personality.js';
import Note from '../models/Note.js';
import Folder from '../models/Folder.js';
import Draft from '../models/Draft.js';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client('283355615750-l8u04tnk65dv48stlvn5avjms3rvf4n3.apps.googleusercontent.com');

// Demo login
export const demoLogin = async (req, res) => {
  try {
    let user = await User.findOne({ email: 'demo@memocast.co' });
    
    if (!user) {
      user = new User({
        username: 'Demo User',
        email: 'demo@memocast.co',
        password: 'demo123',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
      });
      await user.save();

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
      audience: '283355615750-l8u04tnk65dv48stlvn5avjms3rvf4n3.apps.googleusercontent.com'  ,
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
      user = new User({
        username: name,
        email,
        googleId,
        avatar: picture || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        authProvider: 'google'
      });
      await user.save();
      
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
      user.googleId = googleId;
      if (picture) user.avatar = picture;
      user.authProvider = 'google';
      await user.save();
    } else if (picture && picture !== user.avatar) {
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

// Register
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    const user = new User({ username, email, password });
    await user.save();

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