import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  }
});

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Personal', 'Academic', 'Work', 'Others'],
    required: true
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
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
  isVoiceNote: {
    type: Boolean,
    default: false
  },
  audioUrl: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [attachmentSchema],
  enhancedVersions: [{
    platform: {
      type: String,
      enum: ['linkedin', 'twitter', 'instagram']
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model('Note', noteSchema);