const Question = require("../models/Question");
const Attempt = require("../models/Attempt");
const User = require("../models/User");
const AIQuestionService = require("../services/aiQuestionService");

// Start a new exam
exports.startExam = async (req, res) => {
  try {
    const { examType, subject, difficulty, numberOfQuestions } = req.body;
    console.log("🚀 ~ exports.startExam= ~ req:", req.body);
    ``;
    const userId = req.user.id;

    if (!examType || !subject || !difficulty || !numberOfQuestions) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Try to generate AI questions first
    let questions = [];
    let aiQuestionsGenerated = false;

    try {
      console.log(`🤖 Generating AI questions for ${examType} ${subject} ${difficulty}...`);
      const aiQuestions = await AIQuestionService.generateQuestions(
        examType,
        subject,
        difficulty.toLowerCase(),
        parseInt(numberOfQuestions)
      );
      
      // Save AI-generated questions to database
      for (const aiQuestion of aiQuestions) {
        const question = new Question(aiQuestion);
        await question.save();
        questions.push(question);
      }
      aiQuestionsGenerated = true;
      console.log(`✅ Generated ${aiQuestions.length} AI questions`);
    } catch (aiError) {
      console.log('⚠️ AI question generation failed, falling back to database:', aiError.message);
      
      // Fallback to database questions
      questions = await Question.aggregate([
        {
          $match: {
            examType: examType,
            subject: subject,
            difficulty: difficulty.toLowerCase(),
          },
        },
        { $sample: { size: parseInt(numberOfQuestions) } },
      ]);

      // If still not enough questions, use fallback questions
      if (questions.length < numberOfQuestions) {
        try {
          const fallbackQuestions = await AIQuestionService.generateFallbackQuestions(
            examType,
            subject,
            difficulty.toLowerCase(),
            numberOfQuestions - questions.length
          );
          
          for (const fallbackQuestion of fallbackQuestions) {
            const question = new Question(fallbackQuestion);
            await question.save();
            questions.push(question);
          }
        } catch (fallbackError) {
          console.log('⚠️ Fallback questions failed, using basic questions');
          // Generate basic placeholder questions as last resort
          const placeholderCount = numberOfQuestions - questions.length;
          for (let i = 0; i < placeholderCount; i++) {
            const question = new Question({
              questionText: `Sample ${subject} question ${i + 1} for ${examType}?`,
              options: [
                { id: 0, text: `Option A` },
                { id: 1, text: `Option B` },
                { id: 2, text: `Option C` },
                { id: 3, text: `Option D` },
              ],
              correctAnswerIndex: Math.floor(Math.random() * 4),
              subject,
              examType,
              difficulty: difficulty.toLowerCase(),
              topic: 'General',
              aiGenerated: false,
            });
            await question.save();
            questions.push(question);
          }
        }
      }
    }

    // Create exam attempt record
    const attempt = new Attempt({
      user: userId,
      examType,
      subject,
      difficulty,
      questions: questions.map((q) => ({
        questionId: q._id,
        questionText: q.questionText,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
      })),
      totalQuestions: questions.length,
    });

    await attempt.save();

    // Format questions for frontend (without correct answer)
    const formattedQuestions = questions.map((q) => ({
      id: q._id.toString(),
      questionText: q.questionText,
      options: q.options,
      subject: q.subject,
      examType: q.examType,
      difficulty: q.difficulty,
    }));

    res.json({
      success: true,
      examId: attempt._id,
      questions: formattedQuestions,
      aiGenerated: aiQuestionsGenerated,
      message: aiQuestionsGenerated 
        ? `Generated ${questions.length} AI-powered questions for ${examType} ${subject}` 
        : `Using ${questions.length} questions from question bank`,
    });
  } catch (error) {
    console.error("Start exam error:", error);
    res.status(500).json({
      success: false,
      message: "Server error starting exam",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Submit exam answers
exports.submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body;
    const userId = req.user.id;

    if (!examId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Find the attempt
    const attempt = await Attempt.findById(examId).populate('user');
    if (!attempt || attempt.user._id.toString() !== userId) {
      return res.status(404).json({
        success: false,
        message: "Exam attempt not found",
      });
    }

    // Calculate score
    let correctAnswers = 0;
    const questionsWithAnswers = attempt.questions.map((question, index) => {
      const userAnswer = answers.find(a => a.questionId === question.questionId.toString());
      const isCorrect = userAnswer && userAnswer.selectedAnswer === question.correctAnswerIndex;
      
      if (isCorrect) {
        correctAnswers++;
      }

      return {
        id: question.questionId.toString(),
        questionText: question.questionText,
        options: question.options,
        correctAnswerIndex: question.correctAnswerIndex,
        selectedAnswer: userAnswer ? userAnswer.selectedAnswer : null,
        isCorrect: isCorrect
      };
    });

    const score = Math.round((correctAnswers / attempt.totalQuestions) * 100);

    // Update attempt with results
    attempt.score = score;
    attempt.completedAt = new Date();
    attempt.questions = attempt.questions.map((question, index) => {
      const userAnswer = answers.find(a => a.questionId === question.questionId.toString());
      return {
        ...question.toObject(),
        selectedAnswer: userAnswer ? userAnswer.selectedAnswer : null
      };
    });

    await attempt.save();

    // Generate AI feedback
    let aiFeedback = null;
    try {
      aiFeedback = await AIQuestionService.analyzePerformance({
        examType: attempt.examType,
        subject: attempt.subject,
        difficulty: attempt.difficulty,
        score: correctAnswers,
        totalQuestions: attempt.totalQuestions,
        questions: questionsWithAnswers,
        answers: answers
      });
    } catch (aiError) {
      console.log('AI feedback generation failed:', aiError.message);
    }

    res.json({
      success: true,
      score: score,
      correctAnswers: correctAnswers,
      totalQuestions: attempt.totalQuestions,
      questions: questionsWithAnswers,
      aiFeedback: aiFeedback,
      message: `Exam completed! You scored ${score}%`
    });
  } catch (error) {
    console.error("Submit exam error:", error);
    res.status(500).json({
      success: false,
      message: "Server error submitting exam",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Get AI feedback for an attempt
exports.getAIFeedback = async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user.id;

    const attempt = await Attempt.findById(examId).populate('user');
    if (!attempt || attempt.user._id.toString() !== userId) {
      return res.status(404).json({
        success: false,
        message: "Exam attempt not found",
      });
    }

    if (!attempt.completedAt) {
      return res.status(400).json({
        success: false,
        message: "Exam not completed yet",
      });
    }

    // Generate AI feedback
    const aiFeedback = await AIQuestionService.analyzePerformance({
      examType: attempt.examType,
      subject: attempt.subject,
      difficulty: attempt.difficulty,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      questions: attempt.questions,
      answers: attempt.questions.map(q => ({
        questionId: q.questionId.toString(),
        selectedAnswer: q.selectedAnswer
      }))
    });

    res.json({
      success: true,
      feedback: aiFeedback
    });
  } catch (error) {
    console.error("Get AI feedback error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting AI feedback",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Analyze exam attempt (alias for getAIFeedback)
exports.analyzeAttempt = exports.getAIFeedback;

// Test AI question generation
exports.testAIQuestions = async (req, res) => {
  try {
    const { examType, subject, difficulty, numberOfQuestions } = req.body;
    
    if (!examType || !subject || !difficulty || !numberOfQuestions) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: examType, subject, difficulty, numberOfQuestions"
      });
    }

    console.log(`🧪 Testing AI question generation for ${examType} ${subject} ${difficulty}...`);
    
    const questions = await AIQuestionService.generateQuestions(
      examType,
      subject,
      difficulty.toLowerCase(),
      parseInt(numberOfQuestions)
    );

    res.json({
      success: true,
      message: `Generated ${questions.length} test questions`,
      questions: questions,
      examType,
      subject,
      difficulty,
      numberOfQuestions: parseInt(numberOfQuestions)
    });
  } catch (error) {
    console.error("Test AI questions error:", error);
    res.status(500).json({
      success: false,
      message: "Server error testing AI questions",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};
