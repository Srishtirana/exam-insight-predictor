
const User = require('../models/User');
const Attempt = require('../models/Attempt');

// Get user dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's exam attempts
    const attempts = await Attempt.find({ user: userId }).sort({ createdAt: -1 });
    
    // Calculate basic stats
    let totalAttempts = attempts.length;
    let totalCorrect = 0;
    let totalQuestions = 0;
    let completedAttempts = 0;
    
    attempts.forEach(attempt => {
      if (attempt.completedAt) {
        completedAttempts++;
        totalCorrect += attempt.score;
        totalQuestions += attempt.totalQuestions;
      }
    });
    
    // Calculate accuracy
    const accuracy = totalQuestions > 0 
      ? Math.round((totalCorrect / totalQuestions) * 100) 
      : 0;
    
    // Get last exam attempt details
    const lastExam = attempts.find(attempt => attempt.completedAt) || null;
    
    let lastExamDetails = null;
    if (lastExam) {
      lastExamDetails = {
        subject: lastExam.subject,
        examType: lastExam.examType,
        difficulty: lastExam.difficulty,
        score: Math.round((lastExam.score / lastExam.totalQuestions) * 100),
        date: lastExam.completedAt.toDateString()
      };
    }
    
    // Calculate subject-specific stats
    const subjectStats = {};
    const examTypeStats = {};
    const difficultyStats = {};
    
    attempts.forEach(attempt => {
      if (!attempt.completedAt) return;
      
      // Subject stats
      if (!subjectStats[attempt.subject]) {
        subjectStats[attempt.subject] = {
          subject: attempt.subject,
          attempts: 0,
          totalScore: 0,
          totalQuestions: 0,
          bestScore: 0
        };
      }
      
      subjectStats[attempt.subject].attempts += 1;
      subjectStats[attempt.subject].totalScore += attempt.score;
      subjectStats[attempt.subject].totalQuestions += attempt.totalQuestions;
      const currentScore = Math.round((attempt.score / attempt.totalQuestions) * 100);
      if (currentScore > subjectStats[attempt.subject].bestScore) {
        subjectStats[attempt.subject].bestScore = currentScore;
      }
      
      // Exam type stats
      if (!examTypeStats[attempt.examType]) {
        examTypeStats[attempt.examType] = {
          examType: attempt.examType,
          attempts: 0,
          totalScore: 0,
          totalQuestions: 0
        };
      }
      
      examTypeStats[attempt.examType].attempts += 1;
      examTypeStats[attempt.examType].totalScore += attempt.score;
      examTypeStats[attempt.examType].totalQuestions += attempt.totalQuestions;
      
      // Difficulty stats
      if (!difficultyStats[attempt.difficulty]) {
        difficultyStats[attempt.difficulty] = {
          difficulty: attempt.difficulty,
          attempts: 0,
          totalScore: 0,
          totalQuestions: 0
        };
      }
      
      difficultyStats[attempt.difficulty].attempts += 1;
      difficultyStats[attempt.difficulty].totalScore += attempt.score;
      difficultyStats[attempt.difficulty].totalQuestions += attempt.totalQuestions;
    });
    
    // Format stats for response
    const examStats = Object.values(subjectStats).map(stat => ({
      subject: stat.subject,
      attempts: stat.attempts,
      averageScore: stat.totalQuestions > 0 
        ? Math.round((stat.totalScore / stat.totalQuestions) * 100) 
        : 0,
      bestScore: stat.bestScore
    }));
    
    const examTypeStatsFormatted = Object.values(examTypeStats).map(stat => ({
      examType: stat.examType,
      attempts: stat.attempts,
      averageScore: stat.totalQuestions > 0 
        ? Math.round((stat.totalScore / stat.totalQuestions) * 100) 
        : 0
    }));
    
    const difficultyStatsFormatted = Object.values(difficultyStats).map(stat => ({
      difficulty: stat.difficulty,
      attempts: stat.attempts,
      averageScore: stat.totalQuestions > 0 
        ? Math.round((stat.totalScore / stat.totalQuestions) * 100) 
        : 0
    }));
    
    // Calculate performance trends (last 7 attempts)
    const recentAttempts = attempts
      .filter(attempt => attempt.completedAt)
      .slice(0, 7)
      .map(attempt => ({
        date: attempt.completedAt.toISOString().split('T')[0],
        score: Math.round((attempt.score / attempt.totalQuestions) * 100),
        subject: attempt.subject,
        examType: attempt.examType
      }))
      .reverse();
    
    // Calculate study streak (consecutive days with completed exams)
    const studyStreak = calculateStudyStreak(attempts.filter(attempt => attempt.completedAt));
    
    // Get performance insights
    const insights = generatePerformanceInsights(examStats, accuracy, totalAttempts);
    
    res.json({
      success: true,
      data: {
        totalAttempts: completedAttempts,
        accuracy,
        lastExamDetails,
        examStats,
        examTypeStats: examTypeStatsFormatted,
        difficultyStats: difficultyStatsFormatted,
        recentAttempts,
        studyStreak,
        insights
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving dashboard stats',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Helper function to calculate study streak
function calculateStudyStreak(completedAttempts) {
  if (completedAttempts.length === 0) return 0;
  
  const today = new Date();
  const dates = completedAttempts
    .map(attempt => attempt.completedAt.toDateString())
    .filter((date, index, arr) => arr.indexOf(date) === index) // Remove duplicates
    .sort((a, b) => new Date(b) - new Date(a));
  
  let streak = 0;
  let currentDate = new Date(today);
  
  for (let i = 0; i < dates.length; i++) {
    const attemptDate = new Date(dates[i]);
    const diffTime = currentDate - attemptDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      streak++;
      currentDate = attemptDate;
    } else {
      break;
    }
  }
  
  return streak;
}

// Helper function to generate performance insights
function generatePerformanceInsights(examStats, accuracy, totalAttempts) {
  const insights = [];
  
  if (totalAttempts === 0) {
    insights.push("Start your first exam to begin tracking your progress!");
    return insights;
  }
  
  if (accuracy >= 80) {
    insights.push("Excellent performance! You're mastering the concepts well.");
  } else if (accuracy >= 60) {
    insights.push("Good progress! Focus on weak areas to improve further.");
  } else {
    insights.push("Keep practicing! Review fundamental concepts and try easier difficulty levels.");
  }
  
  if (examStats.length > 0) {
    const bestSubject = examStats.reduce((prev, current) => 
      (prev.averageScore > current.averageScore) ? prev : current
    );
    const worstSubject = examStats.reduce((prev, current) => 
      (prev.averageScore < current.averageScore) ? prev : current
    );
    
    insights.push(`Your strongest subject is ${bestSubject.subject} (${bestSubject.averageScore}% average).`);
    insights.push(`Focus more on ${worstSubject.subject} to improve overall performance.`);
  }
  
  if (totalAttempts >= 10) {
    insights.push("Great consistency! You've completed 10+ exams. Keep up the momentum!");
  }
  
  return insights;
}
