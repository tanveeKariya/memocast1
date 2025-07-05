import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Personal', 'Academic', 'Work', 'Others'],
    required: true
  },
  color: {
    type: String,
    default: '#8B5CF6'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Personality',
    required: true
  },
  noteCount: {
    type: Number,
    default: 0
  },
  size: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Folder', folderSchema);