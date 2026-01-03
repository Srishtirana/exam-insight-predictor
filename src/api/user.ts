<<<<<<< HEAD
import axios from "axios";
import { API_URL, isBackendAvailable } from "../config/api";

export interface UserStats {
  totalAttempts: number;
  accuracy: number;
  streakDays: number;
  lastExamDetails?: {
    subject: string;
    score: number;
    date: string;
  };
  examStats: {
    subject: string;
    attempts: number;
    averageScore: number;
  }[];
}

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
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

// Mock data generation for GitHub Pages
const getSimulatedUserStats = (): UserStats => {
  const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
  const examStats = subjects.map(subject => ({
    subject,
    attempts: Math.floor(Math.random() * 10) + 1,
    averageScore: Math.floor(Math.random() * 30) + 70, // Between 70-100
  }));

  return {
    totalAttempts: examStats.reduce((sum, stat) => sum + stat.attempts, 0),
    accuracy: Math.floor(Math.random() * 30) + 70, // Between 70-100
    streakDays: Math.floor(Math.random() * 30), // Random streak between 0-29 days
    lastExamDetails: {
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      score: Math.floor(Math.random() * 30) + 70,
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    },
    examStats,
  };
=======
// Stub user API to unblock frontend build

export type UserStats = {
  totalExams: number;
  averageScore: number;
  lastExamScore: number;
};

export const getUserStats = async (): Promise<UserStats> => {
  return Promise.resolve({
    totalExams: 0,
    averageScore: 0,
    lastExamScore: 0,
  });
};

export const getSimulatedUserStats = async (): Promise<UserStats> => {
  return Promise.resolve({
    totalExams: 5,
    averageScore: 62,
    lastExamScore: 68,
  });
>>>>>>> bee1a006c25e0ce529fd3074771684fa80562b3a
};
