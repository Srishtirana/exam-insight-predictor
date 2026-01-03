import axios from "axios";

const API_URL = "http://localhost:5000/api";

export interface PYQQuestion {
  id: string;
  examType: 'JEE' | 'NEET' | 'GATE' | 'CAT' | 'UPSC';
  subject: string;
  topic: string;
  year: number;
  questionText: string;
  options: {
    id: number;
    text: string;
  }[];
  correctAnswerIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
  tags?: string[];
}

export interface PYQFilterParams {
  examType?: string[];
  subjects?: string[];
  topics?: string[];
  years?: number[];
  difficulties?: string[];
  searchQuery?: string;
  limit?: number;
  offset?: number;
}

export const fetchPYQs = async (filters: PYQFilterParams = {}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/pyqs`, {
      params: filters,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching PYQs:", error);
    throw error;
  }
};

export const getPYQById = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/pyqs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching PYQ ${id}:`, error);
    throw error;
  }
};

export const getPYQMetadata = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/pyqs/metadata`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching PYQ metadata:", error);
    throw error;
  }
};
