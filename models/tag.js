const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
    trim: true,
    lowercase: true, 
  },
  type: {
    type: String,
    enum: ['language', 'framework', 'topic'],
    required: true,
  },
}, {
  timestamps: true, 
});

export const Tag = mongoose.models.tags || mongoose.model('tags', tagSchema)