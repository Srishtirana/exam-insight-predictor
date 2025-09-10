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

// Comprehensive question database with real exam questions
const sampleQuestions = [
  // JEE Physics Questions
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
    explanation: "Newton is a unit of force, not energy. Joule, calorie, and electron-volt are all units of energy."
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
    explanation: "Ampere is the SI unit of electric current, named after André-Marie Ampère."
  },
  {
    questionText: "What is the formula for kinetic energy?",
    options: [
      { id: 0, text: "KE = mgh" },
      { id: 1, text: "KE = ½mv²" },
      { id: 2, text: "KE = Fd" },
      { id: 3, text: "KE = P/V" },
    ],
    correctAnswerIndex: 1,
    subject: "physics",
    examType: "JEE",
    difficulty: "medium",
    topic: "Mechanics",
    explanation: "Kinetic energy is given by KE = ½mv² where m is mass and v is velocity."
  },
  {
    questionText: "Which principle states that energy can neither be created nor destroyed?",
    options: [
      { id: 0, text: "Law of Inertia" },
      { id: 1, text: "Law of Conservation of Energy" },
      { id: 2, text: "Newton's Third Law" },
      { id: 3, text: "Archimedes' Principle" },
    ],
    correctAnswerIndex: 1,
    subject: "physics",
    examType: "JEE",
    difficulty: "medium",
    topic: "Thermodynamics",
    explanation: "The Law of Conservation of Energy states that energy can neither be created nor destroyed, only transformed."
  },
  {
    questionText: "What is the speed of light in vacuum?",
    options: [
      { id: 0, text: "3 × 10⁶ m/s" },
      { id: 1, text: "3 × 10⁸ m/s" },
      { id: 2, text: "3 × 10¹⁰ m/s" },
      { id: 3, text: "3 × 10¹² m/s" },
    ],
    correctAnswerIndex: 1,
    subject: "physics",
    examType: "JEE",
    difficulty: "easy",
    topic: "Optics",
    explanation: "The speed of light in vacuum is approximately 3 × 10⁸ m/s or 300,000 km/s."
  },

  // JEE Chemistry Questions
  {
    questionText: "What is the pH of pure water at 25°C?",
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
    explanation: "Pure water has a pH of 7 at 25°C, making it neutral."
  },
  {
    questionText: "Which of the following is not a noble gas?",
    options: [
      { id: 0, text: "Helium" },
      { id: 1, text: "Neon" },
      { id: 2, text: "Chlorine" },
      { id: 3, text: "Argon" },
    ],
    correctAnswerIndex: 2,
    subject: "chemistry",
    examType: "JEE",
    difficulty: "easy",
    topic: "Periodic Table",
    explanation: "Chlorine is a halogen, not a noble gas. Noble gases include helium, neon, argon, krypton, xenon, and radon."
  },
  {
    questionText: "What type of bond is formed when electrons are shared between atoms?",
    options: [
      { id: 0, text: "Ionic" },
      { id: 1, text: "Covalent" },
      { id: 2, text: "Metallic" },
      { id: 3, text: "Hydrogen" },
    ],
    correctAnswerIndex: 1,
    subject: "chemistry",
    examType: "JEE",
    difficulty: "medium",
    topic: "Chemical Bonding",
    explanation: "Covalent bonds are formed when atoms share electrons to achieve stability."
  },
  {
    questionText: "Which of the following is not an alkali metal?",
    options: [
      { id: 0, text: "Sodium" },
      { id: 1, text: "Potassium" },
      { id: 2, text: "Calcium" },
      { id: 3, text: "Lithium" },
    ],
    correctAnswerIndex: 2,
    subject: "chemistry",
    examType: "JEE",
    difficulty: "medium",
    topic: "Periodic Table",
    explanation: "Calcium is an alkaline earth metal, not an alkali metal. Alkali metals include lithium, sodium, potassium, rubidium, cesium, and francium."
  },
  {
    questionText: "The process of converting a solid directly to gas is called:",
    options: [
      { id: 0, text: "Melting" },
      { id: 1, text: "Evaporation" },
      { id: 2, text: "Sublimation" },
      { id: 3, text: "Condensation" },
    ],
    correctAnswerIndex: 2,
    subject: "chemistry",
    examType: "JEE",
    difficulty: "easy",
    topic: "States of Matter",
    explanation: "Sublimation is the process where a solid changes directly to gas without passing through the liquid phase."
  },

  // JEE Mathematics Questions
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
    difficulty: "easy",
    topic: "Calculus",
    explanation: "Using the power rule, the derivative of x² is 2x."
  },
  {
    questionText: "What is the value of π (pi) to 2 decimal places?",
    options: [
      { id: 0, text: "3.14" },
      { id: 1, text: "3.41" },
      { id: 2, text: "3.12" },
      { id: 3, text: "3.24" },
    ],
    correctAnswerIndex: 0,
    subject: "mathematics",
    examType: "JEE",
    difficulty: "easy",
    topic: "Geometry",
    explanation: "π (pi) is approximately 3.14159, which rounds to 3.14 to 2 decimal places."
  },
  {
    questionText: "Which of the following is not a prime number?",
    options: [
      { id: 0, text: "2" },
      { id: 1, text: "3" },
      { id: 2, text: "5" },
      { id: 3, text: "9" },
    ],
    correctAnswerIndex: 3,
    subject: "mathematics",
    examType: "JEE",
    difficulty: "easy",
    topic: "Number Theory",
    explanation: "9 is not a prime number because it can be divided by 3 (9 = 3 × 3). Prime numbers have exactly two distinct positive divisors."
  },
  {
    questionText: "If f(x) = 3x + 4, what is f(2)?",
    options: [
      { id: 0, text: "8" },
      { id: 1, text: "10" },
      { id: 2, text: "6" },
      { id: 3, text: "12" },
    ],
    correctAnswerIndex: 1,
    subject: "mathematics",
    examType: "JEE",
    difficulty: "easy",
    topic: "Algebra",
    explanation: "f(2) = 3(2) + 4 = 6 + 4 = 10"
  },
  {
    questionText: "The sum of angles in a triangle equals:",
    options: [
      { id: 0, text: "90°" },
      { id: 1, text: "180°" },
      { id: 2, text: "270°" },
      { id: 3, text: "360°" },
    ],
    correctAnswerIndex: 1,
    subject: "mathematics",
    examType: "JEE",
    difficulty: "easy",
    topic: "Geometry",
    explanation: "The sum of interior angles in any triangle is always 180°."
  },

  // NEET Biology Questions
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
    explanation: "Mitochondria are called the powerhouse of the cell because they produce ATP through cellular respiration."
  },
  {
    questionText: "What is the basic unit of heredity?",
    options: [
      { id: 0, text: "Cell" },
      { id: 1, text: "Gene" },
      { id: 2, text: "DNA" },
      { id: 3, text: "Chromosome" },
    ],
    correctAnswerIndex: 1,
    subject: "biology",
    examType: "NEET",
    difficulty: "easy",
    topic: "Genetics",
    explanation: "A gene is the basic unit of heredity that carries genetic information."
  },
  {
    questionText: "Which process converts glucose to pyruvate?",
    options: [
      { id: 0, text: "Krebs cycle" },
      { id: 1, text: "Glycolysis" },
      { id: 2, text: "Oxidative phosphorylation" },
      { id: 3, text: "Electron transport chain" },
    ],
    correctAnswerIndex: 1,
    subject: "biology",
    examType: "NEET",
    difficulty: "medium",
    topic: "Metabolism",
    explanation: "Glycolysis is the process that converts glucose to pyruvate in the cytoplasm."
  },
  {
    questionText: "Which of the following is not a nucleotide base found in DNA?",
    options: [
      { id: 0, text: "Adenine" },
      { id: 1, text: "Thymine" },
      { id: 2, text: "Uracil" },
      { id: 3, text: "Guanine" },
    ],
    correctAnswerIndex: 2,
    subject: "biology",
    examType: "NEET",
    difficulty: "medium",
    topic: "Molecular Biology",
    explanation: "Uracil is found in RNA, not DNA. DNA contains adenine, thymine, guanine, and cytosine."
  },
  {
    questionText: "The process by which plants make food is called:",
    options: [
      { id: 0, text: "Respiration" },
      { id: 1, text: "Photosynthesis" },
      { id: 2, text: "Fermentation" },
      { id: 3, text: "Transpiration" },
    ],
    correctAnswerIndex: 1,
    subject: "biology",
    examType: "NEET",
    difficulty: "easy",
    topic: "Plant Physiology",
    explanation: "Photosynthesis is the process by which plants convert light energy into chemical energy (glucose)."
  },

  // GATE Questions
  {
    questionText: "If 3x + 2 = 14, what is the value of x?",
    options: [
      { id: 0, text: "3" },
      { id: 1, text: "4" },
      { id: 2, text: "5" },
      { id: 3, text: "6" },
    ],
    correctAnswerIndex: 1,
    subject: "mathematics",
    examType: "GATE",
    difficulty: "easy",
    topic: "Algebra",
    explanation: "3x + 2 = 14, so 3x = 12, therefore x = 4."
  },
  {
    questionText: "Choose the word which is most similar in meaning to 'CANDID'.",
    options: [
      { id: 0, text: "Secretive" },
      { id: 1, text: "Frank" },
      { id: 2, text: "Vague" },
      { id: 3, text: "Hostile" },
    ],
    correctAnswerIndex: 1,
    subject: "verbal",
    examType: "GATE",
    difficulty: "easy",
    topic: "Vocabulary",
    explanation: "Candid means frank, open, and honest in speech or expression."
  },

  // CAT Questions
  {
    questionText: "The simple interest on Rs. 5000 at 10% per annum for 2 years is:",
    options: [
      { id: 0, text: "Rs. 500" },
      { id: 1, text: "Rs. 1000" },
      { id: 2, text: "Rs. 1500" },
      { id: 3, text: "Rs. 2000" },
    ],
    correctAnswerIndex: 1,
    subject: "quant",
    examType: "CAT",
    difficulty: "easy",
    topic: "Simple Interest",
    explanation: "Simple Interest = (P × R × T)/100 = (5000 × 10 × 2)/100 = Rs. 1000"
  },
  {
    questionText: "If the ratio of boys to girls is 3:2 in a class of 30, number of girls is:",
    options: [
      { id: 0, text: "10" },
      { id: 1, text: "12" },
      { id: 2, text: "15" },
      { id: 3, text: "18" },
    ],
    correctAnswerIndex: 1,
    subject: "quant",
    examType: "CAT",
    difficulty: "easy",
    topic: "Ratio & Proportion",
    explanation: "Total parts = 3 + 2 = 5. Girls = (2/5) × 30 = 12"
  },

  // UPSC Questions
  {
    questionText: "Which Article of the Indian Constitution deals with Fundamental Duties?",
    options: [
      { id: 0, text: "Article 51A" },
      { id: 1, text: "Article 19" },
      { id: 2, text: "Article 21" },
      { id: 3, text: "Article 368" },
    ],
    correctAnswerIndex: 0,
    subject: "polity",
    examType: "UPSC",
    difficulty: "medium",
    topic: "Constitution",
    explanation: "Article 51A of the Indian Constitution deals with Fundamental Duties of citizens."
  },
  {
    questionText: "Who discovered the sea route to India around the Cape of Good Hope?",
    options: [
      { id: 0, text: "Christopher Columbus" },
      { id: 1, text: "Vasco da Gama" },
      { id: 2, text: "Ferdinand Magellan" },
      { id: 3, text: "Marco Polo" },
    ],
    correctAnswerIndex: 1,
    subject: "history",
    examType: "UPSC",
    difficulty: "easy",
    topic: "Modern History",
    explanation: "Vasco da Gama discovered the sea route to India around the Cape of Good Hope in 1498."
  }
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
