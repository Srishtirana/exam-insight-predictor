// Mock exam service for GitHub Pages deployment
import { 
  jeeQuestionBank, 
  getJEEQuestions, 
  getMixedJEEQuestions, 
  getAllAvailableQuestions,
  shuffleArray,
  type JEEQuestion 
} from './jeeQuestionBank';

// Legacy NEET questions for backward compatibility
export const mockQuestions = {
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
  // Handle JEE questions with our comprehensive question bank
  if (examType.toLowerCase() === 'jee') {
    // If difficulty is "mixed" or not specified, get mixed questions
    if (difficulty.toLowerCase() === 'mixed' || !difficulty) {
      return getMixedJEEQuestions(subject, numberOfQuestions);
    }
    
    // Get questions of specific difficulty
    const questions = getJEEQuestions(subject, difficulty, numberOfQuestions);
    
    // If we don't have enough questions of the requested difficulty, 
    // fill with questions from other difficulties
    if (questions.length < numberOfQuestions) {
      const allQuestions = getAllAvailableQuestions(subject);
      const additionalQuestions = allQuestions
        .filter(q => !questions.find(existing => existing.id === q.id))
        .slice(0, numberOfQuestions - questions.length);
      
      return shuffleArray([...questions, ...additionalQuestions]);
    }
    
    return questions;
  }
  
  // Handle NEET and other exam types (legacy support)
  const examQuestions = mockQuestions[examType as keyof typeof mockQuestions];
  if (examQuestions && typeof examQuestions === 'object') {
    const subjectQuestions = examQuestions[subject as keyof typeof examQuestions] || [];
    return Array.isArray(subjectQuestions) ? subjectQuestions.slice(0, numberOfQuestions) : [];
  }
  return [];
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
