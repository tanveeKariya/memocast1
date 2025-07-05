import mongoose from 'mongoose';

const draftSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['social', 'portfolio', 'resume', 'biodata'],
    required: true
  },
  platform: {
    type: String,
    enum: ['linkedin', 'twitter', 'instagram', 'general'],
    default: 'general'
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
  originalNotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('Draft', draftSchema);