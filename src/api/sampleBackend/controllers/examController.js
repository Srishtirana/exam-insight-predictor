const Question = require("../models/Question");
const Attempt = require("../models/Attempt");
const User = require("../models/User");
const AIQuestionService = require("../services/aiQuestionService");

// Start a new exam
exports.startExam = async (req, res) => {
  try {
    const { examType, subject, difficulty, numberOfQuestions } = req.body;
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
      if (AIQuestionService) {
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
      }
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
    const attempt = await Attempt.findOne({
      _id: examId,
      user: userId,
    }).populate('user');

    if (!attempt || attempt.user._id.toString() !== userId) {
      return res.status(404).json({
        success: false,
        message: "Exam attempt not found",
      });
    }

    // Calculate score
    let correctAnswers = 0;
    const questionsWithAnswers = attempt.questions.map((question) => {
      const userAnswer = answers.find(
        (a) => a.questionId === question.questionId.toString()
      );
      const selectedAnswer = userAnswer ? userAnswer.selectedAnswer : null;

      // Check if answer is correct
      const isCorrect = selectedAnswer === question.correctAnswerIndex;
      if (isCorrect) correctAnswers++;

      return {
        ...question.toObject(),
        selectedAnswer,
        isCorrect,
      };
    });

    // Update attempt with results
    attempt.questions = questionsWithAnswers;
    attempt.score = correctAnswers;
    attempt.completedAt = new Date();
    attempt.status = 'completed';
    await attempt.save();

    // Update user's exam history
    await User.findByIdAndUpdate(userId, {
      $push: {
        examHistory: {
          examId: attempt._id,
          subject: attempt.subject,
          examType: attempt.examType,
          difficulty: attempt.difficulty,
          score: correctAnswers,
          totalQuestions: attempt.totalQuestions,
          date: new Date(),
        },
      },
    });

    // Calculate score percentage
    const scorePercentage = Math.round((correctAnswers / attempt.totalQuestions) * 100);

    // Prepare result for frontend
    const result = {
      score: scorePercentage,
      totalQuestions: attempt.totalQuestions,
      correctAnswers,
      incorrectAnswers: attempt.totalQuestions - correctAnswers,
      questions: questionsWithAnswers,
      examType: attempt.examType,
      subject: attempt.subject,
      difficulty: attempt.difficulty,
      completedAt: attempt.completedAt,
    };

    res.json({
      success: true,
      message: "Exam submitted successfully",
      ...result,
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

    // Find the attempt
    const attempt = await Attempt.findOne({
      _id: examId,
      user: userId,
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Exam attempt not found",
      });
    }

    // Check if AI feedback is already generated
    if (attempt.aiFeedback) {
      return res.json({
        success: true,
        feedback: attempt.aiFeedback,
      });
    }

    // Generate AI feedback
    const feedback = await AIQuestionService.generateFeedback(attempt);
    
    // Save feedback to the attempt
    attempt.aiFeedback = feedback;
    await attempt.save();

    res.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Get AI feedback error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating AI feedback",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Analyze exam attempt
exports.analyzeAttempt = async (req, res) => {
  try {
    const { examId } = req.body;
    const userId = req.user.id;

    // Find the attempt
    const attempt = await Attempt.findOne({
      _id: examId,
      user: userId,
    }).populate('questions.question');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Exam attempt not found',
      });
    }

    // Calculate performance metrics
    const totalQuestions = attempt.questions.length;
    const correctAnswers = attempt.questions.filter(
      q => q.selectedAnswer === q.question.correctAnswerIndex
    ).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Generate feedback
    const feedback = {
      score,
      totalQuestions,
      correctAnswers,
      incorrectAnswers: totalQuestions - correctAnswers,
      performance: score >= 70 ? 'Good' : score >= 40 ? 'Average' : 'Needs Improvement',
      topicAnalysis: {},
      suggestions: []
    };

    // Basic topic analysis (can be enhanced)
    const topics = {};
    attempt.questions.forEach(q => {
      const topic = q.question.topic || 'General';
      if (!topics[topic]) {
        topics[topic] = { correct: 0, total: 0 };
      }
      topics[topic].total++;
      if (q.selectedAnswer === q.question.correctAnswerIndex) {
        topics[topic].correct++;
      }
    });

    // Calculate topic-wise performance
    for (const [topic, data] of Object.entries(topics)) {
      const accuracy = Math.round((data.correct / data.total) * 100);
      feedback.topicAnalysis[topic] = {
        accuracy,
        strength: accuracy >= 70,
        weak: accuracy < 50,
      };

      if (accuracy < 50) {
        feedback.suggestions.push(`Focus more on ${topic} (${accuracy}% accuracy)`);
      }
    }

    if (feedback.suggestions.length === 0) {
      feedback.suggestions.push('Good overall performance! Keep practicing to maintain your score.');
    } else {
      feedback.suggestions.unshift('Here are some areas to focus on:');
    }

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error('Error analyzing attempt:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing exam attempt',
      error: error.message,
    });
  }
};

// Test AI question generation
exports.testAIQuestions = async (req, res) => {
  try {
    const { examType, subject, difficulty, count = 2 } = req.body;
    
    if (!examType || !subject || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: examType, subject, difficulty",
      });
    }

    const questions = await AIQuestionService.generateQuestions(
      examType,
      subject,
      difficulty.toLowerCase(),
      parseInt(count)
    );

    res.json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Test AI questions error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating test questions",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};
