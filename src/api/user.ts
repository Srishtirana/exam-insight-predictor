import axios from "axios";
import { API_URL, isBackendAvailable } from "../config/api";
import { UserStats } from "../types";

const transformUserStats = (data: any): UserStats => {
  // If the data already has the correct shape, return it
  if (data.totalQuizzes !== undefined && data.subjectPerformance) {
    return data as UserStats;
  }

  // Transform from old format to new format if needed
  return {
    totalQuizzes: data.totalAttempts || 0,
    averageScore: data.averageScore || 0,
    totalQuestionsAttempted: data.totalQuestionsAttempted || 0,
    correctAnswers: data.correctAnswers || 0,
    accuracy: data.accuracy || 0,
    subjectPerformance: data.examStats?.map((stat: any) => ({
      subject: stat.subject,
      averageScore: stat.averageScore || stat.score || 0,
      totalAttempts: stat.attempts || stat.totalAttempts || 0,
    })) || [],
    recentActivity: data.recentActivity || [],
    lastExamDetails: data.lastExamDetails,
    streakDays: data.streakDays || 0,
  };
};

export const getSimulatedUserStats = (): UserStats => {
  const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
  const subjectPerformance = subjects.map(subject => ({
    subject,
    averageScore: Math.floor(Math.random() * 30) + 70, // Between 70-100
    totalAttempts: Math.floor(Math.random() * 10) + 1,
  }));

  const totalQuizzes = subjectPerformance.reduce((sum, stat) => sum + stat.totalAttempts, 0);
  const correctAnswers = Math.floor(totalQuizzes * 0.8); // 80% accuracy
  const accuracy = Math.round((correctAnswers / (totalQuizzes * 10)) * 100);
  
  return {
    totalQuizzes,
    averageScore: 82, // Mock average score
    totalQuestionsAttempted: totalQuizzes * 10, // Assuming 10 questions per quiz
    correctAnswers,
    accuracy,
    subjectPerformance,
    recentActivity: [
      {
        id: '1',
        type: 'quiz',
        score: 85,
        total: 100,
        subject: 'Mathematics',
        date: new Date().toISOString(),
      },
    ],
    lastExamDetails: {
      subject: 'Mathematics',
      score: 85,
      date: new Date().toISOString(),
    },
    streakDays: 7,
  };
};

export const getUserStats = async (): Promise<UserStats> => {
  if (!isBackendAvailable()) {
    // Return mock stats for GitHub Pages
    return getSimulatedUserStats();
  }

  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/user/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return transformUserStats(response.data);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    // Return mock data in case of error
    return getSimulatedUserStats();
  }
};
