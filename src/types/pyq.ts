export interface PYQQuestion {
  id: string;
  examType: 'JEE' | 'NEET' | 'GATE' | 'CAT' | 'UPSC';
  subject: string;
  topic: string;
  year: number;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  tags?: string[];
  imageUrl?: string;
  solution?: string;
  marks?: number;
  timeLimit?: number; // in seconds
}

export interface PYQFilterOptions {
  examTypes?: string[];
  subjects?: string[];
  topics?: string[];
  years?: number[];
  difficulties?: ('easy' | 'medium' | 'hard')[];
  tags?: string[];
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export interface PYQResponse {
  questions: PYQQuestion[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
