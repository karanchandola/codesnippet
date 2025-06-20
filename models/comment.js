import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
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
  username: { // Optional, only if you want to store username for denormalization
    type: String,
    required: true,
  },
  comment: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

export const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);