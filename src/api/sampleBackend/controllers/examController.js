const Question = require("../models/Question");
const Attempt = require("../models/Attempt");
const User = require("../models/User");

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

    // Find questions matching the criteria
    let questions = await Question.aggregate([
      {
        $match: {
          examType: examType,
          subject: subject,
          difficulty: difficulty.toLowerCase(),
        },
      },
      { $sample: { size: parseInt(numberOfQuestions) } },
    ]);

    // If not enough questions in DB, generate some placeholder questions
    if (questions.length < numberOfQuestions) {
      const placeholderCount = numberOfQuestions - questions.length;

      // Topics by subject (example)
      const topics = {
        Physics: ["Mechanics", "Thermodynamics", "Optics", "Electromagnetism"],
        Chemistry: [
          "Organic Chemistry",
          "Inorganic Chemistry",
          "Physical Chemistry",
        ],
        Biology: ["Cell Biology", "Genetics", "Anatomy", "Ecology"],
        Mathematics: ["Algebra", "Calculus", "Geometry", "Probability"],
      };

      const subjectTopics = topics[subject] || ["General"];

      // Generate placeholder questions
      for (let i = 0; i < placeholderCount; i++) {
        const topic =
          subjectTopics[Math.floor(Math.random() * subjectTopics.length)];
        const options = [
          { id: 0, text: `Option A for question ${i + 1}` },
          { id: 1, text: `Option B for question ${i + 1}` },
          { id: 2, text: `Option C for question ${i + 1}` },
          { id: 3, text: `Option D for question ${i + 1}` },
        ];

        const question = new Question({
          questionText: `Sample ${subject} question ${i + 1} about ${topic}?`,
          options,
          correctAnswerIndex: Math.floor(Math.random() * 4),
          subject,
          examType,
          difficulty,
          topic,
        });

        await question.save();
        questions.push(question);
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
