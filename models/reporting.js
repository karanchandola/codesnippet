const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  snippetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Snippet', required: true
  },
  reportReason: {
    type: String,
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'resolved'],
    default: 'pending'
  },
});

export const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
