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
<<<<<<< HEAD
    enum: ["physics", "chemistry", "biology", "mathematics"],
=======
    enum: ["physics", "chemistry", "biology", "mathematics", "verbal", "quant", "polity", "history"],
>>>>>>> 6522c29d8e296c7698ca89ccf29079ac3c4a38bf
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
<<<<<<< HEAD
=======
  aiGenerated: {
    type: Boolean,
    default: false,
  },
  explanation: {
    type: String,
    default: '',
  },
>>>>>>> 6522c29d8e296c7698ca89ccf29079ac3c4a38bf
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Question", QuestionSchema);
