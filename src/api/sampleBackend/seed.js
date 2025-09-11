const mongoose = require("mongoose");
const Question = require("./models/Question");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Sample questions
const sampleQuestions = [
  // Physics - JEE
  {
    questionText: "Which of these is not a unit of energy?",
    options: [
      { id: 0, text: "Joule" },
      { id: 1, text: "Calorie" },
      { id: 2, text: "Electron-volt" },
      { id: 3, text: "Newton" },
    ],
    correctAnswerIndex: 3,
    subject: "physics",
    examType: "JEE",
    difficulty: "easy",
    topic: "Mechanics",
  },
  {
    questionText: "What is the SI unit of electric current?",
    options: [
      { id: 0, text: "Volt" },
      { id: 1, text: "Ampere" },
      { id: 2, text: "Ohm" },
      { id: 3, text: "Watt" },
    ],
    correctAnswerIndex: 1,
    subject: "physics",
    examType: "JEE",
    difficulty: "easy",
    topic: "Electricity",
  },

  // Chemistry - JEE
  {
    questionText: "What is the pH of a neutral solution at 25°C?",
    options: [
      { id: 0, text: "0" },
      { id: 1, text: "7" },
      { id: 2, text: "14" },
      { id: 3, text: "1" },
    ],
    correctAnswerIndex: 1,
    subject: "chemistry",
    examType: "JEE",
    difficulty: "easy",
    topic: "Acid-Base",
  },

  // Mathematics - JEE
  {
    questionText: "What is the derivative of x²?",
    options: [
      { id: 0, text: "x" },
      { id: 1, text: "2x" },
      { id: 2, text: "x²" },
      { id: 3, text: "2" },
    ],
    correctAnswerIndex: 1,
    subject: "mathematics",
    examType: "JEE",
    difficulty: "medium",
    topic: "Calculus",
  },

  // Biology - NEET
  {
    questionText: "Which organelle is known as the 'powerhouse of the cell'?",
    options: [
      { id: 0, text: "Nucleus" },
      { id: 1, text: "Mitochondria" },
      { id: 2, text: "Ribosome" },
      { id: 3, text: "Golgi apparatus" },
    ],
    correctAnswerIndex: 1,
    subject: "biology",
    examType: "NEET",
    difficulty: "easy",
    topic: "Cell Biology",
  },
];

// Function to seed database
const seedDatabase = async () => {
  try {
    // Clear existing questions
    await Question.deleteMany({});
    console.log("Cleared existing questions");

    // Insert new questions
    const seededQuestions = await Question.insertMany(sampleQuestions);
    console.log(`Seeded ${seededQuestions.length} questions`);

    mongoose.disconnect();
    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
