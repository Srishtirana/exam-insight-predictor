const User = require('../models/User');
const Attempt = require('../models/Attempt');

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

// Get user dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's completed attempts
    const attempts = await Attempt.find({
      user: userId,
      status: 'completed'
    }).sort({ completedAt: -1 });

    // Calculate basic stats
    const totalAttempts = attempts.length;
    const totalQuestions = attempts.reduce((sum, attempt) => sum + attempt.questions.length, 0);
    const correctAnswers = attempts.reduce((sum, attempt) => {
      return sum + attempt.questions.filter(q => q.isCorrect).length;
    }, 0);
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const streak = calculateStudyStreak(attempts);

    // Get performance by subject
    const subjectStats = {};
    attempts.forEach(attempt => {
      const subject = attempt.subject;
      if (!subjectStats[subject]) {
        subjectStats[subject] = { correct: 0, total: 0 };
      }
      subjectStats[subject].correct += attempt.questions.filter(q => q.isCorrect).length;
      subjectStats[subject].total += attempt.questions.length;
    });

    // Format subject stats
    const performanceBySubject = Object.entries(subjectStats).map(([subject, stats]) => ({
      subject,
      accuracy: Math.round((stats.correct / stats.total) * 100) || 0,
      totalQuestions: stats.total
    }));

    // Generate insights
    const insights = generatePerformanceInsights(performanceBySubject, accuracy, totalAttempts);

    res.json({
      success: true,
      stats: {
        totalAttempts,
        totalQuestions,
        correctAnswers,
        accuracy,
        streak,
        performanceBySubject,
        insights
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

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
