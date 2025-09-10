
const User = require('../models/User');
const Attempt = require('../models/Attempt');

// Get user dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's exam attempts
    const attempts = await Attempt.find({ user: userId }).sort({ createdAt: -1 });
    
    // Calculate stats
    let totalAttempts = attempts.length;
    let totalCorrect = 0;
    let totalQuestions = 0;
    
    attempts.forEach(attempt => {
      totalCorrect += attempt.score;
      totalQuestions += attempt.totalQuestions;
    });
    
    // Calculate accuracy
    const accuracy = totalQuestions > 0 
      ? Math.round((totalCorrect / totalQuestions) * 100) 
      : 0;
    
    // Get last exam attempt details
    const lastExam = attempts.length > 0 ? attempts[0] : null;
    
    let lastExamDetails = null;
    if (lastExam) {
      lastExamDetails = {
        subject: lastExam.subject,
        score: Math.round((lastExam.score / lastExam.totalQuestions) * 100),
        date: lastExam.createdAt.toDateString()
      };
    }
    
    // Calculate subject-specific stats
    const subjectStats = {};
    attempts.forEach(attempt => {
      if (!subjectStats[attempt.subject]) {
        subjectStats[attempt.subject] = {
          subject: attempt.subject,
          attempts: 0,
          totalScore: 0,
          totalQuestions: 0
        };
      }
      
      subjectStats[attempt.subject].attempts += 1;
      subjectStats[attempt.subject].totalScore += attempt.score;
      subjectStats[attempt.subject].totalQuestions += attempt.totalQuestions;
    });
    
    // Format subject stats for response
    const examStats = Object.values(subjectStats).map(stat => ({
      subject: stat.subject,
      attempts: stat.attempts,
      averageScore: stat.totalQuestions > 0 
        ? Math.round((stat.totalScore / stat.totalQuestions) * 100) 
        : 0
    }));
    
    res.json({
      success: true,
      data: {
        totalAttempts,
        accuracy,
        lastExamDetails,
        examStats
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
