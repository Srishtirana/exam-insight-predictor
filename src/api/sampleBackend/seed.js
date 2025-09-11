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
  // JEE Physics Questions - Easy Level
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
    questionText: "A ball is thrown vertically upwards with a velocity of 20 m/s. What is the maximum height it will reach? (g = 10 m/s²)",
    options: [
      { id: 0, text: "10 m" },
      { id: 1, text: "20 m" },
      { id: 2, text: "30 m" },
      { id: 3, text: "40 m" },
    ],
    correctAnswerIndex: 1,
    subject: "physics",
    examType: "JEE",
    difficulty: "easy",
    topic: "Kinematics",
    explanation: "Using v² = u² - 2gh, at maximum height v = 0. So 0 = 20² - 2(10)h, therefore h = 400/20 = 20 m."
  },
  {
    questionText: "What is the unit of electric field intensity?",
    options: [
      { id: 0, text: "N/C" },
      { id: 1, text: "V/m" },
      { id: 2, text: "J/C" },
      { id: 3, text: "Both A and B" },
    ],
    correctAnswerIndex: 3,
    subject: "physics",
    examType: "JEE",
    difficulty: "easy",
    topic: "Electrostatics",
    explanation: "Electric field intensity can be expressed as N/C (Newton per Coulomb) or V/m (Volt per meter)."
  },
  {
    questionText: "The resistance of a wire is R. If its length is doubled and radius is halved, the new resistance will be:",
    options: [
      { id: 0, text: "R" },
      { id: 1, text: "2R" },
      { id: 2, text: "4R" },
      { id: 3, text: "8R" },
    ],
    correctAnswerIndex: 3,
    subject: "physics",
    examType: "JEE",
    difficulty: "medium",
    topic: "Current Electricity",
    explanation: "R = ρl/A. If length doubles (2l) and radius halves (r/2), area becomes A/4. So R' = ρ(2l)/(A/4) = 8ρl/A = 8R."
  },
  {
    questionText: "A convex lens of focal length 20 cm forms a real image at a distance of 40 cm from the lens. What is the object distance?",
    options: [
      { id: 0, text: "20 cm" },
      { id: 1, text: "30 cm" },
      { id: 2, text: "40 cm" },
      { id: 3, text: "60 cm" },
    ],
    correctAnswerIndex: 2,
    subject: "physics",
    examType: "JEE",
    difficulty: "medium",
    topic: "Optics",
    explanation: "Using lens formula: 1/f = 1/v - 1/u. Given f = 20 cm, v = 40 cm. So 1/20 = 1/40 - 1/u, solving gives u = 40 cm."
  },
  {
    questionText: "In Young's double slit experiment, if the wavelength of light is doubled, the fringe width will:",
    options: [
      { id: 0, text: "Remain same" },
      { id: 1, text: "Become half" },
      { id: 2, text: "Become double" },
      { id: 3, text: "Become four times" },
    ],
    correctAnswerIndex: 2,
    subject: "physics",
    examType: "JEE",
    difficulty: "medium",
    topic: "Wave Optics",
    explanation: "Fringe width β = λD/d. If λ is doubled, β becomes double."
  },
  {
    questionText: "A particle moves in a circle of radius 2 m with constant angular velocity 4 rad/s. What is its linear velocity?",
    options: [
      { id: 0, text: "2 m/s" },
      { id: 1, text: "4 m/s" },
      { id: 2, text: "8 m/s" },
      { id: 3, text: "16 m/s" },
    ],
    correctAnswerIndex: 2,
    subject: "physics",
    examType: "JEE",
    difficulty: "easy",
    topic: "Circular Motion",
    explanation: "Linear velocity v = rω = 2 × 4 = 8 m/s."
  },
  {
    questionText: "The work done in moving a charge of 2 C from point A to point B is 10 J. What is the potential difference between A and B?",
    options: [
      { id: 0, text: "5 V" },
      { id: 1, text: "10 V" },
      { id: 2, text: "20 V" },
      { id: 3, text: "0.2 V" },
    ],
    correctAnswerIndex: 0,
    subject: "physics",
    examType: "JEE",
    difficulty: "easy",
    topic: "Electrostatics",
    explanation: "Potential difference V = W/q = 10/2 = 5 V."
  },
  {
    questionText: "A body of mass 5 kg is moving with velocity 10 m/s. What is its kinetic energy?",
    options: [
      { id: 0, text: "50 J" },
      { id: 1, text: "100 J" },
      { id: 2, text: "250 J" },
      { id: 3, text: "500 J" },
    ],
    correctAnswerIndex: 2,
    subject: "physics",
    examType: "JEE",
    difficulty: "easy",
    topic: "Work and Energy",
    explanation: "KE = ½mv² = ½ × 5 × 10² = ½ × 5 × 100 = 250 J."
  },
  {
    questionText: "The frequency of a wave is 50 Hz and its wavelength is 4 m. What is its velocity?",
    options: [
      { id: 0, text: "12.5 m/s" },
      { id: 1, text: "50 m/s" },
      { id: 2, text: "200 m/s" },
      { id: 3, text: "250 m/s" },
    ],
    correctAnswerIndex: 2,
    subject: "physics",
    examType: "JEE",
    difficulty: "easy",
    topic: "Waves",
    explanation: "Velocity v = fλ = 50 × 4 = 200 m/s."
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
    questionText: "A force of 10 N acts on a body of mass 2 kg for 3 seconds. What is the change in momentum?",
    options: [
      { id: 0, text: "5 kg m/s" },
      { id: 1, text: "10 kg m/s" },
      { id: 2, text: "20 kg m/s" },
      { id: 3, text: "30 kg m/s" },
    ],
    correctAnswerIndex: 3,
    subject: "physics",
    examType: "JEE",
    difficulty: "medium",
    topic: "Laws of Motion",
    explanation: "Change in momentum = Force × Time = 10 × 3 = 30 kg m/s."
  },
  {
    questionText: "The de Broglie wavelength of an electron moving with velocity v is λ. If the velocity is doubled, the new wavelength will be:",
    options: [
      { id: 0, text: "λ" },
      { id: 1, text: "λ/2" },
      { id: 2, text: "2λ" },
      { id: 3, text: "λ/4" },
    ],
    correctAnswerIndex: 1,
    subject: "physics",
    examType: "JEE",
    difficulty: "hard",
    topic: "Modern Physics",
    explanation: "de Broglie wavelength λ = h/mv. If velocity doubles, wavelength becomes λ/2."
  },
  {
    questionText: "In a photoelectric effect experiment, if the frequency of incident light is increased, what happens to the stopping potential?",
    options: [
      { id: 0, text: "Remains same" },
      { id: 1, text: "Increases" },
      { id: 2, text: "Decreases" },
      { id: 3, text: "Becomes zero" },
    ],
    correctAnswerIndex: 1,
    subject: "physics",
    examType: "JEE",
    difficulty: "hard",
    topic: "Modern Physics",
    explanation: "eV₀ = hf - φ. As frequency f increases, stopping potential V₀ increases."
  },
  {
    questionText: "A transformer has 100 turns in primary and 500 turns in secondary. If input voltage is 220 V, what is the output voltage?",
    options: [
      { id: 0, text: "44 V" },
      { id: 1, text: "110 V" },
      { id: 2, text: "1100 V" },
      { id: 3, text: "2200 V" },
    ],
    correctAnswerIndex: 2,
    subject: "physics",
    examType: "JEE",
    difficulty: "medium",
    topic: "Electromagnetic Induction",
    explanation: "V₂/V₁ = N₂/N₁. So V₂ = (500/100) × 220 = 5 × 220 = 1100 V."
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

  // JEE Chemistry Questions - Easy Level
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
    questionText: "What is the molecular formula of benzene?",
    options: [
      { id: 0, text: "C₆H₆" },
      { id: 1, text: "C₆H₁₂" },
      { id: 2, text: "C₆H₈" },
      { id: 3, text: "C₆H₁₀" },
    ],
    correctAnswerIndex: 0,
    subject: "chemistry",
    examType: "JEE",
    difficulty: "easy",
    topic: "Organic Chemistry",
    explanation: "Benzene has the molecular formula C₆H₆ with a hexagonal ring structure."
  },
  {
    questionText: "Which of the following is the most electronegative element?",
    options: [
      { id: 0, text: "Fluorine" },
      { id: 1, text: "Chlorine" },
      { id: 2, text: "Oxygen" },
      { id: 3, text: "Nitrogen" },
    ],
    correctAnswerIndex: 0,
    subject: "chemistry",
    examType: "JEE",
    difficulty: "easy",
    topic: "Periodic Properties",
    explanation: "Fluorine is the most electronegative element with an electronegativity value of 4.0."
  },
  {
    questionText: "What is the oxidation state of chromium in K₂Cr₂O₇?",
    options: [
      { id: 0, text: "+3" },
      { id: 1, text: "+4" },
      { id: 2, text: "+6" },
      { id: 3, text: "+7" },
    ],
    correctAnswerIndex: 2,
    subject: "chemistry",
    examType: "JEE",
    difficulty: "medium",
    topic: "Redox Reactions",
    explanation: "In K₂Cr₂O₇, K has +1, O has -2. So 2(+1) + 2x + 7(-2) = 0, solving gives x = +6."
  },
  {
    questionText: "Which of the following is not a reducing agent?",
    options: [
      { id: 0, text: "H₂S" },
      { id: 1, text: "SO₂" },
      { id: 2, text: "H₂SO₄" },
      { id: 3, text: "FeSO₄" },
    ],
    correctAnswerIndex: 2,
    subject: "chemistry",
    examType: "JEE",
    difficulty: "medium",
    topic: "Redox Reactions",
    explanation: "H₂SO₄ is an oxidizing agent, not a reducing agent. The others can act as reducing agents."
  },
  {
    questionText: "The IUPAC name of CH₃-CH₂-CH₂-OH is:",
    options: [
      { id: 0, text: "Ethanol" },
      { id: 1, text: "Propanol" },
      { id: 2, text: "Butanol" },
      { id: 3, text: "Methanol" },
    ],
    correctAnswerIndex: 1,
    subject: "chemistry",
    examType: "JEE",
    difficulty: "easy",
    topic: "Nomenclature",
    explanation: "CH₃-CH₂-CH₂-OH has 3 carbon atoms with an OH group, so it's propanol."
  },
  {
    questionText: "What is the hybridization of carbon in methane (CH₄)?",
    options: [
      { id: 0, text: "sp" },
      { id: 1, text: "sp²" },
      { id: 2, text: "sp³" },
      { id: 3, text: "sp³d" },
    ],
    correctAnswerIndex: 2,
    subject: "chemistry",
    examType: "JEE",
    difficulty: "medium",
    topic: "Chemical Bonding",
    explanation: "Carbon in CH₄ forms 4 bonds, so it undergoes sp³ hybridization."
  },
  {
    questionText: "Which of the following has the highest boiling point?",
    options: [
      { id: 0, text: "CH₄" },
      { id: 1, text: "C₂H₆" },
      { id: 2, text: "C₃H₈" },
      { id: 3, text: "C₄H₁₀" },
    ],
    correctAnswerIndex: 3,
    subject: "chemistry",
    examType: "JEE",
    difficulty: "easy",
    topic: "States of Matter",
    explanation: "Boiling point increases with molecular weight. C₄H₁₀ has the highest molecular weight."
  },
  {
    questionText: "What is the product when ethene reacts with bromine water?",
    options: [
      { id: 0, text: "1,2-dibromoethane" },
      { id: 1, text: "1,1-dibromoethane" },
      { id: 2, text: "Bromoethane" },
      { id: 3, text: "Ethyl bromide" },
    ],
    correctAnswerIndex: 0,
    subject: "chemistry",
    examType: "JEE",
    difficulty: "medium",
    topic: "Organic Reactions",
    explanation: "Ethene undergoes addition reaction with bromine to form 1,2-dibromoethane."
  },
  {
    questionText: "The number of moles in 44 g of CO₂ is:",
    options: [
      { id: 0, text: "0.5" },
      { id: 1, text: "1" },
      { id: 2, text: "2" },
      { id: 3, text: "4" },
    ],
    correctAnswerIndex: 1,
    subject: "chemistry",
    examType: "JEE",
    difficulty: "easy",
    topic: "Mole Concept",
    explanation: "Molar mass of CO₂ = 12 + 2(16) = 44 g/mol. So 44 g = 1 mole."
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

  // JEE Mathematics Questions - Easy Level
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
    questionText: "What is the value of sin(30°)?",
    options: [
      { id: 0, text: "1/2" },
      { id: 1, text: "√3/2" },
      { id: 2, text: "1" },
      { id: 3, text: "0" },
    ],
    correctAnswerIndex: 0,
    subject: "mathematics",
    examType: "JEE",
    difficulty: "easy",
    topic: "Trigonometry",
    explanation: "sin(30°) = 1/2, which is a standard trigonometric value."
  },
  {
    questionText: "What is the integral of 2x dx?",
    options: [
      { id: 0, text: "x² + C" },
      { id: 1, text: "2x² + C" },
      { id: 2, text: "x + C" },
      { id: 3, text: "2 + C" },
    ],
    correctAnswerIndex: 0,
    subject: "mathematics",
    examType: "JEE",
    difficulty: "easy",
    topic: "Calculus",
    explanation: "∫2x dx = 2∫x dx = 2(x²/2) + C = x² + C."
  },
  {
    questionText: "What is the value of log₁₀(100)?",
    options: [
      { id: 0, text: "1" },
      { id: 1, text: "2" },
      { id: 2, text: "10" },
      { id: 3, text: "100" },
    ],
    correctAnswerIndex: 1,
    subject: "mathematics",
    examType: "JEE",
    difficulty: "easy",
    topic: "Logarithms",
    explanation: "log₁₀(100) = log₁₀(10²) = 2 log₁₀(10) = 2 × 1 = 2."
  },
  {
    questionText: "What is the equation of a circle with center at (0,0) and radius 5?",
    options: [
      { id: 0, text: "x² + y² = 5" },
      { id: 1, text: "x² + y² = 25" },
      { id: 2, text: "x + y = 5" },
      { id: 3, text: "x + y = 25" },
    ],
    correctAnswerIndex: 1,
    subject: "mathematics",
    examType: "JEE",
    difficulty: "easy",
    topic: "Coordinate Geometry",
    explanation: "Equation of circle with center (0,0) and radius r is x² + y² = r². So x² + y² = 5² = 25."
  },
  {
    questionText: "What is the value of lim(x→0) sin(x)/x?",
    options: [
      { id: 0, text: "0" },
      { id: 1, text: "1" },
      { id: 2, text: "∞" },
      { id: 3, text: "undefined" },
    ],
    correctAnswerIndex: 1,
    subject: "mathematics",
    examType: "JEE",
    difficulty: "medium",
    topic: "Limits",
    explanation: "This is a standard limit: lim(x→0) sin(x)/x = 1."
  },
  {
    questionText: "What is the sum of the first 10 natural numbers?",
    options: [
      { id: 0, text: "45" },
      { id: 1, text: "50" },
      { id: 2, text: "55" },
      { id: 3, text: "60" },
    ],
    correctAnswerIndex: 2,
    subject: "mathematics",
    examType: "JEE",
    difficulty: "easy",
    topic: "Arithmetic Progression",
    explanation: "Sum of first n natural numbers = n(n+1)/2 = 10(11)/2 = 55."
  },
  {
    questionText: "What is the derivative of ln(x)?",
    options: [
      { id: 0, text: "1/x" },
      { id: 1, text: "x" },
      { id: 2, text: "eˣ" },
      { id: 3, text: "1" },
    ],
    correctAnswerIndex: 0,
    subject: "mathematics",
    examType: "JEE",
    difficulty: "medium",
    topic: "Calculus",
    explanation: "The derivative of ln(x) is 1/x."
  },
  {
    questionText: "What is the value of cos(60°)?",
    options: [
      { id: 0, text: "1/2" },
      { id: 1, text: "√3/2" },
      { id: 2, text: "1" },
      { id: 3, text: "0" },
    ],
    correctAnswerIndex: 0,
    subject: "mathematics",
    examType: "JEE",
    difficulty: "easy",
    topic: "Trigonometry",
    explanation: "cos(60°) = 1/2, which is a standard trigonometric value."
  },
  {
    questionText: "What is the area of a triangle with base 6 and height 8?",
    options: [
      { id: 0, text: "14" },
      { id: 1, text: "24" },
      { id: 2, text: "28" },
      { id: 3, text: "48" },
    ],
    correctAnswerIndex: 1,
    subject: "mathematics",
    examType: "JEE",
    difficulty: "easy",
    topic: "Geometry",
    explanation: "Area of triangle = (1/2) × base × height = (1/2) × 6 × 8 = 24."
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

  // NEET Biology Questions - Easy Level
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
  {
    questionText: "Which blood group is known as the universal donor?",
    options: [
      { id: 0, text: "A" },
      { id: 1, text: "B" },
      { id: 2, text: "AB" },
      { id: 3, text: "O" },
    ],
    correctAnswerIndex: 3,
    subject: "biology",
    examType: "NEET",
    difficulty: "easy",
    topic: "Human Physiology",
    explanation: "Blood group O is the universal donor because it lacks both A and B antigens."
  },
  {
    questionText: "Which part of the brain controls breathing?",
    options: [
      { id: 0, text: "Cerebrum" },
      { id: 1, text: "Cerebellum" },
      { id: 2, text: "Medulla oblongata" },
      { id: 3, text: "Hypothalamus" },
    ],
    correctAnswerIndex: 2,
    subject: "biology",
    examType: "NEET",
    difficulty: "medium",
    topic: "Human Physiology",
    explanation: "The medulla oblongata controls involuntary functions including breathing and heart rate."
  },
  {
    questionText: "What is the site of protein synthesis in the cell?",
    options: [
      { id: 0, text: "Nucleus" },
      { id: 1, text: "Ribosome" },
      { id: 2, text: "Mitochondria" },
      { id: 3, text: "Golgi apparatus" },
    ],
    correctAnswerIndex: 1,
    subject: "biology",
    examType: "NEET",
    difficulty: "easy",
    topic: "Cell Biology",
    explanation: "Ribosomes are the cellular organelles where protein synthesis occurs."
  },
  {
    questionText: "Which hormone is produced by the pancreas?",
    options: [
      { id: 0, text: "Insulin" },
      { id: 1, text: "Adrenaline" },
      { id: 2, text: "Thyroxine" },
      { id: 3, text: "Estrogen" },
    ],
    correctAnswerIndex: 0,
    subject: "biology",
    examType: "NEET",
    difficulty: "easy",
    topic: "Endocrinology",
    explanation: "The pancreas produces insulin, which regulates blood glucose levels."
  },
  {
    questionText: "What is the largest organ in the human body?",
    options: [
      { id: 0, text: "Liver" },
      { id: 1, text: "Skin" },
      { id: 2, text: "Lung" },
      { id: 3, text: "Brain" },
    ],
    correctAnswerIndex: 1,
    subject: "biology",
    examType: "NEET",
    difficulty: "easy",
    topic: "Human Anatomy",
    explanation: "The skin is the largest organ in the human body, covering the entire external surface."
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

  // GATE Questions - Engineering Mathematics
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
    questionText: "What is the rank of the matrix [[1,2,3],[0,1,2],[0,0,1]]?",
    options: [
      { id: 0, text: "1" },
      { id: 1, text: "2" },
      { id: 2, text: "3" },
      { id: 3, text: "0" },
    ],
    correctAnswerIndex: 2,
    subject: "mathematics",
    examType: "GATE",
    difficulty: "medium",
    topic: "Linear Algebra",
    explanation: "This is an upper triangular matrix with non-zero diagonal elements, so its rank is 3."
  },
  {
    questionText: "What is the value of ∫₀^π sin(x) dx?",
    options: [
      { id: 0, text: "0" },
      { id: 1, text: "1" },
      { id: 2, text: "2" },
      { id: 3, text: "π" },
    ],
    correctAnswerIndex: 2,
    subject: "mathematics",
    examType: "GATE",
    difficulty: "medium",
    topic: "Calculus",
    explanation: "∫₀^π sin(x) dx = [-cos(x)]₀^π = -cos(π) + cos(0) = -(-1) + 1 = 2."
  },
  {
    questionText: "What is the Laplace transform of e^(at)?",
    options: [
      { id: 0, text: "1/(s-a)" },
      { id: 1, text: "1/(s+a)" },
      { id: 2, text: "s/(s²+a²)" },
      { id: 3, text: "a/(s²+a²)" },
    ],
    correctAnswerIndex: 0,
    subject: "mathematics",
    examType: "GATE",
    difficulty: "hard",
    topic: "Transform Theory",
    explanation: "L{e^(at)} = 1/(s-a) for s > a."
  },
  {
    questionText: "What is the probability of getting exactly 2 heads in 3 coin tosses?",
    options: [
      { id: 0, text: "1/8" },
      { id: 1, text: "3/8" },
      { id: 2, text: "1/2" },
      { id: 3, text: "5/8" },
    ],
    correctAnswerIndex: 1,
    subject: "mathematics",
    examType: "GATE",
    difficulty: "medium",
    topic: "Probability",
    explanation: "P(2 heads in 3 tosses) = C(3,2) × (1/2)³ = 3 × 1/8 = 3/8."
  },
  {
    questionText: "What is the derivative of x³ + 2x² + 5x + 1?",
    options: [
      { id: 0, text: "3x² + 4x + 5" },
      { id: 1, text: "3x² + 2x + 5" },
      { id: 2, text: "x² + 4x + 5" },
      { id: 3, text: "3x² + 4x + 1" },
    ],
    correctAnswerIndex: 0,
    subject: "mathematics",
    examType: "GATE",
    difficulty: "easy",
    topic: "Calculus",
    explanation: "d/dx(x³ + 2x² + 5x + 1) = 3x² + 4x + 5."
  },
  {
    questionText: "What is the value of lim(x→∞) (1 + 1/x)^x?",
    options: [
      { id: 0, text: "0" },
      { id: 1, text: "1" },
      { id: 2, text: "e" },
      { id: 3, text: "∞" },
    ],
    correctAnswerIndex: 2,
    subject: "mathematics",
    examType: "GATE",
    difficulty: "medium",
    topic: "Limits",
    explanation: "This is the definition of e: lim(x→∞) (1 + 1/x)^x = e."
  },
  {
    questionText: "What is the Fourier transform of δ(t)?",
    options: [
      { id: 0, text: "1" },
      { id: 1, text: "δ(ω)" },
      { id: 2, text: "e^(-jωt)" },
      { id: 3, text: "1/jω" },
    ],
    correctAnswerIndex: 0,
    subject: "mathematics",
    examType: "GATE",
    difficulty: "hard",
    topic: "Signal Processing",
    explanation: "F{δ(t)} = ∫ δ(t)e^(-jωt) dt = e^(-jω×0) = 1."
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

  // CAT Questions - Quantitative Aptitude
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
  {
    questionText: "A train 150m long passes a platform 300m long in 18 seconds. What is the speed of the train?",
    options: [
      { id: 0, text: "25 m/s" },
      { id: 1, text: "30 m/s" },
      { id: 2, text: "35 m/s" },
      { id: 3, text: "40 m/s" },
    ],
    correctAnswerIndex: 0,
    subject: "quant",
    examType: "CAT",
    difficulty: "medium",
    topic: "Time, Speed & Distance",
    explanation: "Total distance = 150 + 300 = 450m. Speed = 450/18 = 25 m/s."
  },
  {
    questionText: "What is the compound interest on Rs. 10000 for 2 years at 10% per annum?",
    options: [
      { id: 0, text: "Rs. 2000" },
      { id: 1, text: "Rs. 2100" },
      { id: 2, text: "Rs. 2200" },
      { id: 3, text: "Rs. 2300" },
    ],
    correctAnswerIndex: 1,
    subject: "quant",
    examType: "CAT",
    difficulty: "medium",
    topic: "Compound Interest",
    explanation: "CI = P[(1 + r/100)^n - 1] = 10000[(1.1)² - 1] = 10000[1.21 - 1] = Rs. 2100"
  },
  {
    questionText: "If 15% of a number is 45, what is 30% of that number?",
    options: [
      { id: 0, text: "60" },
      { id: 1, text: "75" },
      { id: 2, text: "90" },
      { id: 3, text: "120" },
    ],
    correctAnswerIndex: 2,
    subject: "quant",
    examType: "CAT",
    difficulty: "easy",
    topic: "Percentage",
    explanation: "Let the number be x. 15% of x = 45, so x = 300. 30% of 300 = 90."
  },
  {
    questionText: "A can do a work in 10 days and B can do it in 15 days. In how many days will they complete it together?",
    options: [
      { id: 0, text: "5 days" },
      { id: 1, text: "6 days" },
      { id: 2, text: "8 days" },
      { id: 3, text: "12 days" },
    ],
    correctAnswerIndex: 1,
    subject: "quant",
    examType: "CAT",
    difficulty: "medium",
    topic: "Time & Work",
    explanation: "A's 1 day work = 1/10, B's 1 day work = 1/15. Together = 1/10 + 1/15 = 5/30 = 1/6. So 6 days."
  },
  {
    questionText: "What is the average of first 20 natural numbers?",
    options: [
      { id: 0, text: "9.5" },
      { id: 1, text: "10" },
      { id: 2, text: "10.5" },
      { id: 3, text: "11" },
    ],
    correctAnswerIndex: 2,
    subject: "quant",
    examType: "CAT",
    difficulty: "easy",
    topic: "Average",
    explanation: "Average of first n natural numbers = (n+1)/2 = (20+1)/2 = 10.5"
  },
  {
    questionText: "If the cost price of 12 articles is equal to the selling price of 10 articles, what is the profit percentage?",
    options: [
      { id: 0, text: "16.67%" },
      { id: 1, text: "20%" },
      { id: 2, text: "25%" },
      { id: 3, text: "30%" },
    ],
    correctAnswerIndex: 1,
    subject: "quant",
    examType: "CAT",
    difficulty: "medium",
    topic: "Profit & Loss",
    explanation: "Let CP of 1 article = Rs. 1. CP of 12 = Rs. 12 = SP of 10. SP of 1 = 12/10 = 1.2. Profit = 20%"
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

  // UPSC Questions - Polity & History
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
  },
  {
    questionText: "Which of the following is not a Fundamental Right?",
    options: [
      { id: 0, text: "Right to Equality" },
      { id: 1, text: "Right to Freedom" },
      { id: 2, text: "Right to Property" },
      { id: 3, text: "Right against Exploitation" },
    ],
    correctAnswerIndex: 2,
    subject: "polity",
    examType: "UPSC",
    difficulty: "medium",
    topic: "Fundamental Rights",
    explanation: "Right to Property was removed from Fundamental Rights and made a legal right under Article 300A."
  },
  {
    questionText: "The Battle of Plassey was fought in which year?",
    options: [
      { id: 0, text: "1756" },
      { id: 1, text: "1757" },
      { id: 2, text: "1764" },
      { id: 3, text: "1765" },
    ],
    correctAnswerIndex: 1,
    subject: "history",
    examType: "UPSC",
    difficulty: "easy",
    topic: "Modern History",
    explanation: "The Battle of Plassey was fought on June 23, 1757, between the British East India Company and the Nawab of Bengal."
  },
  {
    questionText: "Who was the first President of India?",
    options: [
      { id: 0, text: "Jawaharlal Nehru" },
      { id: 1, text: "Dr. Rajendra Prasad" },
      { id: 2, text: "Sardar Vallabhbhai Patel" },
      { id: 3, text: "Dr. S. Radhakrishnan" },
    ],
    correctAnswerIndex: 1,
    subject: "polity",
    examType: "UPSC",
    difficulty: "easy",
    topic: "Indian Polity",
    explanation: "Dr. Rajendra Prasad was the first President of India, serving from 1950 to 1962."
  },
  {
    questionText: "The Quit India Movement was launched in which year?",
    options: [
      { id: 0, text: "1940" },
      { id: 1, text: "1941" },
      { id: 2, text: "1942" },
      { id: 3, text: "1943" },
    ],
    correctAnswerIndex: 2,
    subject: "history",
    examType: "UPSC",
    difficulty: "easy",
    topic: "Freedom Struggle",
    explanation: "The Quit India Movement was launched by Mahatma Gandhi on August 8, 1942."
  },
  {
    questionText: "Which schedule of the Indian Constitution deals with the languages?",
    options: [
      { id: 0, text: "7th Schedule" },
      { id: 1, text: "8th Schedule" },
      { id: 2, text: "9th Schedule" },
      { id: 3, text: "10th Schedule" },
    ],
    correctAnswerIndex: 1,
    subject: "polity",
    examType: "UPSC",
    difficulty: "medium",
    topic: "Constitution",
    explanation: "The 8th Schedule of the Indian Constitution deals with the official languages of India."
  },
  {
    questionText: "Who wrote the book 'Discovery of India'?",
    options: [
      { id: 0, text: "Mahatma Gandhi" },
      { id: 1, text: "Jawaharlal Nehru" },
      { id: 2, text: "Rabindranath Tagore" },
      { id: 3, text: "Subhash Chandra Bose" },
    ],
    correctAnswerIndex: 1,
    subject: "history",
    examType: "UPSC",
    difficulty: "easy",
    topic: "Modern History",
    explanation: "Jawaharlal Nehru wrote 'Discovery of India' while he was in prison during 1942-1946."
  },
  {
    questionText: "The minimum age for becoming a member of Lok Sabha is:",
    options: [
      { id: 0, text: "21 years" },
      { id: 1, text: "25 years" },
      { id: 2, text: "30 years" },
      { id: 3, text: "35 years" },
    ],
    correctAnswerIndex: 1,
    subject: "polity",
    examType: "UPSC",
    difficulty: "easy",
    topic: "Parliament",
    explanation: "The minimum age for becoming a member of Lok Sabha is 25 years as per Article 84 of the Constitution."
  },
  {
    questionText: "The first session of the Indian National Congress was held in:",
    options: [
      { id: 0, text: "Bombay" },
      { id: 1, text: "Calcutta" },
      { id: 2, text: "Madras" },
      { id: 3, text: "Delhi" },
    ],
    correctAnswerIndex: 0,
    subject: "history",
    examType: "UPSC",
    difficulty: "easy",
    topic: "Freedom Struggle",
    explanation: "The first session of the Indian National Congress was held in Bombay (now Mumbai) in 1885 under the presidency of W.C. Bonnerjee."
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
