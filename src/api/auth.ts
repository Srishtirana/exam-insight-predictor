/* eslint-disable */
import axios from "axios";
import { API_URL, isBackendAvailable } from "../config/api";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  name: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const signup = async (userData: SignupData): Promise<LoginResponse> => {
  if (!isBackendAvailable()) {
    // Mock response for GitHub Pages
    const mockUser = {
      id: "mock-user-id",
      name: userData.name,
      email: userData.email
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
    // Mock response for GitHub Pages
    const mockUser = {
      id: "mock-user-id",
      name: "Demo User",
      email: credentials.email
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

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = (): any => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token;
};
