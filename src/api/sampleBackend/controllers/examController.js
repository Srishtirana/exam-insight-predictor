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

    // Validate request
    if (!examId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission format",
      });
    }

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
      };
    });

    // Update attempt with results
    attempt.questions = questionsWithAnswers;
    attempt.score = correctAnswers;
    attempt.completedAt = new Date();
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

    // Prepare result for frontend
    const result = {
      score: Math.round((correctAnswers / attempt.totalQuestions) * 100),
      totalQuestions: attempt.totalQuestions,
      correctAnswers,
      incorrectAnswers: attempt.totalQuestions - correctAnswers,
      questions: questionsWithAnswers,
    };

    res.json({
      success: true,
      result,
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

// Optional AI analysis for an attempt: returns feedback per question and overall tips
exports.analyzeAttempt = async (req, res) => {
  try {
    const { examId } = req.body;
    const userId = req.user.id;

    if (!examId) {
      return res.status(400).json({ success: false, message: "examId is required" });
    }

    const attempt = await Attempt.findOne({ _id: examId, user: userId });
    if (!attempt || !attempt.completedAt) {
      return res.status(404).json({ success: false, message: "Completed attempt not found" });
    }

    // Build a compact prompt
    const prompt = {
      role: "user",
      content: `You are an exam tutor. Analyze the following attempt. For each question provide: correctness (true/false), a one-line explanation for the correct option, and a tip if the answer was wrong. Then provide short overall tips (<=3 bullets). Keep it concise and exam-oriented. Data: ${JSON.stringify(
        attempt.questions.map((q) => ({
          questionText: q.questionText,
          options: q.options,
          correctAnswerIndex: q.correctAnswerIndex,
          selectedAnswer: q.selectedAnswer ?? null,
          subject: attempt.subject,
          examType: attempt.examType,
          difficulty: attempt.difficulty,
        }))
      )}`,
    };

    const openaiKey = process.env.OPENAI_API_KEY;
    let aiResponseText = null;

    if (openaiKey && typeof fetch !== 'undefined') {
      try {
        const resp = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [prompt],
            temperature: 0.3,
          }),
        });
        const data = await resp.json();
        aiResponseText = data?.choices?.[0]?.message?.content || null;
      } catch (e) {
        // Fall back to local heuristic if API fails
        aiResponseText = null;
      }
    }

    if (!aiResponseText) {
      // Heuristic feedback fallback
      const wrong = attempt.questions.filter(
        (q) => q.selectedAnswer !== null && q.selectedAnswer !== q.correctAnswerIndex
      );
      const overall = [
        wrong.length > 0
          ? `Focus on ${attempt.subject} topics you missed: ${[...new Set(wrong.map((q) => q.topic).filter(Boolean))].slice(0, 3).join(
              ", "
            ) || "core concepts"}.`
          : "Great accuracy. Consider attempting a higher difficulty next time.",
        "Review explanations for incorrect questions and practice 5 similar ones.",
        "Manage time by skipping and revisiting lengthy items.",
      ];

      aiResponseText = `Overall Tips:\n- ${overall.join("\n- ")}`;
    }

    return res.json({ success: true, feedback: aiResponseText });
  } catch (error) {
    console.error("Analyze attempt error:", error);
    res.status(500).json({
      success: false,
      message: "Server error analyzing attempt",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Test AI question generation (for development/testing)
exports.testAIQuestions = async (req, res) => {
  try {
    const { examType, subject, difficulty, numberOfQuestions } = req.body;
    
    if (!examType || !subject || !difficulty || !numberOfQuestions) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: examType, subject, difficulty, numberOfQuestions",
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
      message: `Successfully generated ${questions.length} AI questions`,
      questions: questions,
      examType,
      subject,
      difficulty,
      aiGenerated: true,
    });
  } catch (error) {
    console.error("Test AI questions error:", error);
    res.status(500).json({
      success: false,
      message: "Error testing AI question generation",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};
