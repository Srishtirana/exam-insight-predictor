// Comprehensive JEE Question Bank with Easy, Medium, Hard difficulty levels
export interface JEEQuestion {
  id: string;
  questionText: string;
  options: { id: number; text: string }[];
  correctAnswerIndex: number;
  subject: string;
  examType: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  topic: string;
}

export const jeeQuestionBank: Record<string, Record<string, JEEQuestion[]>> = {
  physics: {
    easy: [
      {
        id: "phy_easy_1",
        questionText: "What is the SI unit of electric current?",
        options: [
          { id: 0, text: "Volt" },
          { id: 1, text: "Ampere" },
          { id: 2, text: "Ohm" },
          { id: 3, text: "Watt" }
        ],
        correctAnswerIndex: 1,
        subject: "physics",
        examType: "JEE",
        difficulty: "easy",
        explanation: "Ampere (A) is the SI unit of electric current, named after André-Marie Ampère.",
        topic: "Current Electricity"
      },
      {
        id: "phy_easy_2",
        questionText: "Which of the following is NOT a unit of energy?",
        options: [
          { id: 0, text: "Joule" },
          { id: 1, text: "Calorie" },
          { id: 2, text: "Electron-volt" },
          { id: 3, text: "Newton" }
        ],
        correctAnswerIndex: 3,
        subject: "physics",
        examType: "JEE",
        difficulty: "easy",
        explanation: "Newton is a unit of force, not energy. Energy units include Joule, Calorie, and Electron-volt.",
        topic: "Units and Measurements"
      },
      {
        id: "phy_easy_3",
        questionText: "What is the formula for kinetic energy?",
        options: [
          { id: 0, text: "KE = mgh" },
          { id: 1, text: "KE = ½mv²" },
          { id: 2, text: "KE = Fd" },
          { id: 3, text: "KE = P/V" }
        ],
        correctAnswerIndex: 1,
        subject: "physics",
        examType: "JEE",
        difficulty: "easy",
        explanation: "Kinetic energy is given by KE = ½mv², where m is mass and v is velocity.",
        topic: "Work, Energy and Power"
      },
      {
        id: "phy_easy_4",
        questionText: "Which law states that energy can neither be created nor destroyed?",
        options: [
          { id: 0, text: "Newton's First Law" },
          { id: 1, text: "Law of Conservation of Energy" },
          { id: 2, text: "Ohm's Law" },
          { id: 3, text: "Hooke's Law" }
        ],
        correctAnswerIndex: 1,
        subject: "physics",
        examType: "JEE",
        difficulty: "easy",
        explanation: "The Law of Conservation of Energy states that energy cannot be created or destroyed, only transformed.",
        topic: "Work, Energy and Power"
      },
      {
        id: "phy_easy_5",
        questionText: "What is the acceleration due to gravity on Earth?",
        options: [
          { id: 0, text: "9.8 m/s²" },
          { id: 1, text: "10 m/s²" },
          { id: 2, text: "8.9 m/s²" },
          { id: 3, text: "11 m/s²" }
        ],
        correctAnswerIndex: 0,
        subject: "physics",
        examType: "JEE",
        difficulty: "easy",
        explanation: "The standard acceleration due to gravity on Earth is approximately 9.8 m/s².",
        topic: "Gravitation"
      }
    ],
    medium: [
      {
        id: "phy_med_1",
        questionText: "A ball is thrown vertically upward with initial velocity 20 m/s. What is the maximum height reached? (g = 10 m/s²)",
        options: [
          { id: 0, text: "10 m" },
          { id: 1, text: "20 m" },
          { id: 2, text: "30 m" },
          { id: 3, text: "40 m" }
        ],
        correctAnswerIndex: 1,
        subject: "physics",
        examType: "JEE",
        difficulty: "medium",
        explanation: "Using v² = u² - 2gh, at maximum height v=0, so h = u²/2g = (20)²/(2×10) = 20 m.",
        topic: "Kinematics"
      },
      {
        id: "phy_med_2",
        questionText: "The resistance of a wire is 10Ω. If it is stretched to double its length, what will be its new resistance?",
        options: [
          { id: 0, text: "20Ω" },
          { id: 1, text: "40Ω" },
          { id: 2, text: "10Ω" },
          { id: 3, text: "5Ω" }
        ],
        correctAnswerIndex: 1,
        subject: "physics",
        examType: "JEE",
        difficulty: "medium",
        explanation: "When length doubles, area becomes half. Since R ∝ L/A, resistance becomes 4 times = 40Ω.",
        topic: "Current Electricity"
      },
      {
        id: "phy_med_3",
        questionText: "Two forces of 3N and 4N act at right angles. What is the magnitude of their resultant?",
        options: [
          { id: 0, text: "5N" },
          { id: 1, text: "7N" },
          { id: 2, text: "1N" },
          { id: 3, text: "12N" }
        ],
        correctAnswerIndex: 0,
        subject: "physics",
        examType: "JEE",
        difficulty: "medium",
        explanation: "For perpendicular forces, resultant = √(3² + 4²) = √(9 + 16) = √25 = 5N.",
        topic: "Laws of Motion"
      },
      {
        id: "phy_med_4",
        questionText: "A simple pendulum has a period of 2s on Earth. What will be its period on the Moon? (g_moon = g_earth/6)",
        options: [
          { id: 0, text: "2√6 s" },
          { id: 1, text: "2/√6 s" },
          { id: 2, text: "12 s" },
          { id: 3, text: "1/3 s" }
        ],
        correctAnswerIndex: 0,
        subject: "physics",
        examType: "JEE",
        difficulty: "medium",
        explanation: "T ∝ 1/√g. Since g_moon = g_earth/6, T_moon = T_earth × √6 = 2√6 s.",
        topic: "Oscillations"
      },
      {
        id: "phy_med_5",
        questionText: "A lens has a focal length of 20 cm. What is its power?",
        options: [
          { id: 0, text: "5 D" },
          { id: 1, text: "0.05 D" },
          { id: 2, text: "20 D" },
          { id: 3, text: "0.2 D" }
        ],
        correctAnswerIndex: 0,
        subject: "physics",
        examType: "JEE",
        difficulty: "medium",
        explanation: "Power P = 1/f (in meters) = 1/0.2 = 5 Diopters.",
        topic: "Ray Optics"
      }
    ],
    hard: [
      {
        id: "phy_hard_1",
        questionText: "A particle moves in a circle of radius R with constant angular velocity ω. What is the magnitude of change in velocity after half revolution?",
        options: [
          { id: 0, text: "0" },
          { id: 1, text: "ωR" },
          { id: 2, text: "2ωR" },
          { id: 3, text: "πωR" }
        ],
        correctAnswerIndex: 2,
        subject: "physics",
        examType: "JEE",
        difficulty: "hard",
        explanation: "Initial velocity = ωR (tangential), final velocity = -ωR (opposite direction). Change = 2ωR.",
        topic: "Circular Motion"
      },
      {
        id: "phy_hard_2",
        questionText: "In a photoelectric effect experiment, the stopping potential is 2V for light of wavelength 400nm. What will be the stopping potential for 300nm light?",
        options: [
          { id: 0, text: "2.67V" },
          { id: 1, text: "3.33V" },
          { id: 2, text: "4V" },
          { id: 3, text: "1.5V" }
        ],
        correctAnswerIndex: 1,
        subject: "physics",
        examType: "JEE",
        difficulty: "hard",
        explanation: "Using Einstein's equation: eV = hf - φ. The energy difference gives V₂ = 2 + (hc/e)(1/300 - 1/400) × 10⁻⁹ ≈ 3.33V.",
        topic: "Dual Nature of Matter"
      },
      {
        id: "phy_hard_3",
        questionText: "A rod of length L rotates about one end with angular velocity ω. What is the velocity of the center of mass?",
        options: [
          { id: 0, text: "ωL" },
          { id: 1, text: "ωL/2" },
          { id: 2, text: "ωL/3" },
          { id: 3, text: "2ωL/3" }
        ],
        correctAnswerIndex: 1,
        subject: "physics",
        examType: "JEE",
        difficulty: "hard",
        explanation: "Center of mass is at L/2 from the pivot. Velocity = ω × (L/2) = ωL/2.",
        topic: "Rotational Motion"
      }
    ]
  },
  chemistry: {
    easy: [
      {
        id: "chem_easy_1",
        questionText: "What is the pH of pure water at 25°C?",
        options: [
          { id: 0, text: "0" },
          { id: 1, text: "7" },
          { id: 2, text: "14" },
          { id: 3, text: "1" }
        ],
        correctAnswerIndex: 1,
        subject: "chemistry",
        examType: "JEE",
        difficulty: "easy",
        explanation: "Pure water has a pH of 7 at 25°C, making it neutral.",
        topic: "Ionic Equilibrium"
      },
      {
        id: "chem_easy_2",
        questionText: "Which of the following is NOT a noble gas?",
        options: [
          { id: 0, text: "Helium" },
          { id: 1, text: "Neon" },
          { id: 2, text: "Chlorine" },
          { id: 3, text: "Argon" }
        ],
        correctAnswerIndex: 2,
        subject: "chemistry",
        examType: "JEE",
        difficulty: "easy",
        explanation: "Chlorine is a halogen, not a noble gas. Noble gases include He, Ne, Ar, Kr, Xe, Rn.",
        topic: "Periodic Table"
      },
      {
        id: "chem_easy_3",
        questionText: "What type of bond is formed when electrons are shared between atoms?",
        options: [
          { id: 0, text: "Ionic" },
          { id: 1, text: "Covalent" },
          { id: 2, text: "Metallic" },
          { id: 3, text: "Hydrogen" }
        ],
        correctAnswerIndex: 1,
        subject: "chemistry",
        examType: "JEE",
        difficulty: "easy",
        explanation: "Covalent bonds are formed by sharing of electrons between atoms.",
        topic: "Chemical Bonding"
      },
      {
        id: "chem_easy_4",
        questionText: "Which element has the atomic number 6?",
        options: [
          { id: 0, text: "Oxygen" },
          { id: 1, text: "Carbon" },
          { id: 2, text: "Nitrogen" },
          { id: 3, text: "Boron" }
        ],
        correctAnswerIndex: 1,
        subject: "chemistry",
        examType: "JEE",
        difficulty: "easy",
        explanation: "Carbon has atomic number 6, with 6 protons in its nucleus.",
        topic: "Atomic Structure"
      },
      {
        id: "chem_easy_5",
        questionText: "What is the molecular formula of methane?",
        options: [
          { id: 0, text: "CH₄" },
          { id: 1, text: "C₂H₆" },
          { id: 2, text: "C₂H₄" },
          { id: 3, text: "CH₃OH" }
        ],
        correctAnswerIndex: 0,
        subject: "chemistry",
        examType: "JEE",
        difficulty: "easy",
        explanation: "Methane has the molecular formula CH₄, consisting of one carbon and four hydrogen atoms.",
        topic: "Organic Chemistry"
      }
    ],
    medium: [
      {
        id: "chem_med_1",
        questionText: "What is the hybridization of carbon in methane (CH₄)?",
        options: [
          { id: 0, text: "sp" },
          { id: 1, text: "sp²" },
          { id: 2, text: "sp³" },
          { id: 3, text: "sp³d" }
        ],
        correctAnswerIndex: 2,
        subject: "chemistry",
        examType: "JEE",
        difficulty: "medium",
        explanation: "In methane, carbon forms 4 sigma bonds, requiring sp³ hybridization with tetrahedral geometry.",
        topic: "Chemical Bonding"
      },
      {
        id: "chem_med_2",
        questionText: "Which of the following has the highest boiling point?",
        options: [
          { id: 0, text: "HF" },
          { id: 1, text: "HCl" },
          { id: 2, text: "HBr" },
          { id: 3, text: "HI" }
        ],
        correctAnswerIndex: 0,
        subject: "chemistry",
        examType: "JEE",
        difficulty: "medium",
        explanation: "HF has the highest boiling point due to strong hydrogen bonding between molecules.",
        topic: "Chemical Bonding"
      },
      {
        id: "chem_med_3",
        questionText: "What is the oxidation state of Mn in KMnO₄?",
        options: [
          { id: 0, text: "+5" },
          { id: 1, text: "+6" },
          { id: 2, text: "+7" },
          { id: 3, text: "+4" }
        ],
        correctAnswerIndex: 2,
        subject: "chemistry",
        examType: "JEE",
        difficulty: "medium",
        explanation: "In KMnO₄: K(+1) + Mn(x) + 4O(-2) = 0, so x = +7.",
        topic: "Redox Reactions"
      },
      {
        id: "chem_med_4",
        questionText: "Which of the following is an example of a nucleophilic substitution reaction?",
        options: [
          { id: 0, text: "CH₃Cl + OH⁻ → CH₃OH + Cl⁻" },
          { id: 1, text: "C₂H₄ + Br₂ → C₂H₄Br₂" },
          { id: 2, text: "C₆H₆ + Cl₂ → C₆H₅Cl + HCl" },
          { id: 3, text: "CH₄ + Cl₂ → CH₃Cl + HCl" }
        ],
        correctAnswerIndex: 0,
        subject: "chemistry",
        examType: "JEE",
        difficulty: "medium",
        explanation: "OH⁻ (nucleophile) attacks CH₃Cl and substitutes Cl⁻, making it a nucleophilic substitution.",
        topic: "Organic Chemistry"
      }
    ],
    hard: [
      {
        id: "chem_hard_1",
        questionText: "The rate constant of a first-order reaction is 0.693 min⁻¹. What is its half-life?",
        options: [
          { id: 0, text: "0.5 min" },
          { id: 1, text: "1 min" },
          { id: 2, text: "1.5 min" },
          { id: 3, text: "2 min" }
        ],
        correctAnswerIndex: 1,
        subject: "chemistry",
        examType: "JEE",
        difficulty: "hard",
        explanation: "For first-order reactions, t₁/₂ = 0.693/k = 0.693/0.693 = 1 min.",
        topic: "Chemical Kinetics"
      },
      {
        id: "chem_hard_2",
        questionText: "Which of the following complexes is expected to be paramagnetic?",
        options: [
          { id: 0, text: "[Ni(CN)₄]²⁻" },
          { id: 1, text: "[NiCl₄]²⁻" },
          { id: 2, text: "[Ni(CO)₄]" },
          { id: 3, text: "[Ni(NH₃)₆]²⁺" }
        ],
        correctAnswerIndex: 1,
        subject: "chemistry",
        examType: "JEE",
        difficulty: "hard",
        explanation: "[NiCl₄]²⁻ has Ni²⁺ in tetrahedral field with unpaired electrons, making it paramagnetic.",
        topic: "Coordination Compounds"
      }
    ]
  },
  mathematics: {
    easy: [
      {
        id: "math_easy_1",
        questionText: "What is the derivative of x²?",
        options: [
          { id: 0, text: "x" },
          { id: 1, text: "2x" },
          { id: 2, text: "x²" },
          { id: 3, text: "2" }
        ],
        correctAnswerIndex: 1,
        subject: "mathematics",
        examType: "JEE",
        difficulty: "easy",
        explanation: "Using the power rule, d/dx(x²) = 2x¹ = 2x.",
        topic: "Differential Calculus"
      },
      {
        id: "math_easy_2",
        questionText: "What is the value of sin(90°)?",
        options: [
          { id: 0, text: "0" },
          { id: 1, text: "1" },
          { id: 2, text: "1/2" },
          { id: 3, text: "√3/2" }
        ],
        correctAnswerIndex: 1,
        subject: "mathematics",
        examType: "JEE",
        difficulty: "easy",
        explanation: "sin(90°) = 1, which is a fundamental trigonometric value.",
        topic: "Trigonometry"
      },
      {
        id: "math_easy_3",
        questionText: "If f(x) = 3x + 4, what is f(2)?",
        options: [
          { id: 0, text: "8" },
          { id: 1, text: "10" },
          { id: 2, text: "6" },
          { id: 3, text: "12" }
        ],
        correctAnswerIndex: 1,
        subject: "mathematics",
        examType: "JEE",
        difficulty: "easy",
        explanation: "f(2) = 3(2) + 4 = 6 + 4 = 10.",
        topic: "Functions"
      },
      {
        id: "math_easy_4",
        questionText: "What is the sum of angles in a triangle?",
        options: [
          { id: 0, text: "90°" },
          { id: 1, text: "180°" },
          { id: 2, text: "270°" },
          { id: 3, text: "360°" }
        ],
        correctAnswerIndex: 1,
        subject: "mathematics",
        examType: "JEE",
        difficulty: "easy",
        explanation: "The sum of interior angles in any triangle is always 180°.",
        topic: "Geometry"
      },
      {
        id: "math_easy_5",
        questionText: "What is the value of log₁₀(100)?",
        options: [
          { id: 0, text: "1" },
          { id: 1, text: "2" },
          { id: 2, text: "10" },
          { id: 3, text: "100" }
        ],
        correctAnswerIndex: 1,
        subject: "mathematics",
        examType: "JEE",
        difficulty: "easy",
        explanation: "log₁₀(100) = log₁₀(10²) = 2.",
        topic: "Logarithms"
      }
    ],
    medium: [
      {
        id: "math_med_1",
        questionText: "What is the integral of 2x dx?",
        options: [
          { id: 0, text: "x² + C" },
          { id: 1, text: "2x² + C" },
          { id: 2, text: "x²/2 + C" },
          { id: 3, text: "2 + C" }
        ],
        correctAnswerIndex: 0,
        subject: "mathematics",
        examType: "JEE",
        difficulty: "medium",
        explanation: "∫2x dx = 2∫x dx = 2(x²/2) + C = x² + C.",
        topic: "Integral Calculus"
      },
      {
        id: "math_med_2",
        questionText: "If the roots of ax² + bx + c = 0 are equal, then:",
        options: [
          { id: 0, text: "b² = 4ac" },
          { id: 1, text: "b² > 4ac" },
          { id: 2, text: "b² < 4ac" },
          { id: 3, text: "b² ≠ 4ac" }
        ],
        correctAnswerIndex: 0,
        subject: "mathematics",
        examType: "JEE",
        difficulty: "medium",
        explanation: "For equal roots, discriminant = 0, so b² - 4ac = 0, hence b² = 4ac.",
        topic: "Quadratic Equations"
      },
      {
        id: "math_med_3",
        questionText: "What is the coefficient of x² in the expansion of (1 + x)⁵?",
        options: [
          { id: 0, text: "5" },
          { id: 1, text: "10" },
          { id: 2, text: "15" },
          { id: 3, text: "20" }
        ],
        correctAnswerIndex: 1,
        subject: "mathematics",
        examType: "JEE",
        difficulty: "medium",
        explanation: "Using binomial theorem, coefficient of x² is ⁵C₂ = 5!/(2!3!) = 10.",
        topic: "Binomial Theorem"
      }
    ],
    hard: [
      {
        id: "math_hard_1",
        questionText: "What is the value of lim(x→0) (sin x)/x?",
        options: [
          { id: 0, text: "0" },
          { id: 1, text: "1" },
          { id: 2, text: "∞" },
          { id: 3, text: "undefined" }
        ],
        correctAnswerIndex: 1,
        subject: "mathematics",
        examType: "JEE",
        difficulty: "hard",
        explanation: "This is a standard limit: lim(x→0) (sin x)/x = 1.",
        topic: "Limits"
      },
      {
        id: "math_hard_2",
        questionText: "The area bounded by y = x² and y = 4x - x² is:",
        options: [
          { id: 0, text: "16/3" },
          { id: 1, text: "32/3" },
          { id: 2, text: "8" },
          { id: 3, text: "4" }
        ],
        correctAnswerIndex: 1,
        subject: "mathematics",
        examType: "JEE",
        difficulty: "hard",
        explanation: "Intersection points are x = 0, 2. Area = ∫₀² (4x - 2x²) dx = 32/3.",
        topic: "Integral Calculus"
      }
    ]
  }
};

// Utility functions for question management
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getJEEQuestions = (
  subject: string,
  difficulty: string,
  numberOfQuestions: number
): JEEQuestion[] => {
  const subjectQuestions = jeeQuestionBank[subject.toLowerCase()];
  if (!subjectQuestions) {
    return [];
  }

  const difficultyQuestions = subjectQuestions[difficulty.toLowerCase()];
  if (!difficultyQuestions) {
    return [];
  }

  // Shuffle questions and return the requested number
  const shuffledQuestions = shuffleArray(difficultyQuestions);
  return shuffledQuestions.slice(0, numberOfQuestions);
};

export const getMixedJEEQuestions = (
  subject: string,
  numberOfQuestions: number,
  difficultyDistribution?: { easy: number; medium: number; hard: number }
): JEEQuestion[] => {
  const subjectQuestions = jeeQuestionBank[subject.toLowerCase()];
  if (!subjectQuestions) {
    return [];
  }

  // Default distribution if not provided
  const distribution = difficultyDistribution || {
    easy: Math.ceil(numberOfQuestions * 0.4),
    medium: Math.ceil(numberOfQuestions * 0.4),
    hard: Math.ceil(numberOfQuestions * 0.2)
  };

  const questions: JEEQuestion[] = [];

  // Get questions from each difficulty level
  if (subjectQuestions.easy) {
    const easyQuestions = shuffleArray(subjectQuestions.easy);
    questions.push(...easyQuestions.slice(0, distribution.easy));
  }

  if (subjectQuestions.medium) {
    const mediumQuestions = shuffleArray(subjectQuestions.medium);
    questions.push(...mediumQuestions.slice(0, distribution.medium));
  }

  if (subjectQuestions.hard) {
    const hardQuestions = shuffleArray(subjectQuestions.hard);
    questions.push(...hardQuestions.slice(0, distribution.hard));
  }

  // Shuffle the final mix and return requested number
  const shuffledMix = shuffleArray(questions);
  return shuffledMix.slice(0, numberOfQuestions);
};

export const getAllAvailableQuestions = (subject: string): JEEQuestion[] => {
  const subjectQuestions = jeeQuestionBank[subject.toLowerCase()];
  if (!subjectQuestions) {
    return [];
  }

  const allQuestions: JEEQuestion[] = [];
  Object.values(subjectQuestions).forEach(difficultyQuestions => {
    allQuestions.push(...difficultyQuestions);
  });

  return shuffleArray(allQuestions);
};
