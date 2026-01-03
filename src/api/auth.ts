// Stub auth API to unblock frontend build

export type AuthCredentials = {
  email: string;
  password: string;
};

export type SignupData = {
  name: string;
  email: string;
  password: string;
};

export const login = async (_data: AuthCredentials) => {
  return Promise.resolve({ success: true });
};

export const signup = async (_data: SignupData) => {
  return Promise.resolve({ success: true });
};

export const logout = async () => {
  return Promise.resolve();
};

export const isAuthenticated = () => {
  return false;
};

export const getCurrentUser = async () => {
  return null;
};
