import axios from "axios";
import { API_URL, isBackendAvailable } from "../config/api";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export type SignupData = {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const signup = async (userData: SignupData): Promise<LoginResponse> => {
  if (!isBackendAvailable()) {
    // Mock response for GitHub Pages
    const mockUser = {
      id: `user-${Date.now()}`,
      name: userData.name.trim(), // Ensure name is properly trimmed
      email: userData.email.toLowerCase().trim() // Normalize email
    };
    const mockToken = "mock-token-" + Date.now();
    localStorage.setItem("token", mockToken);
    localStorage.setItem("user", JSON.stringify(mockUser));
    return { token: mockToken, user: mockUser };
  }

  try {
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (
  credentials: AuthCredentials
): Promise<LoginResponse> => {
  if (!isBackendAvailable()) {
    // Check if user already exists in localStorage
    const existingUser = getCurrentUser();
    
    if (existingUser && existingUser.email === credentials.email.toLowerCase().trim()) {
      // User exists, return the existing user data
      const mockToken = "mock-token-" + Date.now();
      localStorage.setItem("token", mockToken);
      return { token: mockToken, user: existingUser };
    }
    
    // If user doesn't exist, create a new one with email as name
    const emailPrefix = credentials.email.split('@')[0];
    const formattedName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    
    const mockUser = {
      id: `user-${Date.now()}`,
      name: formattedName,
      email: credentials.email.toLowerCase().trim()
    };
    
    const mockToken = "mock-token-" + Date.now();
    localStorage.setItem("token", mockToken);
    localStorage.setItem("user", JSON.stringify(mockUser));
    return { token: mockToken, user: mockUser };
  }

  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return Promise.resolve();
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

export const getCurrentUser = (): { id: string; name: string; email: string } | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
