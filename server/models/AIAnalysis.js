const mongoose = require('mongoose');

const aiAnalysisSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  report: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  },
  inputType: {
    type: String,
    enum: ['symptoms', 'report', 'chat'],
    required: true
  },
  userInput: {
    type: String,
    required: true
  },
  aiResponse: {
    possibleDiagnosis: [{
      condition: String,
      probability: Number,
      description: String
    }],
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    },
    recommendedActions: [String],
    notes: String,
    confidence: Number
  },
  aiModel: {
    type: String,
    default: 'gpt-4'
  },
  isReviewed: {
    type: Boolean,
    default: false
  },
  doctorNotes: {
    type: String
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Index for analytics
aiAnalysisSchema.index({ patient: 1, createdAt: -1 });
aiAnalysisSchema.index({ doctor: 1, createdAt: -1 });

const AIAnalysis = mongoose.model('AIAnalysis', aiAnalysisSchema);

module.exports = AIAnalysis;

