
const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  examType: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    questionText: String,
    options: [{
      id: Number,
      text: String
    }],
    correctAnswerIndex: Number,
    selectedAnswer: Number
  }],
  score: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Attempt', AttemptSchema);
