
const mongoose = require('mongoose');


const snippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  language: {
    type: String,
    required: true,
    trim: true,
  },
  framework: {
    type: String,
    trim: true,
    validate: {
      validator: function (value) {
        const languagesWithFrameworks = ['JavaScript', 'Python', 'Ruby'];
        // Only require framework if language needs one
        return languagesWithFrameworks.includes(this.language) ? !!value : true;
      },
      message: 'Framework is required for the selected language.',
    },
  },
  code: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true,
  }],
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Assuming 'user' is the name of the user model
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  votes: {
    up: {
      type: Number,
      default: 0,
    },
    down: {
      type: Number,
      default: 0,
    },
  },
  aiGenerated: {
    type: Boolean,
    default: false,
  },
  version: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'flagged', 'deleted'],
    default: 'pending',
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
}, {
  timestamps: true, // adds createdAt and updatedAt
});


export const Snippet = mongoose.models.Snippet || mongoose.model('Snippet', snippetSchema);
