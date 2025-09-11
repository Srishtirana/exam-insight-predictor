const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      id: Number,
      text: String,
    },
  ],
  correctAnswerIndex: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    required: true,
    enum: ["physics", "chemistry", "biology", "mathematics"],
  },
  examType: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"],
  },
  topic: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Question", QuestionSchema);
