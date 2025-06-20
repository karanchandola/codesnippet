const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['provider', 'admin'],
    default: 'provider'
  },
  reputation: {
    type: Number,
    default: 0
  },
  verifiedSnippets: {
    type: Number,
    default: 0
  },
  reportsMade: {
    type: Number,
    default: 0
  },
  reportsConfirmed: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Snippet'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const user = mongoose.models.user || mongoose.model('user', UserSchema)