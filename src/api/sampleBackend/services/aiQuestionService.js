const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here',
});

// Exam type specific configurations
const EXAM_CONFIGS = {
  JEE: {
    subjects: {
      physics: {
        topics: ['Mechanics', 'Thermodynamics', 'Waves', 'Electricity', 'Magnetism', 'Optics', 'Modern Physics'],
        difficultyLevels: {
          easy: 'Basic concepts and direct formula applications',
          medium: 'Multi-step problems requiring concept integration',
          hard: 'Complex problems with multiple concepts and advanced mathematics'
        }
      },
      chemistry: {
        topics: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Coordination Compounds', 'Biomolecules'],
        difficultyLevels: {
          easy: 'Basic chemical reactions and simple calculations',
          medium: 'Mechanism-based problems and complex calculations',
          hard: 'Advanced synthesis problems and complex molecular interactions'
        }
      },
      mathematics: {
        topics: ['Algebra', 'Calculus', 'Coordinate Geometry', 'Trigonometry', 'Probability', 'Statistics'],
        difficultyLevels: {
          easy: 'Direct formula applications and basic problem solving',
          medium: 'Multi-step problems requiring multiple concepts',
          hard: 'Advanced calculus and complex mathematical reasoning'
        }
      }
    }
  },
  NEET: {
    subjects: {
      physics: {
        topics: ['Mechanics', 'Thermodynamics', 'Waves', 'Electricity', 'Magnetism', 'Optics', 'Modern Physics'],
        difficultyLevels: {
          easy: 'Basic concepts and direct applications',
          medium: 'Problem-solving with multiple concepts',
          hard: 'Complex medical physics applications'
        }
      },
      chemistry: {
        topics: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Biomolecules', 'Environmental Chemistry'],
        difficultyLevels: {
          easy: 'Basic chemical principles',
          medium: 'Biological chemistry applications',
          hard: 'Advanced medicinal chemistry'
        }
      },
      biology: {
        topics: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology', 'Plant Physiology', 'Evolution', 'Biotechnology'],
        difficultyLevels: {
          easy: 'Basic biological concepts and definitions',
          medium: 'Process understanding and applications',
          hard: 'Complex biological systems and medical applications'
        }
      }
    }
  },
  GATE: {
    subjects: {
      mathematics: {
        topics: ['Linear Algebra', 'Calculus', 'Differential Equations', 'Complex Analysis', 'Probability', 'Statistics'],
        difficultyLevels: {
          easy: 'Basic mathematical concepts',
          medium: 'Engineering applications',
          hard: 'Advanced mathematical modeling'
        }
      },
      verbal: {
        topics: ['Reading Comprehension', 'Vocabulary', 'Grammar', 'Critical Reasoning', 'Verbal Ability'],
        difficultyLevels: {
          easy: 'Basic language skills',
          medium: 'Complex comprehension',
          hard: 'Advanced analytical reasoning'
        }
      }
    }
  },
  CAT: {
    subjects: {
      quant: {
        topics: ['Arithmetic', 'Algebra', 'Geometry', 'Number System', 'Percentage', 'Profit Loss', 'Time Speed Distance'],
        difficultyLevels: {
          easy: 'Basic mathematical operations',
          medium: 'Problem-solving strategies',
          hard: 'Complex quantitative reasoning'
        }
      },
      verbal: {
        topics: ['Reading Comprehension', 'Vocabulary', 'Grammar', 'Para Jumbles', 'Critical Reasoning'],
        difficultyLevels: {
          easy: 'Basic language comprehension',
          medium: 'Complex passage analysis',
          hard: 'Advanced critical thinking'
        }
      }
    }
  },
  UPSC: {
    subjects: {
      polity: {
        topics: ['Constitution', 'Fundamental Rights', 'Directive Principles', 'Parliament', 'Judiciary', 'Federalism'],
        difficultyLevels: {
          easy: 'Basic constitutional concepts',
          medium: 'Constitutional applications',
          hard: 'Complex governance issues'
        }
      },
      history: {
        topics: ['Ancient History', 'Medieval History', 'Modern History', 'Freedom Struggle', 'World History'],
        difficultyLevels: {
          easy: 'Basic historical facts',
          medium: 'Historical analysis',
          hard: 'Complex historical interpretations'
        }
      }
    }
  }
};

class AIQuestionService {
  static async generateQuestions(examType, subject, difficulty, numberOfQuestions) {
    try {
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
        console.log("OpenAI API key not configured, using fallback questions.");
        return this.generateFallbackQuestions(examType, subject, difficulty, numberOfQuestions);
      }

      const config = EXAM_CONFIGS[examType];
      if (!config || !config.subjects[subject]) {
        throw new Error(`Invalid exam type or subject: ${examType} - ${subject}`);
      }

      const subjectConfig = config.subjects[subject];
      const difficultyDescription = subjectConfig.difficultyLevels[difficulty];
      const topics = subjectConfig.topics;

      const prompt = this.createPrompt(examType, subject, difficulty, difficultyDescription, topics, numberOfQuestions);
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert question generator for competitive exams. Generate high-quality, accurate questions with exactly 4 options and provide the correct answer index (0-3)."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      });

      const generatedContent = response.choices[0].message.content;
      return this.parseGeneratedQuestions(generatedContent, examType, subject, difficulty);
    } catch (error) {
      console.error('Error generating AI questions:', error);
      console.log('Falling back to fallback questions...');
      return this.generateFallbackQuestions(examType, subject, difficulty, numberOfQuestions);
    }
  }

  static createPrompt(examType, subject, difficulty, difficultyDescription, topics, numberOfQuestions) {
    const topicList = topics.join(', ');
    
    return `Generate ${numberOfQuestions} high-quality multiple choice questions for ${examType} ${subject} exam at ${difficulty} difficulty level.

EXAM CONTEXT:
- Exam Type: ${examType}
- Subject: ${subject}
- Difficulty: ${difficulty} - ${difficultyDescription}
- Topics to cover: ${topicList}

QUESTION REQUIREMENTS:
1. Each question must have exactly 4 options (A, B, C, D)
2. Questions should be realistic and similar to actual ${examType} exam questions
3. Include numerical problems, conceptual questions, and application-based questions
4. Ensure questions test understanding, not just memorization
5. Make options plausible but only one should be correct
6. Include step-by-step solutions for numerical problems

OUTPUT FORMAT:
For each question, provide:
Question: [The question text]
A) [Option 1]
B) [Option 2] 
C) [Option 3]
D) [Option 4]
Correct Answer: [A/B/C/D]
Explanation: [Detailed explanation of why the answer is correct]

Generate questions that would appear in real ${examType} exams and help students prepare effectively.`;
  }

  // AI-powered performance analysis
  static async analyzePerformance(attemptData) {
    try {
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
        return this.generateFallbackFeedback(attemptData);
      }

      const { examType, subject, difficulty, score, totalQuestions, questions, answers } = attemptData;
      
      const prompt = `Analyze the exam performance and provide detailed feedback for a ${examType} ${subject} exam.

EXAM DETAILS:
- Exam Type: ${examType}
- Subject: ${subject}
- Difficulty: ${difficulty}
- Score: ${score}/${totalQuestions} (${Math.round((score/totalQuestions)*100)}%)
- Total Questions: ${totalQuestions}

PERFORMANCE ANALYSIS:
Please provide:
1. Overall performance assessment
2. Strengths identified
3. Areas for improvement
4. Specific study recommendations
5. Tips for better performance in future exams
6. Subject-specific advice for ${subject}

Make the feedback encouraging but honest, and provide actionable advice for improvement.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert educational counselor and exam analyst. Provide detailed, constructive feedback on exam performance with specific improvement suggestions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error analyzing performance:', error);
      return this.generateFallbackFeedback(attemptData);
    }
  }

  // Generate fallback feedback when AI is not available
  static generateFallbackFeedback(attemptData) {
    const { examType, subject, difficulty, score, totalQuestions } = attemptData;
    const percentage = Math.round((score/totalQuestions)*100);
    
    let performance = "";
    let advice = "";
    
    if (percentage >= 80) {
      performance = "Excellent performance! You have a strong grasp of the concepts.";
      advice = "Continue practicing advanced problems and maintain your current study routine.";
    } else if (percentage >= 60) {
      performance = "Good performance with room for improvement.";
      advice = "Focus on understanding the concepts you missed and practice more problems.";
    } else if (percentage >= 40) {
      performance = "Average performance. More practice is needed.";
      advice = "Review fundamental concepts and practice basic problems before moving to advanced ones.";
    } else {
      performance = "Below average performance. Focus on strengthening your basics.";
      advice = "Start with basic concepts, get help from teachers or study materials, and practice regularly.";
    }

    return `PERFORMANCE ANALYSIS FOR ${examType} ${subject.toUpperCase()} EXAM

Overall Assessment: ${performance}

Score: ${score}/${totalQuestions} (${percentage}%)

Strengths:
- Completed the exam successfully
- Demonstrated knowledge in some areas

Areas for Improvement:
- Focus on topics where you scored lower
- Practice more problems in ${subject}

Recommendations:
${advice}

Study Tips:
1. Review all incorrect answers and understand the concepts
2. Practice similar problems regularly
3. Create a study schedule for ${subject}
4. Take more practice tests to improve speed and accuracy

Subject-Specific Advice for ${subject}:
- Focus on understanding fundamental concepts
- Practice numerical problems if applicable
- Review theory and applications
- Use multiple study resources

Keep practicing and you'll see improvement in your next exam!`;
  }

  // Enhanced question generation with better parsing
  static parseGeneratedQuestions(content, examType, subject, difficulty) {
    try {
      // Clean the content to extract JSON
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const questions = JSON.parse(jsonMatch[0]);
      
      return questions.map((q, index) => ({
        questionText: q.questionText,
        options: q.options || [],
        correctAnswerIndex: q.correctAnswerIndex,
        subject: subject,
        examType: examType,
        difficulty: difficulty,
        topic: q.topic || 'General',
        explanation: q.explanation || '',
        aiGenerated: true
      }));
    } catch (error) {
      console.error('Error parsing AI questions:', error);
      throw new Error('Failed to parse generated questions');
    }
  }

  static getRandomTopics(topics, count) {
    const shuffled = topics.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }


  static async generateFallbackQuestions(examType, subject, difficulty, numberOfQuestions) {
    // Comprehensive fallback questions database
    const fallbackQuestions = {
      JEE: {
        physics: [
          {
            questionText: "What is the SI unit of electric current?",
            options: [
              { id: 0, text: "Volt" },
              { id: 1, text: "Ampere" },
              { id: 2, text: "Ohm" },
              { id: 3, text: "Watt" }
            ],
            correctAnswerIndex: 1,
            explanation: "Ampere is the SI unit of electric current, named after André-Marie Ampère."
          },
          {
            questionText: "Which of the following is not a unit of energy?",
            options: [
              { id: 0, text: "Joule" },
              { id: 1, text: "Calorie" },
              { id: 2, text: "Electron-volt" },
              { id: 3, text: "Newton" }
            ],
            correctAnswerIndex: 3,
            explanation: "Newton is a unit of force, not energy. Joule, calorie, and electron-volt are all units of energy."
          },
          {
            questionText: "What is the formula for kinetic energy?",
            options: [
              { id: 0, text: "KE = mgh" },
              { id: 1, text: "KE = ½mv²" },
              { id: 2, text: "KE = Fd" },
              { id: 3, text: "KE = P/V" }
            ],
            correctAnswerIndex: 1,
            explanation: "Kinetic energy is given by KE = ½mv² where m is mass and v is velocity."
          },
          {
            questionText: "Which principle states that energy can neither be created nor destroyed?",
            options: [
              { id: 0, text: "Law of Inertia" },
              { id: 1, text: "Law of Conservation of Energy" },
              { id: 2, text: "Newton's Third Law" },
              { id: 3, text: "Archimedes' Principle" }
            ],
            correctAnswerIndex: 1,
            explanation: "The Law of Conservation of Energy states that energy can neither be created nor destroyed, only transformed."
          },
          {
            questionText: "What is the speed of light in vacuum?",
            options: [
              { id: 0, text: "3 × 10⁶ m/s" },
              { id: 1, text: "3 × 10⁸ m/s" },
              { id: 2, text: "3 × 10¹⁰ m/s" },
              { id: 3, text: "3 × 10¹² m/s" }
            ],
            correctAnswerIndex: 1,
            explanation: "The speed of light in vacuum is approximately 3 × 10⁸ m/s or 300,000 km/s."
          }
        ],
        chemistry: [
          {
            questionText: "What is the pH of pure water at 25°C?",
            options: [
              { id: 0, text: "0" },
              { id: 1, text: "7" },
              { id: 2, text: "14" },
              { id: 3, text: "1" }
            ],
            correctAnswerIndex: 1,
            explanation: "Pure water has a pH of 7 at 25°C, making it neutral."
          },
          {
            questionText: "Which of the following is not a noble gas?",
            options: [
              { id: 0, text: "Helium" },
              { id: 1, text: "Neon" },
              { id: 2, text: "Chlorine" },
              { id: 3, text: "Argon" }
            ],
            correctAnswerIndex: 2,
            explanation: "Chlorine is a halogen, not a noble gas. Noble gases include helium, neon, argon, krypton, xenon, and radon."
          },
          {
            questionText: "What type of bond is formed when electrons are shared between atoms?",
            options: [
              { id: 0, text: "Ionic" },
              { id: 1, text: "Covalent" },
              { id: 2, text: "Metallic" },
              { id: 3, text: "Hydrogen" }
            ],
            correctAnswerIndex: 1,
            explanation: "Covalent bonds are formed when atoms share electrons to achieve stability."
          },
          {
            questionText: "Which of the following is not an alkali metal?",
            options: [
              { id: 0, text: "Sodium" },
              { id: 1, text: "Potassium" },
              { id: 2, text: "Calcium" },
              { id: 3, text: "Lithium" }
            ],
            correctAnswerIndex: 2,
            explanation: "Calcium is an alkaline earth metal, not an alkali metal. Alkali metals include lithium, sodium, potassium, rubidium, cesium, and francium."
          },
          {
            questionText: "The process of converting a solid directly to gas is called:",
            options: [
              { id: 0, text: "Melting" },
              { id: 1, text: "Evaporation" },
              { id: 2, text: "Sublimation" },
              { id: 3, text: "Condensation" }
            ],
            correctAnswerIndex: 2,
            explanation: "Sublimation is the process where a solid changes directly to gas without passing through the liquid phase."
          }
        ],
        mathematics: [
          {
            questionText: "What is the derivative of x²?",
            options: [
              { id: 0, text: "x" },
              { id: 1, text: "2x" },
              { id: 2, text: "x²" },
              { id: 3, text: "2" }
            ],
            correctAnswerIndex: 1,
            explanation: "Using the power rule, the derivative of x² is 2x."
          },
          {
            questionText: "What is the value of π (pi) to 2 decimal places?",
            options: [
              { id: 0, text: "3.14" },
              { id: 1, text: "3.41" },
              { id: 2, text: "3.12" },
              { id: 3, text: "3.24" }
            ],
            correctAnswerIndex: 0,
            explanation: "π (pi) is approximately 3.14159, which rounds to 3.14 to 2 decimal places."
          },
          {
            questionText: "Which of the following is not a prime number?",
            options: [
              { id: 0, text: "2" },
              { id: 1, text: "3" },
              { id: 2, text: "5" },
              { id: 3, text: "9" }
            ],
            correctAnswerIndex: 3,
            explanation: "9 is not a prime number because it can be divided by 3 (9 = 3 × 3). Prime numbers have exactly two distinct positive divisors."
          },
          {
            questionText: "If f(x) = 3x + 4, what is f(2)?",
            options: [
              { id: 0, text: "8" },
              { id: 1, text: "10" },
              { id: 2, text: "6" },
              { id: 3, text: "12" }
            ],
            correctAnswerIndex: 1,
            explanation: "f(2) = 3(2) + 4 = 6 + 4 = 10"
          },
          {
            questionText: "The sum of angles in a triangle equals:",
            options: [
              { id: 0, text: "90°" },
              { id: 1, text: "180°" },
              { id: 2, text: "270°" },
              { id: 3, text: "360°" }
            ],
            correctAnswerIndex: 1,
            explanation: "The sum of interior angles in any triangle is always 180°."
          }
        ]
      },
      NEET: {
        physics: [
          {
            questionText: "What is the SI unit of electric current?",
            options: [
              { id: 0, text: "Volt" },
              { id: 1, text: "Ampere" },
              { id: 2, text: "Ohm" },
              { id: 3, text: "Watt" }
            ],
            correctAnswerIndex: 1,
            explanation: "Ampere is the SI unit of electric current."
          },
          {
            questionText: "Which of the following is not a unit of energy?",
            options: [
              { id: 0, text: "Joule" },
              { id: 1, text: "Calorie" },
              { id: 2, text: "Electron-volt" },
              { id: 3, text: "Newton" }
            ],
            correctAnswerIndex: 3,
            explanation: "Newton is a unit of force, not energy."
          }
        ],
        chemistry: [
          {
            questionText: "What is the pH of pure water at 25°C?",
            options: [
              { id: 0, text: "0" },
              { id: 1, text: "7" },
              { id: 2, text: "14" },
              { id: 3, text: "1" }
            ],
            correctAnswerIndex: 1,
            explanation: "Pure water has a pH of 7 at 25°C."
          }
        ],
        biology: [
          {
            questionText: "Which organelle is known as the 'powerhouse of the cell'?",
            options: [
              { id: 0, text: "Nucleus" },
              { id: 1, text: "Mitochondria" },
              { id: 2, text: "Ribosome" },
              { id: 3, text: "Golgi apparatus" }
            ],
            correctAnswerIndex: 1,
            explanation: "Mitochondria are called the powerhouse of the cell because they produce ATP through cellular respiration."
          },
          {
            questionText: "What is the basic unit of heredity?",
            options: [
              { id: 0, text: "Cell" },
              { id: 1, text: "Gene" },
              { id: 2, text: "DNA" },
              { id: 3, text: "Chromosome" }
            ],
            correctAnswerIndex: 1,
            explanation: "A gene is the basic unit of heredity that carries genetic information."
          },
          {
            questionText: "Which process converts glucose to pyruvate?",
            options: [
              { id: 0, text: "Krebs cycle" },
              { id: 1, text: "Glycolysis" },
              { id: 2, text: "Oxidative phosphorylation" },
              { id: 3, text: "Electron transport chain" }
            ],
            correctAnswerIndex: 1,
            explanation: "Glycolysis is the process that converts glucose to pyruvate in the cytoplasm."
          },
          {
            questionText: "Which of the following is not a nucleotide base found in DNA?",
            options: [
              { id: 0, text: "Adenine" },
              { id: 1, text: "Thymine" },
              { id: 2, text: "Uracil" },
              { id: 3, text: "Guanine" }
            ],
            correctAnswerIndex: 2,
            explanation: "Uracil is found in RNA, not DNA. DNA contains adenine, thymine, guanine, and cytosine."
          },
          {
            questionText: "The process by which plants make food is called:",
            options: [
              { id: 0, text: "Respiration" },
              { id: 1, text: "Photosynthesis" },
              { id: 2, text: "Fermentation" },
              { id: 3, text: "Transpiration" }
            ],
            correctAnswerIndex: 1,
            explanation: "Photosynthesis is the process by which plants convert light energy into chemical energy (glucose)."
          }
        ]
      },
      GATE: {
        mathematics: [
          {
            questionText: "What is the derivative of x²?",
            options: [
              { id: 0, text: "x" },
              { id: 1, text: "2x" },
              { id: 2, text: "x²" },
              { id: 3, text: "2" }
            ],
            correctAnswerIndex: 1,
            explanation: "Using the power rule, the derivative of x² is 2x."
          },
          {
            questionText: "If 3x + 2 = 14, what is the value of x?",
            options: [
              { id: 0, text: "3" },
              { id: 1, text: "4" },
              { id: 2, text: "5" },
              { id: 3, text: "6" }
            ],
            correctAnswerIndex: 1,
            explanation: "3x + 2 = 14, so 3x = 12, therefore x = 4."
          }
        ],
        verbal: [
          {
            questionText: "Choose the word which is most similar in meaning to 'CANDID'.",
            options: [
              { id: 0, text: "Secretive" },
              { id: 1, text: "Frank" },
              { id: 2, text: "Vague" },
              { id: 3, text: "Hostile" }
            ],
            correctAnswerIndex: 1,
            explanation: "Candid means frank, open, and honest in speech or expression."
          }
        ]
      },
      CAT: {
        quant: [
          {
            questionText: "The simple interest on Rs. 5000 at 10% per annum for 2 years is:",
            options: [
              { id: 0, text: "Rs. 500" },
              { id: 1, text: "Rs. 1000" },
              { id: 2, text: "Rs. 1500" },
              { id: 3, text: "Rs. 2000" }
            ],
            correctAnswerIndex: 1,
            explanation: "Simple Interest = (P × R × T)/100 = (5000 × 10 × 2)/100 = Rs. 1000"
          },
          {
            questionText: "If the ratio of boys to girls is 3:2 in a class of 30, number of girls is:",
            options: [
              { id: 0, text: "10" },
              { id: 1, text: "12" },
              { id: 2, text: "15" },
              { id: 3, text: "18" }
            ],
            correctAnswerIndex: 1,
            explanation: "Total parts = 3 + 2 = 5. Girls = (2/5) × 30 = 12"
          }
        ],
        verbal: [
          {
            questionText: "Choose the word which is most similar in meaning to 'CANDID'.",
            options: [
              { id: 0, text: "Secretive" },
              { id: 1, text: "Frank" },
              { id: 2, text: "Vague" },
              { id: 3, text: "Hostile" }
            ],
            correctAnswerIndex: 1,
            explanation: "Candid means frank, open, and honest in speech or expression."
          }
        ]
      },
      UPSC: {
        polity: [
          {
            questionText: "Which Article of the Indian Constitution deals with Fundamental Duties?",
            options: [
              { id: 0, text: "Article 51A" },
              { id: 1, text: "Article 19" },
              { id: 2, text: "Article 21" },
              { id: 3, text: "Article 368" }
            ],
            correctAnswerIndex: 0,
            explanation: "Article 51A of the Indian Constitution deals with Fundamental Duties of citizens."
          }
        ],
        history: [
          {
            questionText: "Who discovered the sea route to India around the Cape of Good Hope?",
            options: [
              { id: 0, text: "Christopher Columbus" },
              { id: 1, text: "Vasco da Gama" },
              { id: 2, text: "Ferdinand Magellan" },
              { id: 3, text: "Marco Polo" }
            ],
            correctAnswerIndex: 1,
            explanation: "Vasco da Gama discovered the sea route to India around the Cape of Good Hope in 1498."
          }
        ]
      }
    };

    const questions = fallbackQuestions[examType]?.[subject] || [];
    return questions.slice(0, numberOfQuestions).map(q => ({
      ...q,
      subject,
      examType,
      difficulty,
      aiGenerated: false,
      createdAt: new Date()
    }));
  }
}

module.exports = AIQuestionService;



