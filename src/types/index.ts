// Common types used across the application

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ExamStat {
  subject: string;
  averageScore: number;
  totalAttempts: number;
}

export interface RecentActivity {
  id: string;
  type: 'quiz' | 'practice' | 'test';
  score: number;
  total: number;
  subject: string;
  date: string;
}

export interface UserStats {
  totalQuizzes: number;
  totalAttempts?: number; // For backward compatibility
  averageScore: number;
  totalQuestionsAttempted: number;
  correctAnswers: number;
  accuracy: number;
  examStats?: ExamStat[]; // For backward compatibility
  subjectPerformance: ExamStat[];
  recentActivity: RecentActivity[];
  lastExamDetails?: {
    subject: string;
    score: number;
    date: string;
  };
  streakDays?: number;
}

export interface ExamParams {
  examType: string;
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  numberOfQuestions: number;
  topics?: string[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  year?: number;
  examType?: string;
}

export interface QuizResult {
  id: string;
  userId: string;
  questions: Question[];
  answers: number[];
  score: number;
  total: number;
  subject: string;
  examType: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeSpent: number; // in seconds
  completedAt: string;
}
