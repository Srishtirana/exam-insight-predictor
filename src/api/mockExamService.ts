// Mock exam service for GitHub Pages deployment
export const mockQuestions = {
  JEE: {
    physics: [
      {
        id: "1",
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
        explanation: "Ampere is the SI unit of electric current."
      },
      {
        id: "2",
        questionText: "Which of the following is not a unit of energy?",
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
        explanation: "Newton is a unit of force, not energy."
      }
    ],
    chemistry: [
      {
        id: "3",
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
        explanation: "Pure water has a pH of 7 at 25°C."
      }
    ],
    mathematics: [
      {
        id: "4",
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
        explanation: "Using the power rule, the derivative of x² is 2x."
      }
    ]
  },
  NEET: {
    biology: [
      {
        id: "5",
        questionText: "Which organelle is known as the 'powerhouse of the cell'?",
        options: [
          { id: 0, text: "Nucleus" },
          { id: 1, text: "Mitochondria" },
          { id: 2, text: "Ribosome" },
          { id: 3, text: "Golgi apparatus" }
        ],
        correctAnswerIndex: 1,
        subject: "biology",
        examType: "NEET",
        difficulty: "easy",
        explanation: "Mitochondria are called the powerhouse of the cell because they produce ATP."
      }
    ]
  }
};

export const getMockQuestions = (examType: string, subject: string, difficulty: string, numberOfQuestions: number) => {
  const questions = mockQuestions[examType as keyof typeof mockQuestions]?.[subject as keyof typeof mockQuestions[typeof examType]] || [];
  return questions.slice(0, numberOfQuestions);
};

export const getMockFeedback = (score: number, totalQuestions: number, examType: string, subject: string) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
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
};
