const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  snippetId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Snippet', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user', 
    required: true 
  },
  voteType: { 
    type: String, 
    enum: ['up', 'down'], 
    required: true 
  },
});

voteSchema.index({ snippetId: 1, userId: 1 }, { unique: true }); // Ensure unique votes per user per snippet
voteSchema.set('timestamps', true); // Automatically manage createdAt and updatedAt fields

export const Vote = mongoose.models.Vote || mongoose.model('Vote', voteSchema);