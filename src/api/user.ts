/* eslint-disable */
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export interface UserStats {
  totalAttempts: number;
  accuracy: number;
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
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/user/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// For fallback or testing purposes
export const getSimulatedUserStats = (): UserStats => {
  return {
    totalAttempts: 15,
    accuracy: 68,
    lastExamDetails: {
      subject: "Physics",
      score: 75,
      date: new Date().toDateString(),
    },
    examStats: [
      { subject: "Physics", attempts: 5, averageScore: 72 },
      { subject: "Chemistry", attempts: 4, averageScore: 68 },
      { subject: "Mathematics", attempts: 6, averageScore: 81 },
    ],
  };
};
